import { Hono } from "hono";
import type { AppContext } from "../index";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VectorizeMatch {
  id: string;
  score: number;
  metadata?: Record<string, string | number | boolean>;
}

interface VectorizeQueryResult {
  matches: VectorizeMatch[];
}

interface EmbeddingResponse {
  data: number[][];
}

export type SearchResultType = "nominee" | "question" | "flag";

interface SearchResult {
  type: SearchResultType;
  id: string;
  score: number;
  snippet: string;
}

interface SearchResponse {
  success: true;
  query: string;
  type: SearchResultType | "all";
  results: SearchResult[];
}

interface SearchErrorResponse {
  success: false;
  error: string;
  code: string;
}

// ── Route ─────────────────────────────────────────────────────────────────────

export const searchRoutes = new Hono<AppContext>();

searchRoutes.get("/", async (c) => {
  const query = c.req.query("q")?.trim();
  const typeParam = c.req.query("type");

  if (!query) {
    return c.json<SearchErrorResponse>(
      { success: false, error: "Missing query parameter: q", code: "BAD_REQUEST" },
      400
    );
  }

  // Validate type param
  const validTypes: SearchResultType[] = ["nominees", "questions", "flags"] as unknown as SearchResultType[];
  const requestedType = typeParam as string | undefined;
  if (requestedType && !["nominees", "questions", "flags"].includes(requestedType)) {
    return c.json<SearchErrorResponse>(
      {
        success: false,
        error: "Invalid type. Must be one of: nominees, questions, flags",
        code: "BAD_REQUEST",
      },
      400
    );
  }

  // Generate embedding for the query via Workers AI
  let embedding: number[];
  try {
    const aiResponse = await c.env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [query],
    }) as EmbeddingResponse;
    embedding = aiResponse.data[0];
  } catch (err) {
    console.error("[search] embedding error", err);
    return c.json<SearchErrorResponse>(
      { success: false, error: "Failed to generate query embedding", code: "EMBEDDING_ERROR" },
      500
    );
  }

  // Build Vectorize filter if type is specified
  const vectorizeOptions: Parameters<VectorizeIndex["query"]>[1] = {
    topK: 10,
    returnMetadata: "all",
  };

  if (requestedType) {
    // Map plural route param to singular metadata type stored in Vectorize
    const typeMap: Record<string, string> = {
      nominees: "nominee",
      questions: "question",
      flags: "flag",
    };
    (vectorizeOptions as Record<string, unknown>).filter = {
      type: { $eq: typeMap[requestedType] },
    };
  }

  // Query Vectorize
  let queryResult: VectorizeQueryResult;
  try {
    queryResult = (await c.env.VECTORIZE.query(
      embedding,
      vectorizeOptions
    )) as VectorizeQueryResult;
  } catch (err) {
    console.error("[search] vectorize query error", err);
    return c.json<SearchErrorResponse>(
      { success: false, error: "Failed to query search index", code: "VECTORIZE_ERROR" },
      500
    );
  }

  // Shape results
  const results: SearchResult[] = queryResult.matches.map((match) => {
    const meta = match.metadata ?? {};
    const type = (meta.type as SearchResultType) ?? "nominee";
    const snippet = (meta.snippet as string) ?? (meta.name as string) ?? "";

    return {
      type,
      id: match.id,
      score: Math.round(match.score * 1000) / 1000,
      snippet,
    };
  });

  return c.json<SearchResponse>({
    success: true,
    query,
    type: requestedType ? (requestedType as unknown as SearchResultType) : "all",
    results,
  });
});

"use client";

import React, { useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CitizenQuestionStatus =
  | "pending"
  | "asked"
  | "ignored"
  | "partially_asked";

export interface CitizenQuestion {
  id: string;
  body: string;
  upvotes: number;
  status: CitizenQuestionStatus;
}

export interface CommitteeQuestion {
  id: string;
  askedBy: string;
  questionText: string;
  addressesCitizenQuestion: boolean;
}

interface SilenceMapProps {
  citizenQuestions: CitizenQuestion[];
  committeeQuestions: CommitteeQuestion[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

const STATUS_CONFIG: Record<
  CitizenQuestionStatus,
  { dotClass: string; label: string }
> = {
  asked: { dotClass: "bg-emerald-500", label: "Asked" },
  partially_asked: { dotClass: "bg-amber-500", label: "Partially asked" },
  ignored: { dotClass: "bg-red-500", label: "Ignored" },
  pending: { dotClass: "bg-neutral-600", label: "Pending" },
};

function StatusDot({ status }: { status: CitizenQuestionStatus }) {
  const { dotClass, label } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dotClass}`}
      title={label}
      aria-label={label}
    />
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────

function buildCsv(
  citizenQuestions: CitizenQuestion[],
  committeeQuestions: CommitteeQuestion[]
): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;

  const cqRows = citizenQuestions.map((q) =>
    [
      "citizen",
      escape(q.id),
      escape(q.body),
      q.upvotes.toString(),
      q.status,
      "",
      "",
      "",
    ].join(",")
  );

  const mqRows = committeeQuestions.map((q) =>
    [
      "committee",
      escape(q.id),
      "",
      "",
      "",
      escape(q.askedBy),
      escape(q.questionText),
      q.addressesCitizenQuestion ? "true" : "false",
    ].join(",")
  );

  const header =
    "type,id,body,upvotes,status,askedBy,questionText,addressesCitizenQuestion";
  return [header, ...cqRows, ...mqRows].join("\n");
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SilenceMap({
  citizenQuestions,
  committeeQuestions,
}: SilenceMapProps) {
  const total = citizenQuestions.length;
  const addressed = citizenQuestions.filter((q) =>
    ["asked", "partially_asked"].includes(q.status)
  ).length;
  const coveragePct = total > 0 ? Math.round((addressed / total) * 100) : 0;

  const handleExportCsv = useCallback(() => {
    const csv = buildCsv(citizenQuestions, committeeQuestions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "silence-map.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [citizenQuestions, committeeQuestions]);

  return (
    <div className="space-y-6">
      {/* Coverage bar */}
      <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-xs text-neutral-400">
            <span className="text-emerald-400 font-semibold">{addressed}</span>{" "}
            of{" "}
            <span className="text-neutral-200 font-semibold">{total}</span>{" "}
            citizen questions addressed
          </p>
          <span className="font-mono text-xs text-neutral-500">
            {coveragePct}% coverage
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${coveragePct}%` }}
            role="progressbar"
            aria-valuenow={coveragePct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column: Citizen Questions */}
        <div>
          <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-3">
            Citizen Questions
          </p>
          <div className="space-y-2">
            {citizenQuestions.length === 0 && (
              <p className="text-neutral-600 text-sm italic">
                No citizen questions submitted yet.
              </p>
            )}
            {citizenQuestions.map((q) => (
              <div
                key={q.id}
                className="flex gap-3 border border-neutral-800 rounded-lg p-3 bg-neutral-900/30"
              >
                <StatusDot status={q.status} />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm text-neutral-200 leading-snug ${
                      q.status === "ignored"
                        ? "line-through text-neutral-500"
                        : ""
                    }`}
                  >
                    {truncate(q.body, 80)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-xs text-neutral-600">
                      ↑ {q.upvotes.toLocaleString()}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        q.status === "asked"
                          ? "text-emerald-500"
                          : q.status === "partially_asked"
                          ? "text-amber-500"
                          : q.status === "ignored"
                          ? "text-red-500"
                          : "text-neutral-600"
                      }`}
                    >
                      {STATUS_CONFIG[q.status].label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Committee Questions */}
        <div>
          <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-3">
            Committee Questions
          </p>
          <div className="space-y-2">
            {committeeQuestions.length === 0 && (
              <p className="text-neutral-600 text-sm italic">
                No committee questions recorded yet.
              </p>
            )}
            {committeeQuestions.map((q) => (
              <div
                key={q.id}
                className="flex gap-3 border border-neutral-800 rounded-lg p-3 bg-neutral-900/30"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                    q.addressesCitizenQuestion
                      ? "bg-emerald-500"
                      : "bg-neutral-600"
                  }`}
                  title={
                    q.addressesCitizenQuestion
                      ? "Addresses a citizen question"
                      : "Does not address a citizen question"
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-200 leading-snug">
                    {truncate(q.questionText, 80)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-xs text-neutral-500">
                      {q.askedBy}
                    </span>
                    {q.addressesCitizenQuestion && (
                      <span className="font-mono text-xs text-emerald-600">
                        ✓ citizen question
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export button */}
      <div className="flex justify-end">
        <button
          onClick={handleExportCsv}
          className="font-mono text-xs text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-neutral-200 transition-colors px-3 py-1.5 rounded"
        >
          Export CSV ↓
        </button>
      </div>
    </div>
  );
}

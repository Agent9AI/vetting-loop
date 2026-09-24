import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Nominee } from "@vetting-loop/types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Nominee Dossier | The Vetting Loop`,
  };
}

async function getNominee(slug: string): Promise<Nominee | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";
  const res = await fetch(`${apiBase}/nominees/${slug}`, {
    next: { revalidate: 300 }, // ISR: 5-minute stale
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.success ? json.data : null;
}

export default async function NomineePage({ params }: Props) {
  const nominee = await getNominee(params.slug);
  if (!nominee) notFound();

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-neutral-800 pb-8">
        <p className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-2">
          {nominee.appointmentType} · {nominee.position}
        </p>
        <h1 className="text-3xl font-bold mb-2">{nominee.fullName}</h1>
        <div className="flex gap-4 text-sm text-neutral-500">
          <span>Gazetted: {new Date(nominee.gazetteDate).toLocaleDateString("en-KE", { dateStyle: "medium" })}</span>
          {nominee.hearingDate && (
            <span>
              Hearing: {new Date(nominee.hearingDate).toLocaleDateString("en-KE", { dateStyle: "medium" })}
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
              nominee.status === "approved"
                ? "bg-red-950 text-red-400"
                : nominee.status === "rejected"
                ? "bg-emerald-950 text-emerald-400"
                : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {nominee.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* 3-Act Navigation Strip */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/nominees/${params.slug}/questions`} className="block p-4 border border-neutral-800 rounded-lg hover:border-emerald-500/50 transition-colors group">
          <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1 group-hover:text-emerald-400">Act 1: Before</div>
          <div className="font-bold text-neutral-200 group-hover:text-white">Public Questions</div>
          <p className="text-xs text-neutral-500 mt-1">Submit & upvote questions for the committee.</p>
        </Link>
        <Link href={`/nominees/${params.slug}/hearing`} className="block p-4 border border-neutral-800 rounded-lg hover:border-emerald-500/50 transition-colors group">
          <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1 group-hover:text-emerald-400">Act 2: During</div>
          <div className="font-bold text-neutral-200 group-hover:text-white">Hearing Record</div>
          <p className="text-xs text-neutral-500 mt-1">Transcripts and citizen question tracking.</p>
        </Link>
        <Link href={`/nominees/${params.slug}/votes`} className="block p-4 border border-neutral-800 rounded-lg hover:border-emerald-500/50 transition-colors group">
          <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1 group-hover:text-emerald-400">Act 3: After</div>
          <div className="font-bold text-neutral-200 group-hover:text-white">Vote Trail</div>
          <p className="text-xs text-neutral-500 mt-1">How each MP voted on the floor.</p>
        </Link>
      </div>

      {/* Integrity Flags */}
      {nominee.integrityFlags.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">
            Integrity Flags — {nominee.integrityFlags.length}
          </h2>
          <div className="space-y-4">
            {nominee.integrityFlags.map((item: any) => (
              <div
                key={item.flag.id}
                className={`border rounded-lg p-4 ${
                  item.flag.severity === "high"
                    ? "border-red-800 bg-red-950/20"
                    : item.flag.severity === "medium"
                    ? "border-amber-800 bg-amber-950/20"
                    : "border-neutral-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded ${
                    item.flag.severity === "high" ? "bg-red-900 text-red-100" :
                    item.flag.severity === "medium" ? "bg-amber-900 text-amber-100" :
                    "bg-neutral-800 text-neutral-300"
                  }`}>
                    {item.flag.severity} severity
                  </span>
                </div>
                <p className="text-sm text-neutral-200 mb-3">{item.flag.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {item.sources.map((src: any) => (
                    <a
                      key={src.id}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-emerald-500 hover:text-emerald-400 underline underline-offset-2"
                    >
                      {src.publisher} · {src.documentType.replace("_", " ")}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-600 mt-3">
            Every flag cites a source document. No bare allegations.
          </p>
        </section>
      )}

      {/* Career Timeline */}
      {nominee.career.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">Career Timeline</h2>
          <div className="space-y-2">
            {nominee.career.map((entry: any) => (
              <div key={entry.id} className="flex gap-4 text-sm border-b border-neutral-900 pb-2">
                <span className="text-neutral-600 font-mono w-24 shrink-0">
                  {entry.startYear}–{entry.endYear ?? "present"}
                </span>
                <div>
                  <span className="text-neutral-200">{entry.role}</span>
                  <span className="text-neutral-500"> · {entry.organisation}</span>
                  {entry.notes && <p className="text-xs text-neutral-600 mt-0.5">{entry.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

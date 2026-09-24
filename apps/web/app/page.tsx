import Link from "next/link";
import { LOOKBACK_YEARS, summarize } from "@vetting-loop/integrity";
import { getProfiles } from "@/lib/integrity";

const ACTS = [
  {
    act: "Act 1 · Before",
    label: "The Nominee File",
    description: "Source-linked dossier: CV, track record, integrity flags. Public question queue with upvotes.",
  },
  {
    act: "Act 2 · During",
    label: "The Hearing Record",
    description: "Who asked what, tagged by topic — citizen questions shown alongside: asked vs. ignored.",
  },
  {
    act: "Act 3 · After",
    label: "The Accountability Trail",
    description: "Committee report vs. citizen submissions, side by side. Per-MP vote on every approval — one query.",
  },
];

export default async function HomePage() {
  const s = summarize(getProfiles());
  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-16 text-center">
        <h1 className="text-3xl font-bold leading-tight text-mz-red md:text-5xl">
          Close the loop between citizens and Parliament on every public appointment.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-mz-muted">
          Source-linked nominee dossiers, public question queues, hearing records, and per-MP vote trails, now with a{" "}
          {LOOKBACK_YEARS}-year Integrity Index ahead of the 2027 general election.
        </p>
        <Link
          href="/integrity"
          className="mt-10 inline-block rounded-mz bg-mz-green px-10 py-5 text-2xl font-bold text-white shadow hover:bg-mz-green-dark"
        >
          Explore the Integrity Index
        </Link>
        <p className="mt-4 text-sm text-mz-muted">
          Part of the <Link href="/civic-tech" className="mz-link">Civic Tech Tools</Link> collection.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        <div className="mz-stat">
          <p className="mz-eyebrow">Nominees profiled</p>
          <p className="text-3xl font-bold text-mz-green">{s.total}</p>
          <Link href="/integrity" className="mz-link text-sm">2024 cohort</Link>
        </div>
        <div className="mz-stat">
          <p className="mz-eyebrow">No adverse record</p>
          <p className="text-3xl font-bold text-mz-green">{s.byBand.clear}</p>
          <span className="text-sm text-amber-700">mock data</span>
        </div>
        <div className="mz-stat">
          <p className="mz-eyebrow">Sources monitored</p>
          <p className="text-3xl font-bold text-mz-green">4</p>
          <Link href="/integrity/methodology" className="mz-link text-sm">Methodology</Link>
        </div>
        <div className="mz-stat">
          <p className="mz-eyebrow">Next general election</p>
          <p className="text-2xl font-bold text-mz-green">10 Aug 2027</p>
          <Link href="/integrity/roster" className="mz-link text-sm">Roster status</Link>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-mz-red">The three acts of every vetting</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {ACTS.map((a) => (
            <div key={a.act} className="mz-card border-t-4 border-t-mz-red p-6">
              <p className="mz-eyebrow text-mz-green">{a.act}</p>
              <h3 className="mt-1 text-lg font-bold">{a.label}</h3>
              <p className="mt-2 text-sm text-mz-muted">{a.description}</p>
            </div>
          ))}
        </div>
        <blockquote className="mt-10 border-l-4 border-mz-green pl-4 text-mz-muted italic">
          &ldquo;Agency without accountability is a suggestion box; accountability without agency is surveillance. We build both.&rdquo;
        </blockquote>
      </section>
    </main>
  );
}

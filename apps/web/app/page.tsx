import Link from "next/link";

export default async function HomePage() {
  // In production, fetch active nominees server-side
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-neutral-800 px-6 py-20 max-w-4xl mx-auto">
        <p className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-4">
          Hackathon Problem Two · Kenya · 2026
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          The Vetting Loop
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
          A citizen platform for parliamentary vetting — source-linked nominee dossiers, public question queues,
          hearing records, and per-MP vote trails.
        </p>
        <blockquote className="mt-8 border-l-2 border-emerald-500 pl-4 text-neutral-400 italic text-sm">
          "Agency without accountability is a suggestion box; accountability without agency is surveillance.
          We build both."
        </blockquote>
      </section>

      {/* Three Acts */}
      <section className="px-6 py-16 max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          {
            act: "ACT 1 · BEFORE",
            label: "The Nominee File",
            description:
              "Source-linked dossier: CV, track record, integrity flags. Public question queue with upvotes.",
            href: "#",
          },
          {
            act: "ACT 2 · DURING",
            label: "The Hearing Record",
            description:
              "Who asked what, tagged by topic — citizen questions shown alongside: asked vs. ignored.",
            href: "#",
          },
          {
            act: "ACT 3 · AFTER",
            label: "The Accountability Trail",
            description:
              "Committee report vs. citizen submissions, side by side. Per-MP vote on every approval — one query.",
            href: "#",
          },
        ].map((act) => (
          <div key={act.act} className="border border-neutral-800 rounded-lg p-6 hover:border-emerald-700 transition-colors">
            <p className="text-xs font-mono text-emerald-500 mb-2">{act.act}</p>
            <h2 className="text-lg font-semibold mb-3">{act.label}</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">{act.description}</p>
          </div>
        ))}
      </section>

      {/* Active nominees — placeholder for server-fetched list */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-6">Active Vettings</h2>
        <div className="border border-neutral-800 rounded-lg p-8 text-center text-neutral-500 text-sm">
          No active vettings. Seed the database with a real episode to begin.
          <br />
          <code className="text-xs font-mono text-neutral-600 mt-2 block">pnpm run scripts/seed-episode.ts</code>
        </div>
      </section>
    </main>
  );
}

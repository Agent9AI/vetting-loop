import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | The Vetting Loop",
  description:
    "The mission, methodology, team, and data sources behind The Vetting Loop — Kenya's parliamentary vetting accountability platform.",
};

// ── Data ──────────────────────────────────────────────────────────────────────

const dataSources = [
  {
    name: "Mzalendo",
    url: "https://mzalendo.com",
    type: "Structured",
    covers: "MP profiles, party affiliation, voting records",
    license: "Open / CC BY",
  },
  {
    name: "Kenya Hansard",
    url: "https://parliament.go.ke",
    type: "PDF / Structured",
    covers: "Committee hearing transcripts, plenary debates",
    license: "Public record",
  },
  {
    name: "EACC",
    url: "https://eacc.go.ke",
    type: "PDF",
    covers: "Ethics & Anti-Corruption Commission gazettes, decisions",
    license: "Public record",
  },
  {
    name: "Kenya Gazette",
    url: "https://kenyalaw.org/kl/index.php?id=4521",
    type: "PDF",
    covers: "Appointment notices, legal notices, statutory instruments",
    license: "Public record",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
      {/* Header */}
      <div>
        <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-3">
          About
        </p>
        <h1 className="text-3xl font-bold text-neutral-100 mb-6">
          Closing the loop between citizens and Parliament
        </h1>
        <p className="text-neutral-400 leading-relaxed text-base">
          The Vetting Loop is an open-source accountability platform that
          aggregates, structures, and publishes everything the Kenyan public
          needs to evaluate nominees before they are confirmed by the National
          Assembly or Senate. We build nominee dossiers from official public
          records, surface red flags with source links, collect citizen
          questions, track what committees actually ask during hearings, and
          publish every MP&apos;s vote — so the full loop from nomination to
          confirmation is legible to any Kenyan with a smartphone.
        </p>
      </div>

      {/* Three-Act Framework */}
      <section>
        <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">
          Methodology
        </p>
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">
          The three-act framework
        </h2>
        <div className="space-y-6">
          {[
            {
              act: "Act I",
              label: "Before the Hearing",
              description:
                "We compile a nominee dossier from the Kenya Gazette appointment notice, the nominee's public declarations of assets, EACC records, court filings, and Hansard references. Integrity flags are attached to specific allegations only when backed by a citable public document. Citizens can read the dossier and submit questions they want MPs to ask.",
            },
            {
              act: "Act II",
              label: "During the Hearing",
              description:
                "We cross-reference committee Hansard transcripts against the citizen question queue. The Silence Map shows which citizen questions were asked, partially asked, or ignored entirely — giving the public a real-time picture of committee accountability.",
            },
            {
              act: "Act III",
              label: "The Vote & After",
              description:
                "We publish each MP's vote (Aye, Nay, Abstain, Absent) with their party and constituency. Nominees who pass vetting move to a monitored watchlist. We track whether Parliament revisits a confirmation if new evidence emerges.",
            },
          ].map(({ act, label, description }) => (
            <div
              key={act}
              className="border border-neutral-800 rounded-lg p-5 bg-neutral-900/40"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {act}
                </span>
                <span className="font-semibold text-neutral-100">{label}</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Source Integrity */}
      <section>
        <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">
          Editorial standard
        </p>
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">
          Source integrity constraint
        </h2>
        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
          Every integrity flag on this platform must link to a publicly
          accessible, official or reputable document — a gazette notice, court
          judgment, EACC finding, parliamentary committee report, or registered
          news investigation. We do not publish bare allegations, anonymised
          tips, or documents that cannot be independently verified. If a source
          link breaks, the flag is immediately suspended pending re-verification.
        </p>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Corrections are welcome and taken seriously. If you believe a flag is
          inaccurate, outdated, or unsourced, email{" "}
          <a
            href="mailto:corrections@vettingloop.ke"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            corrections@vettingloop.ke
          </a>{" "}
          with the correct source document and we will review within 48 hours.
        </p>
      </section>

      {/* Team */}
      <section>
        <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">
          Team
        </p>
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">
          Who built this
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "Caroline Gaita",
              role: "Research Lead",
              bio: "Kenyan civic technologist and journalist. Leads data sourcing, editorial review, and CSO partnerships.",
            },
            {
              name: "Jimmy",
              role: "Engineering",
              bio: "Full-stack engineer. Responsible for the API, database schema, and infrastructure on Cloudflare.",
            },
            {
              name: "Terry Richards",
              role: "Product / Agent9",
              bio: "Co-founder of Agent9. Designed the product architecture and AI-assisted data pipeline.",
            },
          ].map(({ name, role, bio }) => (
            <div
              key={name}
              className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40"
            >
              <p className="font-semibold text-neutral-100 text-sm">{name}</p>
              <p className="font-mono text-xs text-emerald-500 mb-2">{role}</p>
              <p className="text-neutral-500 text-xs leading-relaxed">{bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section>
        <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">
          Data sources
        </p>
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">
          Where the data comes from
        </h2>
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/60">
                <th className="text-left font-mono text-xs text-neutral-500 uppercase tracking-wide px-4 py-3">
                  Source
                </th>
                <th className="text-left font-mono text-xs text-neutral-500 uppercase tracking-wide px-4 py-3">
                  Type
                </th>
                <th className="text-left font-mono text-xs text-neutral-500 uppercase tracking-wide px-4 py-3">
                  Covers
                </th>
                <th className="text-left font-mono text-xs text-neutral-500 uppercase tracking-wide px-4 py-3">
                  License
                </th>
              </tr>
            </thead>
            <tbody>
              {dataSources.map((src, i) => (
                <tr
                  key={src.name}
                  className={
                    i < dataSources.length - 1
                      ? "border-b border-neutral-800/60"
                      : ""
                  }
                >
                  <td className="px-4 py-3">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                    >
                      {src.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                    {src.type}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{src.covers}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                    {src.license}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact */}
      <section>
        <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">
          Contact
        </p>
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">
          Corrections & contact
        </h2>
        <div className="space-y-3 text-neutral-400 text-sm leading-relaxed">
          <p>
            Found an error? Email{" "}
            <a
              href="mailto:corrections@vettingloop.ke"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              corrections@vettingloop.ke
            </a>{" "}
            with the correct source document. We aim to respond within 48 hours.
          </p>
          <p>
            For CSO partnerships or data collaboration, email{" "}
            <a
              href="mailto:partnerships@vettingloop.ke"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              partnerships@vettingloop.ke
            </a>
            .
          </p>
          <p>
            The platform is fully open source.{" "}
            <a
              href="https://github.com/Agent9AI/vetting-loop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View the repository on GitHub →
            </a>
          </p>
        </div>
      </section>

      {/* Back link */}
      <div>
        <Link
          href="/"
          className="font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

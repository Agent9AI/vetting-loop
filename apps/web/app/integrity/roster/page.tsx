import type { Metadata } from "next";
import Link from "next/link";
import { ROSTER_2022_CS, ROSTER_2022_PS, ROSTER_2025_CHANGES, ROSTER_PROVENANCE } from "@vetting-loop/integrity";
import { formatDate, getProfiles } from "@/lib/integrity";
import { PageHeader } from "@/components/integrity/ui";

export const metadata: Metadata = {
  title: "Roster status · Integrity Index | The Vetting Loop",
};

function Status({ profiled }: { profiled: boolean }) {
  return profiled ? (
    <span className="rounded-mz bg-mz-green px-1.5 py-0.5 text-[11px] font-bold uppercase text-white">Profiled</span>
  ) : (
    <span className="rounded-mz border border-mz-border px-1.5 py-0.5 text-[11px] font-semibold uppercase text-mz-muted">Queued</span>
  );
}

export default function RosterPage() {
  const profiled = getProfiles();
  // Match on the roster's own names so the check works in pseudonym mode too.
  const slugTokens = profiled.map((p) => new Set(p.slug.split("-")));
  const isProfiled = (name: string) => {
    const tokens = name.toLowerCase().replace(/^(prof|dr|amb|eng)\.\s+/, "").replace(/[^a-z\s]/g, "").split(/\s+/);
    return slugTokens.some((set) => tokens.every((t) => set.has(t)));
  };

  return (
    <main>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Civic Tech Tools", href: "/civic-tech" },
          { label: "Integrity Index", href: "/integrity" },
          { label: "Roster status" },
        ]}
        title="Roster status"
        lede={
          <>
            The index currently profiles the {profiled.length}-member 2024 Cabinet vetting cohort. This page tracks the wider
            public-officer roster and will switch to the 2027 candidate list when it is known.
          </>
        }
      />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10">
        <p className="text-xs text-mz-muted">{ROSTER_PROVENANCE}</p>

        <section className="mz-stat">
          <p className="mz-eyebrow">2027 general election</p>
          <p className="text-2xl font-bold text-mz-green">Candidate list pending</p>
          <p className="text-sm text-mz-muted">
            When IEBC publishes the cleared candidate list, replace <code>PROFILED_ROSTER</code> in{" "}
            <code>packages/integrity/src/roster.ts</code>. Pages, scoring and tests pick it up without other changes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-mz-red">Cabinet nominated 27 Sep 2022 ({ROSTER_2022_CS.length})</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {ROSTER_2022_CS.map((r) => (
              <div key={r.name} className="mz-card flex items-center justify-between px-4 py-2 text-sm">
                <span>
                  <span className="font-semibold">{r.name}</span>
                  <span className="block text-xs text-mz-muted">{r.portfolio}</span>
                </span>
                <Status profiled={isProfiled(r.name)} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-mz-red">2025 appointments outside the 2024 vetting cycle ({ROSTER_2025_CHANGES.length})</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {ROSTER_2025_CHANGES.map((r) => (
              <div key={r.name} className="mz-card flex items-center justify-between px-4 py-2 text-sm">
                <span>
                  <span className="font-semibold">{r.name}</span>
                  <span className="block text-xs text-mz-muted">
                    {r.portfolio} · {r.date.length === 10 ? formatDate(r.date) : r.date}
                  </span>
                </span>
                <Status profiled={false} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-mz-red">Principal Secretaries nominated 2 Nov 2022 ({ROSTER_2022_PS.length})</h2>
          <div className="grid gap-2 md:grid-cols-3">
            {ROSTER_2022_PS.map((r) => (
              <div key={r.name} className="mz-card px-4 py-2 text-sm">
                <span className="font-semibold">{r.name}</span>
                <span className="block text-xs text-mz-muted">{r.department}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm">
          <Link href="/integrity" className="mz-link">
            Back to the Integrity Index
          </Link>
        </p>
      </div>
    </main>
  );
}

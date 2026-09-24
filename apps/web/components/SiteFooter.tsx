import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-4 border-mz-red bg-mz-subtle">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div>
          <p className="font-bold text-mz-red">The Vetting Loop</p>
          <p className="mt-2 text-mz-muted">
            A civic tech prototype for parliamentary vetting accountability in Kenya, designed to sit under
            Mzalendo&apos;s Civic Tech Tools.
          </p>
        </div>
        <div>
          <p className="mz-eyebrow mb-2">Tools</p>
          <ul className="space-y-1">
            <li><Link className="mz-link" href="/integrity">Integrity Index</Link></li>
            <li><Link className="mz-link" href="/integrity/methodology">Methodology</Link></li>
            <li><Link className="mz-link" href="/integrity/roster">2027 roster status</Link></li>
          </ul>
        </div>
        <div>
          <p className="mz-eyebrow mb-2">Data notice</p>
          <p className="text-mz-muted">
            Integrity ratings and findings shown in this prototype are mock data. Appointment histories are
            compiled from public records and pending Kenya Gazette verification.
          </p>
        </div>
      </div>
    </footer>
  );
}

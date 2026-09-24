import * as React from "react";
import Link from "next/link";
import { BAND_LABEL, type RatingBand } from "@vetting-loop/integrity";
import { BAND_STYLE, initials } from "@/lib/integrity";

export function MockBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div role="note" className="border-y border-amber-300 bg-amber-50">
      <div className={`mx-auto max-w-7xl px-4 ${compact ? "py-2" : "py-3"} text-sm text-amber-900`}>
        <strong className="mr-2 rounded-mz bg-amber-500 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          Mock data
        </strong>
        Every integrity rating and finding on these pages is synthetic, generated to demonstrate the interface
        outside election season. None describes a real investigation, audit or hearing. Names and appointments come
        from the 2022–2025 public roster and will be replaced by the 2027 candidate list.
      </div>
    </div>
  );
}

export function MockStamp() {
  return (
    <span className="rounded-mz border border-amber-500 px-1 py-px text-[10px] font-bold uppercase tracking-wide text-amber-700">
      Mock
    </span>
  );
}

export function PageHeader({
  crumbs,
  title,
  lede,
}: {
  crumbs: Array<{ label: string; href?: string }>;
  title: string;
  lede?: React.ReactNode;
}) {
  return (
    <section className="border-b border-mz-border bg-mz-subtle">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-2 text-mz-muted">»</span>}
              {c.href ? (
                <Link href={c.href} className="text-mz-green hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className="font-medium">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-bold text-mz-red md:text-4xl">{title}</h1>
        {lede && <div className="mt-3 max-w-3xl text-mz-muted">{lede}</div>}
      </div>
    </section>
  );
}

export function RatingBadge({ band, score, size = "sm" }: { band: RatingBand; score: number; size?: "sm" | "lg" }) {
  const s = BAND_STYLE[band];
  if (size === "lg") {
    return (
      <div className={`rounded-mz border-2 ${s.ring} p-4 text-center`}>
        <div className={`text-5xl font-extrabold ${s.text}`}>{score}</div>
        <div className="text-xs text-mz-muted">of 100 · risk score</div>
        <div className={`mt-3 inline-block rounded-mz ${s.bg} px-3 py-1 text-sm font-bold text-white`}>{BAND_LABEL[band]}</div>
      </div>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className={`inline-block min-w-[2.25rem] rounded-mz ${s.bg} px-1.5 py-0.5 text-center text-xs font-bold text-white`}>
        {score}
      </span>
      <span className={`text-sm font-semibold ${s.text}`}>{BAND_LABEL[band]}</span>
    </span>
  );
}

export function Avatar({ name, band }: { name: string; band: RatingBand }) {
  return (
    <span
      aria-hidden
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${BAND_STYLE[band].ring} bg-mz-subtle text-sm font-bold text-mz-text`}
    >
      {initials(name)}
    </span>
  );
}

export function VettingPill({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    approved: "bg-green-50 text-mz-green border-green-200",
    rejected: "bg-red-50 text-mz-red border-red-200",
    withdrawn: "bg-neutral-50 text-mz-muted border-mz-border",
    not_vetted: "bg-neutral-50 text-mz-muted border-mz-border",
  };
  return (
    <span className={`rounded-mz border px-1.5 py-0.5 text-[11px] font-semibold uppercase ${styles[outcome] ?? styles.not_vetted}`}>
      {outcome.replace("_", " ")}
    </span>
  );
}

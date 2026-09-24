import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SilenceMapBarProps {
  asked: number;
  ignored: number;
  total: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SilenceMapBar({ asked, ignored, total }: SilenceMapBarProps) {
  const coveragePct = total > 0 ? Math.round((asked / total) * 100) : 0;
  const fillWidth = Math.min(100, coveragePct);

  return (
    <div className="space-y-2">
      {/* Percentage headline */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono text-emerald-400">
          {coveragePct}%
        </span>
        <span className="text-xs font-mono text-neutral-500 uppercase tracking-wide">
          coverage
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={coveragePct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${coveragePct}% of citizen questions addressed`}
      >
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      {/* Summary row */}
      <p className="font-mono text-xs text-neutral-500">
        <span className="text-emerald-400">{asked.toLocaleString()} asked</span>
        {" · "}
        <span className="text-red-400">{ignored.toLocaleString()} ignored</span>
        {" · "}
        <span className="text-neutral-400">
          {total.toLocaleString()} total citizen questions
        </span>
      </p>
    </div>
  );
}

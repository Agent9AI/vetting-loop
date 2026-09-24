"use client";

import * as React from "react";
import Link from "next/link";
import { BAND_LABEL, type RatingBand, type SourceChannel } from "@vetting-loop/integrity";
import { CHANNEL_META } from "@/lib/integrity";
import { Avatar, RatingBadge, VettingPill } from "./ui";

export type IndexRow = {
  slug: string;
  name: string;
  role: string;
  vetting2024: string;
  returnee: boolean;
  score: number;
  band: RatingBand;
  channelCounts: Record<SourceChannel, number>;
  excluded: number;
};

type Sort = "score" | "name";

export function IndexTable({ rows }: { rows: IndexRow[] }) {
  const [q, setQ] = React.useState("");
  const [band, setBand] = React.useState<RatingBand | "all">("all");
  const [sort, setSort] = React.useState<Sort>("score");

  const shown = rows
    .filter((r) => band === "all" || r.band === band)
    .filter((r) => {
      const needle = q.trim().toLowerCase();
      return !needle || r.name.toLowerCase().includes(needle) || r.role.toLowerCase().includes(needle);
    })
    .sort((a, b) => (sort === "score" ? b.score - a.score || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)));

  const channels = Object.keys(CHANNEL_META) as SourceChannel[];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
        <label className="flex-1">
          <span className="mz-eyebrow mb-1 block">Find a nominee</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or portfolio"
            className="w-full rounded-mz border border-neutral-300 px-4 py-2.5 focus:border-mz-red focus:outline-none"
          />
        </label>
        <label>
          <span className="mz-eyebrow mb-1 block">Rating</span>
          <select
            value={band}
            onChange={(e) => setBand(e.target.value as RatingBand | "all")}
            className="rounded-mz border border-neutral-300 bg-white px-3 py-2.5"
          >
            <option value="all">All ratings</option>
            {(Object.keys(BAND_LABEL) as RatingBand[]).map((b) => (
              <option key={b} value={b}>
                {BAND_LABEL[b]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mz-eyebrow mb-1 block">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-mz border border-neutral-300 bg-white px-3 py-2.5">
            <option value="score">Highest score first</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-mz border border-mz-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-mz-subtle text-xs uppercase tracking-wide text-mz-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Nominee</th>
              <th className="px-4 py-3 font-semibold">2024 vetting</th>
              <th className="px-4 py-3 font-semibold">Integrity rating <span className="text-amber-700">(mock)</span></th>
              <th className="px-4 py-3 font-semibold">Records in window</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.slug} className="border-t border-mz-border hover:bg-mz-subtle">
                <td className="px-4 py-3">
                  <Link href={`/integrity/${r.slug}`} className="flex items-center gap-3">
                    <Avatar name={r.name} band={r.band} />
                    <span>
                      <span className="block font-semibold text-mz-red hover:underline">{r.name}</span>
                      <span className="block text-xs text-mz-muted">{r.role}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <VettingPill outcome={r.vetting2024} />
                  {r.returnee && <span className="ml-2 text-[11px] text-mz-muted">returnee</span>}
                </td>
                <td className="px-4 py-3">
                  <RatingBadge band={r.band} score={r.score} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {channels.map((c) =>
                      r.channelCounts[c] > 0 ? (
                        <span
                          key={c}
                          className="rounded-mz px-1.5 py-0.5 text-[11px] font-semibold text-white"
                          style={{ background: CHANNEL_META[c].color }}
                          title={CHANNEL_META[c].long}
                        >
                          {CHANNEL_META[c].short} {r.channelCounts[c]}
                        </span>
                      ) : null,
                    )}
                    {channels.every((c) => r.channelCounts[c] === 0) && <span className="text-xs text-mz-muted">None</span>}
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-mz-muted">
                  No nominees match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-mz-muted">
        Showing {shown.length} of {rows.length}. Records counted include cleared and resolved matters, which carry no points.
      </p>
    </div>
  );
}

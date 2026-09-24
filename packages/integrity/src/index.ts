import { assignMockBands, mockFindings } from "./mock";
import { PROFILED_ROSTER } from "./roster";
import { DEFAULT_AS_OF, rate } from "./scoring";
import type { Profile, RatingBand } from "./types";

export * from "./types";
export * from "./scoring";
export * from "./roster";
export { MOCK_DISCLOSURE, MOCK_BAND_QUOTA, PORTALS, hashSlug, assignMockBands, mockFindings } from "./mock";

/**
 * "named" shows real names from the roster beside MOCK ratings.
 * "pseudonym" replaces names with neutral labels: use it for any public
 * or external deployment while findings are synthetic.
 */
export type IdentityMode = "named" | "pseudonym";

export function pseudonymFor(index: number): string {
  return `Nominee ${String(index + 1).padStart(2, "0")}`;
}

export function getProfiles(opts: { asOf?: string; identity?: IdentityMode } = {}): Profile[] {
  const asOf = opts.asOf ?? DEFAULT_AS_OF;
  const bands = assignMockBands(PROFILED_ROSTER.map((p) => p.slug));
  return PROFILED_ROSTER.map((person, i) => {
    const findings = mockFindings(person, bands.get(person.slug) ?? "clear");
    const fullName = opts.identity === "pseudonym" ? pseudonymFor(i) : person.fullName;
    return { ...person, fullName, findings, rating: rate(findings, asOf) };
  });
}

export function getProfile(slug: string, opts: { asOf?: string; identity?: IdentityMode } = {}): Profile | undefined {
  return getProfiles(opts).find((p) => p.slug === slug);
}

export type IndexSummary = {
  total: number;
  byBand: Record<RatingBand, number>;
  findingsInWindow: number;
  excludedOutsideWindow: number;
};

export function summarize(profiles: Profile[]): IndexSummary {
  const byBand: Record<RatingBand, number> = { clear: 0, low: 0, elevated: 0, high: 0 };
  let findingsInWindow = 0;
  let excludedOutsideWindow = 0;
  for (const p of profiles) {
    byBand[p.rating.band]++;
    findingsInWindow += p.rating.inWindow.length;
    excludedOutsideWindow += p.rating.excludedOutsideWindow;
  }
  return { total: profiles.length, byBand, findingsInWindow, excludedOutsideWindow };
}

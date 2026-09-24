# Shareable Cards — OG Image & Social Media Spec

**Version:** 0.1 — Phase 2 implementation target
**Technology:** Cloudflare Worker + [Satori](https://github.com/vercel/satori) (WASM, no Node dependencies)

---

## Overview

Auto-generated social images give The Vetting Loop a presence in Twitter/X timelines and WhatsApp previews without requiring a design team to produce per-nominee graphics. Every shareable entity on the platform — nominee dossiers, silence maps, vote trails, and individual flags — gets a canonical OG card URL that any meta tag can reference.

All cards are generated on-demand by a Cloudflare Worker at `/api/og/*` using Satori (JSX→SVG→PNG). Results are cached in Cloudflare's edge cache with a `Cache-Control: public, max-age=3600, s-maxage=86400` header. Cache invalidation on data update is handled by `wrangler kv:key put` clearing the cache tag.

---

## Card Specifications

### 1. Nominee Dossier Card

**Purpose:** Shared when a user shares a nominee's profile page (`/nominees/[slug]`)

**URL pattern:** `/api/og/nominee/[slug]`
**Example:** `/api/og/nominee/jane-doe-attorney-general`

**Dimensions:** 1200 × 630 px

**Design tokens:**
| Token | Value |
|---|---|
| Background | `#0F172A` (slate-950) |
| Accent stripe | `#F59E0B` (amber-500) — 8px left border |
| Heading font | Inter Bold, 48px |
| Body font | Inter Regular, 28px |
| Badge (status) | Rounded pill, amber or red per status enum |
| Flag count pill | Red background `#EF4444`, white text |

**Key data fields (sourced from D1 `/nominees/[slug]`):**
- `full_name` — large heading
- `position` — subheading
- `status` — status badge (gazetted / hearing scheduled / approved / rejected)
- `flag_count` — red pill, e.g. "3 Integrity Flags"
- `hearing_date` — if set, shown as "Hearing: 14 Oct 2026"
- Platform wordmark bottom-right: "The Vetting Loop · vettingloop.ke"

**Photo placeholder:** Grey avatar circle (no actual photo stored; photos are a Phase 3 consideration after editorial/consent policy is established)

---

### 2. Silence Map Card

**Purpose:** The highest-impact shareable stat — the ratio of citizen questions ignored at a hearing

**URL pattern:** `/api/og/silence/[hearing-id]`
**Example:** `/api/og/silence/hr-2026-001`

**Dimensions:** 1200 × 630 px

**Design tokens:**
| Token | Value |
|---|---|
| Background | `#1E1B4B` (indigo-950) |
| Highlight number | `#F59E0B` (amber-500), 120px, bold |
| Supporting text | White, 32px |
| Subtitle | Slate-400, 24px |

**Key data fields (sourced from D1 `/hearings/[id]`):**
- `citizen_questions_ignored` — giant amber number, top-centre
- `citizen_questions_asked` — denominator in supporting text
- Generated sentence: **"11 of 14 citizen questions ignored"**
- `nominee.full_name` + `nominee.position` — bottom attribution
- `date` — hearing date
- Platform wordmark

**Shareable copy (pre-filled for Twitter share button):**
`11 of 14 questions citizens submitted for [Name]'s vetting hearing were never asked. #VettingLoop #KenyaParliament`

---

### 3. Vote Trail Card

**Purpose:** Summarises the committee vote on a nominee

**URL pattern:** `/api/og/votes/[nominee-slug]`
**Example:** `/api/og/votes/jane-doe-attorney-general`

**Dimensions:** 1200 × 630 px

**Design tokens:**
| Token | Value |
|---|---|
| Background | `#0F172A` (slate-950) |
| Aye bar | `#22C55E` (green-500) |
| Nay bar | `#EF4444` (red-500) |
| Abstain/Absent bar | `#94A3B8` (slate-400) |
| Nominee name | White, Inter Bold, 42px |

**Key data fields (aggregated from D1 `/votes?nomineeId=[id]`):**
- `nominee.full_name`
- `nominee.position`
- Vote tally: `aye_count`, `nay_count`, `abstain_count`, `absent_count`
- Horizontal bar chart (Satori `<div>` with flex widths)
- Outcome label: "Approved" / "Rejected" / "Deferred"
- Largest single-party bloc noted if >50% of ayes from one party

---

### 4. Per-Flag Card

**Purpose:** Shared when a user views or shares a specific integrity flag

**URL pattern:** `/api/og/flag/[flag-id]`
**Example:** `/api/og/flag/flg-abc123`

**Dimensions:** 1200 × 630 px

**Design tokens:**
| Token | Value |
|---|---|
| Background | `#7F1D1D` (red-950) for high severity; `#78350F` (amber-950) for medium; `#1E3A5F` (blue-950) for low |
| Severity badge | Coloured pill top-right |
| Flag summary | White, Inter Bold, 36px, max 3 lines with ellipsis |
| Source attribution | Slate-300, 22px, italic |

**Key data fields (sourced from D1 flag + source_documents join):**
- `severity` — drives background colour
- `summary` — flag description, truncated to 200 chars for card
- First linked `source_document.publisher` + `source_document.published_at` — attribution line
- `nominee.full_name` — top attribution ("Re: [Name]")
- Platform wordmark

---

## Generation Approach

All four workers share the same Satori pipeline:

```typescript
// apps/api/src/routes/og.ts (pattern)
import satori from 'satori';
import { Resvg } from '@resvg/resvg-wasm';

export async function generateOgCard(jsx: React.ReactElement, env: Env): Promise<Response> {
  const interFont = await env.ASSETS.fetch('/fonts/Inter-Bold.woff');
  const fontBuffer = await interFont.arrayBuffer();

  const svg = await satori(jsx, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Inter', data: fontBuffer, weight: 700, style: 'normal' }],
  });

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
```

Fonts are served from the Worker's asset bundle (added to `wrangler.toml` `[assets]` section). No external font fetches at render time.

---

## Meta Tag Integration (Next.js)

In each page's `generateMetadata`:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  return {
    openGraph: {
      images: [`${process.env.NEXT_PUBLIC_API_URL}/api/og/nominee/${slug}`],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${process.env.NEXT_PUBLIC_API_URL}/api/og/nominee/${slug}`],
    },
  };
}
```

Twitter/X requires `summary_large_image` card type for 1200×630 images to render at full width.

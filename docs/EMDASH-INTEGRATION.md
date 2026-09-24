# EmDash CMS Integration Specification

**Version:** 0.1
**Status:** Phase 2 — Pre-implementation design

---

## Overview

The Vetting Loop separates two distinct content categories with different ownership, update cadence, and editorial requirements:

| Layer | Owner | Technology | Update cadence |
|---|---|---|---|
| **Structured civic data** | Agent9 data team | Cloudflare D1 + Hono API | Real-time / event-driven |
| **Editorial content** | Partner editors (CSOs, Agent9 legal) | EmDash CMS | Weekly or on-demand |

This separation is a deliberate architectural choice. Forcing non-technical CSO editors through a developer workflow to publish a vetting guide or a candidate context article would create a bottleneck. Equally, allowing editorial tooling to touch the authoritative structured data (nominees, flags, votes) would compromise data integrity. EmDash owns interpretation; D1 owns facts.

---

## What EmDash Manages

EmDash is the authoring and publishing environment for all *editorial* content on The Vetting Loop. It does not store nominee records, integrity flags, votes, or hearing data. Those live exclusively in D1.

EmDash manages:

- **Vetting Guides** — How-to articles explaining the vetting process to citizens ("What happens after a nominee is gazetted?")
- **Nominee Context** — Rich-text sidebar articles providing background on specific nominees (career narrative, sector context, controversy history) written by partner editors
- **CSO Spotlight profiles** — Partner organisation profiles used on the `/orgs/[cso-slug]` pages
- **Chapter Six Explainers** — Plain-language articles on constitutional integrity requirements (see also `docs/CHAPTER-SIX.md`)
- **Hearing Analysis** — Post-hearing editorial write-ups ("What the committee failed to ask")

---

## Content Types in EmDash

| Content Type | Fields | Output URL | Notes |
|---|---|---|---|
| `VettingGuide` | title, slug, body (rich text), tags[], publishedAt, seoMeta | `/guides/[slug]` | General civic education; no nominee linkage |
| `NomineeContext` | title, nomineeSlug (FK to D1), body (rich text), author, reviewedAt | `/context/[nominee-slug]` | Linked to specific nominee; displayed as sidebar in dossier view |
| `CSOSpotlight` | orgName, slug, logo, mission, website, body, contactEmail | `/orgs/[cso-slug]` | Published by Agent9 admin; editable by organisation Editor role |
| `Chapter6Explainer` | title, slug, articleNumber, body, relatedGuides[] | `/guides/chapter-six/[slug]` | Tagged by constitutional article; auto-linked from flag cards |
| `HearingAnalysis` | title, hearingId (FK to D1), body, author, publishedAt | `/analysis/[hearing-id]` | Post-hearing editorial; pulled into Hearing Record page if published |

---

## Data Flow

```
EmDash editor publishes content
          │
          ▼
EmDash webhook (POST application/json)
          │
          ▼
Cloudflare Worker (apps/api/src/routes/cms-webhook.ts)
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
KV cache    D1 metadata
(edge HTML  (slug → content_type
 fragment)   mapping for routing)
    │
    ▼
Next.js page fetches from KV at request time
(ISR revalidation on webhook receipt)
```

The webhook handler validates a shared secret (`CMS_WEBHOOK_SECRET`), identifies the content type and slug, fetches the full document from the EmDash Content API, stores the rendered HTML fragment in Cloudflare KV with a TTL of 7 days, and triggers a Next.js on-demand ISR revalidation via `revalidateTag(slug)`.

Cold reads (KV miss) fall back to a direct EmDash Content API call with a 60-second timeout. This ensures no published content is ever stale for more than 60 seconds after publication.

---

## URL Structure

| Route | Content source | Example |
|---|---|---|
| `/guides/*` | EmDash `VettingGuide` | `/guides/what-is-a-hearing` |
| `/guides/chapter-six/*` | EmDash `Chapter6Explainer` | `/guides/chapter-six/article-75` |
| `/context/[nominee-slug]` | EmDash `NomineeContext` + D1 nominee | `/context/jane-doe-attorney-general` |
| `/orgs/[cso-slug]` | EmDash `CSOSpotlight` | `/orgs/khrc` |
| `/analysis/[hearing-id]` | EmDash `HearingAnalysis` | `/analysis/hr-2026-001` |

Pages at `/context/[nominee-slug]` combine data from both sources: the structured nominee record (name, position, status, flags, questions) comes from the D1 API; the contextual sidebar article comes from EmDash via KV.

---

## Author Roles

| Role | Permissions | Assigned to |
|---|---|---|
| **Editor** | Create and edit draft content; cannot publish | CSO partner editorial contacts |
| **Reviewer** | Review and annotate drafts; flag for legal concern | Agent9 legal review team |
| **Publisher** | Approve and publish; can promote draft to live | Agent9 admin (2 seats maximum) |

All `NomineeContext` and `HearingAnalysis` entries require at least one Reviewer sign-off before a Publisher can promote them. This is enforced by EmDash's approval workflow, not application code. The rationale: content linked to named individuals carries defamation exposure and must pass a legal plausibility check.

---

## SEO

EmDash publishes structured OpenGraph and JSON-LD metadata alongside each content item. The Next.js `generateMetadata` function fetches metadata from the EmDash Content API (or KV cache) and injects it into the page `<head>` at request time.

For nominee-linked pages (`/context/[nominee-slug]`), the structured data includes `Person` schema from D1 (name, role, organisation) combined with `Article` schema from EmDash (author, publishedDate, description). This produces rich results in Google News and Twitter Cards with no additional configuration.

---

## Migration Path

The current `docs/` directory contains static Markdown reference documents (`ARCHITECTURE.md`, `ROADMAP.md`, `CHAPTER-SIX.md`, etc.). These are developer-facing and remain in the repository. They are not migrated to EmDash.

Content intended for public citizen consumption (vetting guides, explainers) will be authored directly in EmDash in Phase 2. There is no bulk import from existing Markdown: the editorial framing for public content differs enough from developer documentation to warrant a clean start.

The migration sequence:

1. Agent9 admin creates EmDash workspace and provisions Editor seats for CSO partners
2. Content team authors initial `VettingGuide` set (5–8 guides covering the full vetting lifecycle)
3. Webhook handler deployed and tested in staging
4. Next.js ISR integration verified end-to-end
5. CSO Spotlight profiles seeded for launch partners
6. Public launch with EmDash as the live editorial backend

---

## Environment Variables Required

```
EMDASH_API_URL=https://api.emdash.io
EMDASH_SPACE_ID=<your-space-id>
EMDASH_DELIVERY_TOKEN=<content-delivery-token>
CMS_WEBHOOK_SECRET=<shared-secret-for-webhook-validation>
```

These are stored as Cloudflare Worker secrets (`wrangler secret put`) and are never exposed to the Next.js client bundle.

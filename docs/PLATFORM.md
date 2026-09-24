# The Vetting Loop — Platform Overview

**Version:** 0.1 (Pre-Launch Review)
**Prepared by:** Agent9 · September 2026
**Audience:** Investors, civil society partners, parliamentary reform organisations

---

## Vision

The Vetting Loop is Kenya's first structured accountability platform for executive vetting hearings. It turns the constitutionally mandated vetting of Presidential and parliamentary appointees — a process frequently described by CSOs as "opaque theatre" — into a searchable, citeable, citizen-legible record.

Every nominee, every flag, every question a committee failed to ask, and every MP's vote is indexed, sourced, and exportable. The platform does not editoralise. It structures.

---

## The Three-Act Problem

### Act I — Before the Hearing

Nominees are gazetted with little lead time. Citizens, CSOs, and opposition researchers have days to surface relevant public-interest concerns. Information is scattered across the Kenya Gazette, EACC disclosures, court registries, and media archives. There is no single workspace for assembling a nominee's public accountability profile.

**The Vetting Loop answer:** A sourced dossier for every gazetted nominee — flagged records, structured career timeline, and a public question submission portal, seeded from Mzalendo data and editorial research.

### Act II — During the Hearing

Parliamentary committee hearings are partially transcribed in Hansard (when Hansard is published at all). Citizens who submitted questions have no way to know whether their concerns were raised. The silence is invisible.

**The Vetting Loop answer:** A Hearing Record linked to each nominee, tagging every exchange by topic (integrity, competence, financial disclosure). Citizen questions are matched to committee questions. The Silence Map quantifies what was ignored: *11 of 14 citizen questions were not raised*.

### Act III — After the Vote

Committee recommendations are published in reports that few citizens read. MP votes are recorded in Hansard but never aggregated by nominee. There is no longitudinal record of which legislators consistently approve nominees with active integrity flags.

**The Vetting Loop answer:** A per-nominee Vote Trail with each MP's choice, party affiliation, and constituency. An exportable dataset. A committee report linked to the citizen submissions it was supposed to reflect.

---

## Target Users

| Segment | Primary Use Case | Key Feature |
|---|---|---|
| **Citizens** | Track a specific nominee; upvote questions | Public portal, question submission |
| **Civil Society Orgs** | Research dossiers; monitor patterns | Structured export, Flag API, Silence Map |
| **Investigative Journalists** | Cross-nominee data; source attribution | CSV/JSON exports, SourceLink citations |
| **Parliament Reform Orgs** | Long-run MP voting record analysis | Vote Trail aggregates, MP scorecard |
| **Academic Researchers** | Longitudinal datasets | Vectorize semantic search, bulk API |

---

## Business Model

The Vetting Loop is designed for a layered model that moves from grant-funded sustainability to institutional revenue:

1. **Grant-funded NGO tier** — Core public access, free, funded by digital democracy and rule-of-law funders (Ford, MacArthur, Open Society East Africa, KICTANet). Estimated seed ask: USD 120k for an 18-month runway.

2. **Institutional API licensing** — Parliament-adjacent bodies, development partners, and embassies pay for structured data access and white-label reporting packages. Target: USD 8–15k/year per institutional seat.

3. **CSO SaaS subscriptions** — Tier above the public portal with bulk export, priority flag queuing, and co-branded dossier generation. Target: KES 25k/month per organisation.

4. **Media partnership white-label** — Nation Media Group, The Standard, and regional digital outlets embed nominee dossier cards and Silence Map widgets. Revenue share on co-produced investigation packages.

---

## Competitive Landscape

| Platform | Geography | Strength | Gap vs. Vetting Loop |
|---|---|---|---|
| **Mzalendo** | Kenya | MP profiles, voting records | No vetting-specific flow; no silence map; no flag sourcing |
| **TheyWorkForYou / MySociety** | UK, global | Hansard parsing, bill tracking | Not Kenya-localised; no nomination lifecycle |
| **Africa Check** | Pan-Africa | Fact-checking claims | Unstructured; no structured nominee data model |
| **OpenAfrica** | Pan-Africa | Open dataset hosting | No live data pipeline; no user-facing layer |

The Vetting Loop is the only product with: (a) a data model built around the Chapter Six compliance lifecycle, (b) the Silence Map algorithm, (c) source-integrity enforcement at the flag level, and (d) a citizen question → committee question matching pipeline.

---

## Platform Features Matrix

| Feature | MVP | Phase 2 | Phase 3 |
|---|---|---|---|
| Nominee dossier (basic) | ✅ | — | — |
| Integrity flags with sourced documents | ✅ | — | — |
| Citizen question portal | ✅ | — | — |
| Silence Map (ignored questions counter) | ✅ | — | — |
| Hearing exchange transcript | ✅ | — | — |
| MP vote trail | ✅ | — | — |
| Committee report linkage | ✅ | — | — |
| Mzalendo MP sync | ✅ | — | — |
| Shareable OG cards (nominee, vote, silence) | — | ✅ | — |
| Vectorize semantic search across dossiers | — | ✅ | — |
| EmDash CMS editorial layer | — | ✅ | — |
| Bulk structured export (CSV/JSON) | — | ✅ | — |
| Longitudinal MP integrity scorecard | — | ✅ | — |
| Public API with rate limiting and keys | — | ✅ | — |
| Uganda PPDA vetting module | — | — | ✅ |
| South Africa DPSA adaptation | — | — | ✅ |
| Nigeria RMAFC integration | — | — | ✅ |
| AI-assisted flag triage | — | — | ✅ |

---

## EmDash CMS Integration

The Vetting Loop separates *editorial content* from *structured civic data*. D1 and the Hono API own nominees, flags, votes, and hearing records. EmDash CMS owns the interpretive layer: explainers, vetting guides, CSO spotlight profiles, and historical context articles.

This separation enables non-technical partner editors at CSO organisations to publish context without touching the data pipeline. See [`docs/EMDASH-INTEGRATION.md`](./EMDASH-INTEGRATION.md) for the full integration spec.

---

## Technical Moat

- **Source-integrity constraint** — No integrity flag can exist without at least one linked `source_document`. The API enforces this at insert time; the UI surfaces the citation on every flag card. This is the single most defensible feature against defamation claims.
- **Silence Map algorithm** — `citizenQuestionsIgnored / citizenQuestionsAsked` is computed per hearing record, with the raw matched question IDs as evidence. The stat is not an editorial judgment; it is a count.
- **Structured exports** — Every entity (nominee, flag, vote, question) is exportable as JSON or CSV via the public API. This makes The Vetting Loop the authoritative upstream source for any media or CSO downstream analysis.
- **Cloudflare edge delivery** — D1 + Workers + KV means sub-100ms response times from Nairobi without a separate CDN contract.

---

## Expansion Pathways

| Country | Institution | Analogous Process | Readiness |
|---|---|---|---|
| Uganda | PPDA / Parliament | Presidential appointments vetting | High — similar Commonwealth structure |
| South Africa | DPSA | NPA, SABC, SOE board appointments | Medium — more complex multi-committee routing |
| Nigeria | RMAFC | Revenue mobilisation appointments | Medium — federal vs. state complexity |

The data model is deliberately country-agnostic at the schema level (no Kenya-specific columns). Expansion requires a new Cloudflare D1 database instance, a country-specific Mzalendo-equivalent sync script, and localised Chapter Six equivalent documentation.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Defamation exposure from flags | Medium | High | Source-integrity constraint; legal review workflow in EmDash before publication |
| Political pressure / takedown | Medium | High | Cloudflare infrastructure outside Kenyan jurisdiction; legal entity structured as NGO |
| Data quality (incorrect flag) | High | Medium | Mandatory source document; admin review queue; community flagging |
| Mzalendo API instability | Medium | Low | Local cache layer; graceful degradation; fallback to manual entry |
| Low citizen engagement | Medium | Medium | Partnership with CSO networks for seeded questions; WhatsApp share integration |

---

## Go-to-Market Sequence

```
[Hackathon launch / NDIA submission]
         │
         ▼
[Mzalendo partnership — MP data integration + cross-promotion]
         │
         ▼
[CSO network onboarding — KHRC, TISA, Transparency International Kenya]
         │
         ▼
[Media partnership — Nation Digital / The Standard embeds]
         │
         ▼
[Parliamentary committee engagement — formal data-sharing MOU]
         │
         ▼
[Phase 2: institutional API licensing + EmDash editorial layer]
```

The hackathon submission establishes public legitimacy and a working codebase. The Mzalendo partnership is the single most leveraged early move: their MP dataset is the seed for the vote trail feature, and their audience is our audience.

---

*The Vetting Loop is built by Agent9. Enquiries: [hello@agent9.ai](mailto:hello@agent9.ai)*

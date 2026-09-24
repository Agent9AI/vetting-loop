# CONTRIBUTING-DATA.md

# Contributing Data — A Guide for CSOs, Researchers & Journalists

This guide explains how data contributors — civil society organisations, investigative journalists, parliamentary researchers, and members of the public — can submit structured data to The Vetting Loop. All contributions are reviewed before merging.

---

## 1. Submitting an Integrity Flag

An **integrity flag** is a sourced concern about a nominee: a past finding by the EACC, a court judgment, an adverse committee report, a gazette notice, or a credible news investigation. Flags must link to a public document.

### How to submit

1. Open a **GitHub Issue** using the [Integrity Flag template](https://github.com/Agent9AI/vetting-loop/issues/new?template=integrity-flag.md).
2. Fill in all required fields (see below).
3. Submit the issue. Agent9's legal review team will respond within **48 hours**.

### Required fields

| Field | Description |
|---|---|
| **Nominee name** | Full name as it appears in the Gazette |
| **Description of concern** | A factual, source-based summary. No bare allegations. |
| **Source URL** | Direct link to the public document (not a search result) |
| **Publisher** | e.g. Kenya Gazette, EACC, High Court of Kenya, Nation Media |
| **Publication date** | ISO 8601 format: `YYYY-MM-DD` |
| **Document type** | One of: `gazette` / `eacc_decision` / `court_judgment` / `committee_report` / `news_investigation` / `other` |

### Review process

- **48h legal review** by Agent9 team. We check that the source is publicly accessible, official or from a recognised publication, and that the flag text does not make claims beyond what the source supports.
- If approved, the flag is merged into the nominee's dossier with a direct source link.
- If rejected, we will explain the reason in the issue thread so you can revise and resubmit.

---

## 2. Submitting a Correction

If you believe an existing dossier, flag, vote record, or hearing data point is incorrect or outdated:

1. Email **corrections@vettingloop.ke** with:
   - The specific data point (including the nominee name or record ID)
   - The correct information
   - A link to a public source document that supports the correction
2. Alternatively, open a GitHub Issue using the [Data Correction template](https://github.com/Agent9AI/vetting-loop/issues/new?template=data-correction.md).
3. We will review and respond within 48 hours.

---

## 3. Adding a Hearing Exchange

Hearing exchanges are drawn from Hansard transcripts. If you have parsed a transcript and want to contribute structured hearing data:

1. Follow the seed script format in [`packages/db/seeds/hearings.ts`](../packages/db/seeds/).
2. Each exchange requires:
   - `nomineeSlug` — matches the nominee's URL slug
   - `committeeId` — the committee that held the hearing
   - `date` — ISO 8601 date of the hearing session
   - `askedBy` — MP name as it appears in Hansard
   - `questionText` — verbatim or lightly cleaned transcript text (English)
   - `answerSummary` — brief factual summary of the nominee's response
   - `hansardRef` — Hansard volume, date, and page number
3. Open a Pull Request with your seed data file and a link to the source Hansard PDF.

---

## 4. Data Standards

All contributed data must meet these standards:

- **English only.** Swahili summaries may be added as an optional field in future, but structured data fields must be in English.
- **Public record sources only.** No private documents, leaked materials, or anonymous tips. If a document is not publicly accessible via a URL, it cannot be cited.
- **No bare allegations.** Every claim must be traceable to a specific passage in a specific document. Paraphrase accurately; do not extrapolate.
- **No defamatory content.** Flags must describe documented findings, not personal opinions or unverified rumours.
- **Document types accepted:** Kenya Gazette, EACC decisions, High Court / Court of Appeal / Supreme Court judgments, parliamentary committee reports, Hansard transcripts, KNEC/TSC/IEBC official records, and credible news investigations from registered Kenyan or international publications.

---

## 5. CSO Partnership Track

If you are a civil society organisation that regularly tracks public appointments, parliamentary committees, or anti-corruption proceedings, we offer a **partnership track**:

- Priority review of your submissions (12h turnaround)
- Access to our bulk import script for structured CSV submissions
- A dedicated contact at Agent9 for data pipeline questions

To apply for the partnership track, email **partnerships@vettingloop.ke** with a brief description of your organisation, the data you produce, and the cadence of your submissions.

---

## 6. Code of Conduct for Data Contributors

By submitting data, you agree that:

- The source document you have linked is publicly accessible and has not been altered.
- You have not fabricated, altered, or selectively quoted the source to misrepresent its findings.
- You understand that submissions that do not meet these standards will be rejected and the issue closed.

Repeated bad-faith submissions will result in being blocked from the repository.

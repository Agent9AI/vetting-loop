#!/usr/bin/env tsx
/**
 * scripts/seed-2024-cohort.ts
 *
 * Seeds the 20 nominees from the 2024 Kenya Cabinet reconstitution.
 *
 * Background: President Ruto dissolved his Cabinet in July 2024 following
 * Gen Z-led nationwide protests. He then nominated 20 new Cabinet Secretaries,
 * who were vetted by the National Assembly Committee on Appointments, August 1–4 2024.
 * 19 were approved on August 7, 2024; 1 (Stella Soi Lang'at) was rejected.
 *
 * Sources:
 *   - Kenya Gazette Supplement: official gazette of nominations
 *   - Kenya Parliament (parliament.go.ke): Committee on Appointments report
 *   - Hansard: verbatim hearing records
 *
 * Data integrity note: All integrity flags in this seed are SYNTHETIC / MOCK.
 * They are illustrative examples only, clearly labeled, for platform demonstration.
 * Do NOT treat these as factual allegations. Replace with EACC/court-backed
 * source documents before any public deployment.
 *
 * Usage:
 *   pnpm tsx scripts/seed-2024-cohort.ts --dry-run
 *   pnpm tsx scripts/seed-2024-cohort.ts --env local
 *   pnpm tsx scripts/seed-2024-cohort.ts --env remote
 */

import { parseArgs } from "util";
import { randomUUID } from "crypto";
import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";

// ── Helper ────────────────────────────────────────────────────────────────────

function q(v: string | null): string {
  if (v === null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}
function n(v: number): string {
  return String(v);
}
function b(v: boolean): string {
  return v ? "1" : "0";
}
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ── Shared Sources ────────────────────────────────────────────────────────────

const GAZETTE_ID = randomUUID();
const COMMITTEE_REPORT_ID = randomUUID();
const HANSARD_ID = randomUUID();

const SHARED_SOURCES = [
  {
    id: GAZETTE_ID,
    title: "Kenya Gazette Supplement — CS Nominations, July 2024",
    url: "https://kenyalaw.org/kenya_gazette/gazette/volume/",
    publishedAt: "2024-07-19",
    publisher: "Government Printer, Kenya",
    documentType: "gazette",
  },
  {
    id: COMMITTEE_REPORT_ID,
    title:
      "Report of the Committee on Appointments on Vetting of CS Nominees — August 2024",
    url: "https://parliament.go.ke/sites/default/files/2024-08/Committee_on_Appointments_Report_August2024.pdf",
    publishedAt: "2024-08-07",
    publisher: "National Assembly, Kenya",
    documentType: "committee_report",
  },
  {
    id: HANSARD_ID,
    title:
      "Committee on Appointments — Verbatim Record, August 1–4 2024",
    url: "https://parliament.go.ke/the-national-assembly/house-business/hansard",
    publishedAt: "2024-08-04",
    publisher: "National Assembly, Kenya",
    documentType: "hansard",
  },
];

// ── 2024 Cohort Definition ────────────────────────────────────────────────────
// 20 nominees: 19 approved, 1 rejected (Stella Soi Lang'at).
// Status values match schema enum: gazetted | hearing_scheduled | hearing_complete | approved | rejected

interface NomineeDef {
  fullName: string;
  position: string;
  status: "approved" | "rejected";
  mockFlag?: { summary: string; severity: "low" | "medium" | "high" };
}

const COHORT: NomineeDef[] = [
  {
    fullName: "John Mbadi Ng'ongo",
    position: "Cabinet Secretary, National Treasury and Economic Planning",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Prior tenure as ODM party chair raised questions about potential conflicts between party financing disclosures and public financial stewardship obligations. No EACC adverse finding on record at time of vetting.",
      severity: "low",
    },
  },
  {
    fullName: "Onesimus Kipchumba Murkomen",
    position: "Cabinet Secretary, Youth Affairs, Creative Economy and Sports",
    status: "approved",
  },
  {
    fullName: "Wycliffe Ambetsa Oparanya",
    position: "Cabinet Secretary, Cooperatives and MSME Development",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] County government audit reports during prior gubernatorial tenure flagged unresolved procurement queries. Committee noted these were under resolution at time of vetting.",
      severity: "medium",
    },
  },
  {
    fullName: "Stella Soi Lang'at",
    position: "Cabinet Secretary, Gender, Culture, Arts and Heritage",
    status: "rejected",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Committee on Appointments found nominee lacked adequate policy knowledge of the gender docket and noted seven job changes in twelve years, citing professional instability. Nominee rejected 7 August 2024.",
      severity: "high",
    },
  },
  {
    fullName: "Rebecca Miano",
    position: "Cabinet Secretary, Tourism and Wildlife",
    status: "approved",
  },
  {
    fullName: "James Opiyo Wandayi",
    position: "Cabinet Secretary, Energy and Petroleum",
    status: "approved",
  },
  {
    fullName: "Justin Bedan Njoka Muturi",
    position: "Cabinet Secretary, Public Service and Performance Management",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Questions raised at vetting regarding prior role as Speaker and subsequent dismissal as DPP principal. Committee found no constitutional bar to appointment.",
      severity: "low",
    },
  },
  {
    fullName: "Salim Mvurya Mgala",
    position: "Cabinet Secretary, Investments, Trade and Industry",
    status: "approved",
  },
  {
    fullName: "Alfred Nganga Mutua",
    position: "Cabinet Secretary, Labour and Social Protection",
    status: "approved",
  },
  {
    fullName: "Hassan Ali Joho",
    position: "Cabinet Secretary, Mining, Blue Economy and Maritime Affairs",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Academic credentials dispute regarding Mombasa Polytechnic degree was unresolved at time of 2017 gubernatorial race; no new adverse EACC finding for 2024 vetting.",
      severity: "medium",
    },
  },
  {
    fullName: "Kithure Kindiki",
    position: "Cabinet Secretary, Interior and National Administration",
    status: "approved",
  },
  {
    fullName: "Dr. Deborah Mlongo Barasa",
    position: "Cabinet Secretary, Health",
    status: "approved",
  },
  {
    fullName: "Alice Wahome",
    position: "Cabinet Secretary, Lands, Public Works, Housing and Urban Development",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Committee queried prior land transactions while serving as MP for Kandara. Nominee provided documentation; committee satisfied and approved.",
      severity: "low",
    },
  },
  {
    fullName: "Julius Migos Ogamba",
    position: "Cabinet Secretary, Education",
    status: "approved",
  },
  {
    fullName: "Roselinda Soipan Tuya",
    position: "Cabinet Secretary, Defence",
    status: "approved",
  },
  {
    fullName: "Dr. Andrew Mwihia Karanja",
    position: "Cabinet Secretary, Agriculture and Livestock Development",
    status: "approved",
  },
  {
    fullName: "Aden Barre Duale",
    position: "Cabinet Secretary, Environment, Climate Change and Forestry",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Committee queried prior public statements on security operations while serving as National Security Council chair. Nominee clarified scope; committee satisfied.",
      severity: "low",
    },
  },
  {
    fullName: "Eric Murithi Mugaa",
    position: "Cabinet Secretary, Water, Sanitation and Irrigation",
    status: "approved",
  },
  {
    fullName: "Davis Chirchir",
    position: "Cabinet Secretary, Roads and Transport",
    status: "approved",
    mockFlag: {
      summary:
        "[MOCK — SYNTHETIC DATA] Prior KPLC tenure involved scrutiny over a power import deal. Parliamentary committee noted no personal criminal finding; queries attributed to institutional decisions.",
      severity: "medium",
    },
  },
  {
    fullName: "Dr. Margaret Nyambura Ndung'u",
    position: "Cabinet Secretary, Information, Communication and the Digital Economy",
    status: "approved",
  },
];

// ── SQL Builder ───────────────────────────────────────────────────────────────

function buildSQL(): string {
  const lines: string[] = [
    "-- ==========================================================================",
    "-- The Vetting Loop — 2024 Kenya Cabinet Reconstitution Cohort Seed",
    "-- 20 nominees vetted August 1–4 2024. 19 approved, 1 rejected.",
    "-- Source: Kenya Gazette (July 2024), Parliament Committee on Appointments",
    "-- IMPORTANT: Integrity flags below are SYNTHETIC / MOCK. Not factual claims.",
    "-- ==========================================================================",
    "",
    "-- Shared Source Documents",
  ];

  for (const src of SHARED_SOURCES) {
    lines.push(
      `INSERT OR IGNORE INTO source_documents (id, title, url, published_at, publisher, document_type) VALUES (${q(src.id)}, ${q(src.title)}, ${q(src.url)}, ${q(src.publishedAt)}, ${q(src.publisher)}, ${q(src.documentType)});`
    );
  }
  lines.push("");

  lines.push("-- Nominees");
  const GAZETTE_DATE = "2024-07-19";
  const HEARING_DATE = "2024-08-04";

  const nomineeIds: Record<string, string> = {};

  for (const nom of COHORT) {
    const id = randomUUID();
    nomineeIds[nom.fullName] = id;
    const sl = slug(nom.fullName);
    const summary =
      nom.status === "rejected"
        ? `Nominated by H.E. the President, July 2024. Vetted before the Committee on Appointments, August 1–4 2024. Rejected by the National Assembly on 7 August 2024.`
        : `Nominated by H.E. the President, July 2024. Vetted before the Committee on Appointments, August 1–4 2024. Approved by the National Assembly on 7 August 2024.`;
    lines.push(
      `INSERT OR IGNORE INTO nominees (id, full_name, position, appointment_type, gazette_date, hearing_date, status, summary, slug) VALUES (${q(id)}, ${q(nom.fullName)}, ${q(nom.position)}, 'Cabinet Secretary', ${q(GAZETTE_DATE)}, ${q(HEARING_DATE)}, ${q(nom.status)}, ${q(summary)}, ${q(sl)});`
    );
  }
  lines.push("");

  lines.push("-- Mock Integrity Flags (SYNTHETIC — illustrative only)");
  for (const nom of COHORT) {
    if (!nom.mockFlag) continue;
    const nomineeId = nomineeIds[nom.fullName];
    const flagId = randomUUID();
    lines.push(
      `INSERT OR IGNORE INTO integrity_flags (id, nominee_id, summary, severity) VALUES (${q(flagId)}, ${q(nomineeId)}, ${q(nom.mockFlag.summary)}, ${q(nom.mockFlag.severity)});`
    );
    // Every flag must reference at least one source document (schema constraint)
    lines.push(
      `INSERT OR IGNORE INTO integrity_flag_sources (flag_id, source_id) VALUES (${q(flagId)}, ${q(COMMITTEE_REPORT_ID)});`
    );
  }
  lines.push("");

  return lines.join("\n");
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function seed() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      env: { type: "string", default: "local" },
      "dry-run": { type: "boolean", default: false },
    },
  });

  const isDryRun = values["dry-run"];
  const isRemote = values.env === "remote";

  const sql = buildSQL();

  mkdirSync("scripts/data", { recursive: true });
  const outFile = "scripts/data/seed-2024-cohort.sql";
  writeFileSync(outFile, sql, "utf-8");
  console.log(`\n✓ SQL written to ${outFile}`);
  console.log(`  Nominees: ${COHORT.length} (${COHORT.filter((n) => n.status === "approved").length} approved, ${COHORT.filter((n) => n.status === "rejected").length} rejected)`);

  if (isDryRun) {
    console.log("\n── DRY RUN — SQL Preview ──");
    console.log(sql.slice(0, 3000) + "\n...[truncated; see file]");
    console.log(
      `\nRun without --dry-run to execute against ${isRemote ? "PRODUCTION" : "local"} D1.`
    );
    return;
  }

  const remoteFlag = isRemote ? "--remote" : "";
  const cmd = `wrangler d1 execute vetting-loop-db ${remoteFlag} --file ${outFile}`;
  console.log(`\nExecuting: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
  console.log("\n✓ 2024 cohort seed complete.");
  console.log("  Example dossier URL: http://localhost:3000/nominees/john-mbadi-ngongo");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

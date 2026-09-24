-- ============================================================================
-- The Vetting Loop — Initial Migration
-- Target: Cloudflare D1 (SQLite dialect)
-- Run: wrangler d1 execute vetting-loop-db --file packages/db/migrations/0001_initial.sql
-- ============================================================================

-- ── Source Documents ──────────────────────────────────────────────────────────
-- The canonical truth anchor. Every integrity flag MUST link to at least one
-- source_document. SourceDocuments cannot be deleted if referenced (RESTRICT).

CREATE TABLE IF NOT EXISTS source_documents (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  url               TEXT NOT NULL,
  published_at      TEXT NOT NULL,  -- ISO 8601 date
  publisher         TEXT NOT NULL,
  document_type     TEXT NOT NULL CHECK (document_type IN (
                      'gazette', 'eacc_report', 'court_record',
                      'hansard', 'committee_report', 'media', 'other'
                    )),
  created_at        TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- ── Nominees ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS nominees (
  id                TEXT PRIMARY KEY,
  full_name         TEXT NOT NULL,
  position          TEXT NOT NULL,
  appointment_type  TEXT NOT NULL,  -- e.g. 'Cabinet Secretary', 'Principal Secretary'
  gazette_date      TEXT NOT NULL,  -- ISO 8601
  hearing_date      TEXT,           -- ISO 8601; null until scheduled
  status            TEXT NOT NULL DEFAULT 'gazetted' CHECK (status IN (
                      'gazetted', 'hearing_scheduled', 'hearing_complete',
                      'approved', 'rejected'
                    )),
  summary           TEXT,           -- brief factual bio; no opinions
  slug              TEXT NOT NULL UNIQUE,  -- URL-safe: jane-doe-cs-health-2026
  created_at        TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at        TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_nominees_slug   ON nominees (slug);
CREATE INDEX IF NOT EXISTS idx_nominees_status ON nominees (status);

-- ── Integrity Flags ───────────────────────────────────────────────────────────
-- Application layer MUST insert at least one record into integrity_flag_sources
-- for every flag. The API rejects inserts without sourceIds (422 INTEGRITY_CONSTRAINT).

CREATE TABLE IF NOT EXISTS integrity_flags (
  id          TEXT PRIMARY KEY,
  nominee_id  TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  summary     TEXT NOT NULL,  -- factual description; no bare allegations
  severity    TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  created_at  TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_integrity_flags_nominee ON integrity_flags (nominee_id);

-- Many-to-many: flag → source_documents (RESTRICT: cannot delete source if in use)
CREATE TABLE IF NOT EXISTS integrity_flag_sources (
  flag_id    TEXT NOT NULL REFERENCES integrity_flags (id) ON DELETE CASCADE,
  source_id  TEXT NOT NULL REFERENCES source_documents (id) ON DELETE RESTRICT,
  PRIMARY KEY (flag_id, source_id)
);

-- ── Career Entries ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS career_entries (
  id            TEXT PRIMARY KEY,
  nominee_id    TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  role          TEXT NOT NULL,
  organisation  TEXT NOT NULL,
  start_year    INTEGER NOT NULL,
  end_year      INTEGER,  -- null = current
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_career_nominee ON career_entries (nominee_id);

-- ── Citizen Questions ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id               TEXT PRIMARY KEY,
  nominee_id       TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  body             TEXT NOT NULL,
  context          TEXT,           -- optional supporting context (must cite source if specific)
  upvotes          INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                     'pending', 'asked', 'ignored', 'partially_asked'
                   )),
  asked_at         TEXT,           -- ISO 8601; set when committee raises it
  asked_by         TEXT,           -- MP name
  submitted_at     TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  submitter_label  TEXT            -- null = anonymous; CSO name if disclosed
);

CREATE INDEX IF NOT EXISTS idx_questions_nominee  ON questions (nominee_id);
CREATE INDEX IF NOT EXISTS idx_questions_upvotes  ON questions (nominee_id, upvotes DESC);

-- ── Members of Parliament ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mps (
  id              TEXT PRIMARY KEY,
  mzalendo_id     TEXT UNIQUE,  -- Mzalendo person ID for deep linking
  full_name       TEXT NOT NULL,
  constituency    TEXT NOT NULL,
  party           TEXT NOT NULL,
  chamber         TEXT NOT NULL CHECK (chamber IN ('national_assembly', 'senate')),
  scorecard_url   TEXT,         -- link to Mzalendo scorecard
  created_at      TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at      TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

-- ── Hearing Records ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS hearing_records (
  id                         TEXT PRIMARY KEY,
  nominee_id                 TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  date                       TEXT NOT NULL,           -- ISO 8601
  committee_id               TEXT NOT NULL,
  committee_name             TEXT NOT NULL,
  transcript_source_id       TEXT NOT NULL REFERENCES source_documents (id),
  citizen_questions_asked    INTEGER NOT NULL DEFAULT 0,
  citizen_questions_ignored  INTEGER NOT NULL DEFAULT 0,
  created_at                 TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_hearing_nominee ON hearing_records (nominee_id);

-- Hearing exchanges: individual question/answer pairs from the transcript

CREATE TABLE IF NOT EXISTS hearing_exchanges (
  id                          TEXT PRIMARY KEY,
  hearing_id                  TEXT NOT NULL REFERENCES hearing_records (id) ON DELETE CASCADE,
  question_id                 TEXT REFERENCES questions (id),   -- links to citizen queue if matched
  topic                       TEXT NOT NULL CHECK (topic IN (
                                'integrity', 'competence', 'financial_disclosure',
                                'track_record', 'policy_position', 'procedural', 'other'
                              )),
  asked_by                    TEXT NOT NULL,  -- MP name
  question_text               TEXT NOT NULL,
  response_text               TEXT,
  timestamp                   TEXT,           -- hearing timestamp (HH:MM:SS)
  addresses_citizen_question  INTEGER NOT NULL DEFAULT 0 CHECK (addresses_citizen_question IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_exchanges_hearing ON hearing_exchanges (hearing_id);

-- ── MP Votes ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mp_votes (
  id           TEXT PRIMARY KEY,
  nominee_id   TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  mp_id        TEXT NOT NULL REFERENCES mps (id),
  source_id    TEXT NOT NULL REFERENCES source_documents (id),  -- Hansard / Mzalendo record
  choice       TEXT NOT NULL CHECK (choice IN ('aye', 'nay', 'abstain', 'absent')),
  recorded_at  TEXT NOT NULL  -- ISO 8601
);

CREATE INDEX IF NOT EXISTS idx_mp_votes_nominee ON mp_votes (nominee_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mp_votes_unique ON mp_votes (nominee_id, mp_id);

-- ── Committee Reports ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS committee_reports (
  id                    TEXT PRIMARY KEY,
  nominee_id            TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  published_at          TEXT NOT NULL,
  source_id             TEXT NOT NULL REFERENCES source_documents (id),
  recommendation        TEXT NOT NULL CHECK (recommendation IN ('approve', 'reject', 'defer')),
  submissions_reflected INTEGER NOT NULL DEFAULT 0 CHECK (submissions_reflected IN (0, 1)),
  created_at            TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX IF NOT EXISTS idx_committee_reports_nominee ON committee_reports (nominee_id);

-- Citizen submissions cross-referenced against committee report

CREATE TABLE IF NOT EXISTS citizen_submissions (
  id               TEXT PRIMARY KEY,
  nominee_id       TEXT NOT NULL REFERENCES nominees (id) ON DELETE CASCADE,
  report_id        TEXT REFERENCES committee_reports (id),
  submitter_label  TEXT,
  summary          TEXT NOT NULL,
  submitted_at     TEXT NOT NULL,
  outcome          TEXT NOT NULL DEFAULT 'absent' CHECK (outcome IN ('reflected', 'addressed', 'absent')),
  report_reference TEXT  -- paragraph/section reference if reflected
);

CREATE INDEX IF NOT EXISTS idx_citizen_submissions_nominee ON citizen_submissions (nominee_id);

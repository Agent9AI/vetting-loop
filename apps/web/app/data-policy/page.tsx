import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Policy | The Vetting Loop",
  description:
    "What data The Vetting Loop collects, what it doesn't, how public record data is sourced, and your right to correction.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-neutral-100 mb-4">{children}</h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3 text-neutral-400 text-sm leading-relaxed">
      {children}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DataPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
      {/* Header */}
      <div>
        <SectionLabel>Data Policy</SectionLabel>
        <h1 className="text-3xl font-bold text-neutral-100 mb-4">
          Plain-language data policy
        </h1>
        <p className="text-neutral-500 font-mono text-xs">
          Last updated: September 2026
        </p>
      </div>

      {/* What we collect */}
      <section>
        <SectionLabel>What we collect</SectionLabel>
        <Heading>Data we do collect</Heading>
        <Body>
          <p>
            <span className="font-semibold text-neutral-300">
              Authentication data (registered users only):
            </span>{" "}
            If you sign in, we use{" "}
            <a
              href="https://clerk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Clerk
            </a>{" "}
            to manage your account. Clerk stores your email address and any
            OAuth tokens you authorise (e.g. Google sign-in). We never see your
            password. You can delete your account at any time from your profile
            settings.
          </p>
          <p>
            <span className="font-semibold text-neutral-300">
              Upvote counts:
            </span>{" "}
            When you upvote a citizen question, we record a single integer
            increment against that question&apos;s ID. We do not store which
            user cast which vote — votes are anonymised at the point of
            recording.
          </p>
          <p>
            <span className="font-semibold text-neutral-300">
              Question submissions:
            </span>{" "}
            If you submit a citizen question, we store the question text and
            associate it with your Clerk user ID so you can edit or delete it
            later. Question text is always public once submitted.
          </p>
        </Body>
      </section>

      {/* What we don't collect */}
      <section>
        <SectionLabel>What we don&apos;t collect</SectionLabel>
        <Heading>Data we deliberately do not collect</Heading>
        <Body>
          <p>
            We do not collect your location, IP address (beyond what Cloudflare
            logs at the edge for security — see Cloudflare&apos;s own privacy
            policy), device fingerprints, browser history, or any form of
            cross-site tracking identifier.
          </p>
          <p>
            We do not serve advertising and have no advertising tracking pixels,
            third-party analytics cookies, or behavioural profiling scripts in
            the current MVP.
          </p>
          <p>
            We do not sell, rent, or share your personal data with any third
            party for commercial purposes.
          </p>
        </Body>
      </section>

      {/* Public record data */}
      <section>
        <SectionLabel>Public record</SectionLabel>
        <Heading>Nominee and vetting data</Heading>
        <Body>
          <p>
            All structured data about nominees — their dossiers, declared
            assets, integrity flags, hearing exchange records, and MP vote
            trails — is sourced exclusively from official public documents:
            Kenya Gazette notices, National Assembly and Senate Hansard
            transcripts, EACC findings, court judgments, and other statutory
            publications.
          </p>
          <p>
            This data is public record and is treated as such. It does not
            constitute private personal data under Kenyan data protection law
            when sourced from official government publications. We publish it in
            the public interest.
          </p>
          <p>
            <span className="font-semibold text-neutral-300">
              Integrity flags
            </span>{" "}
            require a citable, publicly accessible source document. We do not
            publish defamatory content, bare allegations, anonymous tips, or
            information from private or leaked documents. Every flag links
            directly to its source.
          </p>
        </Body>
      </section>

      {/* Right to correction */}
      <section>
        <SectionLabel>Corrections</SectionLabel>
        <Heading>Your right to correction</Heading>
        <Body>
          <p>
            If you believe any structured data about a nominee, vote record, or
            integrity flag is incorrect or outdated, you have the right to
            request a correction.
          </p>
          <p>
            To request a correction, email{" "}
            <a
              href="mailto:corrections@vettingloop.ke"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              corrections@vettingloop.ke
            </a>{" "}
            with: (1) the specific data you believe is wrong, (2) the correct
            information, and (3) a link to an official public source document
            that supports the correction. We will review and respond within 48
            hours.
          </p>
          <p>
            If a correction relates to your personal authentication data, log in
            and use the profile settings to update or delete your account.
          </p>
        </Body>
      </section>

      {/* Data retention */}
      <section>
        <SectionLabel>Retention</SectionLabel>
        <Heading>How long we keep data</Heading>
        <Body>
          <p>
            <span className="font-semibold text-neutral-300">
              Authentication data:
            </span>{" "}
            Follows{" "}
            <a
              href="https://clerk.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Clerk&apos;s data retention policy
            </a>
            . When you delete your account in Clerk, your email and OAuth tokens
            are removed from Clerk&apos;s systems. Your question submissions and
            upvotes are anonymised (user ID reference removed) but the content
            remains as a public record.
          </p>
          <p>
            <span className="font-semibold text-neutral-300">
              Public record data:
            </span>{" "}
            Nominee dossiers, hearing transcripts, vote records, and integrity
            flags are permanent public record and are retained indefinitely. We
            may archive data for nominees who were vetted in past sessions, but
            we do not delete it.
          </p>
        </Body>
      </section>

      {/* Analytics placeholder */}
      <section>
        <SectionLabel>Analytics</SectionLabel>
        <Heading>Third-party analytics</Heading>
        <Body>
          <p>
            The current MVP does not use any third-party analytics service
            (Google Analytics, Plausible, Mixpanel, etc.). If we add analytics
            in a future version, we will update this policy and provide opt-out
            controls before deploying it.
          </p>
          <p>
            Cloudflare&apos;s edge network logs basic request metadata (path,
            status, timestamp) for security and availability purposes. These
            logs are not used for user profiling.
          </p>
        </Body>
      </section>

      {/* Contact */}
      <section>
        <SectionLabel>Questions</SectionLabel>
        <Heading>Questions about this policy</Heading>
        <Body>
          <p>
            If you have any questions about this data policy, email{" "}
            <a
              href="mailto:corrections@vettingloop.ke"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              corrections@vettingloop.ke
            </a>
            . We will respond within 5 business days.
          </p>
        </Body>
      </section>

      {/* Back link */}
      <div>
        <Link
          href="/"
          className="font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

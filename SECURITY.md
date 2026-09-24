# Security Policy — The Vetting Loop

## Scope

The Vetting Loop publishes structured accountability data on public nominees for parliamentary vetting in Kenya. We take data integrity and the safety of our users seriously.

---

## Reporting a Vulnerability

**Contact:** security@vettingloop.ke  
**PGP:** Available on request.

**Do not** open a public GitHub issue for security vulnerabilities. Email us directly.

### Response SLA

| Step | Target |
|------|--------|
| Acknowledgment | 48 hours |
| Triage and severity classification | 7 days |
| Resolution or workaround | 30 days for critical; 60 days for medium/low |
| Public disclosure | Coordinated with reporter after patch |

---

## In Scope

Reports in the following categories qualify for recognition:

- **API injection** — SQL injection, command injection in any endpoint
- **Authentication bypass** — accessing admin routes without valid Clerk + internal secret
- **Integrity constraint bypass** — inserting an integrity flag without a valid source document via any path
- **PII exposure** — accessing or leaking Clerk user data, submission author identities, or email addresses
- **Privilege escalation** — citizen-role user gaining admin capabilities
- **Stored XSS** — in any rendered nominee, flag, or question content
- **SSRF** — via document URL fields

---

## Out of Scope

The following are **not** eligible for recognition:

- Denial-of-service attacks (rate limits are a product decision, not a vulnerability)
- Social engineering of Agent9 team members
- Issues requiring physical access to infrastructure
- Vulnerabilities in third-party dependencies without a demonstrated exploit path
- Missing HTTP security headers on the current MVP (noted; will be addressed pre-production)
- Self-XSS (requires the attacker to inject content into their own browser only)

---

## Data Sensitivity Classification

| Data Type | Sensitivity | Access |
|-----------|-------------|--------|
| Nominee names, positions, hearing dates | Public record | Public |
| Integrity flags + source citations | Public record | Public |
| Career timeline entries | Public record | Public |
| MP vote records | Public record | Public |
| Citizen-submitted questions (body) | Low — submitted for public view | Public |
| Question submitter identity | Moderate — anonymous by default | Not exposed via API |
| Clerk user emails | High | Never exposed via public API |
| Admin session tokens | Critical | Workers secret; never logged |
| API internal secret | Critical | Workers secret; never logged |

---

## Recognition

Reporters of valid, in-scope vulnerabilities are credited in our Hall of Fame (hall-of-fame.vettingloop.ke) with their name or handle, at their discretion. We do not currently offer monetary bounties; this may change as the platform scales.

---

## Data Correction vs. Security Report

If you have found **incorrect data** (wrong vote, wrong source link, outdated career entry), that is a data correction, not a security issue. Open a GitHub issue using the **Data Correction** template, or email corrections@vettingloop.ke.

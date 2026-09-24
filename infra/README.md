# Infrastructure Provisioning — The Vetting Loop

Follow these steps in order. All commands run from the repo root unless noted.

---

## Prerequisites

- Cloudflare account (free tier is sufficient for MVP)
- Wrangler CLI ≥ 3: `npm install -g wrangler`
- Node.js ≥ 20, pnpm ≥ 9
- Clerk account (free tier covers MVP)

---

## Step 1 · Create the D1 Database

```bash
wrangler d1 create vetting-loop-db
```

Copy the output `database_id` value. Open `apps/api/wrangler.toml` and replace:

```toml
database_id = "YOUR_D1_DATABASE_ID"
```

with the actual ID.

---

## Step 2 · Run the Initial Migration

```bash
wrangler d1 execute vetting-loop-db \
  --file packages/db/migrations/0001_initial.sql
```

Verify with:

```bash
wrangler d1 execute vetting-loop-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

Expected output: 12 tables listed.

---

## Step 3 · Create the Vectorize Index

```bash
wrangler vectorize create vetting-loop-docs \
  --dimensions=768 \
  --metric=cosine
```

The index name `vetting-loop-docs` is already set in `wrangler.toml`. No change needed unless you rename it (also update `VECTORIZE_INDEX` in `.env`).

---

## Step 4 · Configure Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → Create Application → "The Vetting Loop"
2. Enable social providers: **Google** (required), GitHub (optional)
3. Under **Roles**, create:
   - `citizen` (default for all users)
   - `admin` (assign manually to team members)
4. Copy:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`
   - **Secret Key** → set as Wrangler secret (Step 5)

---

## Step 5 · Set Wrangler Secrets

```bash
# Clerk secret key
wrangler secret put CLERK_SECRET_KEY

# Internal API secret (generate a random 32-char string)
openssl rand -hex 16 | wrangler secret put API_INTERNAL_SECRET

# Mzalendo API key (request from mzalendo.com)
wrangler secret put MZALENDO_API_KEY
```

Each command prompts for the value interactively — not stored in shell history.

---

## Step 6 · Create the Cloudflare Pages Project

```bash
wrangler pages project create vetting-loop \
  --production-branch main
```

---

## Step 7 · Set GitHub Actions Secrets

In your GitHub repo → Settings → Secrets and variables → Actions, add:

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers + Pages + D1 edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `NEXT_PUBLIC_API_URL` | `https://vetting-loop-api.YOUR_SUBDOMAIN.workers.dev` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From Clerk dashboard |

---

## Step 8 · Seed the Demo Episode

1. Copy and edit the seed script constants (nominee name, sources):

```bash
# Edit scripts/seed-episode.ts — replace placeholder URLs and nominee details
```

2. Dry run to preview SQL:

```bash
pnpm tsx scripts/seed-episode.ts --dry-run
```

3. Execute against local D1:

```bash
pnpm tsx scripts/seed-episode.ts
```

4. For remote (production):

```bash
pnpm tsx scripts/seed-episode.ts --env remote
```

---

## Step 9 · Custom Domain (vettingloop.ke)

1. In Cloudflare Pages → your project → Custom domains → Add domain
2. Add `vettingloop.ke` and `www.vettingloop.ke`
3. For the API worker: Workers & Pages → `vetting-loop-api` → Triggers → Add Custom Domain → `api.vettingloop.ke`
4. Update `NEXT_PUBLIC_API_URL` in GitHub Actions secrets to `https://api.vettingloop.ke`

---

## Step 10 · Verify

```bash
curl https://api.vettingloop.ke/health
# Expected: {"ok":true,"ts":"..."}

curl https://api.vettingloop.ke/nominees
# Expected: {"success":true,"data":[...]} with seeded nominee
```

---

## Local Development

```bash
cp .env.example .env
# Fill in values

pnpm install
pnpm dev   # web on :3000, api on :8787
```

D1 local dev uses Wrangler's bundled SQLite. Run migrations locally first:

```bash
wrangler d1 execute vetting-loop-db --local \
  --file packages/db/migrations/0001_initial.sql
```

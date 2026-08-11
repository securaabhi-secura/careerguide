# CareerGuide

AI-Powered Career Guidance for Students — a responsive web app (works on desktop and mobile browsers), deployable as a single Vercel project.

Career and quiz recommendations use a transparent, rule-based matching engine (no external AI API, no per-request cost, fully deterministic) — see `server/src/data/careers.js`.

## Project structure

```
careerguide/
  api/index.js   Vercel serverless function entry point (wraps the Express app)
  server/        Express app + Postgres data layer (auth, careers, quiz, saved careers, chat, colleges, profile)
  client/        React + Vite + Tailwind frontend
  vercel.json    Vercel build/routing config
```

The database is Postgres (works with Vercel's built-in Postgres storage, which is Neon under the hood, or any standard Postgres connection string) via the `pg` driver — no native binaries, so it's serverless-friendly.

## Deploy to Vercel

### 1. Push the project to a GitHub repo

Vercel deploys from a Git repo. Create a new repo, push this folder's contents to it (the top level should contain `api/`, `client/`, `server/`, `vercel.json`, `package.json`).

### 2. Import the repo in Vercel

Go to vercel.com → **Add New → Project** → import your repo. Vercel will detect `vercel.json` and use its `buildCommand` (`cd client && npm install && npm run build`) and `outputDirectory` (`client/dist`) automatically. Don't change the framework preset — leave it as "Other".

### 3. Add a Postgres database

In your new project → **Storage** tab → **Create Database** → **Postgres**. Once created, click **Connect** to your project — this automatically sets the `POSTGRES_URL` environment variable (and a few related ones) for you. No manual copy-pasting needed.

### 4. Add the auth secrets

Project → **Settings → Environment Variables**, add:
- `JWT_ACCESS_SECRET` — a long random string (generate with `openssl rand -hex 32`)
- `JWT_REFRESH_SECRET` — a different long random string
- `CLIENT_ORIGIN` — your production URL once you know it, e.g. `https://your-app.vercel.app` (optional here since frontend and backend share one origin on Vercel, but harmless to set)

Apply these to Production (and Preview if you want preview deployments to work too).

### 5. Deploy

Trigger a deploy (push to your repo, or click **Deploy** in the dashboard). Vercel builds the client, and every request to `/api/*` is routed to `api/index.js`, which runs the whole Express app as a serverless function. The database tables are created automatically the first time any `/api` route runs — no manual migration step.

### 6. Test it

Visit your `*.vercel.app` URL, sign up, take the quiz, save a career, chat with the counselor — all of it now runs on Vercel's infrastructure with a real Postgres database.

## Local development

You don't need Postgres installed locally — point `POSTGRES_URL` at any reachable Postgres instance:
- **Easiest**: after connecting Vercel Postgres in step 3 above, run `vercel env pull server/.env` from the project root (requires the Vercel CLI: `npm i -g vercel`, then `vercel link`) to pull the real connection string down.
- **Or**: create a free database at neon.tech or supabase.com and use its connection string.
- **Or**: install Postgres locally and use `postgres://user:password@localhost:5432/careerguide`.

Then:

```bash
# Backend
cd server
npm install
cp .env.example .env   # fill in POSTGRES_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm run dev             # http://localhost:4000

# Frontend (second terminal)
cd client
npm install
npm run dev              # http://localhost:5173, proxies /api to localhost:4000
```

## Security measures already in place

- **Passwords**: hashed with bcrypt (cost 12), never stored or logged in plain text.
- **Sessions**: short-lived JWT access tokens (15 min) + rotating refresh tokens (7 days), both stored in `httpOnly`, `SameSite=Lax` cookies — not accessible to JavaScript, which mitigates XSS token theft. Refresh tokens are stored server-side as SHA-256 hashes in Postgres and rotated (old one deleted, new one issued) on every refresh.
- **CSRF mitigation**: cookie-based auth plus a required `X-Requested-With` header on all state-changing requests, which a plain cross-site form/script can't set.
- **Rate limiting**: strict limits on `/api/auth/*` (20 requests / 15 min) and `/api/chat` (30/min), plus a global API limiter. Note: on Vercel this is per warm serverless instance, not globally shared — a reasonable speed bump, but pair it with Vercel's Firewall rate limiting or an external store (e.g. Upstash Redis) if you need a hard guarantee under real traffic.
- **Input validation**: every request body is validated with `zod` schemas before touching the database; malformed input is rejected with a 400, not passed through.
- **SQL injection protection**: all queries use parameterized `$1, $2, …` placeholders via `pg` — no string-concatenated SQL anywhere.
- **Password change** invalidates all existing sessions (refresh tokens) for that user.
- **Generic auth errors**: login failures return "Invalid email or password" regardless of which part was wrong, so the API doesn't leak which emails are registered.
- **Security headers**: `helmet` is enabled for standard hardening (HSTS, no-sniff, etc.).
- **Error handling**: a centralized error handler ensures stack traces / internals are never sent to the client.
- **TLS**: cookies are marked `secure` automatically when `NODE_ENV=production` (Vercel sets this), so they're only ever sent over HTTPS.

### Before opening this up publicly, also consider

1. Email verification and a "forgot password" flow (not included yet).
2. Moving rate limiting to a shared store (Upstash Redis is a common Vercel-friendly choice) if traffic grows.
3. Regular Postgres backups — Vercel/Neon handles this for you on paid tiers; check your plan's retention.

## Stability notes

- The frontend automatically retries a request once after silently refreshing the session if a 401 is returned (`client/src/lib/api.js`), so short access-token expiry doesn't interrupt the user.
- The layout is mobile-first (max-width phone frame, bottom nav) and progressively widens into a sidebar + wider content column on desktop (`md:` breakpoints in `AppLayout.jsx`), rather than being two separate codebases.
- `prefers-reduced-motion` is respected globally; all interactive elements have visible keyboard focus rings for accessibility.
- Database schema creation is idempotent and runs automatically on first request per warm instance — no separate migration step to forget.

## A note on the monorepo setup

`package.json` at the repo root and `server/package.json` currently list overlapping dependencies. This is intentional and simple: the root one is what Vercel installs for the `api/` serverless function, and `server/package.json` is what you install for local `npm run dev`. If this grows, converting to npm workspaces would remove the duplication — happy to do that if it becomes annoying to maintain.

## Extending this

The 16-screen design included a few screens not yet wired up 1:1 (e.g. a dedicated multi-step review/confirmation screen and a celebratory "quiz complete" screen with confetti) — the quiz flow currently goes straight from the last question to results. The architecture (shared `QuizPage`/`QuizResultsPage`, rule-based `scoreCareers()` in `server/src/data/careers.js`) makes it straightforward to add those as additional steps if you want to match the mockups more closely — let me know and I can build them out.


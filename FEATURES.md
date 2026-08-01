# Features

Roadmap of notable engineering work in this portfolio. Updated as features
ship; planned items are clearly marked.

## Implemented

### Lighthouse CI (perf / a11y / SEO budgets on every PR)
- `@lhci/cli` runs in CI on every PR. Three runs per URL (median), desktop
  preset, `next start` against the production build.
- Hard-fail on budget violations — the workflow exits non-zero.
- Budgets per page (median of 3 runs):
  - `/en` — perf ≥ 0.90, a11y / BP / SEO ≥ 0.95, LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms
  - `/en/work` — perf ≥ 0.85, LCP ≤ 3.0s, TBT ≤ 300ms (lower because of `swiper` + filter UI)
  - `/en/work/portfolio-website` — perf ≥ 0.85, LCP ≤ 3.0s, TBT ≤ 300ms (MDX + image content)
  - `/en/contact` — perf ≥ 0.90, LCP ≤ 2.5s, TBT ≤ 200ms
- Reports upload to `temporary-public-storage` (LHCI's free, no-account tier).
  Install the [LHCI GitHub App](https://github.com/apps/lighthouse-ci) to enable
  PR comment summaries.
- Tunes after first run: if any budget is wrong, investigate the cause first
  (often an image or a hydrate-heavy component), and only lower the budget
  with a `FEATURES.md` note explaining why.
- **Local vs CI.** Running `pnpm lighthouse` against `pnpm start` locally
  produces lower scores than CI, especially on `/en/work` (Best Practices).
  The differences are environment-specific and do not exist on Vercel:
  1. `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`
     are served by Vercel's edge runtime in production, but return 404 from
     `next start`. Lighthouse flags both as console errors.
  2. Chrome's DevTools Issues panel flags a CSP report-only violation only
     on `/en/work` (Swiper's runtime CSS injection combined with the
     report-only `default-src 'self'` policy). The panel is empty on
     every other page.
  CI is the source of truth for budget enforcement. Treat local runs as a
  smoke test, not a gate.

### Distributed rate limiter (Upstash Redis)
- Contact form rate limiter now uses `@upstash/ratelimit` with sliding-window
  algorithm when `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are set
  (production). Limits hold across all Vercel function instances.
- Falls back to an in-memory limiter when env vars are absent (dev / CI only).
  The cooldown check (`CONTACT_MIN_REQUEST_INTERVAL_MS`) lives only in the
  fallback — Upstash's sliding window already spaces requests in production.
- Fails open on Redis errors. Logging includes the error so observability is
  preserved without blocking legitimate users.
- Key composition matches the previous in-memory scheme: `${ip}:${email}:${userAgent}`,
  preserving the per-browser / per-email semantics.

### Content Security Policy (Report-Only)
- CSP ships in `Content-Security-Policy-Report-Only` mode by default. Browsers
  log violations but do not block anything, so the site stays functional while
  reports are collected.
- Set `CSP_ENFORCE=1` in production env to switch to `Content-Security-Policy`
  (enforced). Because Next.js evaluates `next.config.ts` at build time, the
  flip requires a rebuild: set `CSP_ENFORCE=1` in Vercel env, then trigger a
  redeploy (or push to main). The header is then enforced on the next deploy.
- Set `CSP_REPORT_URI` to receive violation reports as `application/csp-report`
  POSTs. Point it at any endpoint that accepts JSON (e.g. a Vercel route or an
  external report-collector service). Leave unset to skip `report-uri`.
- After a week of low-violation reports, promote to enforced mode.
- Current policy permits `'unsafe-inline'` for `script-src` and `style-src`
  because Next.js hydration scripts and inline `style={{...}}` are in use.
  Tightening to nonces/SRI hashes is a follow-up.

### Other hardened headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  (production only)
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

## Planned

- **CSP tightening.** Replace `'unsafe-inline'` with nonces for `script-src`
  and `style-src`. Requires emitting a per-request nonce from `next.config.ts`
  and updating components that hand-roll inline scripts.
- **Local generation of `defaultOgImage`** with `@vercel/og` at build time.

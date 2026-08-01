# Portfolio — Anh Nguyen Dev

Personal portfolio website for **Nguyen Hoang Anh** (Full-Stack Web Developer & Educator), built with Next.js App Router.

Live site: [https://anhnguyendev.me](https://anhnguyendev.me)

## Highlights

- Bilingual experience: English (`/en`) and Vietnamese (`/vi`)
- MDX blog with syntax highlighting, table of contents, and recommendations
- SEO-focused setup: metadata, Open Graph/Twitter, JSON-LD, sitemap, robots, RSS
- Contact flow using Server Actions + Resend + Zod validation
- Responsive UI with dark/light theme and animated page transitions

## Why this codebase is worth reading

This is a small Next.js app, but it ships with patterns usually only seen in
production systems:

- **i18n at the route level** — every page is locale-prefixed, dictionaries
  are typed, `alternates.languages` is generated per page, and the home page
  is statically rendered for both `en` and `vi` via `generateStaticParams`.
- **MDX content pipeline** — blog posts are MDX files in `content/`, parsed
  with `remark-gfm` + `remark-frontmatter`, validated through a `safe_slug`
  check, and deduped per request with `react/cache`.
- **Server Actions with rate limiting, honeypot, and parallel email
  delivery** — see `app/actions/actions.ts`. The contact form is one action
  with no API route; Zod validates, then two Resend sends run in parallel,
  and logging is moved off the response path with `after()`.
- **Distributed rate limiting** *(planned)* — sliding-window limiter on
  Upstash Redis so the contact form stays correct when Vercel scales the
  function horizontally.
- **Performance budgets enforced in CI** *(planned)* — Lighthouse CI runs on
  every PR with thresholds of ≥95 perf, 100 accessibility / best-practices
  / SEO.
- **Content-visibility and dynamic imports** — heavy client components
  (Swiper, ResumeClient, ContactForm, Stats) are code-split; long lists use
  `content-visibility: auto`.
- **Structured SEO** — JSON-LD (Person, WebSite, BlogPosting,
  BreadcrumbList), per-route `sitemap.ts`, `robots.ts`, dynamic OG images
  via `next/og`, and a generated RSS feed.
- **Security headers in production** — CSP, HSTS, X-Content-Type-Options,
  X-Frame-Options, Referrer-Policy, and Permissions-Policy via
  `next.config.ts`.

It's not a toy. It runs on the free Vercel tier with strict enforced
budgets.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, Radix UI primitives, shadcn/ui pattern
- **Content:** MDX, gray-matter, Shiki
- **Email:** Resend, React Email
- **Validation:** Zod
- **Tooling:** ESLint 9 (flat config), Prettier, pnpm
- **Ops:** Docker, Vercel Analytics, Vercel Speed Insights

## Project Structure

- `app/` — routes, layouts, metadata, sitemap/robots/manifest, server actions
- `components/` — feature components (`home`, `blog`, `work`, `contact`, `layout`, `ui`)
- `content/` — localized MDX blog posts (`en`, `vi`)
- `dictionaries/` — i18n dictionaries
- `lib/` — utilities, i18n helpers, metadata, data fetching
- `constants/` — static app content

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment variables

Copy `env.example` to `.env.local` and fill values:

```bash
cp env.example .env.local
```

Required variables:

- `RESEND_API_KEY` — Resend API key
- `CONTACT_TO_EMAIL` — destination email for contact form notifications

Optional variables:

- `CONTACT_FROM_EMAIL` — sender address for outgoing emails
- `CONTACT_RATE_LIMIT` — max accepted contact requests per window (default `5`)
- `CONTACT_RATE_WINDOW_MS` — rate-limit window in milliseconds (default `60000`)
- `CONTACT_MIN_REQUEST_INTERVAL_MS` — minimum interval between requests from same sender fingerprint (default `10000`)
- `GITHUB_TOKEN` and `GITHUB_USERNAME` — GitHub stats on home page
- `DEPLOY_DATE` — custom date used by sitemap metadata

### 3) Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `pnpm dev` — start local dev server
- `pnpm build` — create production build
- `pnpm start` — run production server
- `pnpm lint` — run ESLint
- `pnpm test` — run unit/component tests (Vitest)
- `pnpm test:e2e` — run Playwright smoke test

## Quality Checks

```bash
pnpm lint
pnpm test
pnpm build
```

## Docker

Build and run with Docker:

```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env.local portfolio
```

## Features Roadmap

See [FEATURES.md](FEATURES.md) for implemented and planned features.

## License

This repository is for personal portfolio and showcase purposes.

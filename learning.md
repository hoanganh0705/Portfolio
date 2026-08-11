# Reverse-Engineered Project Map & Learning Plan

**Project:** Personal portfolio site (`anhnguyendev.me`)
**Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · MDX · Upstash Redis · Resend · Vercel Analytics · Vitest + Playwright + Lighthouse CI
**Repo size:** ~70 source files. No database, no API routes, no ORM, no auth flow — only one Server Action.

> **Important correction to your prompt template:** Your prompt assumes a NestJS/PostgreSQL/Redis/queues backend. This project is **not** that. It is a Next.js 16 single-process frontend with one Server Action (`sendEmail`) and an Upstash-backed rate limiter. Treating it like a NestJS app will mislead you. The map below reflects the **actual** codebase.

---

## Phase 1 — Repository Reconnaissance

### What I actually found

- **No backend service.** No controllers, no services, no repositories, no DTOs in the NestJS sense. The "backend" is Next.js server functions and one Server Action.
- **No database.** Content lives in MDX files on the filesystem (`content/en`, `content/vi`) — read at build/request time via `fs.readdir` + `gray-matter`.
- **One Server Action:** `app/actions/actions.ts` (`sendEmail`) — the only mutating endpoint.
- **One external API consumer:** GitHub GraphQL (`lib/fetchGithubCommits.ts`) for commit count.
- **One email provider:** Resend, with two React Email templates.
- **One Redis user:** Upstash, only for sliding-window rate limiting on the contact form (HTTP/REST, not Node TCP).
- **Routing:** Two layers — `proxy.ts` (Edge middleware) for locale detection, and the App Router `[locale]` segment for pages.
- **SEO surface:** `sitemap.ts`, `robots.ts`, `manifest.ts`, `feed.xml/route.ts`, per-page `opengraph-image.tsx`, JSON-LD via `<script>` tags.
- **Security:** CSP (Report-Only by default) + 6 other headers in `lib/security-headers.ts`, applied to every route via `next.config.ts`.
- **Performance surface:** Lighthouse CI on every PR with hard budgets; `dynamic()` for heavy client components; `content-visibility: auto` for off-fold sections; ISR via `export const revalidate`.
- **Tests:** Vitest (unit), Playwright (E2E smoke), Puppeteer-based endurance scripts.

### Entry Points (where the app actually starts)

| Concern | File |
|---|---|
| Root layout (passthrough) | `app/layout.tsx` |
| **Locale layout** (real root) | `app/[locale]/layout.tsx` |
| Edge middleware (locale redirect) | `proxy.ts` |
| Next config (CSP, redirects, MDX, bundle analyzer) | `next.config.ts` |
| **Server Action** | `app/actions/actions.ts` (`sendEmail`) |
| RSS feed route | `app/feed.xml/route.ts` |
| Sitemap / robots / manifest | `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` |
| Dynamic OG image (per blog post) | `app/[locale]/blog/[id]/opengraph-image.tsx` |

### Core Modules (where the important logic lives)

1. **`lib/getPosts.ts`** — filesystem-based "database" for blog posts. `React.cache()` for per-request dedup. This is the closest thing to a repository in your codebase.
2. **`app/actions/actions.ts`** — `sendEmail` Server Action: Zod validation, honeypot, IP-keyed rate limit, parallel Resend sends, `after()` for off-response logging.
3. **`lib/redis.ts`** — sliding-window rate limiter with dual backend (Upstash vs in-memory fallback). 185 lines, ~50 of those comments.
4. **`lib/i18n.ts` + `dictionaries/*.json` + `lib/dictionaries.ts` + `lib/locale-context.tsx`** — the full i18n pipeline.
5. **`proxy.ts`** — locale detection + redirect (runs at the edge before any route).
6. **`lib/security-headers.ts` + `next.config.ts`** — CSP and header policy.

### Supporting Modules

- `lib/site-config.ts` — single source of truth for SEO/brand (read by 10+ files).
- `lib/metadata.ts` + `lib/json-ld.ts` — SEO helpers.
- `lib/fetchGithubCommits.ts` — GitHub GraphQL integration.
- `lib/utils.ts` — `cn()` + `isBlogDetail()`.
- `mdx-components.tsx` — MDX element styling (h1/h2/code/etc).
- `next.config.ts` — wires MDX, bundle analyzer, headers, redirects.

### Infrastructure

- **Upstash Redis** (REST) — rate limiting only. Optional, falls back to in-memory.
- **Resend** — outbound email.
- **GitHub GraphQL API** — commit count (cached via Next.js `next: { revalidate: 86400 }`).
- **Vercel Analytics + Speed Insights** — telemetry (client components at root).
- **Docker** — multi-stage standalone build (used by `Dockerfile`).
- **No database.** No queue. No background worker.

### Generated / Boilerplate / Skip-for-now

- `app/globals.css` — Tailwind v4 directives and shadcn CSS variables. Read once.
- `components/ui/*.tsx` — 8 shadcn-style Radix wrappers (Button, Input, Select, Sheet, Tabs, Tooltip, etc.). **Generated-style code.** Read the API of each once; do not study internals.
- `tailwindcss`, `postcss`, `eslint`, `prettier`, `next-env.d.ts`, `next.config.ts` boilerplate — read only what is referenced.

---

## Phase 2 — Architecture Map

This is **not** NestJS. There are no layered backend tiers. The architecture is:

```text
Browser
  ↓
[Edge Middleware: proxy.ts]
  • locale detection (cookie → Accept-Language → default 'vi')
  • redirect /<path> → /<locale>/<path>
  ↓
[Next.js Server: app/[locale]/layout.tsx]
  • await params (Next 15+ style)
  • getDictionary(locale)        ← typed JSON, dynamically imported
  • inject JSON-LD <script>
  • wrap children in <LocaleProvider> + <ThemeProvider>
  ↓
[Page Component — async server component]
  • generateMetadata() runs first (parallel with data fetch)
  • await getAllPosts / getDictionary
  • <Suspense fallback={...}> wraps heavy sections
  ↓
[Client Islands — 'use client']
  • Header, ContactForm, WorkClient, BlogPostGridClient, etc.
  ↓
[Server Action: sendEmail] — called from ContactForm via useActionState
  • Zod parse → checkRateLimit → Promise.all(2x Resend) → after() log
  ↓
[External services]
  • Upstash Redis (REST) for sliding window
  • Resend HTTP API for transactional email
  • GitHub GraphQL (cached, daily)
```

### Dependency direction

- `app/` imports `lib/`, `components/`, `constants/`, `types/`, `dictionaries/`.
- `components/` imports `lib/`, `constants/`, `ui/`, `types/`.
- `lib/` is the bottom: only imports `types/`, `dictionaries/`, and external packages.
- **No circular dependencies.** Pure acyclic graph.

### Data flow on a page render (e.g., `/en/blog`)

```text
1. Request hits Vercel edge
2. proxy.ts checks pathname; if no locale prefix, redirect to /en/<path>
3. Next.js matches app/[locale]/layout.tsx
4. Layout runs generateStaticParams → statically generated for both 'en' and 'vi'
5. LocaleLayout awaits params, validates locale, loads dictionary, renders <LocaleProvider>
6. BlogPage generates metadata (createMetadata), renders <Suspense> boundaries
7. BlogFeaturedPosts and BlogPostGrid run in parallel (both await getAllPosts/getDictionary)
8. BlogPostGrid passes data to BlogPostGridClient (the 'use client' island)
9. Client island hydrates; useState/useMemo run client-side
```

### What's strong

- **Clean separation of `locale` and `dict`** via context — every consumer uses `useLocale()` instead of prop-drilling.
- **Server Components by default.** Most logic stays on the server; only interactive parts are `'use client'`.
- **`React.cache()` on `getAllPosts`** — Next dedupes within one request, so a page + its `generateMetadata` don't read the FS twice.
- **SAFE_SLUG regex** in `app/[locale]/blog/[id]/page.tsx` — blocks path traversal in MDX imports.
- **`output: 'standalone'`** in `next.config.ts` — minimal Docker image.

### What's confusing / inconsistent

- **Two near-identical page-transition components** (`StairTransition` and `PageTransition`) — they both do framer-motion fades and both check `isBlogDetail()`. Worth knowing they exist; one is probably redundant.
- **MDX content loaded via dynamic `import()` from a template string** (`loadMdx`). This is unusual; Next.js MDX usually does this for you via webpack. This custom path gives you safe-slug validation but bypasses normal module caching.
- **No ORM, but `constants/` files have data structures that look like DB rows** (`projects.tsx`, `stats.tsx`, `whyme.tsx`, `skills-icons.tsx`). It's a thin static-data layer, not a domain model.
- **`proxy.ts`** is the new Next.js 16 name for what was previously `middleware.ts`. The fact that it lives at the root and is called `proxy.ts` is a recent API change — easy to miss.

### What is unnecessarily complex (vibe-coded feel)

- `components/blog/TableOfContents.tsx` — `MutationObserver` + `IntersectionObserver` + `setTimeout` + `requestAnimationFrame` chained for a TOC. Probably over-engineered.
- `components/home/WhyMe.tsx` — heavy framer-motion parallax + scroll-coupled state with viewport-amount state tuned on resize. The `loadFeatures = () => import('framer-motion').then(m => m.domMax)` lazy import is a perf trick; worth understanding, but easy to break by editing.
- The framer-motion `LazyMotion + m.*` pattern appears 5+ times — once you understand it once, the rest is repetition.

---

## Phase 3 — Critical User Flows

### Flow 1 — User lands on `/en` (home)

```text
1. Browser requests https://anhnguyendev.me/
2. proxy.ts runs at edge
   • pathname "/" doesn't start with /en or /vi
   • getPreferredLocale(): cookie NEXT_LOCALE? no → Accept-Language → default 'vi'
   • 308 redirect to /vi/
3. Layout app/[locale]/layout.tsx matches
4. LocaleLayout awaits params, calls getDictionary('vi')
5. LocaleProvider injects { locale: 'vi', dict }
6. HomePage (app/[locale]/page.tsx) runs:
   • StatsSection wrapped in <Suspense>
   • BriefInfo + WhyMe below the fold (dynamic() imports)
   • generateStaticParams has both 'en' and 'vi' → statically pre-rendered
   • GitHub commit count fetched once at build (cached 86400s via Next fetch cache)
7. Client hydrates: Header (sticky on scroll), TypeWriter, animations
8. JSON-LD Person/WebSite/ProfessionalService injected into <head>
```

### Flow 2 — User opens a blog post `/en/blog/mastering-nextjs-app-router`

```text
1. proxy.ts: already prefixed → pass through
2. app/[locale]/layout.tsx loads
3. app/[locale]/blog/[id]/page.tsx:
   • generateStaticParams ran at build, generated this URL → statically served
   • loadMdx('en', 'mastering-nextjs-app-router')
       • SAFE_SLUG regex check
       • import(`@/content/en/mastering-nextjs-app-router.mdx`) → { default, metadata }
   • getRelatedPosts(id, category, 4, 'en')
   • JSON-LD Article + BreadcrumbList injected as <script>
4. PostDetailLayout ('use client') renders 3-column grid:
   • Left: TableOfContents (reads headings from DOM after mount)
   • Center: MDX content + AuthorAvatar + ShareButtons
   • Right: Recommendations (related posts)
5. Client islands hydrate; Swiper (not here), intersection observers start
```

### Flow 3 — User submits the contact form

This is the **only mutation** in the entire app. Trace it carefully.

```text
1. Browser POST: form submit on /en/contact
2. ContactForm ('use client') uses React 19's useActionState(sendEmail, initialState)
3. sendEmail (Server Action, 'use server') runs server-side:
   a. Honeypot: if formData.get('website') truthy → silently return success
   b. Extract raw fields from FormData
   c. ContactFormSchema (Zod) safeParse → if fail, return error
   d. headers() (Next 15+) → get x-forwarded-for + user-agent
   e. getClientKey() → `${ip}:${email}:${userAgent}`
   f. checkRateLimit(key, config) from lib/redis.ts:
       • If UPSTASH env vars set → @upstash/ratelimit slidingWindow
       • Else → in-memory Map with min-interval check
       • Fail-open on Upstash errors
   g. If blocked → return error "Too many requests"
   h. Promise.all([
        resend.emails.send(to: site owner, React Email template),
        resend.emails.send(to: user, AutoReplyEmail)
      ])
   i. after(() => console.info) — non-blocking log
4. Response: { status, message, timestamp }
5. ContactForm's useEffect on response.timestamp:
   • toast.success() or toast.error()
   • Reset form on success
6. Tests: tests/unit/contact-rate-limit.test.tsx exercises both backends via vi.mock
```

### Flow 4 — Search engines crawl the site

```text
1. Crawler requests /sitemap.xml
2. app/sitemap.ts:
   • locales.flatMap(static routes)
   • Promise.all([getAllPosts('en'), getAllPosts('vi')]) → blog entries
   • Returns MetadataRoute.Sitemap array
3. Crawler requests /robots.txt → app/robots.ts
4. Crawler requests /feed.xml → app/feed.xml/route.ts (manually built RSS XML)
5. Crawler requests a blog post URL → opengraph-image.tsx renders dynamic OG image via next/og
```

### Flow 5 — User switches language (e.g., `/en` → `/vi`)

```text
1. Click LanguageSwitcher button (Header)
2. Client component sets document.cookie NEXT_LOCALE=vi
3. pathname.replace('/en', '/vi') → router.push
4. Browser navigates → proxy.ts re-runs but pathname already prefixed → pass through
5. app/[locale]/layout.tsx reloads with locale='vi', getDictionary('vi')
6. LocaleProvider value updates → all useLocale() consumers re-render with new dict
```

---

## Phase 4 — File Reading Order

### LEVEL 0 — Orientation (must read in order)

| Pri | File | Why |
|---|---|---|
| MUST | `README.md` | Author's own description of patterns |
| MUST | `FEATURES.md` | Documents Lighthouse CI + Upstash + CSP strategy |
| MUST | `package.json` | Lists every library and script |
| MUST | `env.example` | All env vars and what they do |
| MUST | `next.config.ts` | Headers, redirects, MDX, output mode |
| MUST | `proxy.ts` | The edge entry — locale redirect |
| MUST | `app/layout.tsx` | Root (passthrough) |
| MUST | `app/[locale]/layout.tsx` | **Real root** — fonts, providers, JSON-LD |
| SHOULD | `tsconfig.json` | Path alias `@/*` |
| SHOULD | `components.json` | shadcn config (helps understand UI components) |
| SKIP (for now) | `Dockerfile`, `playwright.config.ts`, `vitest.config.ts`, `vitest.setup.ts` | Read later when you hit those areas |

**Why this order:** config → entry → root layout. Without these, you cannot understand where code lives.

### LEVEL 1 — Core Architecture (the 5 most important files)

| Pri | File | Why | Read next |
|---|---|---|---|
| MUST | `lib/site-config.ts` | Central config; 10+ files import from here | `lib/metadata.ts`, `lib/json-ld.ts` |
| MUST | `lib/i18n.ts` | Locale type, `isValidLocale` guard | `lib/dictionaries.ts`, `lib/locale-context.tsx` |
| MUST | `lib/dictionaries.ts` | Dynamic import of JSON dictionaries | `dictionaries/en.json` (skim structure only) |
| MUST | `lib/locale-context.tsx` | How `useLocale()` works | Every component that calls `useLocale()` |
| MUST | `mdx-components.tsx` | Defines what MDX elements render as | One MDX file in `content/en/` |

After LEVEL 1 you can navigate the whole site. Every page ultimately consumes these.

### LEVEL 2 — Core Business Logic

| Pri | File | Why |
|---|---|---|
| MUST | `app/actions/actions.ts` | The only mutation in the app |
| MUST | `lib/redis.ts` | Rate limiter with dual backend |
| MUST | `types/contact.ts` | `FeedbackState` shape used by the form |
| MUST | `lib/utils.ts` | `cn()` helper + `isBlogDetail()` predicate |
| SHOULD | `constants/projects.tsx`, `constants/stats.tsx`, `constants/info.tsx`, `constants/whyme.tsx`, `constants/skills-icons.tsx`, `constants/socials.tsx` | Static data sources |
| SHOULD | `lib/getPosts.ts` | The filesystem "database" |
| SHOULD | `lib/fetchGithubCommits.ts` | External API integration pattern |
| SHOULD | `lib/security-headers.ts` | CSP and header builder |

### LEVEL 3 — Page Tree (skim, do not memorize)

| Pri | File |
|---|---|
| SHOULD | `app/[locale]/page.tsx` (home) |
| SHOULD | `app/[locale]/blog/page.tsx` (blog index) |
| SHOULD | `app/[locale]/blog/[id]/page.tsx` (blog detail) |
| SHOULD | `app/[locale]/work/page.tsx` |
| SHOULD | `app/[locale]/work/[slug]/page.tsx` |
| SHOULD | `app/[locale]/resume/page.tsx` |
| SHOULD | `app/[locale]/contact/page.tsx` |
| SHOULD | `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/feed.xml/route.ts`, `app/apple-icon.tsx`, `app/icon.tsx` |
| LATER | Each page's `loading.tsx` and `error.tsx` (3-line patterns, very repetitive) |

### LEVEL 4 — Components (skim, then deep-dive as needed)

| Pri | File |
|---|---|
| MUST | `components/layout/Header.tsx` + `Nav.tsx` + `LanguageSwitcher.tsx` + `ThemeProvider.tsx` |
| MUST | `components/contact/ContactForm.tsx` + `ContactClient.tsx` |
| MUST | `components/contact/AutoReplyEmail.tsx` + `EmailTemplate.tsx` (Resend templates) |
| MUST | `components/blog/PostDetailLayout.tsx` (3-column article shell) |
| MUST | `components/blog/BlogPostGrid.tsx` + `BlogPostGridClient.tsx` |
| SHOULD | `components/blog/TableOfContents.tsx`, `Recommendations.tsx`, `BlogFeaturedPosts.tsx`, `CodeBlock.tsx`, `CodeBlockClient.tsx`, `Breadcrumb.tsx`, `ShareButtons.tsx`, `AuthorAvatar.tsx` |
| SHOULD | `components/home/*` (Stats, TypeWriter, BriefInfo, WhyMe, Social) |
| SHOULD | `components/resume/ResumeClient.tsx`, `components/work/WorkClient.tsx`, `components/work/WorkSliderBtns.tsx` |
| SKIP (for now) | `components/ui/*.tsx` — read API, not implementation. shadcn-generated. |

### LEVEL 5 — Infrastructure & Tests

| Pri | File |
|---|---|
| SHOULD | `.github/workflows/ci.yml` (CI pipeline: lint → test → build → LHCI) |
| SHOULD | `lighthouserc.json` (perf budgets) |
| SHOULD | `tests/unit/contact-rate-limit.test.tsx` (best test in the repo — exercises the rate limiter end-to-end) |
| LATER | `tests/e2e/smoke.spec.ts`, `tests/unit/button.test.tsx`, `tests/unit/input.test.tsx` |
| LATER | The MDX files themselves — only relevant when you add a post |

### Reading Priority Summary

- **MUST:** ~20 files — these you must understand to be dangerous.
- **SHOULD:** ~30 files — important for adding features.
- **LATER:** Everything else.

---

## Phase 5 — Concept Dependency Graph

Read this top to bottom. Each row depends on the one above it.

```text
JavaScript / TypeScript basics
    ↓
Next.js App Router fundamentals
    ↓
React Server Components vs Client Components
    ↓
Next.js metadata API (generateMetadata, Metadata type)
    ↓
Next.js dynamic params (params is now a Promise)
    ↓
i18n routing pattern (locale segment + proxy.ts + dictionaries)
    ↓
React Context for client-side locale dict
    ↓
Dynamic imports + React.lazy (next/dynamic)
    ↓
Server Actions ('use server')
    ↓
React 19 useActionState hook
    ↓
Zod schema validation
    ↓
Upstash Ratelimit sliding window
    ↓
Resend SDK + React Email components
    ↓
next/og for dynamic OG images
    ↓
MDX pipeline (@next/mdx + gray-matter + remark plugins)
    ↓
Content-visibility + ISR (revalidate) + React.cache
```

### Concept Detail

#### Next.js App Router
- **Why here:** Every file in `app/` uses it.
- **Where:** `app/[locale]/layout.tsx`, all `page.tsx` files.
- **Files to inspect:** `app/layout.tsx` (passthrough), then any `[locale]/page.tsx`.
- **Need to understand:** async server components, the difference between `layout.tsx` and `page.tsx`, how `generateStaticParams` works.

#### React Server Components vs Client Components
- **Why here:** Some files start with `'use client'`, most don't.
- **Where:** Look at `app/[locale]/page.tsx` (server) vs `components/contact/ContactForm.tsx` (client).
- **Need to understand:** Server components cannot use hooks or event handlers. Client components are bundled to the browser. Context providers MUST be client components.

#### Next.js dynamic params (Promise)
- **Why here:** Every `page.tsx` writes `params: Promise<{ locale: string }>` and `await params`.
- **Need to understand:** Next.js 15+ changed this. If you write `params.foo` directly it will break.

#### i18n routing pattern
- **Why here:** This is THE distinctive pattern of this codebase.
- **Where:** `proxy.ts` (edge), `lib/i18n.ts` (types), `lib/dictionaries.ts` (loaders), `lib/locale-context.tsx` (context).
- **Need to understand:** The edge middleware redirects users without a locale prefix. The dictionary is dynamically imported per locale. Client components read `useLocale()`.

#### Server Actions
- **Why here:** The only mutation in the app.
- **Where:** `app/actions/actions.ts`.
- **Need to understand:** `'use server'` directive. Actions are POST endpoints invoked by client `useActionState`. They receive `(prevState, formData)`.

#### `useActionState` (React 19)
- **Why here:** Used in `ContactForm.tsx`.
- **Need to understand:** Returns `[state, action, isPending]`. The form's `action={action}` triggers the Server Action.

#### Upstash sliding-window rate limiting
- **Why here:** The dual in-memory/Upstash pattern in `lib/redis.ts` is non-trivial.
- **Files to inspect:** `lib/redis.ts`, `tests/unit/contact-rate-limit.test.tsx`.
- **Need to understand:** Sliding window vs fixed window. Why fail-open. Why the cooldown check exists only in the fallback.

#### MDX pipeline
- **Why here:** Blog posts are MDX.
- **Where:** `next.config.ts` (`createMDX`), `mdx-components.tsx` (element styling), `lib/getPosts.ts` (frontmatter parsing), `app/[locale]/blog/[id]/page.tsx` (`loadMdx`).
- **Need to understand:** `remark-frontmatter` extracts YAML metadata. `gray-matter` parses it. `rehype-slug` adds IDs to headings for the TOC.

#### `React.cache()`
- **Why here:** `getAllPosts` is wrapped in `cache()`. This means within one request, multiple calls dedupe.
- **Need to understand:** Different from `useMemo` and from `lru-cache`. Per-request only.

#### Dynamic imports via `next/dynamic`
- **Why here:** Almost every page uses it for below-fold components.
- **Where:** `app/[locale]/page.tsx` (`Stats`, `BriefInfo`, `WhyMe`), `app/[locale]/contact/page.tsx` (`ContactClient`), etc.
- **Need to understand:** Code-splitting. `{ ssr: false }` skips server render (used for animation libraries).

#### Resend + React Email
- **Why here:** The notification emails.
- **Files:** `components/contact/EmailTemplate.tsx`, `components/contact/AutoReplyEmail.tsx`.
- **Need to understand:** React Email components are React components that render email-safe HTML. `react.email` works in tandem with Resend.

#### Security headers & CSP
- **Why here:** `lib/security-headers.ts` is a self-contained policy module.
- **Need to understand:** CSP `Report-Only` vs enforced. `'unsafe-inline'` for script-src is necessary because of Next.js hydration. Why the policy differs between dev and prod.

#### Framer-motion LazyMotion + `m.*`
- **Why here:** Used in 5+ components (TypeWriter, BriefInfo, WhyMe, ResumeClient, WorkClient).
- **Need to understand:** `LazyMotion` with `domAnimation` (or `domMax`) shrinks the bundle. `m.div` is the lightweight alternative to `motion.div`. Once you understand this pattern, the components become simple.

---

## Phase 6 — Must Understand vs. Nice to Know

### MUST UNDERSTAND

If you skip any of these, you cannot safely modify the project.

- **Proxy/middleware and locale routing** — `proxy.ts` + `app/[locale]/layout.tsx`
- **Dictionary loading + LocaleProvider pattern** — `lib/dictionaries.ts`, `lib/locale-context.tsx`
- **Server Action + useActionState** — `app/actions/actions.ts`, `ContactForm.tsx`
- **Rate limiter contract** — `lib/redis.ts` (`checkRateLimit`, `getRateLimitConfig`, fallback vs Upstash)
- **Blog post filesystem reader** — `lib/getPosts.ts` (SAFE_SLUG validation, React.cache)
- **MDX loadMdx function** — `app/[locale]/blog/[id]/page.tsx` (slug validation, dynamic import)
- **generateStaticParams + dynamicParams = false** — every statically generated route
- **`'use client'` boundaries** — know which components hydrate
- **`metadataBase` + `createMetadata` helper** — SEO consistency
- **Security headers policy** — how CSP is built, why `'unsafe-inline'`

### SHOULD UNDERSTAND

Important for adding features.

- Framer-motion `LazyMotion` + `m.*` pattern (5+ components use it)
- `dynamic()` for below-fold components and why
- `React.cache()` semantics vs `useMemo`
- ISR via `export const revalidate`
- `next/og` for dynamic OG images (`app/[locale]/blog/[id]/opengraph-image.tsx`)
- Honeypot field pattern
- `useSearchParams` + `router.replace` for client-side filtering (BlogPostGridClient)
- IntersectionObserver + MutationObserver (TableOfContents)
- `output: 'standalone'` Docker build

### KNOW THE PURPOSE

You only need to know what it does and when it is used.

- Shiki syntax highlighting (`lib/CodeBlock.tsx`)
- GitHub GraphQL API integration (`lib/fetchGithubCommits.ts`)
- RSS feed generation (`app/feed.xml/route.ts`)
- JSON-LD generators (`lib/json-ld.ts`, inline in blog page)
- Resend React Email templates (mostly styling)
- Lighthouse CI / Puppeteer / autocannon (load testing)

### CAN IGNORE FOR NOW

- `components/ui/*.tsx` internals (shadcn-generated; just import them)
- Tailwind v4 CSS variables in `app/globals.css`
- shadcn config (`components.json`)
- Prettier/ESLint config internals
- Vitest config details
- Per-page `loading.tsx` / `error.tsx` files (3-line skeletons)

---

## Phase 7 — Module Cards

### Module: `app/[locale]` (Pages)

**Purpose:** Render all public pages with locale-aware metadata.

**Entry point:** `app/[locale]/layout.tsx`

**Important files:**
- `layout.tsx` — root for the locale segment
- `page.tsx` (home)
- `blog/page.tsx`, `blog/[id]/page.tsx`
- `work/page.tsx`, `work/[slug]/page.tsx`
- `resume/page.tsx`, `contact/page.tsx`

**Data it owns:** None directly; consumes `lib/`.

**Dependencies:** `lib/dictionaries`, `lib/getPosts`, `lib/metadata`, `lib/json-ld`, `lib/site-config`.

**Database tables:** None (file-system MDX for blog).

**Important concepts:** `generateStaticParams`, `dynamicParams`, `generateMetadata`, async server components, Suspense.

**Hidden complexity:** The `loadMdx` function bypasses normal MDX module caching by using dynamic `import()` with template literals.

**Failure points:** Missing dictionary for locale, broken MDX import (catches to `notFound()`), missing frontmatter fields.

---

### Module: Contact Form (Server Action + UI)

**Purpose:** Allow visitors to send the site owner an email.

**Entry point:** `app/actions/actions.ts` (`sendEmail`)

**Important files:**
- `app/actions/actions.ts` (server action)
- `components/contact/ContactForm.tsx` (client form, calls action)
- `components/contact/ContactClient.tsx` (parent layout)
- `components/contact/EmailTemplate.tsx` (notification to owner)
- `components/contact/AutoReplyEmail.tsx` (reply to sender)
- `lib/redis.ts` (rate limiting)
- `types/contact.ts` (FeedbackState)

**Data it owns:** None persistent.

**Dependencies:** Resend SDK, React Email, Upstash (optional), Zod, next/headers.

**External dependencies:** Resend, Upstash Redis.

**Important concepts:** Server Actions, `useActionState`, Zod validation, honeypot, sliding-window rate limiting, fail-open, parallel API calls, `after()` for non-blocking logs.

**Hidden complexity:** Two backends for rate limiting (Upstash vs in-memory). The in-memory fallback includes a min-interval check that Upstash doesn't need (sliding window already covers it).

**Failure points:** Upstash unreachable (handled — fail open), Resend down (caught — generic error), honeypot triggered (silently returns success to confuse bots).

---

### Module: i18n (Internationalization)

**Purpose:** English + Vietnamese support across the entire site.

**Entry point:** `proxy.ts` (detects locale, redirects)

**Important files:**
- `lib/i18n.ts` — locale constants
- `lib/dictionaries.ts` — JSON loaders
- `lib/locale-context.tsx` — React Context
- `dictionaries/en.json`, `dictionaries/vi.json` — translations
- `types/dictionary.ts` — typed shape

**Data it owns:** Two JSON dictionaries (~270 lines each).

**Dependencies:** None external.

**Important concepts:** Edge middleware, dynamic imports, Context API, JSON-as-data.

**Hidden complexity:** The `Dictionary` type in `types/dictionary.ts` is hand-written, not generated from the JSON. If you add a key to the JSON, you also must add it to the type. This is fragile.

**Failure points:** Mismatch between JSON and type causes TypeScript errors. Missing translation falls back silently to the English text (in some cases) or breaks (in others).

---

### Module: Blog (MDX content pipeline)

**Purpose:** Render localized MDX blog posts with metadata, recommendations, and OG images.

**Entry point:** `app/[locale]/blog/[id]/page.tsx`

**Important files:**
- `app/[locale]/blog/page.tsx` (index)
- `app/[locale]/blog/[id]/page.tsx` (detail)
- `app/[locale]/blog/[id]/opengraph-image.tsx` (dynamic OG)
- `app/[locale]/blog/[id]/loading.tsx`, `error.tsx`
- `lib/getPosts.ts`
- `mdx-components.tsx`
- `next.config.ts` (createMDX)
- `components/blog/*.tsx`

**Data it owns:** Reads from `content/{en,vi}/*.mdx` at build/request time.

**Dependencies:** `gray-matter`, `@next/mdx`, `remark-gfm`, `remark-frontmatter`, `rehype-slug`.

**Database tables:** The filesystem IS the database. Each `.mdx` file = one row.

**Important concepts:** MDX compilation, frontmatter parsing, SAFE_SLUG validation, `dynamicParams = false`, static generation.

**Hidden complexity:** `loadMdx` uses a dynamic `import()` with a template literal path. This works in Next.js but bypasses normal webpack caching.

**Failure points:** Missing MDX file → `notFound()`. Invalid slug → throws and `notFound()`. Missing frontmatter fields → defaulted in `parseFrontmatter`.

---

### Module: SEO Surface

**Purpose:** Make the site crawlable, indexable, and shareable.

**Entry point:** Various — `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/feed.xml/route.ts`, `app/icon.tsx`, `app/apple-icon.tsx`.

**Important files:**
- `lib/metadata.ts` (`createMetadata`)
- `lib/json-ld.ts` (`getJsonLd`)
- `app/sitemap.ts`
- `app/robots.ts`
- `app/manifest.ts`
- `app/feed.xml/route.ts`
- Per-page `generateMetadata` functions

**Data it owns:** None. Pulls from `lib/site-config.ts` and `lib/getPosts.ts`.

**Important concepts:** Next.js Metadata API, `MetadataRoute` types, `next/og` `ImageResponse`, RSS XML generation.

**Failure points:** `sitemap.ts` swallows errors from `getAllPosts` — if MDX content breaks, sitemap silently degrades.

---

### Module: Security & Headers

**Purpose:** Harden HTTP responses.

**Entry point:** `next.config.ts` (calls `securityHeaders`)

**Important files:**
- `lib/security-headers.ts`
- `next.config.ts`

**Important concepts:** CSP `Report-Only` vs enforced, dev vs prod differences, `Strict-Transport-Security` only in prod, HSTS preload list, Permissions-Policy.

**Hidden complexity:** `next.config.ts` runs at build time, so flipping `CSP_ENFORCE` requires a redeploy, not a hot reload.

---

## Phase 8 — Teaching Milestones

### Milestone A — Orientation & Entry Points

**Read**
1. `README.md`
2. `FEATURES.md`
3. `package.json`
4. `env.example`
5. `next.config.ts`
6. `proxy.ts`
7. `app/layout.tsx`
8. `app/[locale]/layout.tsx`

**Learn**
- Next.js App Router basics
- Server vs Client Components
- Edge Middleware (`proxy.ts`)
- The `output: 'standalone'` Docker setup
- How `generateStaticParams` pre-renders

**Trace**
- Browser request for `/en` → proxy.ts → LocaleLayout → HomePage

**Questions you must answer**
1. Where does the app actually start when a request comes in?
2. Why is there both `app/layout.tsx` and `app/[locale]/layout.tsx`?
3. What does `proxy.ts` do and where does it run?
4. What happens when someone visits `/` without a locale?
5. How does the app decide between `en` and `vi`?

**Practical task:** Add `console.log` at the top of `app/[locale]/layout.tsx` and visit `/en`. Confirm the log appears server-side only.

---

### Milestone B — i18n Pipeline

**Read**
1. `lib/i18n.ts`
2. `lib/dictionaries.ts`
3. `lib/locale-context.tsx`
4. `types/dictionary.ts`
5. `dictionaries/en.json` (skim)
6. `components/layout/LanguageSwitcher.tsx`

**Learn**
- Locale type pattern with `as const` and type guards
- Dynamic imports vs static imports (and why)
- React Context API
- The `useLocale()` hook
- Cookie-based locale persistence

**Trace**
- Click language switcher → set cookie → pathname.replace → router.push → re-render with new dict

**Questions**
1. Why is `Locale = (typeof locales)[number]` and not `string`?
2. Why does `dictionaries.ts` use `import(...)` inside a Record?
3. Why is `LocaleProvider` a client component?
4. What does the cookie do exactly?
5. If you add `'fr'` to `lib/i18n.ts`, what else must you change?

**Practical task:** Add a new key (e.g., `dict.footer.tagline2`) to both `en.json` and `vi.json`, then display it in the Footer.

---

### Milestone C — Server Actions & Forms

**Read**
1. `app/actions/actions.ts`
2. `components/contact/ContactForm.tsx`
3. `components/contact/ContactClient.tsx`
4. `types/contact.ts`
5. `lib/redis.ts`

**Learn**
- `'use server'` directive
- `useActionState` (React 19)
- Zod schema validation
- Honeypot anti-spam
- IP-based key composition
- `next/headers` and `next/server` (for `after()`)
- `Promise.all` for parallel calls
- `after()` for non-blocking side effects

**Trace**
- Form submit → useActionState → sendEmail → Zod → rate limit → Resend parallel → after() log

**Questions**
1. Where exactly does the form's POST request go?
2. Why is `sendEmail` shaped as `(prevState, formData)`?
3. What does the honeypot do and why does it silently return success?
4. Why are the two Resend calls inside `Promise.all`?
5. Why is the log inside `after()` instead of in the main flow?
6. What happens if Resend throws?

**Practical task:** Add a new field to the form (e.g., `subject`). Trace which files you must touch.

---

### Milestone D — Rate Limiter

**Read**
1. `lib/redis.ts` (entire file)
2. `tests/unit/contact-rate-limit.test.tsx` (skim the in-memory and Upstash tests)

**Learn**
- Fixed-window vs sliding-window
- Why sliding window matters
- Why fail-open
- Upstash HTTP-based Redis (no TCP)
- `vi.hoisted` and `vi.mock` patterns in Vitest
- `next/server`'s `after()` integration

**Trace**
- `checkRateLimit('1.2.3.4:foo:bar', { limit, windowMs, minIntervalMs })` → Upstash branch vs in-memory branch

**Questions**
1. What's the key composed of?
2. Why does the in-memory path have a min-interval check but Upstash doesn't?
3. What happens if Upstash returns an error?
4. Why is the Upstash limiter cached in a module-level variable?
5. Why prune the in-memory store at 1000 entries?

**Practical task:** Change `MEMORY_STORE_LIMIT` to 5 and verify the test still passes. Then write a small comment explaining what limit you chose.

---

### Milestone E — Blog Pipeline

**Read**
1. `lib/getPosts.ts`
2. `next.config.ts` (`createMDX` block)
3. `app/[locale]/blog/page.tsx`
4. `app/[locale]/blog/[id]/page.tsx`
5. `mdx-components.tsx`
6. One file in `content/en/`
7. `app/[locale]/blog/[id]/opengraph-image.tsx` (skim)

**Learn**
- `gray-matter` for frontmatter
- `remark-frontmatter`, `remark-gfm`, `rehype-slug`
- `React.cache()` for per-request dedup
- `dynamicParams = false`
- `generateStaticParams` for SSG
- Dynamic OG image generation with `next/og`
- `unsafe_slug` validation

**Trace**
- Visit `/en/blog/foo` → layout → page → `loadMdx` → MDX render → JSON-LD injection

**Questions**
1. Where does the MDX content actually get parsed?
2. Why is `loadMdx` written as a dynamic `import()`?
3. Why does `getAllPosts` use `cache()`?
4. What does the `SAFE_SLUG` regex prevent?
5. What happens at build time vs at request time?

**Practical task:** Add a new MDX post to `content/en/`. Confirm it appears on the blog index without redeploying anything other than a rebuild.

---

### Milestone F — Page Tree & Dynamic Imports

**Read**
1. `app/[locale]/page.tsx` (home — the most complex example)
2. `app/[locale]/contact/page.tsx`
3. `app/[locale]/work/page.tsx`
4. `components/home/Stats.tsx`
5. `components/contact/ContactForm.tsx`

**Learn**
- `next/dynamic` for code-splitting
- `Suspense` boundaries and streaming
- `contentVisibility: 'auto'` CSS
- ISR via `export const revalidate`
- Hoisted static JSX (the `*Fallback` constants)

**Trace**
- Home page render → Suspense around StatsSection → BriefInfo dynamic import → WhyMe dynamic import

**Questions**
1. Why are BriefInfo and WhyMe wrapped in `dynamic()` but TypeWriter isn't?
2. What does `contentVisibility: 'auto'` do?
3. Why is `StatsFallback` declared OUTSIDE the component function?
4. What's the difference between `dynamic()` and `React.lazy()`?

**Practical task:** Wrap a new section on the home page in `<Suspense>` and add a fallback. Use a real data fetch (e.g., a delay) to see the fallback in action.

---

### Milestone G — SEO Surface

**Read**
1. `lib/metadata.ts`
2. `lib/json-ld.ts`
3. `app/sitemap.ts`
4. `app/robots.ts`
5. `app/feed.xml/route.ts`
6. `app/[locale]/blog/[id]/page.tsx` (the JSON-LD injection)

**Learn**
- Next.js Metadata API
- `MetadataRoute` types
- `next/og` `ImageResponse`
- JSON-LD schemas (`@graph`, `@type`)
- Canonical URLs and hreflang

**Trace**
- Crawler visits `/sitemap.xml` → sitemap() → flatMap locales × routes + blog entries
- Crawler visits `/en/blog/foo` → generateMetadata → OpenGraph image rendered separately by `opengraph-image.tsx`

**Questions**
1. Where does the canonical URL get computed?
2. How does `hreflang` get generated?
3. What's the difference between `Metadata` and `MetadataRoute.Sitemap`?
4. Why is the OG image a separate route?

**Practical task:** Add a new JSON-LD schema (e.g., `FAQPage`) to one blog post and verify it renders with [Google's Rich Results test](https://search.google.com/test/rich-results).

---

### Milestone H — Security Headers

**Read**
1. `lib/security-headers.ts`
2. `next.config.ts` (the `headers()` block)

**Learn**
- CSP directives (`default-src`, `script-src`, etc.)
- `Report-Only` vs enforced
- HSTS preload list
- Permissions-Policy

**Trace**
- Every request → Next.js applies headers from `next.config.ts` → browser receives CSP and other headers

**Questions**
1. Why is `'unsafe-inline'` allowed in `script-src`?
2. Why is `Strict-Transport-Security` only set in production?
3. What is `report-uri`?
4. Why does `next.config.ts` need a rebuild to flip `CSP_ENFORCE`?

**Practical task:** Add a new header (`X-Custom-Header: foo`) and confirm it appears in `curl -I http://localhost:3000/en`.

---

## Phase 9 — Active Recall Questions

After each milestone, attempt these without looking at the code. Then check your answers against the file.

### After Milestone A (Orientation)

1. What file runs FIRST when a request hits your server?
2. Why does `app/layout.tsx` exist if `app/[locale]/layout.tsx` already provides `<html>`?
3. What's the default locale, and where is it defined?
4. Where does the choice between `en` and `vi` happen?
5. What does `generateStaticParams` do in `app/[locale]/layout.tsx`?
6. If you removed `proxy.ts`, what would break?
7. What is `output: 'standalone'` and why does it matter for Docker?

### After Milestone B (i18n)

1. Why is `Locale` a literal-union type and not a plain `string`?
2. What does `isValidLocale` return type-signature-wise?
3. Why use `import(...)` inside `dictionaries.ts` instead of top-level imports?
4. What happens if you read `dict.contact.title` but the contact key doesn't exist?
5. What does `useLocale()` throw and when?
6. Why is the cookie named `NEXT_LOCALE`?
7. If you add a new translation key to `en.json`, what 3 other files might need updates?

### After Milestone C (Forms / Server Actions)

1. What does `'use server'` do?
2. What is `useActionState`'s third return value?
3. Why validate BEFORE rate limiting in `sendEmail`?
4. What is the purpose of the `website` field?
5. What does `getClientKey` build, and why include `user-agent`?
6. Why use `Promise.all` instead of two sequential awaits?
7. What does `after()` do, and why prefer it?
8. Why does the form reset on success but not on error?
9. What's the difference between `prevState` and the form's current values?

### After Milestone D (Rate Limit)

1. What does "fail open" mean in this codebase?
2. Why prefer sliding window over fixed window?
3. Why does the in-memory fallback have `minIntervalMs` but Upstash doesn't?
4. What is the key composed of? Why those parts?
5. Why is `cachedLimiter` a module-level variable?
6. What's the purpose of `MEMORY_STORE_LIMIT`?
7. What happens on the third request within 1 second, given `limit: 5, minIntervalMs: 1000`?

### After Milestone E (Blog)

1. Where does MDX parsing actually happen?
2. Why is `loadMdx` not a normal `import`?
3. Why wrap `getAllPosts` in `cache()`?
4. What does the `SAFE_SLUG` regex protect against?
5. Why `dynamicParams = false`?
6. What does `rehype-slug` do, and why does the TOC need it?
7. What's in the frontmatter, and what isn't?
8. Where do JSON-LD scripts for blog posts come from?

### After Milestone F (Pages & Dynamic Imports)

1. Why dynamic-import `BriefInfo` and `WhyMe` but not `TypeWriter`?
2. What's the difference between `dynamic()` and `React.lazy()`?
3. What does `contentVisibility: 'auto'` actually do?
4. Why hoist `StatsFallback` outside the component?
5. What's `export const revalidate = 864000` doing?
6. When would you use `{ ssr: false }` in `dynamic()`?

### After Milestone G (SEO)

1. Where does the canonical URL get set?
2. Where does `hreflang` come from?
3. Why use `next/og` instead of a static image?
4. Why does the sitemap silently catch errors?
5. What's the purpose of JSON-LD `@graph`?
6. What's the difference between `openGraph` and `twitter` metadata?

### After Milestone H (Security)

1. Why does CSP differ between dev and prod?
2. Why `'unsafe-inline'` in script-src?
3. What is `Content-Security-Policy-Report-Only`?
4. Why is HSTS only set in prod?
5. What does `Permissions-Policy` control?
6. Why does flipping `CSP_ENFORCE=1` require a rebuild?

---

## Phase 10 — Code Tracing Exercises

### Exercise 1 — User clicks "Hire me"

Trace from the click to the page render. Identify every file and function touched.

Hint: Header.tsx → Button → Link → /en/contact → ContactClient → ContactForm → form action prop.

### Exercise 2 — User opens a blog post

Trace from `https://anhnguyendev.me/en/blog/mastering-nextjs-app-router` to the rendered page.

Hint: proxy.ts (pass through) → layout → blog/[id]/page.tsx → loadMdx → MDX render → JSON-LD → PostDetailLayout → TableOfContents reads DOM after mount.

### Exercise 3 — User submits contact form

Trace from `submit` click to the toast that appears.

Hint: ContactForm → useActionState → sendEmail Server Action → Zod → checkRateLimit → Promise.all(Resend) → after() → useEffect on response.timestamp → react-hot-toast.

### Exercise 4 — A search engine bot crawls the site

Trace from `https://anhnguyendev.me/sitemap.xml` to the JSON-LD it sees on a blog post.

Hint: sitemap.ts → flatMap → getAllPosts → blog/[id]/page.tsx → script dangerouslySetInnerHTML.

### Exercise 5 — Lighthouse CI runs on a PR

Trace from `.github/workflows/ci.yml` to the assertion failure.

Hint: lhci autorun → puppeteer browsers install chrome → pnpm start (waits for "Ready in") → 3 runs per URL → median aggregation → assert per matchingUrlPattern.

---

## Phase 11 — Feature Implementation Exercises

### Exercise A — Add a new locale

Add Vietnamese-only content for French (or pick another you know). Decide:
- Where to add the locale constant
- Where to create the dictionary
- Where to update the type
- Whether the `LanguageSwitcher` UI needs changes
- What about the MDX content (do you create a `content/fr/` folder?)
- What about the cookie logic?
- What about the JSON-LD `inLanguage`?

Do NOT write code yet. First write down the file list and the order of changes.

### Exercise B — Add a "View counter" to blog posts

Add a counter that shows "X views" on each blog post.

Decisions to make FIRST:
- Where does the counter live? (Server component or client?)
- Where does the count come from? (Upstash? File? Mock for now?)
- Should the count be incremented on every page load?
- Does this affect `generateStaticParams`?
- Does this need a Server Action?
- What's the cache strategy?

### Exercise C — Add a "Subscribe to blog" form

Add a newsletter form to the blog index.

Decisions to make FIRST:
- New Server Action or extend `sendEmail`?
- New rate limit key (or share with contact form)?
- What provider for the actual newsletter (Resend Audience? External service? Mock?)
- Where to validate? (Zod schema for emails only?)
- Honeypot needed?

### Exercise D — Add a "Resume PDF download counter"

Track how many times the CV is downloaded.

Decisions to make FIRST:
- Server Action or just a `fetch` with `keepalive`?
- How to track: Upstash `INCR`, a JSON file, a separate counter endpoint?
- Privacy: do you log IPs?
- What does the UI look like (counter, simple page, hidden)?

---

## Phase 12 — Areas You Probably Vibe-Coded

🚨 **HIGH RISK — read these carefully**

### 1. Server Action rate limiter (`lib/redis.ts`)

**Why risky:** The dual-backend pattern is unusual. The `cachedLimiter` module-level cache could surprise you if you import this file from multiple places. The in-memory fallback is not safe across server instances — this is documented but easy to forget.

**What to learn:** Sliding-window algorithm fundamentals. How to test rate limiters with fake timers (`vi.useFakeTimers`, `vi.advanceTimersByTime`).

**Files to inspect:** `lib/redis.ts` + `tests/unit/contact-rate-limit.test.tsx`.

**Trace:** `checkRateLimit` → both branches → the `fail open` path.

---

### 2. `loadMdx` dynamic import in `app/[locale]/blog/[id]/page.tsx`

**Why risky:** Dynamic `import()` with a template literal path is an unusual Next.js pattern. Webpack normally handles MDX imports at build time. This custom path is intentionally more defensive (SAFE_SLUG regex) but bypasses normal module caching.

**What to learn:** How Next.js MDX works normally, and why a custom loader might bypass tree-shaking.

**Files to inspect:** `app/[locale]/blog/[id]/page.tsx`, `next.config.ts`.

**Trace:** Visit `/en/blog/foo` → `loadMdx` → `import('@/content/en/foo.mdx')` → render.

---

### 3. `components/blog/TableOfContents.tsx` (MutationObserver + IntersectionObserver + rAF + setTimeout)

**Why risky:** Four browser APIs are coordinated. Likely the result of multiple iterations without consolidation.

**What to learn:** When to use `MutationObserver`, when to use `IntersectionObserver`, why `requestAnimationFrame` after DOM mutations.

**Files to inspect:** `TableOfContents.tsx`, `mdx-components.tsx` (provides the IDs via `rehype-slug`).

**Trace:** Mount → look for `article` → extract `h2/h3/h4` → observe for intersection → set active id.

---

### 4. The two near-identical transition components

**Why risky:** `PageTransition.tsx` and `StairTransition.tsx` both check `isBlogDetail()` and both animate. Redundancy is a smell.

**What to learn:** When you have two components doing similar work, you usually want one. Decide which one is canonical.

**Files to inspect:** Both files + `lib/utils.ts` (`isBlogDetail`).

---

### 5. `framer-motion` `LazyMotion` + `m.*` everywhere

**Why risky:** This is a perf optimization but easy to break. Adding `motion.div` instead of `m.div` in a `LazyMotion` tree silently increases bundle size.

**What to learn:** `LazyMotion` features (`domAnimation` vs `domMax`). Why `m.*` works but `motion.*` doesn't inside a LazyMotion tree.

**Files to inspect:** Any of `components/home/{TypeWriter,BriefInfo,WhyMe}.tsx`, `components/resume/ResumeClient.tsx`, `components/work/WorkClient.tsx`, `components/contact/ContactClient.tsx`.

---

### 6. `proxy.ts` instead of `middleware.ts`

**Why risky:** This is the new Next.js 16 API. Older Next.js 13/14 documentation says `middleware.ts`. If you follow a tutorial, you might create the wrong file.

**What to learn:** The new naming. Edge runtime constraints (no Node APIs).

**Files to inspect:** `proxy.ts`.

---

### 7. The hand-written `Dictionary` type in `types/dictionary.ts`

**Why risky:** Adding a key to the JSON without adding it to the type causes silent `undefined` access at runtime (TypeScript won't catch it if you're using bracket notation). The header even says "Auto-generated type from the dictionary JSON structure" — but it is NOT auto-generated. It's hand-written.

**What to learn:** How to generate types from JSON (e.g., `json2ts`, or hand-write carefully). The cost of type drift.

**Files to inspect:** `types/dictionary.ts`, both `dictionaries/*.json`.

---

### 8. `app/sitemap.ts` silently catches errors

**Why risky:** A `console.error` won't fail the build. If MDX is broken, the sitemap silently returns only static routes. You won't notice until crawlers can't find your posts.

**What to learn:** When to fail loudly vs silently. Build-time vs runtime error handling.

**Files to inspect:** `app/sitemap.ts`, `app/feed.xml/route.ts` (same pattern).

---

### ⚠️ MEDIUM RISK

- **`PostDetailLayout.tsx`** — 240 lines with many concerns (breadcrumb, hero, TOC, recommendations, footer, CTA). Long components are hard to reason about.
- **`WorkClient.tsx`** — Swiper + Tooltip + framer-motion + i18n all together.
- **`HomePage` (`app/[locale]/page.tsx`)** — `StatsFallback`, `StatsSection` (which itself imports dynamically), Suspense boundaries, content-visibility. Lots of perf tricks in one file.

### ✅ LOW RISK

- `lib/site-config.ts`, `lib/utils.ts`, `lib/dictionaries.ts` — straightforward.
- `lib/metadata.ts`, `lib/json-ld.ts` — pure helpers.
- `constants/*.tsx` — pure data.
- All shadcn UI components.

---

## Phase 13 — Knowledge Gaps

### FOUNDATIONAL

- **JavaScript modules:** `import()` vs top-level imports; default vs named exports.
- **React Hooks:** `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useActionState` (React 19), `useTransition`.
- **TypeScript:** literal unions with `as const`, type guards, `typeof X[number]`, generic components.

### ARCHITECTURAL

- **Next.js App Router:** the single most important concept. Understand `layout.tsx` vs `page.tsx`, server vs client components, dynamic segments, `generateStaticParams`, `generateMetadata`.
- **Next.js metadata API:** `Metadata` type, `MetadataRoute`, OpenGraph, Twitter cards, JSON-LD via `<script>`.
- **MDX pipeline:** how `@next/mdx` integrates with the build, how `remark`/`rehype` plugins transform content.

### BACKEND (minimal)

- **Server Actions:** `'use server'`, `(prevState, formData)` signature, how they're invoked from `useActionState`.
- **Form validation with Zod:** `safeParse` vs `parse`, error shape.
- **Rate limiting:** sliding window vs fixed window, fail-open vs fail-closed, distributed vs in-memory.
- **Email:** Resend SDK basics, React Email components, parallel sends.

### FRONTEND

- **React Server Components:** the boundary between server and client.
- **`'use client'` directive:** what it implies, what's allowed inside.
- **`React.cache()` vs `useMemo`:** per-request dedup vs per-render memoization.
- **Streaming with Suspense:** `<Suspense fallback={...}>` boundaries, what gets sent first.
- **Dynamic imports:** `next/dynamic` with/without `{ ssr: false }`.

### DATABASE

- **None.** This project has no database. The closest analog is the filesystem (MDX files).
- **Learn:** `fs.readdir`, `fs.readFile`, `path.join`, `gray-matter` (frontmatter parser).

### INFRASTRUCTURE

- **Edge Middleware:** runs at the edge before any route. Constraints (no Node APIs).
- **Upstash Redis:** HTTP-based Redis, works in serverless.
- **Vercel deployment:** environment variables, build vs runtime.
- **Docker multi-stage build:** for the `output: 'standalone'` Next.js setup.
- **Lighthouse CI:** performance budgets in CI.

### DEVOPS

- **GitHub Actions:** the `ci.yml` workflow (lint → test → build → LHCI).
- **Puppeteer / headless Chrome:** for Lighthouse.
- **CSP basics:** what each directive does, why `'unsafe-inline'`.

### ADVANCED

- **Content-visibility:** browser-native off-screen rendering.
- **`next/og`:** dynamic OG images at the edge.
- **ISR:** `export const revalidate` for time-based revalidation.
- **Performance optimization:** the patterns scattered through comments (e.g., `bundle-dynamic-imports`, `server-parallel-fetching`, `rendering-hoist-jsx`). These are well-named; once you understand them once, you'll see them everywhere.

---

## Final Learning Roadmap

```text
PHASE 0
Project Orientation

Read:
- README.md
- FEATURES.md
- package.json
- env.example
- next.config.ts
- proxy.ts
- app/layout.tsx
- app/[locale]/layout.tsx

Learn:
- Next.js App Router basics
- Edge Middleware
- Server vs Client Components
- Standalone build output

Trace:
- Browser request for /en → proxy.ts → LocaleLayout → HomePage

Goal:
Understand how a request enters the app and where the real root is.


PHASE 1
Core Architecture

Read:
- lib/i18n.ts
- lib/dictionaries.ts
- lib/locale-context.tsx
- lib/site-config.ts
- lib/utils.ts
- types/dictionary.ts

Learn:
- Locale type with as const
- Dynamic JSON imports
- React Context for client dict
- Site config as single source of truth

Trace:
- Click LanguageSwitcher → cookie → new dict re-render

Goal:
Navigate the entire site without getting lost.


PHASE 2
Server Actions & Forms

Read:
- app/actions/actions.ts
- components/contact/ContactForm.tsx
- components/contact/ContactClient.tsx
- types/contact.ts
- components/contact/EmailTemplate.tsx
- components/contact/AutoReplyEmail.tsx

Learn:
- 'use server' directive
- useActionState (React 19)
- Zod validation
- Honeypot pattern
- next/headers, next/server after()
- Promise.all for parallel sends

Trace:
- Submit form → useActionState → sendEmail → Zod → rate limit → Resend parallel → toast

Goal:
Understand the only mutation flow in the app.


PHASE 3
Rate Limiter

Read:
- lib/redis.ts
- tests/unit/contact-rate-limit.test.tsx

Learn:
- Sliding window algorithm
- Fail-open strategy
- Upstash HTTP-based Redis
- In-memory fallback trade-offs
- Vitest vi.hoisted + vi.mock patterns

Trace:
- checkRateLimit → Upstash branch vs in-memory branch → error handling

Goal:
Understand how to protect a Server Action from abuse.


PHASE 4
Blog Pipeline

Read:
- lib/getPosts.ts
- next.config.ts (createMDX block)
- app/[locale]/blog/page.tsx
- app/[locale]/blog/[id]/page.tsx
- mdx-components.tsx
- One file in content/en/

Learn:
- MDX compilation
- Frontmatter parsing with gray-matter
- React.cache for per-request dedup
- dynamicParams = false
- SAFE_SLUG validation
- rehype-slug for headings

Trace:
- Visit /en/blog/foo → loadMdx → MDX render → JSON-LD injection

Goal:
Add a new blog post without breaking anything.


PHASE 5
Pages & Dynamic Imports

Read:
- app/[locale]/page.tsx
- app/[locale]/contact/page.tsx
- app/[locale]/work/page.tsx
- components/home/Stats.tsx
- components/home/TypeWriter.tsx

Learn:
- next/dynamic for code-splitting
- Suspense boundaries and streaming
- contentVisibility CSS
- ISR with revalidate
- Hoisted static JSX (fallback patterns)

Trace:
- Home page render → Suspense → dynamic imports → hydration

Goal:
Add a new below-fold section with proper Suspense.


PHASE 6
SEO Surface

Read:
- lib/metadata.ts
- lib/json-ld.ts
- app/sitemap.ts
- app/robots.ts
- app/feed.xml/route.ts
- app/[locale]/blog/[id]/opengraph-image.tsx

Learn:
- Next.js Metadata API
- MetadataRoute types
- next/og ImageResponse
- JSON-LD schemas
- Canonical URLs and hreflang

Trace:
- Crawler hits /sitemap.xml → flatMap → JSON output
- Visit blog post → JSON-LD injected as <script>

Goal:
Make a new page SEO-complete.


PHASE 7
Security & Headers

Read:
- lib/security-headers.ts
- next.config.ts (headers() block)

Learn:
- CSP directives
- Report-Only vs enforced
- HSTS preload
- Permissions-Policy

Trace:
- Every request → headers from next.config.ts → browser receives CSP

Goal:
Add or modify a security header with confidence.


PHASE 8
Full-Stack Data Flow

Read:
- All files from PHASES 1-7 again

Learn:
- How a single feature touches multiple layers

Trace:
- Pick one feature (e.g., blog post with share buttons) and trace every file involved

Goal:
Build a mental model of the whole system.


PHASE 9
Advanced Patterns

Read:
- components/blog/TableOfContents.tsx
- components/home/WhyMe.tsx
- components/work/WorkClient.tsx
- components/blog/CodeBlock.tsx + CodeBlockClient.tsx

Learn:
- IntersectionObserver + MutationObserver
- Framer-motion LazyMotion pattern
- Shiki SSR syntax highlighting
- Swiper integration

Trace:
- Mount → observer setup → state updates → re-render

Goal:
Confidently modify the most complex components.


PHASE 10
Independent Implementation

Exercises:
- Exercise A: Add a new locale
- Exercise B: Add a view counter to blog posts
- Exercise C: Add a subscribe form
- Exercise D: Add a CV download counter

Goal:
Design and implement features without needing to look things up.
```

---

# START HERE

**Milestone:** Project Orientation — understand how the app actually starts.

**Why we start here:** Everything else assumes you know where the entry points are. Without this foundation, every other concept will feel arbitrary. Once you can answer "what runs first when a request hits the server?", the rest of the architecture clicks into place.

### 1. Open: `README.md`

Read the whole file. Pay attention to:
- The "Highlights" section — it tells you which patterns the author considers important.
- The "Tech Stack" section.
- The "Project Structure" section.

### 2. Read: `next.config.ts`

This is the build-time configuration. Notice:
- `output: 'standalone'` (Docker-friendly)
- `pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']` (MDX is a first-class route type)
- `headers()` returns CSP/security headers from `lib/security-headers.ts`
- `redirects()` does www → non-www
- `withMDX(withBundleAnalyzer(nextConfig))` — both wrappers

### 3. Read: `proxy.ts` (32 lines)

This is the edge middleware. Every request hits this FIRST. Understand:
- `getPreferredLocale(request)` — the priority: cookie → Accept-Language → default 'vi'
- The matcher regex — what paths it does NOT run on
- It does NOT add a default locale if missing — it redirects

### 4. Read: `app/layout.tsx` (12 lines)

This is a PASSTHROUGH. The real root is `app/[locale]/layout.tsx`. The author did this intentionally so the `<html>` and `<body>` only render once (locale-aware).

### 5. Read: `app/[locale]/layout.tsx` (172 lines)

This is the real root layout. Understand:
- `params` is `Promise<{ locale: string }>` (Next 15+)
- `if (!isValidLocale(locale)) notFound()`
- `await getDictionary(locale)` — load translations
- The provider stack: `<ThemeProvider>` → `<LocaleProvider>` → page content
- `generateStaticParams` returns both `'en'` and `'vi'`

### 6. Trace: A request to `https://anhnguyendev.me/en`

```text
Browser → Vercel edge
  → proxy.ts runs (locale already present, pass through)
  → Next.js routes to app/[locale]/layout.tsx
  → params = { locale: 'en' }
  → isValidLocale('en') → true
  → getDictionary('en') → import('@/dictionaries/en.json')
  → <html lang="en"> with <LocaleProvider value={{ locale, dict }}>
  → page.tsx renders inside <PageTransition>
```

Now repeat for `https://anhnguyendev.me/`:
```text
Browser → Vercel edge
  → proxy.ts runs (no locale prefix)
  → getPreferredLocale() → 'vi' (default)
  → NextResponse.redirect('/vi/')
  → Browser follows redirect → above flow with locale='vi'
```

### 7. You should be able to explain:

- **Where does a request first hit the application?**
  *(Answer: Vercel edge, where `proxy.ts` runs.)*

- **Why are there TWO layout files?**
  *(Answer: `app/layout.tsx` is required by Next.js but only passes children through. The real layout is `app/[locale]/layout.tsx` because `<html>` and `<body>` need to be locale-aware.)*

- **What happens when someone visits `/` with no locale?**
  *(Answer: `proxy.ts` detects missing locale, picks one via cookie → Accept-Language → default, and 308-redirects to `/{locale}/`.)*

- **What is `generateStaticParams` doing in the locale layout?**
  *(Answer: It tells Next.js to pre-render this layout for both `'en'` and `'vi'` at build time. The layout becomes a static asset served from CDN, not regenerated per request.)*

- **What is `output: 'standalone'` and why is it in `next.config.ts`?**
  *(Answer: Next.js produces a minimal Node.js server in `.next/standalone/`. Used by the Dockerfile to ship a small image without `node_modules`.)*

- **Why is `params` typed as `Promise<{ locale: string }>` instead of `{ locale: string }`?**
  *(Answer: Next.js 15+ change. `params` is now async because some metadata decisions require it. You `await params` before using.)*

### 8. Test yourself — answer these WITHOUT looking at the files:

1. What file runs first for any incoming request?
2. What is the default locale, and where is it defined?
3. If a user visits `https://anhnguyendev.me/contact`, what URL do they end up on?
4. What does `isValidLocale` do if the locale is invalid?
5. Why is the root layout (`app/layout.tsx`) so empty?
6. What is the difference between `layout.tsx` and `page.tsx`?
7. What does `generateStaticParams` return for this layout?

### 9. Done when:

You can confidently trace any URL on this site through the routing layer without needing to look at the code. You understand why every file exists in `app/` and where the boundary between server-rendered and client-rendered happens.

---

**Now stop. Do not start Phase 1 yet.**

Come back and tell me when you've completed the orientation milestone. Then we move to **Milestone B — i18n Pipeline** (`lib/i18n.ts`, `lib/dictionaries.ts`, `lib/locale-context.tsx`, `types/dictionary.ts`, `dictionaries/en.json` structure, `components/layout/LanguageSwitcher.tsx`).

If you get stuck on any of the test questions, tell me which one and we'll work through it together.
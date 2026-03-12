# Project Audit Report

> **Date**: March 11, 2026  
> **Scope**: Full codebase scan — configuration, app routes, components, lib, constants, types  
> **Total Issues Found**: **90+**

---

## Summary by Severity

| Severity | Count |
|----------|-------|
| **Critical** | 4 |
| **High** | 19 |
| **Medium** | 35 |
| **Low** | 33 |

---

## Table of Contents

1. [Security Issues](#1-security-issues)
2. [Performance Issues](#2-performance-issues)
3. [TypeScript Issues](#3-typescript-issues)
4. [Next.js Best Practices Violations](#4-nextjs-best-practices-violations)
5. [SEO Issues](#5-seo-issues)
6. [i18n Issues](#6-i18n-issues)
7. [Accessibility Issues](#7-accessibility-issues)
8. [Error Handling Gaps](#8-error-handling-gaps)
9. [React Anti-patterns](#9-react-anti-patterns)
10. [Architecture & Code Consistency](#10-architecture--code-consistency)
11. [Dead Code / Unnecessary Code](#11-dead-code--unnecessary-code)
12. [Priority Fix Roadmap](#12-priority-fix-roadmap)


## 2. Performance Issues

| # | Severity | File | Description |
|---|----------|------|-------------|
| 2.1 | **Critical** | `lib/fetchGithubCommits.tsx` | **N+1 API problem**: Fetches ALL repos (paginated), then for EACH non-fork repo, fetches ALL commits (paginated). 50 repos = 50+ sequential HTTP requests. Can exhaust GitHub's 5,000 req/hour rate limit. Use GraphQL API or `/stats/contributors` endpoint. |
| 2.2 | **High** | `constants/stats.tsx` | **Top-level `await`** blocks the entire module graph until the (potentially slow, N+1) GitHub API call completes. Every file that imports from `stats.tsx` is blocked. |
| 2.3 | **Medium** | `lib/getPosts.ts` | Uses synchronous `fs.readFileSync` and `fs.readdirSync` inside an `async` function. These block the Node.js event loop. Should use `fs/promises`. |
| 2.4 | **Medium** | `lib/getPosts.ts` | `getAllPosts` reads all MDX files from disk every call. Both `getFeaturedPosts` and `getRelatedPosts` call it, so duplicate reads happen per render. Use `React.cache()` or `unstable_cache`. |
| 2.5 | **Medium** | `app/[locale]/blog/[id]/page.tsx` | MDX module is `import()`-ed **twice** — once in `generateMetadata` and once in the page component. Redundant at dev/runtime. |
| 2.6 | **Medium** | `app/feed.xml/route.ts` | Sorts items by **regex-parsing the XML string** to extract `<pubDate>`. Brittle and slow. Should sort data objects before XML generation. |
| 2.7 | **Medium** | `components/home/TypeWriter.tsx` | Every render creates **inline animation objects** for each character inside `.map()`. New object references per render prevent framer-motion from bailing out. Hoist outside component. |
| 2.8 | **Medium** | `components/home/WhyMe.tsx` | `window.addEventListener('resize', ...)` fires on every frame with no debounce/throttle. Uses `domMax` (full framer-motion bundle) while every other component uses `domAnimation`. `willChange: 'transform'` set permanently wastes GPU memory. |
| 2.9 | **Medium** | `components/blog/AuthorAvatar.tsx` | `priority` unconditionally set on Image. When many avatars render in a list, all get preload hints, hurting LCP. |
| 2.10 | **Low** | `app/actions/actions.ts` | `new Resend(process.env.RESEND_API_KEY)` creates a new client on every request. Should be a module-level singleton. |
| 2.11 | **Low** | `lib/fetchGithubCommits.tsx` | `repos = [...repos, ...repoData]` creates a new array copy each loop iteration. Use `repos.push(...repoData)`. |
| 2.12 | **Low** | `lib/fetchGithubCommits.tsx` | `cache: 'force-cache'` means commit data is cached indefinitely. Consider `next: { revalidate: 86400 }` for daily refresh. |
| 2.13 | **Low** | `components/ui/tooltip.tsx` | Each `Tooltip` wraps itself with its own `TooltipProvider`, creating redundant providers when parent already supplies one. |
| 2.14 | **Low** | `components/blog/PostDetailLayout.tsx` | Default parameter `recommendations = []` creates a new array reference each render. Define as module-level constant. |

---

## 3. TypeScript Issues

| # | Severity | File | Description |
|---|----------|------|-------------|
| 3.1 | **Medium** | `lib/dictionaries.ts` | Dictionary return type is `any` (with eslint-disable). Propagates untyped data throughout the entire app. Create a `Dictionary` interface from the JSON structure. |
| 3.2 | **Medium** | `lib/locale-context.tsx` | `dict: Record<string, any>` with eslint-disable. Same untyped dictionary issue. |
| 3.3 | **Medium** | `components/blog/BlogPostGridClient.tsx` | `locale` prop typed as `string` instead of `Locale`. Allows invalid locale strings at compile time. |
| 3.4 | **Medium** | `components/work/WorkClient.tsx` | `handleSlideChange` uses ad-hoc inline type `{ activeIndex: number }` instead of Swiper's exported `SwiperClass` type. |
| 3.5 | **Medium** | `constants/projects.tsx`, `socials.tsx`, `info.tsx`, `whyme.tsx` | Arrays/objects exported without explicit type annotations. Should have `interface` definitions. |
| 3.6 | **Low** | `lib/getPosts.ts` | `gray-matter` output `data` is `{ [key: string]: any }`. No Zod schema validation on frontmatter. |
| 3.7 | **Low** | `constants/stats.tsx` | `calculateYearsOfExperience(startDate: string | number | Date)` — `number` variant is unused and ambiguous. |
| 3.8 | **Low** | `types/contact.ts` | Only defines `FeedbackState` but no `ContactFormData` type. Contact form Zod schema defines its own inline type. Centralize. |
| 3.9 | **Low** | `mdx-components.tsx` | `useMDXComponents()` doesn't accept the `components` parameter. Can't merge/override upstream components. |
| 3.10 | **Low** | `components/contact/ContactClient.tsx` | Unsafe cast: `item.title.toLowerCase() as keyof typeof dict.contact.infoLabels`. No runtime guard. |

---

## 4. Next.js Best Practices Violations

| # | Severity | File | Description |
|---|----------|------|-------------|
| 4.1 | **High** | `app/[locale]/blog/[id]/page.tsx` | JSON-LD `<Script>` tags use `strategy='afterInteractive'`. Structured data (Article, BreadcrumbList) **must** be in the initial HTML for search engine crawlers. Use a plain `<script>` tag or Next.js metadata API. |
| 4.2 | **High** | `app/[locale]/layout.tsx` | Organization JSON-LD also uses `strategy='afterInteractive'`. Same SEO-critical issue. |
| 4.3 | **High** | `lib/getPosts.ts` | `'use server'` is misused — intended for mutations/form handlers, not data-fetching. Remove the directive. Use `import 'server-only'` instead. |
| 4.4 | **Medium** | `app/[locale]/blog/page.tsx` | Uses static `export const metadata` instead of `generateMetadata`. Static metadata cannot vary by locale — both `/en/blog` and `/vi/blog` get the same English title. |
| 4.5 | **Medium** | `app/[locale]/contact/page.tsx`, `resume/page.tsx`, `work/page.tsx` | Same as 4.4 — static metadata with hardcoded English strings and canonical URLs missing locale prefix. |
| 4.6 | **Low** | `app/[locale]/blog/[id]/page.tsx` | `wordCount: undefined` in JSON-LD. `JSON.stringify` omits it, so it's dead code. Either calculate or remove. |

---

## 5. SEO Issues

| # | Severity | File | Description |
|---|----------|------|-------------|
| 5.1 | **High** | `lib/metadata.ts` | `createMetadata` doesn't generate `alternates.languages` (hreflang). Google can't discover the Vietnamese version of pages. |
| 5.2 | **High** | Multiple page files | Canonical URLs from `createMetadata` use paths like `/blog`, `/contact` without locale prefix. `https://anhnguyendev.me/blog` is canonical for both `/en/blog` and `/vi/blog` — and that URL doesn't exist (middleware redirects it). |
| 5.3 | **Medium** | `app/sitemap.ts` | `lastModified: new Date()` for static routes means every crawl sees a "new" modification date. Degrades crawl trust. Use a fixed or actual deploy date. |
| 5.4 | **Medium** | `app/feed.xml/route.ts` | `<language>en-us</language>` is hardcoded but the feed contains posts from both locales. Either split into per-locale feeds or update the tag. |
| 5.5 | **Medium** | `app/[locale]/blog/[id]/page.tsx` | `modifiedTime` equals `publishedTime`. Identical dates signal stale content. Omit `modifiedTime` or track separately in frontmatter. |
| 5.6 | **Medium** | `lib/json-ld.ts` | Entire structured data is monolingual English. `inLanguage: 'en-US'` is hardcoded. Should be per-locale. |
| 5.7 | **Low** | `app/manifest.ts` | `lang: 'en-US'` hardcoded despite serving all locales. |
| 5.8 | **Low** | `app/robots.ts` | No `Disallow` rules for `/api/` or non-content paths for crawl budget efficiency. |

---

## 6. i18n Issues

| # | Severity | File | Description |
|---|----------|------|-------------|
| 6.1 | **Critical** | All `constants/*.tsx` files | **Entire constants layer is English-only** with no localization. `about.tsx`, `info.tsx`, `projects.tsx`, `stats.tsx`, `whyme.tsx` — all user-visible strings are hardcoded English. The site supports `en` and `vi` but these are never translated. |
| 6.2 | **High** | `app/[locale]/blog/[id]/error.tsx` | All strings hardcoded English: "Failed to load article", "Retry", "All articles". |
| 6.3 | **High** | `app/[locale]/error.tsx` | Error page hardcodes "Something went wrong", "Try again", links to `/en`. Should use locale and dictionary. |
| 6.4 | **High** | `app/[locale]/blog/page.tsx`, `contact/page.tsx`, `resume/page.tsx`, `work/page.tsx` | All metadata titles/descriptions are English-only. Vietnamese users see English metadata and OG tags. |
| 6.5 | **High** | `components/blog/BlogFeaturedPosts.tsx` | `"Featured Articles"` hardcoded. |
| 6.6 | **High** | `components/blog/BlogPostGrid.tsx` | `"No articles found."` hardcoded. |
| 6.7 | **High** | `components/blog/TableOfContents.tsx` | `"On this page"` hardcoded. |
| 6.8 | **High** | `components/blog/ShareButtons.tsx` | `"Twitter"`, `"LinkedIn"`, `"Facebook"`, `"Copy link"`, `"Copied!"` hardcoded. |
| 6.9 | **High** | `components/work/WorkClient.tsx` | `"project"`, `"Live project"`, `"Github repository"` hardcoded. |
| 6.10 | **High** | `components/contact/EmailTemplate.tsx` | Entire email body is English: "New Contact Request", "You just received a new message...", etc. |
| 6.11 | **Medium** | `components/blog/BlogFeaturedPosts.tsx`, `Recommendations.tsx` | `toLocaleDateString('en-US', ...)` — date always English regardless of locale. |
| 6.12 | **Medium** | `app/[locale]/blog/[id]/opengraph-image.tsx` | `toLocaleDateString('en-US', ...)` — OG image date always English. |
| 6.13 | **Medium** | `app/[locale]/blog/page.tsx` | `dict.blog.pageTitle.split(' ')[0]` — splitting by space may break for Vietnamese titles. Brittle pattern. |
| 6.14 | **Medium** | `app/manifest.ts` | `name`, `short_name`, `description` are English-only. |
| 6.15 | **Low** | `app/feed.xml/route.ts` | Feed `<title>` suffix is `— Blog` (hardcoded English). |
| 6.16 | **Low** | `components/blog/CodeBlockClient.tsx` | `"Click to copy line"` title attribute. |
| 6.17 | **Low** | `components/blog/Breadcrumb.tsx` | `"Home"` screen-reader text hardcoded. |

---

## 7. Accessibility Issues

| # | Severity | File | Description |
|---|----------|------|-------------|
| 7.1 | **High** | `components/layout/MobileNav.tsx` | `<SheetTitle className='sr-only'></SheetTitle>` — empty title. The dialog has no accessible name. Screen readers announce nothing. Add meaningful text like "Navigation menu". |
| 7.2 | **High** | `components/blog/CodeBlockClient.tsx` | Line number `<div>` elements have `onClick` handlers but no `role="button"`, `tabIndex={0}`, or `onKeyDown`. Keyboard users cannot activate them. |
| 7.3 | **Medium** | `components/layout/Header.tsx` | Uses `<h1>` for the site logo on every page. If individual pages also render `<h1>`, there are multiple `<h1>` tags per page, violating heading hierarchy. |
| 7.4 | **Medium** | `components/home/Stats.tsx` | `CountUp` animated numbers have no `aria-live` region. Screen readers won't announce the final value. |
| 7.5 | **Medium** | `mdx-components.tsx` | External links (`target="_blank"`) lack visual or SR indicator that they open in a new tab. |
| 7.6 | **Medium** | `mdx-components.tsx` | `<ul>` uses `list-none` which removes list semantics in Safari/VoiceOver. Add `role="list"`. |
| 7.7 | **Medium** | `app/[locale]/blog/[id]/error.tsx` | Error container lacks `role="alert"` or `aria-live="polite"`. Screen readers may not announce the error. |
| 7.8 | **Low** | `components/layout/MobileNav.tsx` | `aria-label` on the `<CiMenuFries>` SVG icon inside `SheetTrigger`, but the actual button element has no label. Should be on the button. |
| 7.9 | **Low** | Loading skeletons (blog, etc.) | Lack `aria-label="Loading"` or `role="status"` with `aria-busy`. |
| 7.10 | **Low** | `mdx-components.tsx` | `<li>` uses `before:content-['▹']` for both `<ul>` and `<ol>`. Overrides ordered list numbering. |

---

## 8. Error Handling Gaps

| # | Severity | File | Description |
|---|----------|------|-------------|
| 8.1 | **High** | `app/actions/actions.ts` | The `message` field is extracted from FormData but **never passed** to `ContactResponseEmail`. Contact form messages are **silently discarded**. This is a functional bug. |
| 8.2 | **High** | `components/blog/CodeBlockClient.tsx` | `navigator.clipboard.writeText(code)` called without `try/catch`. Clipboard API throws if page lacks focus or permissions. |
| 8.3 | **High** | `components/blog/ShareButtons.tsx` | Both `navigator.clipboard.writeText()` and `navigator.share()` called without `try/catch`. Web Share API throws on user cancel. |
| 8.4 | **Medium** | `app/feed.xml/route.ts` | No `try/catch` around `getAllPosts()`. Malformed MDX file crashes the RSS route with a 500. |
| 8.5 | **Medium** | `app/sitemap.ts` | Same issue — no error handling around `getAllPosts()`. Broken MDX file prevents entire sitemap generation. |
| 8.6 | **Medium** | `app/[locale]/contact/page.tsx`, `resume/page.tsx`, `work/page.tsx` | No `error.tsx` boundary for these routes. Only `blog/[id]` has one. Runtime errors bubble to root error handler. |
| 8.7 | **Medium** | `components/work/WorkClient.tsx` | `setProject(projects[currentIndex])` — if Swiper emits `activeIndex` beyond array bounds, `project` becomes `undefined`, crashing UI. Add bounds check. |
| 8.8 | **Medium** | `lib/fetchGithubCommits.tsx` | Catch block creates new `Error`, losing original stack trace. Use `throw new Error('...', { cause: err })`. |
| 8.9 | **Medium** | `lib/getPosts.ts` | Fallback `date: data.date || '1970-01-01'` — an invalid string like `"not-a-date"` produces `NaN`, breaking sort order. |
| 8.10 | **Low** | `app/[locale]/blog/[id]/page.tsx` | `generateMetadata` silently swallows errors — no `console.error` for production debugging. |
| 8.11 | **Low** | `lib/locale-context.tsx` | Default context uses `dict: {}`. Using `useLocale()` outside `<LocaleProvider>` causes runtime crash on `dict.key.nested`. Throw a descriptive error instead. |
| 8.12 | **Low** | `components/blog/PostDetailLayout.tsx` | No error boundary wrapping MDX `{children}`. MDX rendering error crashes the entire page. |

---

## 9. React Anti-patterns

| # | Severity | File | Description |
|---|----------|------|-------------|
| 9.1 | **Medium** | `components/resume/ResumeClient.tsx` | Uses `index` as `key` for experience items, education items, skills, and about info. Can cause incorrect reconciliation if lists are reordered. Use stable identifiers. |
| 9.2 | **Medium** | `components/home/Stats.tsx` | `key={index}` on stats items. |
| 9.3 | **Medium** | `components/contact/ContactClient.tsx` | `key={index}` on info items. |
| 9.4 | **Medium** | `components/home/WhyMe.tsx` | `key={i}` on why-me cards. Inline `whileHover` objects recreated every render inside `.map()`. |
| 9.5 | **Medium** | `components/home/Social.tsx` | `key={index}` instead of `social.name` or `social.path`. |
| 9.6 | **Low** | `components/blog/Breadcrumb.tsx` | `key={index}` on breadcrumb items. |
| 9.7 | **Low** | `components/layout/MobileNav.tsx` | `key={index}` on nav links. |
| 9.8 | **Low** | `components/layout/PageTransition.tsx`, `StairTransition.tsx` | `dynamic()` calls appear before `import dynamic from 'next/dynamic'` in source order. Works due to import hoisting but confusing and may break in future bundlers. |

---

## 10. Architecture & Code Consistency

| # | Severity | File | Description |
|---|----------|------|-------------|
| 10.1 | **High** | Multiple files | **Duplicated data — no single source of truth**: Email appears in `site-config.ts`, `about.tsx`, `info.tsx`. Phone in `about.tsx` and `info.tsx`. Social links in `site-config.ts` and `socials.tsx`. Name/job title in 3+ places. |
| 10.2 | **Medium** | `constants/info.tsx` vs `lib/json-ld.ts` | Inconsistent address: `'Code Corner, Tech Town'` (joke placeholder) vs `'Ho Chi Minh City'` in structured data. Hurts local SEO. |
| 10.3 | **Medium** | `app/actions/actions.ts` | Sender address `from: 'onboarding@resend.dev'` is the Resend test domain. Emails may land in spam. Use a custom verified domain. |
| 10.4 | **Medium** | `components/blog/ShareButtons.tsx`, `opengraph-image.tsx` | Domain `https://anhnguyendev.me` and `anhnguyendev.me` hardcoded. Should use `siteConfig.url`. |
| 10.5 | **Low** | Components | **Mixed export styles**: `export default function X`, `const X = ...; export default X`, named exports. Pick one convention. |
| 10.6 | **Low** | Components | **Mixed interface naming**: Some use `Props`, some use descriptive `XProps`. |
| 10.7 | **Low** | Components | **Mixed function styles**: Arrow functions vs function declarations. |
| 10.8 | **Low** | Constants files | Mix data definitions with JSX icon components (`<FaGithub />`). Prevents use in non-React contexts (scripts, tests, API). |
| 10.9 | **Low** | `constants/*.tsx` vs `lib/site-config.ts` | `site-config.ts` uses `as const` for immutability; constants files do not. |
| 10.10 | **Low** | `lib/fetchGithubCommits.tsx` | File uses `.tsx` extension but contains zero JSX. Should be `.ts`. |
| 10.11 | **Low** | `types/contact.ts` | `timeStamp` (camelCase with capital S) vs standard `timestamp`. |
| 10.12 | **Low** | `env.example` | Env vars use camelCase (`githubToken`, `githubUserName`) instead of the standard `SCREAMING_SNAKE_CASE` (`GITHUB_TOKEN`, `GITHUB_USERNAME`). |

---

## 11. Dead Code / Unnecessary Code

| # | Severity | File | Description |
|---|----------|------|-------------|
| 11.1 | **Low** | `lib/fetchGithubCommits.tsx` | `Commit` interface declares `sha: string` but only `commits.length` is ever used. `sha` is never accessed. |
| 11.2 | **Low** | `types/global.d.ts` | `declare module '*.css'` — Next.js handles CSS imports natively. May be vestigial. |
| 11.3 | **Low** | `app/[locale]/blog/[id]/page.tsx` | `wordCount: undefined` in JSON-LD is omitted by `JSON.stringify`. Dead code. |

---

## 12. Priority Fix Roadmap

### Phase 1 — Critical & High (Do First)

| Priority | Issue | Action |
|----------|-------|--------|
| 1 | **Contact form silently drops messages** (8.1) | Pass `message` to `ContactResponseEmail` and add Zod validation for the `message` field. |
| 2 | **N+1 GitHub API + module-level await** (2.1, 2.2) | Replace REST commit fetcher with GitHub GraphQL API. Move out of module-level `await`. |
| 3 | **`'use server'` misuse on `getPosts.ts`** (4.3, 1.6) | Remove `'use server'`, use `import 'server-only'` instead. |
| 4 | **JSON-LD not in initial HTML** (4.1, 4.2) | Change `strategy='afterInteractive'` `<Script>` to plain `<script>` tags for structured data. |
| 5 | **Constants layer not localized** (6.1) | Refactor constants to use dictionary keys or accept locale parameter. |
| 6 | **Broken canonical URLs + missing hreflang** (5.1, 5.2) | Update `createMetadata` to include locale prefix in canonical URLs and add `alternates.languages`. |
| 7 | **Static metadata on locale pages** (4.4, 4.5, 6.4) | Switch from `export const metadata` to `generateMetadata` on all locale pages. |
| 8 | **Rate limiter ineffective** (1.4) | Replace in-memory rate limiter with Upstash Redis or Vercel's built-in rate limiting. |
| 9 | **PII in source code** (1.1) | Move phone/email to env vars or derive from `siteConfig`. |
| 10 | **Hardcoded English in error pages** (6.2, 6.3) | Use locale context and dictionary for all error page strings. |

### Phase 2 — Medium (Next Sprint)

| Priority | Issue | Action |
|----------|-------|--------|
| 11 | Wrap clipboard/share API calls in `try/catch` (8.2, 8.3) | Add proper error handling. |
| 12 | Fix `MobileNav` empty `SheetTitle` (7.1) | Add meaningful text. |
| 13 | Add keyboard accessibility to code block line numbers (7.2) | Add `role="button"`, `tabIndex`, `onKeyDown`. |
| 14 | Type the dictionary system (3.1, 3.2) | Create `Dictionary` interface from JSON structure. |
| 15 | Fix sync `fs` calls (2.3) | Switch to `fs/promises`. |
| 16 | Add `error.tsx` to contact, resume, work routes (8.6) | Create error boundaries. |
| 17 | Add error handling to `feed.xml` and `sitemap.ts` (8.4, 8.5) | Wrap in `try/catch`. |
| 18 | Use `siteConfig.url` for hardcoded domains (10.4) | Replace all occurrences. |
| 19 | Deduplicate data across constants/config (10.1) | Single source of truth. |
| 20 | SameSite cookie attribute (1.8) | Add to locale cookie. |

### Phase 3 — Low (Backlog)

- Replace `index` keys with stable identifiers across all list renders.
- Standardize export/naming conventions across components.
- Add `as const` to all constants files.
- Rename env vars to `SCREAMING_SNAKE_CASE`.
- Fix `.tsx` extension on non-JSX files.
- Add `aria-live` to animated stats.
- Add loading state a11y attributes to skeletons.
- Clean up dead code (unused types, dead JSON-LD fields).
- Separate data from JSX in constants files.
- Add `role="list"` to styled `<ul>` elements.

# IMPROVEMENTS.md — Portfolio Production Audit Report

## Summary of Improvements

### 🚨 Security (Critical)

| File | Change |
|------|--------|
| `.env` | **Deleted** — contained real GitHub PAT and Resend API key in plaintext |
| `app/[locale]/blog/[id]/page.tsx` | Added `SAFE_SLUG` regex to sanitize `locale` and `id` params before dynamic MDX import, preventing path traversal attacks |
| `components/work/WorkClient.tsx` | Added `target="_blank"` and `rel="noopener noreferrer"` to external project links |
| `app/[locale]/work/[slug]/page.tsx` | Added `target="_blank"` and `rel="noopener noreferrer"` to external project links |

### 🏗️ Architecture

| File | Change |
|------|--------|
| `proxy.ts` → `middleware.ts` | **Renamed** and changed export from `proxy` to `middleware` so Next.js actually loads the locale redirect logic |

### 🧹 Code Cleanup (DRY / Dead Code)

| File | Change |
|------|--------|
| `lib/utils.ts` | Extracted shared `isBlogDetail` helper (was duplicated in two components) |
| `components/layout/PageTransition.tsx` | Imports `isBlogDetail` from shared util instead of inline definition |
| `components/layout/StairTransition.tsx` | Imports `isBlogDetail` from shared util instead of inline definition |
| `components/home/Social.tsx` | Removed unused `React` import (not needed in React 19) and removed `React.FC` type annotation |
| `components/blog/BlogFeaturedPosts.tsx` | Removed unused `PostMetadata` import |
| `components/layout/Stairs.tsx` | Extracted magic number `6` to named `TOTAL_STEPS` constant |
| `components/layout/Header.tsx` | Removed empty `className=""` on Button |

### 🎨 Theme Consistency

| File | Change |
|------|--------|
| `components/home/BriefInfo.tsx` | `text-gray-500` → `text-muted-foreground` (hardcoded color bypassed the theme system) |

### 🌍 Internationalization (i18n)

| File | Change |
|------|--------|
| `types/dictionary.ts` | Added `challenge`, `approach`, `result` keys to `work` dictionary type |
| `dictionaries/en.json` | Added English translations for case study headings |
| `dictionaries/vi.json` | Added Vietnamese translations for case study headings |
| `app/[locale]/work/[slug]/page.tsx` | Replaced hardcoded English "Challenge"/"Approach"/"Result" headings with dictionary keys |

---

## Remaining Issues NOT Fixed

1. **`constants/about.tsx`** — Experience/education items have hardcoded English strings (company names, positions, durations). These should ideally be i18n-ized via the dictionary, but would require a significant data structure refactor.

2. **`constants/projects.tsx`** — Project descriptions and case study content are hardcoded in English. Full i18n would require a per-locale project data model.

3. **Email templates** — `EmailTemplate.tsx` and `AutoReplyEmail.tsx` duplicate brand color constants (`ACCENT`, `DARK_BG`, `BODY_TEXT`, `MUTED_TEXT`). These could be extracted to a shared `lib/email-theme.ts`.

4. **Image optimization** — Work project images reference `/assets/work/thumb1.png` for all 3 projects (likely placeholder). Real project-specific images should be used.

5. **`constants/*.tsx` files** — These files export data objects containing JSX (`<FaHtml5 />`, etc.). This forces them to be `.tsx` files and makes them non-serializable. Consider separating icon mappings from data.

6. **Missing `<Image>` priority** — The work page `Image` component in the Swiper doesn't use `priority={true}` for the first slide (above-fold image).

---

## Suggested Future Improvements

1. **Full i18n for constants data** — Move experience, education, skills, and project descriptions into dictionary JSON files so they render in the user's selected locale.

2. **Content Security Policy (CSP)** — Add a `Content-Security-Policy` header in `middleware.ts` to protect against XSS.

3. **Rate limiter persistence** — The current in-memory rate limiter in `actions.ts` resets on every deployment. Consider using Vercel KV or Upstash Redis for persistent rate limiting.

4. **Structured error logging** — Replace `console.error` calls with a structured logging solution (e.g., Pino) for better observability in production.

5. **Image CDN** — Move OG images from GitLab/GitHub raw URLs to a proper CDN or Vercel Image Optimization for better performance and reliability.

6. **E2E test coverage** — Expand the single smoke test to cover contact form submission, locale switching, blog navigation, and work page interactions.

7. **Bundle analysis** — The project has `@next/bundle-analyzer` configured. Run `ANALYZE=true pnpm build` periodically to identify bundle size regressions, particularly from `framer-motion`, `swiper`, and `react-icons`.

---

## Architectural Recommendations for Scaling

1. **Server Component maximization** — The project already does this well. As it grows, keep pushing data fetching to server components and minimize `'use client'` boundaries.

2. **Content layer** — Consider migrating from raw MDX file imports to a content layer tool like Contentlayer2 or Velite for type-safe content with build-time validation.

3. **Component library extraction** — If launching additional sites with the same brand, extract `components/ui/` to a shared package.

4. **Monitoring** — Add error boundary reporting to a service like Sentry for production error tracking beyond `console.error`.

5. **Incremental Static Regeneration** — The `revalidate = 864000` on the home page is good. Consider adding ISR to blog pages too for automatic revalidation without rebuilds.

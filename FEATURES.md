# 📋 Portfolio Features List

> A comprehensive list of features — **implemented**, **in progress**, and **planned** — for [anhnguyendev.me](https://anhnguyendev.me).

---

## ✅ Implemented Features

### 🌐 Internationalization (i18n)
- [x] Bilingual support: **English (EN)** and **Vietnamese (VI)**
- [x] `next-intl`-style locale routing via `middleware.ts` (`/en/...`, `/vi/...`)
- [x] Language switcher in the header
- [x] Per-locale dictionaries (`/dictionaries/en.json`, `/dictionaries/vi.json`)
- [x] Localized metadata (title, description) per page
- [x] Localized blog content (separate `.mdx` files in `/content/en` and `/content/vi`)

---

### 🏠 Home Page
- [x] Hero section with greeting and animated **TypeWriter** effect
- [x] **Download CV** button
- [x] Social links (GitHub, Facebook, LinkedIn)
- [x] **Stats section**: Years of experience, Projects completed, Technologies mastered, Code commits (fetched live from GitHub API)
- [x] **Brief Info / About Me** section
- [x] **Why Me** section (value proposition / unique selling points)

---

### 📄 Resume / About Page
- [x] **About Me** tab with personal info and bio
- [x] **Experience** tab (work history timeline)
- [x] **Education** tab (academic background)
- [x] **Skills** tab with icon grid (HTML, CSS, JS, React, Next.js, Tailwind CSS, Node.js, Python, Go)
- [x] Tabbed navigation with Radix UI Tabs

---

### 💼 Work / Portfolio Page
- [x] Project showcase with numbered entries
- [x] Per-project: title, description, tech stack, thumbnail image
- [x] Links to **live demo** and **GitHub repo**
- [x] Project categories (fullstack, frontend)
- [x] Swiper-powered project slider

---

### 📝 Blog
- [x] MDX-based blog posts with frontmatter (`gray-matter`)
- [x] **Featured posts** section on the blog landing page
- [x] **Post grid** with card layout
- [x] **Client-side search / filtering** (`BlogPostGridClient`)
- [x] Syntax highlighting via **Shiki**
- [x] **Table of Contents** (auto-generated from headings)
- [x] **Breadcrumb** navigation
- [x] **Share buttons** (social sharing)
- [x] **Author avatar** display in post header
- [x] **Post recommendations** at the bottom of each article
- [x] Bilingual blog content (EN + VI)
- [x] RSS feed (`/feed.xml`)

---

### 📬 Contact Page
- [x] Contact form with **Zod** schema validation
- [x] Email delivery via **Resend**
- [x] Custom **email template** (`@react-email/components`)
- [x] **Real-time toast notifications** (`react-hot-toast`) for success/error feedback
- [x] Server Action for form submission (`/app/actions`)

---

### 🎨 Layout & UI
- [x] **Header** with desktop nav + logo
- [x] **Mobile navigation** (hamburger menu / drawer)
- [x] **Footer** with links and copyright
- [x] **Dark / Light theme toggle** (`next-themes`)
- [x] **Stair transition** page animation (Framer Motion)
- [x] **Page transition** wrapper
- [x] **Back-to-top** button
- [x] Responsive design (mobile-first)
- [x] shadcn/ui component library (Button, Dialog, Tabs, Select, Tooltip, ScrollArea)

---

### ⚙️ Technical / Performance
- [x] **Next.js 16** App Router with TypeScript
- [x] **Incremental Static Regeneration (ISR)** (10-day revalidation on home page)
- [x] **Dynamic imports** for below-fold sections (`next/dynamic`)
- [x] `content-visibility: auto` for rendering performance
- [x] `Suspense` boundaries with skeleton fallbacks
- [x] **Vercel Analytics** integration
- [x] **Vercel Speed Insights** integration
- [x] **Docker** support (`Dockerfile`, `.dockerignore`)
- [x] **Sitemap** auto-generation (`/sitemap.ts`)
- [x] **Robots.txt** (`/robots.ts`)
- [x] **Web App Manifest** (`/manifest.ts`)
- [x] **JSON-LD structured data** for SEO (`lib/json-ld.ts`)
- [x] **Open Graph** and **Twitter Card** metadata
- [x] Custom app icons (`apple-icon.tsx`, `icon.tsx`)
- [x] **Prettier** code formatting (`.prettierrc.json`)
- [x] **ESLint** with Next.js and Prettier config
- [x] **Bundle analyzer** (`@next/bundle-analyzer`)
- [x] GitHub commit count fetching (`lib/fetchGithubCommits.tsx`)
- [x] Centralized site config (`lib/site-config.ts`)

---

## 🚧 Suggested / Planned Features

### 🏠 Home Page
- [ ] **Hero image or avatar** — Add a profile photo alongside the greeting
- [ ] **Animated skill badges** in the hero area
- [ ] **Scroll-reveal animations** using Framer Motion for section entries

---

### 📄 Resume
- [x] **Actual PDF CV download** — wire up the "Download CV" button to a real PDF file
- [ ] **Certifications section** — list online certificates with links (Udemy, Coursera, etc.)

---

### 💼 Work / Projects
- [ ] **More project entries** — add real project thumbnails and descriptions
- [x] **Project detail pages** — individual `/work/[id]` pages with full case studies
- [ ] **Category filter** on the work page (filter by fullstack / frontend / etc.)
- [ ] **Live preview modal** — open a project in a lightbox/modal

---

### 📝 Blog
- [ ] **Categories / tags** system with filter pages (`/blog/tag/[tag]`)
- [ ] **Reading time estimate** displayed on post cards and post headers
- [ ] **View count** per post (via Vercel KV or Upstash Redis)
- [ ] **Comment section** (e.g., Giscus powered by GitHub Discussions)
- [ ] **Like / reaction** button on posts
- [ ] **Newsletter subscription** form (e.g., Resend audience / ConvertKit)
- [ ] **Post search** with URL query param sync (`?q=...`)
- [ ] **Code copy button** visible on hover for all code blocks
- [ ] **Image optimization** with `next/image` for in-post images
- [ ] **OG image generation** per blog post (`next/og`)

---

### 📬 Contact
- [x] **Rate limiting** on the contact form server action (prevent spam)
- [ ] **CAPTCHA** integration (e.g., Cloudflare Turnstile or hCaptcha)
- [ ] **Auto-reply email** sent to the person contacting

---

### 🎨 UI / UX
- [ ] **Scroll progress indicator** at the top of blog posts
- [ ] **Keyboard accessibility audit** — ensure full keyboard navigation
- [ ] **Skip-to-content** link for screen readers
- [ ] **Loading skeletons** for the work and resume pages
- [ ] **404 / Error pages** polished with illustration and back-home link *(partially done)*

---

### ⚙️ Technical
- [x] **CI/CD pipeline** (GitHub Actions for lint + build checks on PR)
- [x] **Unit / integration tests** (Vitest or Jest + React Testing Library)
- [x] **E2E tests** (Playwright)
- [ ] **Lighthouse CI** to enforce performance budgets
- [ ] **Environment variable validation** with Zod at startup
- [ ] **Caching strategy** for GitHub commit API (`unstable_cache` or `next/cache`)
- [ ] **Edge runtime** for middleware optimization
- [ ] **PWA support** — offline-ready with service worker
- [ ] **Security headers** via `next.config.ts` (`X-Frame-Options`, `CSP`, etc.)
- [ ] **Image CDN** — serve `/public` assets via a CDN for faster global delivery

---

### 🌐 SEO & Discoverability
- [ ] **Per-post OG image** dynamically generated with `next/og`
- [ ] **Twitter / X profile meta** already added; verify Card Validator
- [ ] **Google Search Console** submission and monitoring
- [ ] **Structured data for BlogPosting** schema on individual posts
- [ ] **Canonical URLs** verified across all locales

---

*Last updated: 2026-02-26*

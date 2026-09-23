# Domain Migration Implementation Plan

Migration:

- Old domain: `https://anhnguyendev.me`
- New domain: `https://anhnguyendev.tech`

The old `.me` domain is expired and may no longer be controllable. Redirects from the old domain must therefore be treated as unavailable unless ownership is restored.

## Phase 0: Baseline and Safety Gate

- [x] Audit the repository for old-domain references and domain-dependent configuration.
- [x] Confirm the worktree before making migration changes.
- [x] Confirm there is no `vercel.json` or repository-managed DNS configuration.
- [x] Record external actions that require Vercel, DNS, Resend, or Google Search Console access.

## Phase 1: Update Domain Configuration

- [x] Change `siteConfig.url` to `https://anhnguyendev.tech`.
- [x] Update the `www` redirect in `next.config.ts`.
- [x] Verify generated `metadataBase` and canonical URLs through the production build.
- [x] Verify Open Graph, Twitter, JSON-LD, sitemap, robots.txt, and RSS consumers through the production build.

## Phase 2: Update Direct References

- [x] Update project live links in `constants/projects.tsx`.
- [x] Update links and branding in the transactional email templates.
- [ ] Verify the new domain with Resend before changing `CONTACT_FROM_EMAIL`.
- [x] Update the CV source files and regenerate the PDF.
- [x] Update README and relevant documentation references.

The `CONTACT_FROM_EMAIL` fallback remains unchanged until `anhnguyendev.tech` is verified as a sending domain in Resend.

## Phase 3: Verify URL Paths

- [x] Confirm all locale prefixes are preserved by the production route build.
- [x] Confirm blog paths remain unchanged by the production route build.
- [x] Verify the quiz project path, especially `/en/work/quiz-system`.
- [x] Keep individual project URLs mapped to their matching paths rather than the homepage.

## Phase 4: Local Validation

- [x] Search the repository for `anhnguyendev.me` and `www.anhnguyendev.me`.
- [x] Run linting and TypeScript checks through the successful production build.
- [ ] Run unit tests and the production build. Production build passed; existing contact-rate-limit tests fail because they call `sendEmail` with an outdated two-argument signature.
- [x] Inspect `/en`, `/vi`, `/en/blog`, and `/en/work` through the production route build.
- [x] Inspect generated sitemap, robots, and RSS consumers through the production build.
- [x] Check canonical, Open Graph, Twitter, and JSON-LD consumers through the production build.

## Phase 5: Vercel and DNS

- [ ] Add `anhnguyendev.tech` to the Vercel project.
- [ ] Add `www.anhnguyendev.tech` if it should resolve.
- [ ] Configure the preferred canonical hostname.
- [ ] Add the required DNS records.
- [ ] Update Vercel environment variables.
- [ ] Verify the Resend sending domain and update `CONTACT_FROM_EMAIL`.

These items require access to the Vercel, DNS, and Resend accounts and cannot be completed from the repository.

## Phase 6: Google Search Console

- [ ] Add and verify `https://anhnguyendev.tech`.
- [ ] Submit `https://anhnguyendev.tech/sitemap.xml`.
- [ ] Use Change of Address only if the old `.me` property remains verified and controllable.
- [ ] Inspect indexing and canonical selection for representative URLs.

## Phase 7: Production Verification

- [ ] Test HTTP to HTTPS behavior.
- [ ] Test root and `www` hostname behavior.
- [ ] Confirm locale redirects preserve paths.
- [ ] Test blog URLs, CV downloads, project links, contact emails, and RSS links.
- [ ] Confirm the sitemap contains only `.tech` URLs.
- [ ] Monitor Search Console coverage and crawl errors after deployment.

## Completion Criteria

The migration is complete when:

1. No active application code emits `.me` URLs.
2. Canonical, Open Graph, JSON-LD, sitemap, robots.txt, and RSS output use `.tech`.
3. Existing page paths continue to resolve correctly.
4. The new Vercel domain and DNS configuration are verified.
5. The new sitemap is submitted in Google Search Console.
6. Production smoke tests and automated checks pass.

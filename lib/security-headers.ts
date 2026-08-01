/**
 * Security headers applied to every route.
 *
 * CSP strategy: ship `Content-Security-Policy-Report-Only` in production by
 * default. After a week of low-violation reports, set `CSP_ENFORCE=1` in
 * Vercel env to flip to `Content-Security-Policy` (enforced).
 *
 * The policy is intentionally permissive:
 *   - `'unsafe-inline'` in `script-src`/`style-src` is required because the
 *     codebase uses inline hydration scripts (Next.js), JSON-LD via
 *     `dangerouslySetInnerHTML`, and inline `style={{...}}` in 18+ places.
 *     Tightening to nonces/SRI hashes is a follow-up, not a one-day change.
 *   - `'unsafe-eval'` is dev-only because Vercel Analytics uses eval in
 *     dev mode for HMR.
 *   - `va.vercel-scripts.com` is dev-only — Vercel serves the analytics
 *     script same-origin in production under `/_vercel/insights/script.js`.
 */

const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_TEST = process.env.NODE_ENV === 'test'

/**
 * Build the CSP directive body. Dev and prod differ only in two places:
 *   1. dev adds `'unsafe-eval'` for Next.js/HMR
 *   2. dev allowlists `va.vercel-scripts.com` for Vercel Analytics debug
 */
function buildCsp(): string {
  const scriptSrc = IS_DEV
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com"
    : "'self' 'unsafe-inline'"

  const styleSrc = "'self' 'unsafe-inline'"

  const imgSrc = "'self' data:"

  const connectSrc = IS_DEV
    ? "'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com"
    : "'self' https://vitals.vercel-insights.com"

  return [
    'default-src \'self\'',
    `script-src ${scriptSrc}`,
    'script-src-elem \'self\' \'unsafe-inline\'',
    'script-src-attr \'unsafe-inline\'',
    `style-src ${styleSrc}`,
    'style-src-elem \'self\' \'unsafe-inline\'',
    'style-src-attr \'unsafe-inline\'',
    `img-src ${imgSrc}`,
    'font-src \'self\'',
    `connect-src ${connectSrc}`,
    'frame-ancestors \'none\'',
    'form-action \'self\'',
    'base-uri \'self\'',
    'object-src \'none\'',
    'upgrade-insecure-requests',
  ].join('; ')
}

/**
 * Headers that ship regardless of CSP mode.
 * `Strict-Transport-Security` is intentionally only set in production — its
 * semantic ("always use HTTPS") makes no sense over plain HTTP localhost.
 */
function buildSecurityHeaders(): { key: string; value: string }[] {
  const csp = buildCsp()
  const enforce = process.env.CSP_ENFORCE === '1'
  const cspHeader = enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only'
  const reportUri = process.env.CSP_REPORT_URI

  const headers: { key: string; value: string }[] = [
    { key: cspHeader, value: reportUri ? `${csp}; report-uri ${reportUri}` : csp },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ]

  if (!IS_DEV && !IS_TEST) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    })
  }

  return headers
}

/**
 * Next.js Header shape. The `headers()` function in `next.config.ts` returns
 * `[{ source, headers: [{ key, value }] }]`. Most rules apply to `/(.*)` —
 * the static `/_next/*` and `/api/*` paths are already covered.
 */
export const securityHeaders = buildSecurityHeaders()

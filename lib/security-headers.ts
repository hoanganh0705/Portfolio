const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_TEST = process.env.NODE_ENV === 'test'

// CSP là một danh sách luật nói cho browser biết: "Website này được phép load/chạy tài nguyên từ đâu và kiểu gì."
// script-src: chỉ định nguồn cho các script (JS) mà trang web có thể tải và thực thi.
// style-src: chỉ định nguồn cho các style (CSS) mà trang web có thể tải và áp dụng.
// img-src: chỉ định nguồn cho các hình ảnh mà trang web có thể tải và hiển thị.
// connect-src: chỉ định nguồn cho các kết nối mạng (ví dụ: fetch, XHR, WebSocket) mà trang web có thể thực hiện.
// frame-ancestors: chỉ định các nguồn mà trang web có thể được nhúng vào (ví dụ: trong iframe).
// form-action: chỉ định các nguồn mà form trên trang web có thể gửi dữ liệu đến.
// base-uri: chỉ định nguồn cho thẻ <base> trong HTML.
// object-src: chỉ định nguồn cho các đối tượng (ví dụ: <object>, <embed>, <applet>) mà trang web có thể tải.
// upgrade-insecure-requests: yêu cầu trình duyệt tự động nâng cấp các yêu cầu HTTP không an toàn lên HTTPS.
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
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "script-src-elem 'self' 'unsafe-inline'",
    "script-src-attr 'unsafe-inline'",
    `style-src ${styleSrc}`,
    "style-src-elem 'self' 'unsafe-inline'",
    "style-src-attr 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self'",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

function buildSecurityHeaders(): {
  key: string
  value: string
}[] {
  const csp = buildCsp()
  const enforce = process.env.CSP_ENFORCE === '1'
  const cspHeader = enforce
    ? 'Content-Security-Policy'
    : 'Content-Security-Policy-Report-Only'
  const reportUri = process.env.CSP_REPORT_URI

  const headers: { key: string; value: string }[] = [
    {
      key: cspHeader,
      value: reportUri
        ? `${csp}; report-uri ${reportUri}`
        : csp,
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value:
        'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
    {
      key: 'Cross-Origin-Opener-Policy',
      value: 'same-origin',
    },
    {
      key: 'Cross-Origin-Resource-Policy',
      value: 'same-origin',
    },
  ]

  if (!IS_DEV && !IS_TEST) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    })
  }

  return headers
}

export const securityHeaders = buildSecurityHeaders()

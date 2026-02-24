import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'vi']
const defaultLocale = 'vi'

function getPreferredLocale(request: NextRequest): string {
  // 1. Cookie preference
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (cookie && locales.includes(cookie)) return cookie

  // 2. Accept-Language header
  const accept = request.headers.get('Accept-Language')
  if (accept) {
    const preferred = accept
      .split(',')
      .map((l) => l.split(';')[0].trim().substring(0, 2))
    for (const lang of preferred) {
      if (locales.includes(lang)) return lang
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already starts with a locale
  const hasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) ||
      pathname === `/${locale}`,
  )

  if (hasLocale) return

  // Redirect to locale-prefixed URL
  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|assets|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest).*)',
  ],
}

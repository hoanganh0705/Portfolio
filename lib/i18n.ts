export const defaultLocale = 'vi' as const
export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale)
}

import type { Locale } from './i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  vi: () => import('@/dictionaries/vi.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}

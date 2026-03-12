import type { Locale } from './i18n'
import type { Dictionary } from '@/types/dictionary'

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default as Dictionary),
  vi: () => import('@/dictionaries/vi.json').then((m) => m.default as Dictionary),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

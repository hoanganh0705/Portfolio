'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import type { Locale } from './i18n'
import type { Dictionary } from '@/types/dictionary'

interface LocaleContextValue {
  locale: Locale
  dict: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  dict,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a <LocaleProvider>. Wrap your component tree with <LocaleProvider>.')
  }
  return context
}

'use client'

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import type { Locale } from './i18n'

interface LocaleContextValue {
  locale: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: Record<string, any>
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  dict: {},
})

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

export function useLocale() {
  return useContext(LocaleContext)
}

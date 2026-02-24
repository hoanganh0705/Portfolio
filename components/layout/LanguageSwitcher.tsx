'use client'

import { useLocale } from '@/lib/locale-context'
import { usePathname, useRouter } from 'next/navigation'

interface LanguageSwitcherProps {
  scrolled: boolean
}

export function LanguageSwitcher({
  scrolled,
}: LanguageSwitcherProps) {
  const { locale } = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'vi' : 'en'
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    // Replace the current locale prefix with the new one
    const newPath = pathname.replace(
      `/${locale}`,
      `/${newLocale}`,
    )
    router.push(newPath)
  }

  return (
    <button
      onClick={switchLocale}
      className={`font-medium text-sm px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
        scrolled
          ? 'border-primary/30 text-primary hover:bg-primary/10'
          : 'border-accent-default/30 text-accent-default hover:bg-accent-default/10'
      }`}
      aria-label={
        locale === 'en'
          ? 'Switch to Vietnamese'
          : 'Switch to English'
      }
    >
      {locale === 'en' ? 'VI' : 'EN'}
    </button>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

// components
import Nav from './Nav'
import MobileNav from './MobileNav'
import PageMascot from './PageMascot'
import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/locale-context'

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false)
  const { locale, dict } = useLocale()

  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, {
      passive: true,
    })
    return () =>
      window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`transition-all duration-300 ease-in-out ${hasScrolled ? 'sticky top-0 left-0 z-50 w-full bg-accent-default/80 py-4 text-primary shadow-lg backdrop-blur-md xl:py-6' : 'bg-transparent py-5 text-foreground sm:py-6 xl:py-12'}`}
    >
      <div className='container mx-auto flex items-center justify-between px-4 sm:px-6 xl:px-0'>
        {/* Logo */}
        <div className='flex min-w-0 items-center'>
          <Link
            href={`/${locale}`}
            className='min-w-0 shrink'
          >
            <span
              className={`whitespace-nowrap font-semibold tracking-tight ${hasScrolled ? 'text-2xl sm:text-3xl' : 'text-2xl sm:text-3xl xl:text-4xl'}`}
            >
              Hoàng Anh
            </span>
          </Link>
          <PageMascot className='ml-1 -translate-y-0.5 sm:ml-2' />
        </div>

        {/* desktop nav & hire me button */}
        <div className='hidden xl:flex items-center gap-8'>
          <Nav scrolled={hasScrolled} />
          <LanguageSwitcher scrolled={hasScrolled} />
          <ThemeToggle scrolled={hasScrolled} />
          <Link href={`/${locale}/contact`}>
            <Button>{dict.common.hireMe}</Button>
          </Link>
        </div>

        {/* mobile nav */}
        <div className='flex items-center gap-1 sm:gap-2 xl:hidden'>
          <ThemeToggle scrolled={hasScrolled} />
          <MobileNav scrolled={hasScrolled} />
        </div>
      </div>
    </header>
  )
}

export default Header

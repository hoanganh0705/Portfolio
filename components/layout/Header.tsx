'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

// components
import Nav from './Nav'
import MobileNav from './MobileNav'
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
      className={` transition-all duration-300 ease-in-out ${hasScrolled ? 'sticky top-0 left-0 w-full z-50 bg-accent-default/80 shadow-lg backdrop-blur-md py-4 xl:py-6 text-primary ' : 'bg-transparent py-8 xl:py-12 text-foreground'}`}
    >
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <Link href={`/${locale}`}>
          <span
            className={`font-semibold  ${hasScrolled ? 'text-3xl' : 'text-4xl'}`}
          >
            Hoàng Anh
            <span className='text-accent-default'>.</span>
          </span>
        </Link>

        {/* desktop nav & hire me button */}
        <div className='hidden xl:flex items-center gap-8'>
          <Nav scrolled={hasScrolled} />
          <LanguageSwitcher scrolled={hasScrolled} />
          <ThemeToggle scrolled={hasScrolled} />
          <Link href={`/${locale}/contact`}>
            <Button className=''>
              {dict.common.hireMe}
            </Button>
          </Link>
        </div>

        {/* mobile nav */}
        <div className='xl:hidden flex items-center gap-3'>
          <LanguageSwitcher scrolled={hasScrolled} />
          <ThemeToggle scrolled={hasScrolled} />
          <MobileNav scrolled={hasScrolled} />
        </div>
      </div>
    </header>
  )
}

export default Header

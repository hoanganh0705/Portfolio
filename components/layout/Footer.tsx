'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'
import Social from '@/components/home/Social'

const Footer = () => {
  const { locale, dict } = useLocale()
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/resume`, label: dict.nav.resume },
    { href: `/${locale}/work`, label: dict.nav.work },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ]

  return (
    <footer className='border-t border-border bg-secondary/30'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Brand */}
          <div className='space-y-4'>
            <Link href={`/${locale}`}>
              <h2 className='text-2xl font-semibold'>
                Hoàng Anh
                <span className='text-accent-default'>
                  .
                </span>
              </h2>
            </Link>
            <p className='text-sm text-muted-foreground leading-relaxed max-w-xs'>
              {dict.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-foreground'>
              {dict.footer.quickLinks}
            </h3>
            <nav aria-label='Footer navigation'>
              <ul className='space-y-2'>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-sm text-muted-foreground hover:text-accent-default transition-colors capitalize'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-foreground'>
              {dict.footer.connect}
            </h3>
            <Social
              containerStyles='flex gap-4'
              iconStyles='w-9 h-9 border border-accent-default rounded-full flex justify-center items-center text-accent-default text-base hover:bg-accent-default hover:text-primary hover:transition-all duration-500'
            />
            <p className='text-sm text-muted-foreground'>
              {dict.footer.email}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-xs text-muted-foreground'>
            &copy; {currentYear} Anh Nguyen Dev.{' '}
            {dict.footer.rights}
          </p>
          <p className='text-xs text-muted-foreground'>
            {dict.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

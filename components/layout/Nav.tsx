'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/lib/locale-context'

type NavProps = { scrolled: boolean }

const Nav = ({ scrolled }: NavProps) => {
  const pathname = usePathname()
  const { locale, dict } = useLocale()

  const links = [
    { name: dict.nav.home, path: `/${locale}` },
    { name: dict.nav.resume, path: `/${locale}/resume` },
    { name: dict.nav.work, path: `/${locale}/work` },
    { name: dict.nav.blog, path: `/${locale}/blog` },
    {
      name: dict.nav.contact,
      path: `/${locale}/contact`,
    },
  ]

  return (
    <nav className='flex gap-8'>
      {links.map((link) => {
        const isActive =
          link.path === pathname ||
          (link.path === `/${locale}` &&
            pathname === `/${locale}/`)

        const activeClasses = isActive
          ? scrolled
            ? 'text-primary border-b-2 border-primary hover:text-primary/80'
            : 'text-accent-default border-b-2 border-accent-default hover:text-accent-hover'
          : ''

        return (
          <Link
            key={link.path}
            href={link.path}
            className={`capitalize font-medium transition-all ${activeClasses} ${scrolled ? 'text-primary/80 hover:text-primary hover:text-base font-bold transition-all' : 'text-foreground hover:text-accent-hover'}`}
          >
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}

export default Nav

'use client'

import { links } from '@/constants/navLinks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavProps = { scrolled: boolean }

const Nav = ({ scrolled }: NavProps) => {
  const pathname = usePathname()

  return (
    <nav className='flex gap-8'>
      {links.map((link) => {
        const isActive = link.path === pathname

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

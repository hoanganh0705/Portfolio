'use client'

import Link from 'next/link'
import { FiChevronRight, FiHome } from 'react-icons/fi'
import { useLocale } from '@/lib/locale-context'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: Props) {
  const { locale } = useLocale()

  return (
    <nav
      aria-label='Breadcrumb'
      className='mb-6 flex items-center gap-1.5 text-sm text-muted-foreground overflow-x-auto'
    >
      <Link
        href={`/${locale}`}
        className='flex items-center gap-1 hover:text-accent-default transition-colors shrink-0'
      >
        <FiHome size={14} />
        <span className='sr-only'>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span
            key={index}
            className='flex items-center gap-1.5 min-w-0'
          >
            <FiChevronRight
              size={12}
              className='shrink-0 text-muted-foreground/50'
            />
            {isLast || !item.href ? (
              <span className='text-foreground font-medium truncate'>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className='hover:text-accent-default transition-colors shrink-0'
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

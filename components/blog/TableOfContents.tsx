'use client'

import { useEffect, useState } from 'react'
import { FiList } from 'react-icons/fi'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the article content
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll('h2, h3, h4')
    const items: TocItem[] = []

    elements.forEach((el) => {
      // Generate ID from text content if not present
      const text =
        el.textContent?.replace(/\*\*/g, '').trim() || ''
      if (!text) return

      let id = el.id
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        el.id = id
      }

      items.push({
        id,
        text,
        level:
          el.tagName === 'H2'
            ? 2
            : el.tagName === 'H3'
              ? 3
              : 4,
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that is intersecting
        const visible = entries.find(
          (e) => e.isIntersecting,
        )
        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className='space-y-1'>
      <div className='flex items-center gap-2 mb-4 text-muted-foreground'>
        <FiList size={16} />
        <span className='text-xs font-semibold uppercase tracking-wider'>
          On this page
        </span>
      </div>
      <ul className='space-y-1'>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(heading.id)
                  ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
              }}
              className={`block text-sm leading-relaxed transition-all duration-200 border-l-2 ${
                heading.level === 3
                  ? 'pl-5'
                  : heading.level === 4
                    ? 'pl-7'
                    : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'border-accent-default text-accent-default font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground/70 hover:border-border'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

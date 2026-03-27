'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiX,
} from 'react-icons/fi'
import type { PostMetadata } from '@/lib/getPosts'
import type { Locale } from '@/lib/i18n'
import { useLocale } from '@/lib/locale-context'
import { useEffect } from 'react'

interface Props {
  posts: PostMetadata[]
  locale: Locale
}

export function BlogPostGridClient({
  posts,
  locale,
}: Props) {
  const { dict } = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(
    () => searchParams.get('q') ?? '',
  )
  const [activeCategory, setActiveCategory] = useState<
    string | null
  >(null)

  useEffect(() => {
    const currentQ = searchParams.get('q') ?? ''
    const nextQ = search.trim()
    if (currentQ === nextQ) return

    const params = new URLSearchParams(
      searchParams.toString(),
    )
    if (nextQ) {
      params.set('q', nextQ)
    } else {
      params.delete('q')
    }

    const queryString = params.toString()
    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false },
    )
  }, [search, pathname, router, searchParams])

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category))]
    return cats.sort()
  }, [posts])

  const filtered = useMemo(() => {
    let result = posts

    if (activeCategory) {
      result = result.filter(
        (p) => p.category === activeCategory,
      )
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    return result
  }, [posts, search, activeCategory])

  return (
    <div>
      {/* Search & Filters */}
      <div className='mb-8 space-y-4'>
        {/* Search bar */}
        <div className='relative max-w-md'>
          <FiSearch
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.blog.searchPlaceholder}
            className='w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-default/50 focus:border-accent-default transition-colors'
            aria-label={dict.blog.searchPlaceholder}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
              aria-label='Clear search'
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === null
                ? 'bg-accent-default text-primary'
                : 'bg-foreground/5 text-muted-foreground border border-border hover:border-accent-default/50 hover:text-accent-default'
            }`}
          >
            {dict.blog.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(
                  activeCategory === cat ? null : cat,
                )
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-accent-default text-primary'
                  : 'bg-foreground/5 text-muted-foreground border border-border hover:border-accent-default/50 hover:text-accent-default'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || activeCategory) && (
        <p className='text-sm text-muted-foreground mb-4'>
          {filtered.length} {dict.blog.resultsFound}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-muted-foreground'>
            {dict.blog.noResults}
          </p>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((post) => (
            <Link
              href={`/${locale}/blog/${post.slug}`}
              key={post.slug}
              className='group'
            >
              <div className='h-full flex flex-col rounded-xl border border-border bg-foreground/5 p-6 transition-all duration-300 hover:border-accent-default/50 hover:bg-accent-default/5 hover:shadow-lg hover:shadow-accent-default/5'>
                <div className='pb-3'>
                  <span className='inline-flex items-center rounded-full bg-accent-default/20 px-3 py-1 text-xs font-medium text-accent-default'>
                    {post.category}
                  </span>
                </div>
                <div className='flex-1 pb-4'>
                  <h3 className='text-lg font-bold text-foreground mb-2 transition-colors dark:group-hover:text-accent-default line-clamp-2'>
                    {post.title}
                  </h3>
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {post.excerpt}
                  </p>
                </div>
                <div className='flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4'>
                  <div className='flex items-center gap-1'>
                    <FiCalendar size={14} />
                    {new Date(post.date).toLocaleDateString(
                      locale === 'vi' ? 'vi-VN' : 'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      },
                    )}
                  </div>
                  <div className='flex items-center gap-1'>
                    <FiClock size={14} />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

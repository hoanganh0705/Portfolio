import 'server-only'

import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import type { Locale, locales as localeValues } from './i18n'

const contentRoot = path.join(process.cwd(), 'content')

// Allowed locales for filesystem access (1.6 — prevent directory traversal)
const ALLOWED_LOCALES: readonly string[] = ['en', 'vi']

export interface PostMetadata {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  featured?: boolean
}

/** Validates and coerces raw frontmatter data from gray-matter (3.6) */
function parseFrontmatter(
  data: Record<string, unknown>,
  slug: string,
): Omit<PostMetadata, 'slug'> {
  const dateStr = typeof data.date === 'string' ? data.date : '1970-01-01'
  const parsedDate = new Date(dateStr)
  const safeDate = isNaN(parsedDate.getTime()) ? '1970-01-01' : dateStr

  return {
    title: typeof data.title === 'string' ? data.title : slug,
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : 'No excerpt',
    category: typeof data.category === 'string' ? data.category : 'General',
    date: safeDate,
    readTime: typeof data.readTime === 'string' ? data.readTime : '5 min read',
    featured: data.featured === true,
  }
}

// Wrapped in React.cache to deduplicate within a single render (2.4)
export const getAllPosts = cache(async (locale: Locale = 'en'): Promise<PostMetadata[]> => {
  // Validate locale to prevent filesystem probing (1.6)
  if (!ALLOWED_LOCALES.includes(locale)) {
    return []
  }

  const postsDirectory = path.join(contentRoot, locale)
  try {
    await fs.access(postsDirectory)
  } catch {
    return []
  }

  const files = await fs.readdir(postsDirectory)
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        const filePath = path.join(postsDirectory, file)
        const fileContents = await fs.readFile(filePath, 'utf8')
        const { data } = matter(fileContents)
        const parsed = parseFrontmatter(data, slug)

        return {
          slug,
          ...parsed,
        }
      })
  )

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

export async function getFeaturedPosts(
  locale: Locale = 'en',
  limit = 3
): Promise<PostMetadata[]> {
  const allPosts = await getAllPosts(locale)
  const featured = allPosts.filter((post) => post.featured)
  return featured.length > 0
    ? featured.slice(0, limit)
    : allPosts.slice(0, limit)
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 4,
  locale: Locale = 'en'
): Promise<PostMetadata[]> {
  const allPosts = await getAllPosts(locale)
  const sameCategory = allPosts.filter(
    (p) => p.slug !== currentSlug && p.category === category
  )
  const others = allPosts.filter(
    (p) => p.slug !== currentSlug && p.category !== category
  )
  return [...sameCategory, ...others].slice(0, limit)
}

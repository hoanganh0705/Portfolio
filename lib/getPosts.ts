'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Locale } from './i18n'

const contentRoot = path.join(process.cwd(), 'content')

export interface PostMetadata {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  featured?: boolean
}

export async function getAllPosts(locale: Locale = 'en'): Promise<PostMetadata[]> {
  const postsDirectory = path.join(contentRoot, locale)
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const files = fs.readdirSync(postsDirectory)
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(postsDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || 'No excerpt',
        category: data.category || 'General',
        date: data.date || '1970-01-01',
        readTime: data.readTime || '5 min read',
        featured: data.featured === true,
      }
    })

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

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

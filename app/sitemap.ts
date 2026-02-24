import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { getAllPosts } from '@/lib/getPosts'
import { locales } from '@/lib/i18n'

const url = siteConfig.url

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/resume', '/work', '/contact', '/blog']

  // Generate entries for each locale × static route
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap(
    (locale) =>
      staticRoutes.map((route) => ({
        url: `${url}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: (route === '' ? 'weekly' : route === '/contact' ? 'yearly' : 'monthly') as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: route === '' ? 1.0 : route === '/resume' ? 0.9 : 0.8,
      })),
  )

  // Generate blog post entries for each locale
  const blogEntries: MetadataRoute.Sitemap = (
    await Promise.all(
      locales.map(async (locale) => {
        const posts = await getAllPosts(locale)
        return posts.map((post) => ({
          url: `${url}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly' as const,
          priority: post.featured ? 0.8 : 0.7,
        }))
      }),
    )
  ).flat()

  return [...staticEntries, ...blogEntries]
}
import { siteConfig } from '@/lib/site-config'
import { getAllPosts } from '@/lib/getPosts'
import { locales, type Locale } from '@/lib/i18n'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const allItems: string[] = []

  for (const locale of locales) {
    const posts = await getAllPosts(locale as Locale)
    for (const post of posts) {
      const url = `${siteConfig.url}/${locale}/blog/${post.slug}`
      allItems.push(`
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>`)
    }
  }

  // Sort by date (newest first)
  allItems.sort((a, b) => {
    const dateA = a.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? ''
    const dateB = b.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? ''
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/en/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/icon</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${siteConfig.url}</link>
    </image>${allItems.join('')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

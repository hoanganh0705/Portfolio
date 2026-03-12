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

interface FeedItem {
  title: string
  url: string
  excerpt: string
  date: string
  category: string
}

export async function GET() {
  try {
    const allItems: FeedItem[] = []

    for (const locale of locales) {
      const posts = await getAllPosts(locale as Locale)
      for (const post of posts) {
        allItems.push({
          title: post.title,
          url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
          excerpt: post.excerpt,
          date: post.date,
          category: post.category,
        })
      }
    }

    // Sort data objects by date before XML generation (2.6)
    allItems.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/en/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/icon</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${siteConfig.url}</link>
    </image>${allItems.map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escapeXml(item.excerpt)}</description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <category>${escapeXml(item.category)}</category>
    </item>`).join('')}
  </channel>
</rss>`

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

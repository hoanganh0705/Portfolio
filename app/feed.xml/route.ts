// this file is RSS feed generator for the blog posts, it will be generated at build time and served as a static file
// When someone visits /feed.xml, this file will be executed and get all the blog posts, sort them by date, and generate an RSS feed in XML format and then sent to the RSS reader. The RSS feed will be cached for 1 hour (3600 seconds) and then regenerated on the next request after the cache expires. This is done to reduce the load on the server and improve performance. The RSS feed will include all the blog posts in all the locales, sorted by date in descending order (newest first). The RSS feed will include the title, link, description, publication date, and category of each blog post. The RSS feed will also include the site name, site URL, site description, and site icon.

import { siteConfig } from '@/lib/site-config'
import { getAllPosts } from '@/lib/getPosts'
import { locales, type Locale } from '@/lib/i18n'

// we need to escape the XML special characters in the title, description, and category of the blog posts to avoid breaking the XML structure. The special characters are: & < > " '
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
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    )

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/en/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/icon</url>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${siteConfig.url}</link>
    </image>${allItems
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escapeXml(item.excerpt)}</description>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <category>${escapeXml(item.category)}</category>
    </item>`,
      )
      .join('')}
  </channel>
</rss>`

    return new Response(feed, {
      headers: {
        'Content-Type':
          'application/rss+xml; charset=utf-8',
        'Cache-Control':
          'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}

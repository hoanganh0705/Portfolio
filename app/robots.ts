import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// robot file is used to instuct search engine crawlers on how to crawl and index the website. It provides rules for different user agents, specifying which parts of the site should be allowed or disallowed for crawling. Additionally, it includes the location of the sitemap and the host URL for better indexing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/', // this means that all pages of the website are allowed to be crawled and indexed by search engines.
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}

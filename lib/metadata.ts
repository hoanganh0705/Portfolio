import type { Metadata } from 'next'
import { siteConfig } from './site-config'

interface MetadataParams {
  title: string
  description?: string
  keywords?: string[]
  ogImage?: string
  path?: string
}

/** Base keywords that should appear on every page for brand recognition */
const brandKeywords = [
  'anh nguyen dev',
  'anhnguyendev',
  'nguyen hoang anh',
  'anh nguyen developer',
]

export const createMetadata = ({
  title,
  description,
  keywords,
  ogImage,
  path = '',
}: MetadataParams): Metadata => {
  const fullTitle = `${title} | ${siteConfig.name}`
  const desc = description || siteConfig.description
  const image = ogImage || siteConfig.defaultOgImage
  const canonicalUrl = `${siteConfig.url}${path}`

  return {
    title: fullTitle,
    description: desc,
    keywords: [...brandKeywords, ...(keywords || [])],
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
      locale: siteConfig.locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [image],
      creator: `@${siteConfig.author.name}`,
    },
  }
}
import type { Metadata } from 'next'
import { siteConfig } from './site-config'

interface MetadataParams {
  title: string
  description?: string
  keywords?: string[]
  ogImage?: string
  path?: string
  locale?: string
}

/** Base keywords that should appear on every page for brand recognition */
const brandKeywords = [
  'Nguyễn Hoàng Anh',
  'Anh Nguyen',
  'anhnguyendev',
  'Full-Stack Developer',
  'full stack developer',
  'nguyen hoang anh',
  'anh nguyen developer',
]

export const createMetadata = ({
  title,
  description,
  keywords,
  ogImage,
  path = '',
  locale,
}: MetadataParams): Metadata => {
  const fullTitle = `${title} | ${siteConfig.name}`
  const desc = description || siteConfig.description
  const image = ogImage || siteConfig.defaultOgImage
  const localePath = locale ? `/${locale}${path}` : path
  const canonicalUrl = `${siteConfig.url}${localePath}`
  const pageLocale = locale === 'vi' ? 'vi_VN' : 'en_US'
  const xDefaultUrl = `${siteConfig.url}/en${path}`

  return {
    title: fullTitle,
    description: desc,
    keywords: [...brandKeywords, ...(keywords || [])],
    authors: [
      { name: siteConfig.author.name, url: siteConfig.url },
    ],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        vi: `${siteConfig.url}/vi${path}`,
        'x-default': xDefaultUrl,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
      locale: pageLocale,
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
    },
  }
}

import { notFound } from 'next/navigation'
import { PostDetailLayout } from '@/components/blog/PostDetailLayout'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import {
  getRelatedPosts,
  getAllPosts,
} from '@/lib/getPosts'
import type { Locale } from '@/lib/i18n'

export const dynamicParams = false

export async function generateStaticParams({
  params,
}: {
  params: { locale: string }
}) {
  const posts = await getAllPosts(params.locale as Locale)
  return posts.map((post) => ({
    id: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params

  try {
    const { metadata } = await loadMdx(locale, id)

    if (!metadata) {
      return {
        title: `Blog | ${siteConfig.name}`,
        description: siteConfig.description,
      }
    }

    const postUrl = `${siteConfig.url}/${locale}/blog/${id}`

    return {
      title: `${metadata.title} | ${siteConfig.name}`,
      description: metadata.excerpt,
      keywords: [
        metadata.category,
        'blog',
        'tutorial',
        'programming',
        'tech',
      ],
      authors: [{ name: metadata.author }],
      creator: metadata.author,
      publisher: siteConfig.author.name,
      openGraph: {
        title: metadata.title,
        description: metadata.excerpt,
        url: postUrl,
        siteName: siteConfig.name,
        type: 'article',
        locale:
          locale === 'vi' ? 'vi_VN' : siteConfig.locale,
        images: metadata.image
          ? [
              {
                url: metadata.image.startsWith('http')
                  ? metadata.image
                  : `${siteConfig.url}${metadata.image}`,
                width: 1200,
                height: 600,
                alt: metadata.title,
              },
            ]
          : [],
        publishedTime: new Date(
          metadata.date,
        ).toISOString(),
        authors: [metadata.author],
        tags: [metadata.category],
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.excerpt,
        images: metadata.image
          ? [
              metadata.image.startsWith('http')
                ? metadata.image
                : `${siteConfig.url}${metadata.image}`,
            ]
          : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: postUrl,
        languages: {
          en: `${siteConfig.url}/en/blog/${id}`,
          vi: `${siteConfig.url}/vi/blog/${id}`,
        },
      },
    }
  } catch {
    return {
      title: `Blog | ${siteConfig.name}`,
      description: siteConfig.description,
    }
  }
}

// Cache the MDX import so generateMetadata and the page component share one load (2.5)
const loadMdx = async (locale: string, id: string) => {
  const mod = await import(`@/content/${locale}/${id}.mdx`)
  return { default: mod.default, metadata: mod.metadata }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  let PostComponent
  let metadata

  try {
    const mod = await loadMdx(locale, id)
    PostComponent = mod.default
    metadata = mod.metadata
  } catch {
    notFound()
  }

  if (!PostComponent || !metadata) notFound()

  const recommendations = await getRelatedPosts(
    id,
    metadata.category,
    4,
    locale as Locale,
  )

  const postUrl = `${siteConfig.url}/${locale}/blog/${id}`
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.excerpt,
    image: metadata.image
      ? metadata.image.startsWith('http')
        ? metadata.image
        : `${siteConfig.url}${metadata.image}`
      : siteConfig.defaultOgImage,
    datePublished: new Date(metadata.date).toISOString(),
    author: {
      '@type': 'Person',
      name: metadata.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    inLanguage: locale === 'vi' ? 'vi-VN' : 'en-US',
    articleSection: metadata.category,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteConfig.url}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: metadata.title,
        item: postUrl,
      },
    ],
  }

  return (
    <>
      <script
        id={`article-jsonld-${id}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <script
        id={`breadcrumb-jsonld-${id}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <PostDetailLayout
        metadata={metadata}
        slug={id}
        recommendations={recommendations}
      >
        <PostComponent />
      </PostDetailLayout>
    </>
  )
}

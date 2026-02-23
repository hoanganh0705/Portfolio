import { notFound } from 'next/navigation'
import { PostDetailLayout } from '@/components/blog/PostDetailLayout'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { getRelatedPosts } from '@/lib/getPosts'

export const dynamicParams = false

export async function generateStaticParams() {
  const { getAllPosts } = await import('@/lib/getPosts')
  const posts = await getAllPosts()

  return posts.map((post) => ({
    id: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const mod = await import(`@/content/${id}.mdx`)
    const metadata = mod.metadata

    if (!metadata) {
      return {
        title: 'Blog | ' + siteConfig.name,
        description: siteConfig.description,
      }
    }

    const postUrl = `${siteConfig.url}/blog/${id}`

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
        locale: siteConfig.locale,
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
        modifiedTime: new Date(metadata.date).toISOString(),
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
      },
    }
  } catch {
    return {
      title: 'Blog | ' + siteConfig.name,
      description: siteConfig.description,
    }
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let PostComponent
  let metadata

  try {
    const mod = await import(`@/content/${id}.mdx`)
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
  )

  return (
    <PostDetailLayout
      metadata={metadata}
      recommendations={recommendations}
    >
      <PostComponent />
    </PostDetailLayout>
  )
}

import { ImageResponse } from 'next/og'
import { getAllPosts } from '@/lib/getPosts'
import type { Locale } from '@/lib/i18n'

export const alt = 'Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams({
  params,
}: {
  params: { locale: string }
}) {
  const posts = await getAllPosts(params.locale as Locale)
  return posts.map((post) => ({ id: post.slug }))
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  let metadata: {
    title: string
    excerpt: string
    category: string
    author: string
    date: string
    readTime: string
  }

  try {
    const mod = await import(
      `@/content/${locale}/${id}.mdx`
    )
    metadata = mod.metadata
  } catch {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          color: '#fff',
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        Anh Nguyen Dev
      </div>,
      size,
    )
  }

  const formattedDate = new Date(
    metadata.date,
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#00ff99',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: '#1a1a2e',
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#e0e0e0',
            }}
          >
            Anh Nguyen Dev
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 255, 153, 0.15)',
            borderRadius: '9999px',
            padding: '8px 20px',
            fontSize: '18px',
            color: '#00ff99',
            fontWeight: 600,
          }}
        >
          {metadata.category}
        </div>
      </div>

      {/* Title & excerpt */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            color: '#ffffff',
            maxWidth: '900px',
          }}
        >
          {metadata.title}
        </h1>
        <p
          style={{
            fontSize: '22px',
            lineHeight: 1.5,
            margin: 0,
            color: '#b0b0b0',
            maxWidth: '800px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {metadata.excerpt}
        </p>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '18px',
            color: '#a0a0a0',
          }}
        >
          <span>{metadata.author}</span>
          <span>•</span>
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{metadata.readTime}</span>
        </div>
        <span
          style={{
            fontSize: '16px',
            color: '#00ff99',
            fontWeight: 500,
          }}
        >
          anhnguyendev.me
        </span>
      </div>
    </div>,
    size,
  )
}

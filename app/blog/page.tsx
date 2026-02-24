import { Suspense } from 'react'
import { BlogFeaturedPosts } from '@/components/blog/BlogFeaturedPosts'
import { BlogPostGrid } from '@/components/blog/BlogPostGrid'
import { createMetadata } from '@/lib/metadata'

export const metadata = createMetadata({
  title: 'Blog — Thoughts on Development & Technology',
  description:
    'Explore articles about web development, programming, and the latest technology trends. Tips, tutorials, and insights from a full-stack developer.',
  keywords: [
    'blog',
    'web development',
    'programming',
    'tutorial',
    'javascript',
    'react',
    'nextjs',
    'typescript',
  ],
  path: '/blog',
})

// Fallback skeleton for blog post grid
const PostGridFallback = (
  <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className='h-64 rounded-xl border border-border bg-foreground/5 animate-pulse'
      />
    ))}
  </div>
)

const FeaturedFallback = (
  <div className='mb-16'>
    <div className='h-8 w-48 bg-foreground/10 rounded mb-8 animate-pulse' />
    <div className='grid md:grid-cols-3 gap-6'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className='h-52 rounded-xl border border-border bg-foreground/5 animate-pulse'
        />
      ))}
    </div>
  </div>
)

export default function BlogPage() {
  return (
    <section className='min-h-screen'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Hero */}
        <div className='py-12 xl:py-16'>
          <h1 className='text-3xl xl:text-4xl font-bold mb-6'>
            My{' '}
            <span className='text-accent-default'>
              Blog
            </span>
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl leading-relaxed'>
            Thoughts on design, development, and the web.
            Exploring the intersection of thoughtful design
            and robust engineering.
          </p>
        </div>

        {/* Featured Posts */}
        <Suspense fallback={FeaturedFallback}>
          <BlogFeaturedPosts />
        </Suspense>

        {/* All Posts */}
        <section className='pb-16'>
          <h2 className='text-2xl font-bold text-foreground mb-8'>
            All Articles
          </h2>
          <Suspense fallback={PostGridFallback}>
            <BlogPostGrid />
          </Suspense>
        </section>
      </div>
    </section>
  )
}

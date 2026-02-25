import { getAllPosts, PostMetadata } from '@/lib/getPosts'
import type { Locale } from '@/lib/i18n'
import { BlogPostGridClient } from './BlogPostGridClient'

interface Props {
  locale: Locale
}

export async function BlogPostGrid({ locale }: Props) {
  const posts: PostMetadata[] = await getAllPosts(locale)

  if (posts.length === 0) {
    return (
      <section className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
        <p className='text-muted-foreground'>
          No articles found.
        </p>
      </section>
    )
  }

  return (
    <BlogPostGridClient posts={posts} locale={locale} />
  )
}

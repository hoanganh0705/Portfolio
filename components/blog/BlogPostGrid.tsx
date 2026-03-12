import { getAllPosts, PostMetadata } from '@/lib/getPosts'
import type { Locale } from '@/lib/i18n'
import { getDictionary } from '@/lib/dictionaries'
import { BlogPostGridClient } from './BlogPostGridClient'

interface Props {
  locale: Locale
}

export async function BlogPostGrid({ locale }: Props) {
  const [posts, dict] = await Promise.all([
    getAllPosts(locale),
    getDictionary(locale),
  ])

  if (posts.length === 0) {
    return (
      <section className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
        <p className='text-muted-foreground'>
          {dict.blog.noArticles}
        </p>
      </section>
    )
  }

  return (
    <BlogPostGridClient posts={posts} locale={locale} />
  )
}

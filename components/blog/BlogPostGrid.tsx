import Link from 'next/link'
import { FiCalendar, FiClock } from 'react-icons/fi'
import { getAllPosts, PostMetadata } from '@/lib/getPosts'

export async function BlogPostGrid() {
  const posts: PostMetadata[] = await getAllPosts()

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
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.slug}
          className='group'
        >
          <div className='h-full flex flex-col rounded-xl border border-border bg-foreground/5 p-6 transition-all duration-300 hover:border-accent-default/50 hover:bg-accent-default/5 hover:shadow-lg hover:shadow-accent-default/5'>
            <div className='pb-3'>
              <span className='inline-flex items-center rounded-full bg-accent-default/20 px-3 py-1 text-xs font-medium text-accent-default'>
                {post.category}
              </span>
            </div>
            <div className='flex-1 pb-4'>
              <h3 className='text-lg font-bold text-foreground mb-2 transition-colors dark:group-hover:text-accent-default line-clamp-2'>
                {post.title}
              </h3>
              <p className='text-sm text-muted-foreground line-clamp-2'>
                {post.excerpt}
              </p>
            </div>
            <div className='flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4'>
              <div className='flex items-center gap-1'>
                <FiCalendar size={14} />
                {new Date(post.date).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  },
                )}
              </div>
              <div className='flex items-center gap-1'>
                <FiClock size={14} />
                {post.readTime}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

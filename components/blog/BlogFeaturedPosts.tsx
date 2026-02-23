import Link from 'next/link'
import {
  getFeaturedPosts,
  PostMetadata,
} from '@/lib/getPosts'

export async function BlogFeaturedPosts() {
  const posts: PostMetadata[] = await getFeaturedPosts(3)

  if (posts.length === 0) return null

  return (
    <section className='mb-16'>
      <h2 className='text-2xl font-bold text-foreground mb-8'>
        Featured Articles
      </h2>
      <div className='grid md:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.slug}
            className='group'
          >
            <div className='h-full rounded-xl border border-border bg-foreground/5 p-6 transition-all duration-300 hover:border-accent-default/50 hover:bg-accent-default/5 hover:scale-[1.02] hover:-translate-y-1'>
              <div className='flex items-center gap-3 mb-4'>
                <span className='inline-flex items-center rounded-full bg-accent-default/20 px-3 py-1 text-xs font-medium text-accent-default'>
                  {post.category}
                </span>
                <span className='text-muted-foreground/50'>
                  •
                </span>
                <span className='text-xs text-muted-foreground'>
                  {new Date(post.date).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}
                </span>
              </div>
              <h3 className='text-xl font-bold text-foreground mb-3 transition-colors group-hover:text-accent-default'>
                {post.title}
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

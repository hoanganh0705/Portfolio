import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import type { PostMetadata } from '@/lib/getPosts'
import type { Locale } from '@/lib/i18n'

interface Props {
  posts: PostMetadata[]
  locale?: Locale
  readNextLabel?: string
}

export function Recommendations({
  posts,
  locale = 'en',
  readNextLabel = 'Read next',
}: Props) {
  if (posts.length === 0) return null

  return (
    <nav className='space-y-1'>
      <div className='flex items-center gap-2 mb-4 text-muted-foreground'>
        <FiArrowRight size={16} />
        <span className='text-xs font-semibold uppercase tracking-wider'>
          {readNextLabel}
        </span>
      </div>
      <ul className='space-y-4'>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className='group block rounded-lg border border-border/50 bg-foreground/2 p-3 transition-all duration-200 hover:border-accent-default/30 hover:bg-accent-default/5'
            >
              <span className='inline-flex items-center rounded-full bg-accent-default/15 px-2 py-0.5 text-[10px] font-medium text-accent-default mb-2'>
                {post.category}
              </span>
              <h4 className='text-sm font-medium text-muted-foreground leading-snug group-hover:text-accent-default transition-colors line-clamp-2'>
                {post.title}
              </h4>
              <p className='text-xs text-muted-foreground/70 mt-1.5 line-clamp-2'>
                {post.excerpt}
              </p>
              <div className='flex items-center gap-2 mt-2 text-[10px] text-muted-foreground/60'>
                <span>{post.readTime}</span>
                <span>•</span>
                <span>
                  {new Date(post.date).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

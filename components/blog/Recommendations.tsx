import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import type { PostMetadata } from '@/lib/getPosts'

interface Props {
  posts: PostMetadata[]
}

export function Recommendations({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <nav className='space-y-1'>
      <div className='flex items-center gap-2 mb-4 text-white/60'>
        <FiArrowRight size={16} />
        <span className='text-xs font-semibold uppercase tracking-wider'>
          Read next
        </span>
      </div>
      <ul className='space-y-4'>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className='group block rounded-lg border border-white/5 bg-white/2 p-3 transition-all duration-200 hover:border-accent-default/30 hover:bg-accent-default/5'
            >
              <span className='inline-flex items-center rounded-full bg-accent-default/15 px-2 py-0.5 text-[10px] font-medium text-accent-default mb-2'>
                {post.category}
              </span>
              <h4 className='text-sm font-medium text-white/70 leading-snug group-hover:text-accent-default transition-colors line-clamp-2'>
                {post.title}
              </h4>
              <p className='text-xs text-white/30 mt-1.5 line-clamp-2'>
                {post.excerpt}
              </p>
              <div className='flex items-center gap-2 mt-2 text-[10px] text-white/25'>
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

'use client'

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import { AuthorAvatar } from './AuthorAvatar'
import { TableOfContents } from './TableOfContents'
import { Recommendations } from './Recommendations'
import type { PostMetadata } from '@/lib/getPosts'

export interface Frontmatter {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  author: string
  authorImage: string
  image?: string
}

interface Props {
  metadata: Frontmatter
  children: ReactNode
  recommendations?: PostMetadata[]
}

export function PostDetailLayout({
  metadata,
  children,
  recommendations = [],
}: Props) {
  const formatted = new Date(
    metadata.date,
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className='min-h-screen'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Back button — full width */}
        <Link href='/blog'>
          <Button
            variant='outline'
            className='mb-8 -ml-2 cursor-pointer border-white/10 text-accent-default hover:bg-accent-default/10 hover:text-accent-hover'
          >
            <FiArrowLeft size={20} className='mr-2' />
            Back to Articles
          </Button>
        </Link>

        {/* 3-column grid */}
        <div className='grid grid-cols-1 xl:grid-cols-[220px_1fr_220px] gap-8'>
          {/* Left sidebar — TOC */}
          <aside className='hidden xl:block'>
            <div className='sticky top-24'>
              <TableOfContents />
            </div>
          </aside>

          {/* Center — Main content */}
          <article className='min-w-0 max-w-3xl mx-auto w-full'>
            {/* Header */}
            <div className='mb-8'>
              <div className='flex flex-wrap items-center gap-3 mb-4'>
                <span className='inline-flex items-center rounded-full bg-accent-default/20 px-3 py-1 text-xs font-medium text-accent-default'>
                  {metadata.category}
                </span>
                <span className='text-sm text-white/40'>
                  •
                </span>
                <span className='text-sm text-white/60 flex items-center gap-1'>
                  <FiCalendar size={14} />
                  {formatted}
                </span>
                <span className='text-sm text-white/60 flex items-center gap-1'>
                  <FiClock size={14} />
                  {metadata.readTime}
                </span>
              </div>

              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 text-balance'>
                {metadata.title}
              </h1>

              <div className='flex items-center gap-3 pt-4 border-t border-white/10'>
                <AuthorAvatar
                  name={metadata.author}
                  image={metadata.authorImage}
                />
                <div>
                  <p className='font-medium text-white'>
                    {metadata.author}
                  </p>
                  <p className='text-sm text-white/60'>
                    Published {formatted}
                  </p>
                </div>
              </div>
            </div>

            {/* Hero image */}
            {metadata.image && (
              <div className='mb-8 rounded-lg overflow-hidden bg-white/5 h-96'>
                <Image
                  src={metadata.image}
                  alt={metadata.title}
                  width={1200}
                  height={600}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            {/* Excerpt */}
            <div className='mb-8 rounded-lg border border-accent-default/20 bg-accent-default/5 p-6'>
              <p className='text-base text-white/80 italic'>
                {metadata.excerpt}
              </p>
            </div>

            {/* MDX content */}
            <div className='prose prose-invert max-w-none mb-12 prose-headings:text-white prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6 prose-p:text-white/80 prose-a:text-accent-default prose-strong:text-white prose-code:text-accent-default'>
              {children}
            </div>
          </article>

          {/* Right sidebar — Recommendations */}
          <aside className='hidden xl:block'>
            <div className='sticky top-24'>
              <Recommendations posts={recommendations} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

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
import { ReadingProgress } from './ReadingProgress'
import { ShareButtons } from './ShareButtons'
import type { PostMetadata } from '@/lib/getPosts'
import { useLocale } from '@/lib/locale-context'

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
  slug: string
  children: ReactNode
  recommendations?: PostMetadata[]
}

export function PostDetailLayout({
  metadata,
  slug,
  children,
  recommendations = [],
}: Props) {
  const { locale, dict } = useLocale()
  const formatted = new Date(
    metadata.date,
  ).toLocaleDateString(
    locale === 'vi' ? 'vi-VN' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )

  return (
    <div className='min-h-screen'>
      <ReadingProgress />
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Back button — full width */}
        <Link href={`/${locale}/blog`}>
          <Button
            variant='outline'
            className='mb-8 -ml-2 cursor-pointer border-border text-accent-default hover:bg-accent-default/10 hover:text-accent-hover'
          >
            <FiArrowLeft size={20} className='mr-2' />
            {dict.blog.backToArticles}
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
                <span className='text-sm text-muted-foreground'>
                  •
                </span>
                <span className='text-sm text-muted-foreground flex items-center gap-1'>
                  <FiCalendar size={14} />
                  {formatted}
                </span>
                <span className='text-sm text-muted-foreground flex items-center gap-1'>
                  <FiClock size={14} />
                  {metadata.readTime}
                </span>
              </div>

              <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance'>
                {metadata.title}
              </h1>

              <div className='flex items-center gap-3 pt-4 border-t border-border'>
                <AuthorAvatar
                  name={metadata.author}
                  image={metadata.authorImage}
                />
                <div>
                  <p className='font-medium text-foreground'>
                    {metadata.author}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {dict.blog.published} {formatted}
                  </p>
                </div>
              </div>
            </div>

            {/* Hero image */}
            {metadata.image && (
              <div className='mb-8 rounded-lg overflow-hidden bg-foreground/5 h-96'>
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
              <p className='text-base text-foreground/80 italic'>
                {metadata.excerpt}
              </p>
            </div>

            {/* MDX content */}
            <div className='prose dark:prose-invert max-w-none mb-12 prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-6 prose-p:text-foreground/80 prose-a:text-accent-default prose-strong:text-foreground prose-code:text-accent-default'>
              {children}
            </div>
          </article>

          {/* Post footer — outside article so TOC doesn't pick up these headings */}
          <div className='min-w-0 max-w-3xl mx-auto w-full col-start-2'>
            <footer className='border-t border-border pt-8 mt-12 space-y-8'>
              {/* Share */}
              <ShareButtons
                title={metadata.title}
                slug={slug}
              />

              {/* Author bio */}
              <div className='rounded-xl border border-border bg-foreground/5 p-6'>
                <div className='flex items-start gap-4'>
                  <AuthorAvatar
                    name={metadata.author}
                    image={metadata.authorImage}
                    size='lg'
                  />
                  <div>
                    <p className='font-semibold text-foreground text-lg'>
                      {metadata.author}
                    </p>
                    <p className='text-muted-foreground text-sm mt-1'>
                      {dict.blog.authorBio}
                    </p>
                    <div className='flex gap-3 mt-3'>
                      <Link
                        href={`/${locale}/contact`}
                        className='text-accent-default hover:text-accent-hover text-sm font-medium transition-colors'
                      >
                        {dict.blog.getInTouch}
                      </Link>
                      <Link
                        href={`/${locale}/blog`}
                        className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
                      >
                        {dict.blog.moreArticles}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className='rounded-xl bg-accent-default/10 border border-accent-default/20 p-6 text-center'>
                <h3 className='text-lg font-semibold text-foreground mb-2'>
                  {dict.blog.enjoyedArticle}
                </h3>
                <p className='text-muted-foreground text-sm mb-4'>
                  {dict.blog.enjoyedDescription}
                </p>
                <div className='flex justify-center gap-3'>
                  <Link href={`/${locale}/contact`}>
                    <Button className='cursor-pointer'>
                      {dict.common.hireMe}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/blog`}>
                    <Button
                      variant='outline'
                      className='cursor-pointer border-accent-default/30 text-accent-default hover:bg-accent-default/10'
                    >
                      {dict.blog.readMoreArticles}
                    </Button>
                  </Link>
                </div>
              </div>
            </footer>
          </div>

          {/* Right sidebar — Recommendations */}
          <aside className='hidden xl:block'>
            <div className='sticky top-24'>
              <Recommendations
                posts={recommendations}
                locale={locale}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

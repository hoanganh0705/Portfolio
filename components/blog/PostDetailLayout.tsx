'use client'

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiShare2,
  FiTwitter,
  FiLinkedin,
} from 'react-icons/fi'
import { FaFacebook } from 'react-icons/fa'
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
            className='mb-8 -ml-2 cursor-pointer border-border text-accent-default hover:bg-accent-default/10 hover:text-accent-hover'
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
                    Published {formatted}
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

            {/* Post footer */}
            <footer className='border-t border-border pt-8 mt-12 space-y-8'>
              {/* Share */}
              <div>
                <h3 className='text-lg font-semibold text-foreground mb-4 flex items-center gap-2'>
                  <FiShare2 size={18} />
                  Share this article
                </h3>
                <div className='flex gap-3'>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(metadata.title)}&url=${encodeURIComponent(`https://anhnguyendev.me/blog/${metadata.title.toLowerCase().replace(/\s+/g, '-')}`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 border border-border text-foreground hover:bg-accent-default/10 hover:text-accent-default transition-colors text-sm'
                  >
                    <FiTwitter size={16} /> Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://anhnguyendev.me/blog/${metadata.title.toLowerCase().replace(/\s+/g, '-')}`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 border border-border text-foreground hover:bg-accent-default/10 hover:text-accent-default transition-colors text-sm'
                  >
                    <FiLinkedin size={16} /> LinkedIn
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://anhnguyendev.me/blog/${metadata.title.toLowerCase().replace(/\s+/g, '-')}`)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 border border-border text-foreground hover:bg-accent-default/10 hover:text-accent-default transition-colors text-sm'
                  >
                    <FaFacebook size={16} /> Facebook
                  </a>
                </div>
              </div>

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
                      Full-Stack Web Developer & Educator
                      based in Vietnam. Passionate about
                      Next.js, React, and building great web
                      experiences.
                    </p>
                    <div className='flex gap-3 mt-3'>
                      <Link
                        href='/contact'
                        className='text-accent-default hover:text-accent-hover text-sm font-medium transition-colors'
                      >
                        Get in touch →
                      </Link>
                      <Link
                        href='/blog'
                        className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
                      >
                        More articles
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className='rounded-xl bg-accent-default/10 border border-accent-default/20 p-6 text-center'>
                <h3 className='text-lg font-semibold text-foreground mb-2'>
                  Enjoyed this article?
                </h3>
                <p className='text-muted-foreground text-sm mb-4'>
                  I write about web development, React,
                  Next.js, and more. Let&apos;s work
                  together on your next project.
                </p>
                <div className='flex justify-center gap-3'>
                  <Link href='/contact'>
                    <Button className='cursor-pointer'>
                      Hire me
                    </Button>
                  </Link>
                  <Link href='/blog'>
                    <Button
                      variant='outline'
                      className='cursor-pointer border-accent-default/30 text-accent-default hover:bg-accent-default/10'
                    >
                      Read more articles
                    </Button>
                  </Link>
                </div>
              </div>
            </footer>
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

'use client'

import { useState } from 'react'
import {
  FiShare2,
  FiTwitter,
  FiLinkedin,
  FiLink,
  FiCheck,
} from 'react-icons/fi'
import { FaFacebook } from 'react-icons/fa'
import { useLocale } from '@/lib/locale-context'

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({
  title,
  slug,
}: ShareButtonsProps) {
  const { locale, dict } = useLocale()
  const [copied, setCopied] = useState(false)

  const url = `https://anhnguyendev.me/${locale}/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      handleCopyLink()
    }
  }

  const linkClass =
    'inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 border border-border text-foreground hover:bg-accent-default/10 hover:text-accent-default transition-colors text-sm'

  return (
    <div>
      <h3 className='text-lg font-semibold text-foreground mb-4 flex items-center gap-2'>
        <FiShare2 size={18} />
        {dict.blog.shareArticle}
      </h3>
      <div className='flex flex-wrap gap-3'>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
          aria-label='Share on Twitter'
        >
          <FiTwitter size={16} /> Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
          aria-label='Share on LinkedIn'
        >
          <FiLinkedin size={16} /> LinkedIn
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
          aria-label='Share on Facebook'
        >
          <FaFacebook size={16} /> Facebook
        </a>
        <button
          onClick={handleNativeShare}
          className={`${linkClass} cursor-pointer`}
          aria-label='Copy link or share'
        >
          {copied ? (
            <>
              <FiCheck
                size={16}
                className='text-green-500'
              />{' '}
              Copied!
            </>
          ) : (
            <>
              <FiLink size={16} /> Copy link
            </>
          )}
        </button>
      </div>
    </div>
  )
}

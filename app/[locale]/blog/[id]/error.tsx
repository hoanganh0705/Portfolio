'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  FiAlertTriangle,
  FiRefreshCw,
} from 'react-icons/fi'
import { useLocale } from '@/lib/locale-context'

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { locale } = useLocale()

  useEffect(() => {
    console.error('Blog post error:', error)
  }, [error])

  return (
    <section className='min-h-[60vh] flex items-center justify-center'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center text-center gap-6 max-w-md mx-auto'>
          <div className='w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center'>
            <FiAlertTriangle
              className='text-red-500'
              size={32}
            />
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-bold text-foreground'>
              Failed to load article
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              This article couldn&apos;t be loaded. It may
              have been moved or there was a server error.
            </p>
          </div>

          <div className='flex gap-3'>
            <Button
              onClick={reset}
              className='cursor-pointer gap-2'
            >
              <FiRefreshCw size={14} />
              Retry
            </Button>
            <Link href={`/${locale}/blog`}>
              <Button
                variant='outline'
                className='cursor-pointer border-accent-default/30 text-accent-default hover:bg-accent-default/10'
              >
                All articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

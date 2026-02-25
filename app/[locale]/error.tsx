'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  FiAlertTriangle,
  FiRefreshCw,
} from 'react-icons/fi'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <section className='min-h-[80vh] flex items-center justify-center'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center text-center gap-8 max-w-lg mx-auto'>
          <div className='w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center'>
            <FiAlertTriangle
              className='text-red-500'
              size={40}
            />
          </div>

          <div className='space-y-3'>
            <h2 className='text-3xl font-bold text-foreground'>
              Something went wrong
            </h2>
            <p className='text-muted-foreground text-base leading-relaxed'>
              An unexpected error occurred. Please try again
              or go back to the homepage.
            </p>
            {error.digest && (
              <p className='text-xs text-muted-foreground/60 font-mono'>
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Button
              onClick={reset}
              className='cursor-pointer gap-2'
            >
              <FiRefreshCw size={16} />
              Try again
            </Button>
            <Link href='/en'>
              <Button
                variant='outline'
                className='cursor-pointer border-accent-default/30 text-accent-default hover:bg-accent-default/10'
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

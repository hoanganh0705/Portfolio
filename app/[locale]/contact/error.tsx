'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  FiAlertTriangle,
  FiRefreshCw,
} from 'react-icons/fi'
import { useLocale } from '@/lib/locale-context'

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { locale, dict } = useLocale()

  useEffect(() => {
    console.error('Contact page error:', error)
  }, [error])

  return (
    <section
      role='alert'
      className='min-h-[60vh] flex items-center justify-center'
    >
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
              {dict.errors.somethingWentWrong}
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {dict.errors.unexpectedError}
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              onClick={reset}
              className='cursor-pointer gap-2'
            >
              <FiRefreshCw size={14} />
              {dict.errors.tryAgain}
            </Button>
            <Link href={`/${locale}`}>
              <Button
                variant='outline'
                className='cursor-pointer border-accent-default/30 text-accent-default hover:bg-accent-default/10'
              >
                {dict.errors.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

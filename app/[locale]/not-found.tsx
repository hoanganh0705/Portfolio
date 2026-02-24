'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/lib/locale-context'

export default function NotFound() {
  const { locale, dict } = useLocale()

  return (
    <section className='min-h-[80vh] flex items-center justify-center'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center text-center gap-8'>
          {/* Glitch-style 404 number */}
          <div className='relative select-none'>
            <h1 className='text-[120px] xl:text-[200px] font-extrabold leading-none text-accent-default/20'>
              {dict.notFound.code}
            </h1>
            <span className='absolute inset-0 flex items-center justify-center text-[120px] xl:text-[200px] font-extrabold leading-none text-accent-default'>
              {dict.notFound.code}
            </span>
          </div>

          {/* Message */}
          <div className='max-w-lg space-y-4'>
            <h2 className='h3 text-foreground'>
              {dict.notFound.title}
            </h2>
            <p className='text-muted-foreground text-base leading-relaxed'>
              {dict.notFound.description}
            </p>
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link href={`/${locale}`}>
              <Button
                variant='outline'
                size='lg'
                className='uppercase cursor-pointer'
              >
                {dict.common.backToHome}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button
                variant='outline'
                size='lg'
                className='uppercase cursor-pointer'
              >
                {dict.common.contactMe}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

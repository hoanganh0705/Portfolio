import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <section className='min-h-[80vh] flex items-center justify-center'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center text-center gap-8'>
          {/* Glitch-style 404 number */}
          <div className='relative select-none'>
            <h1 className='text-[120px] xl:text-[200px] font-extrabold leading-none text-accent-default/20'>
              404
            </h1>
            <span className='absolute inset-0 flex items-center justify-center text-[120px] xl:text-[200px] font-extrabold leading-none text-accent-default'>
              404
            </span>
          </div>

          {/* Message */}
          <div className='max-w-lg space-y-4'>
            <h2 className='h3 text-foreground'>
              Page not found
            </h2>
            <p className='text-muted-foreground text-base leading-relaxed'>
              The page you&apos;re looking for doesn&apos;t
              exist or has been moved. Let&apos;s get you
              back on track.
            </p>
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link href='/'>
              <Button
                variant='outline'
                size='lg'
                className='uppercase cursor-pointer'
              >
                Back to Home
              </Button>
            </Link>
            <Link href='/contact'>
              <Button
                variant='outline'
                size='lg'
                className='uppercase cursor-pointer'
              >
                Contact Me
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

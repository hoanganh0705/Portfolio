import Link from 'next/link'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-jetbrainsMono',
})

export default function NotFound() {
  return (
    <html lang='en'>
      <body className={jetbrainsMono.variable}>
        <section className='min-h-screen flex items-center justify-center bg-background text-foreground'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col items-center text-center gap-8'>
              <div className='relative select-none'>
                <h1 className='text-[120px] xl:text-[200px] font-extrabold leading-none text-accent-default/20'>
                  404
                </h1>
                <span className='absolute inset-0 flex items-center justify-center text-[120px] xl:text-[200px] font-extrabold leading-none text-accent-default'>
                  404
                </span>
              </div>
              <div className='max-w-lg space-y-4'>
                <h2 className='text-2xl font-bold'>
                  Page not found
                </h2>
                <p className='text-base leading-relaxed opacity-70'>
                  The page you&apos;re looking for
                  doesn&apos;t exist or has been moved.
                </p>
              </div>
              <Link
                href='/en'
                className='px-6 py-3 border rounded-lg font-medium uppercase hover:opacity-80 transition-opacity'
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}

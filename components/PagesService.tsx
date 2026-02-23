'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import type { Service } from '@/constants/services'

export default function ServicePages({
  service,
}: {
  service: Service
}) {
  return (
    <section className='container mx-auto py-16 px-4 sm:px-6 lg:px-8'>
      <header className='mb-12 text-center max-w-4xl mx-auto'>
        <div className='flex justify-center items-center mb-6'>
          <span className='text-4xl sm:text-5xl font-bold text-primary mr-4'>
            {service.num}
          </span>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
            {service.title}
          </h1>
        </div>
        <p className='mt-6 text-lg leading-8 text-muted-foreground'>
          {service.description}
        </p>
        <Button className='mt-8' size='lg' asChild>
          <Link
            href='#packages'
            onClick={(e) => {
              e.preventDefault()
              const packagesSection =
                document.getElementById('packages')
              if (packagesSection) {
                packagesSection.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            }}
          >
            Explore Packages
          </Link>
        </Button>
      </header>

      {service.steps && service.steps.length > 0 && (
        <section className='my-20 max-w-4xl mx-auto'>
          <h2 className='text-3xl font-semibold mb-8 text-center'>
            How It Works
          </h2>
          <p className='mt-4 text-lg text-center max-w-2xl mx-auto mb-10'>
            Discover the simple steps to achieve your
            learning goals with our tailored approach.
          </p>
          <div className='relative pl-4 self-center ml-10'>
            <div className='hidden md:block absolute left-8 top-0 w-1 bg-gray-200 h-full transform translate-x-2.5'></div>
            <ol className='space-y-6'>
              {service.steps.map((step, idx) => (
                <li
                  key={idx}
                  className='flex items-start gap-4'
                >
                  <span className='shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent-default text-white font-semibold'>
                    {idx + 1}
                  </span>
                  <p className='text-base leading-7'>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {service.packages && service.packages.length > 0 && (
        <section id='packages' className='my-20'>
          <h2 className='text-3xl font-semibold text-center mb-10'>
            My Packages
          </h2>
          <div className='grid gap-8 grid-cols-1 lg:grid-cols-3'>
            {service.packages.map((pkg) => (
              <div key={pkg.name}>
                <Card className='h-full flex flex-col hover:shadow-lg transition-shadow duration-300'>
                  <CardHeader>
                    <CardTitle className='text-3xl font-medium text-center mb-2'>
                      {pkg.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col grow'>
                    <p className='text-2xl font-bold text-primary mb-8 text-center '>
                      {pkg.price}
                    </p>
                    <ul className='list-disc pl-10 space-y-2 text-sm grow'>
                      {pkg.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <Button
                      className='mt-6 w-full'
                      variant='default'
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      )}

      {service.testimonials &&
        service.testimonials.length > 0 && (
          <section className='my-20 max-w-4xl mx-auto'>
            <h2 className='text-3xl font-semibold mb-8 text-center'>
              What Our Clients Say
            </h2>
            <ScrollArea className='max-h-[400px] rounded-lg border p-6'>
              <div className='space-y-6'>
                {service.testimonials.map((t) => (
                  <blockquote
                    key={t.name}
                    className='border-l-4 border-primary pl-4 italic'
                  >
                    <p className='text-lg'>“{t.comment}”</p>
                    <footer className='mt-2 not-italic font-medium text-sm text-muted-foreground'>
                      — {t.name}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </ScrollArea>
          </section>
        )}
    </section>
  )
}

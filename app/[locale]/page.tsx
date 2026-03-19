import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { FiDownload } from 'react-icons/fi'
import dynamic from 'next/dynamic'

// Components
import Social from '@/components/home/Social'
import TypeWriter from '@/components/home/TypeWriter'

// bundle-dynamic-imports: lazy-load heavy below-fold client components
const Stats = dynamic(
  () => import('@/components/home/Stats'),
)
const BriefInfo = dynamic(
  () => import('@/components/home/BriefInfo'),
)
const WhyMe = dynamic(
  () => import('@/components/home/WhyMe'),
)

// Utils
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'

// Export revalidate to enable ISR for 10 days
export const revalidate = 864000 // 10*24*60*60

export { metadata } from './metadata'

// rendering-hoist-jsx: static fallback extracted outside component
const StatsFallback = (
  <section
    role='status'
    aria-busy='true'
    aria-label='Loading stats'
    className='pt-4 pb-12 xl:pt-0 xl:pb-0'
  >
    <div className='container mx-auto relative top-3'>
      <div className='flex flex-wrap items-center justify-center gap-6 max-w-[80vw] mx-auto xl:max-w-none animate-pulse'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex-1 flex gap-4 items-center justify-center xl:justify-start'
          >
            <div className='h-12 w-20 bg-foreground/10 rounded' />
            <div className='h-6 w-24 bg-foreground/10 rounded' />
          </div>
        ))}
      </div>
    </div>
  </section>
)

// server-parallel-fetching: async server component fetches data independently
async function StatsSection({
  locale,
}: {
  locale: Locale
}) {
  const dict = await getDictionary(locale)
  const { stats, getCommitCount } =
    await import('@/constants/stats')
  const commitCount = await getCommitCount()
  const labels = [
    dict.stats.yearsOfExperience,
    dict.stats.projectsCompleted,
    dict.stats.technologiesMastered,
    dict.stats.codeCommits,
  ]
  const localizedStats = stats.map(
    (s: { num: number; text: string }, i: number) => ({
      ...s,
      num: i === 3 ? commitCount : s.num, // Replace commit count with live value
      text: labels[i] || s.text,
    }),
  )
  return <Stats statsData={localizedStats} />
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <section className='h-full xl:pt-20 xl:pb-4'>
      <div className='container mx-auto px-2 xl:px-0'>
        <div className='flex flex-col items-center justify-center text-center'>
          {/* Text */}
          <div className='w-full max-w-3xl'>
            <h1 className='h1 mb-6'>
              {dict.home.greeting} <br />{' '}
              <TypeWriter mySelf={dict.mySelf} />
            </h1>
            <p className='mx-auto max-w-2xl mb-9 text-muted-foreground'>
              {dict.home.description}
            </p>

            {/* Button and socials */}
            <div className='flex flex-col items-center gap-8 m-10'>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='uppercase flex items-center gap-2'
              >
                <a
                  href={siteConfig.cvFilePath}
                  download
                  aria-label={dict.common.downloadCV}
                >
                  <span>{dict.common.downloadCV}</span>
                  <FiDownload className='text-xl cursor-pointer' />
                </a>
              </Button>
              <div>
                <Social
                  containerStyles='flex gap-6 justify-center m-8'
                  iconStyles='w-9 h-9 border border-accent-default rounded-full flex justify-center items-center hover:bg-accent-default hover:text-primary hover:transition-all duration-500'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* async-suspense-boundaries: Stats fetches GitHub commits, wrap in Suspense so hero renders immediately */}
      <Suspense fallback={StatsFallback}>
        <StatsSection locale={locale as Locale} />
      </Suspense>

      {/* rendering-content-visibility: below-fold sections with content-visibility for rendering performance */}
      <div
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '0 600px',
        }}
      >
        <BriefInfo />
      </div>
      <div
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '0 600px',
        }}
      >
        <WhyMe />
      </div>
    </section>
  )
}

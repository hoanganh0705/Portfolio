import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { FiDownload } from 'react-icons/fi'
import dynamic from 'next/dynamic'

// Components
import Social from '@/components/Social'
import TypeWriter from '@/components/TypeWriter'

// bundle-dynamic-imports: lazy-load heavy below-fold client components
const Stats = dynamic(() => import('@/components/Stats'))
const BriefInfo = dynamic(
  () => import('@/components/BriefInfo'),
)
const WhyMe = dynamic(() => import('@/components/WhyMe'))

// Constants
import { mySelf } from '@/constants/mySelf'

// Utils
import { createMetadata } from '@/lib/metadata'

// Export revalidate to enable ISR for 10 days
export const revalidate = 864000 // 10*24*60*60

export const metadata = createMetadata({
  title:
    'Anh Nguyen Dev — Full-Stack Web Developer & Educator',
  description:
    'Nguyen Hoang Anh (anhnguyendev) — a passionate full-stack web developer and educator based in Vietnam. Offering innovative web development, private tutoring, English teaching, and SEO services.',
  keywords: [
    'web developer',
    'portfolio',
    'full-stack developer',
    'freelance developer vietnam',
    'english teacher',
    'private tutor',
    'next.js developer',
    'react developer',
    'seo specialist',
  ],
  path: '',
  ogImage:
    'https://gitlab.com/nguyennanhcd1/image-container/-/raw/main/portfolio-image/Screenshot%202025-06-21%20072326.png?ref_type=heads',
})

// rendering-hoist-jsx: static fallback extracted outside component
const StatsFallback = (
  <section className='pt-4 pb-12 xl:pt-0 xl:pb-0'>
    <div className='container mx-auto relative top-3'>
      <div className='flex flex-wrap items-center justify-center gap-6 max-w-[80vw] mx-auto xl:max-w-none animate-pulse'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex-1 flex gap-4 items-center justify-center xl:justify-start'
          >
            <div className='h-12 w-20 bg-white/10 rounded' />
            <div className='h-6 w-24 bg-white/10 rounded' />
          </div>
        ))}
      </div>
    </div>
  </section>
)

// server-parallel-fetching: async server component fetches data independently
async function StatsSection() {
  const { stats } = await import('@/constants/stats')
  return <Stats statsData={stats} />
}

export default function Home() {
  return (
    <section className='h-full xl:pt-20 xl:pb-4'>
      <div className='container mx-auto px-2 xl:px-0'>
        <div className='flex flex-col items-center justify-center text-center'>
          {/* Text */}
          <div className='w-full max-w-3xl'>
            <h1 className='h1 mb-6'>
              Hi, I&apos;m <br />{' '}
              <TypeWriter mySelf={mySelf} />
            </h1>
            <p className='mx-auto max-w-2xl mb-9 text-white/80'>
              Full-stack web developer and educator based in
              Vietnam. I craft elegant digital experiences
              with Next.js, React &amp; Tailwind CSS and
              offer tutoring &amp; SEO services.
            </p>

            {/* Button and socials */}
            <div className='flex flex-col items-center gap-8 m-10'>
              <Button
                variant='outline'
                size='lg'
                className='uppercase flex items-center gap-2'
              >
                <span>Download CV</span>
                <FiDownload className='text-xl cursor-pointer' />
              </Button>
              <div>
                <Social
                  containerStyles='flex gap-6 justify-center m-8'
                  iconStyles='w-9 h-9 border border-accent-default rounded-full flex justify-center items-center text-accent text-base hover:bg-accent-default hover:text-primary hover:transition-all duration-500'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* async-suspense-boundaries: Stats fetches GitHub commits, wrap in Suspense so hero renders immediately */}
      <Suspense fallback={StatsFallback}>
        <StatsSection />
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

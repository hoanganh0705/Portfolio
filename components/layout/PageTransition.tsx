'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { isBlogDetail } from '@/lib/utils'

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div),
)

const AnimatePresence = dynamic(() =>
  import('framer-motion').then(
    (mod) => mod.AnimatePresence,
  ),
)

const PageTransition = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const skipTransition = isBlogDetail(pathname)
  // Keep a stable key for blog detail pages so AnimatePresence doesn't re-trigger
  const stableKey = 'blog-detail'
  const animationKey = skipTransition ? stableKey : pathname

  return (
    <AnimatePresence>
      <div key={animationKey}>
        {!skipTransition && (
          <MotionDiv
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              transition: {
                delay: 1,
                duration: 0.4,
                ease: 'easeInOut',
              },
            }}
            className='h-screen w-screen fixed bg-background top-0 pointer-events-none'
          />
        )}
        {children}
      </div>
    </AnimatePresence>
  )
}

export default PageTransition

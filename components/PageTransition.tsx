'use client'

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div),
)

const AnimatePresence = dynamic(() =>
  import('framer-motion').then(
    (mod) => mod.AnimatePresence,
  ),
)

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

/** Blog detail routes like /blog/some-slug should not trigger the full-page transition */
const isBlogDetail = (path: string) =>
  /^\/blog\/.+/.test(path)

const PageTransition = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const skipTransition = isBlogDetail(pathname)
  // Keep a stable key for blog detail pages so AnimatePresence doesn't re-trigger
  const stableKeyRef = useRef('blog-detail')
  const animationKey = skipTransition
    ? stableKeyRef.current
    : pathname

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
            className='h-screen w-screen fixed bg-primary top-0 pointer-events-none'
          />
        )}
        {children}
      </div>
    </AnimatePresence>
  )
}

export default PageTransition

'use client'

import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import dynamic from 'next/dynamic'

//components
import Stairs from './Stairs'

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div),
)

const AnimatePresence = dynamic(() =>
  import('framer-motion').then(
    (mod) => mod.AnimatePresence,
  ),
)

/** Blog detail routes like /en/blog/some-slug should not trigger the stair transition */
const isBlogDetail = (path: string) =>
  /^\/(en|vi)\/blog\/.+/.test(path)

const StairTransition = () => {
  const pathname = usePathname()
  const skipTransition = isBlogDetail(pathname)
  const stableKeyRef = useRef('blog-detail')
  const animationKey = skipTransition
    ? stableKeyRef.current
    : pathname

  if (skipTransition) return null

  return (
    <>
      <AnimatePresence mode='wait'>
        <div key={animationKey}>
          <div className='h-screen w-screen fixed top-0 left-0 right-0 pointer-events-none z-40 flex'>
            <Stairs />
          </div>
          <MotionDiv
            className='h-screen w-screen fixed bg-background top-0 pointer-events-none'
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              transition: {
                delay: 1,
                duration: 0.4,
                ease: 'easeInOut',
              },
            }}
          />
        </div>
      </AnimatePresence>
    </>
  )
}

export default StairTransition

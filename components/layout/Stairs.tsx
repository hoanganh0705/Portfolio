'use client'
import { domAnimation, LazyMotion, m } from 'framer-motion'

const stairAnimation = {
  initial: { y: 0 },
  animate: { y: '100%' },
  exit: { y: ['100%', '0%'] },
}

const TOTAL_STEPS = 6

const reversedIndex = (index: number) => {
  return TOTAL_STEPS - index - 1
}

const Stairs = () => {
  return (
    <LazyMotion features={domAnimation}>
      {[...Array(TOTAL_STEPS)].map((_, index) => (
        <m.div
          key={index}
          variants={stairAnimation}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            delay: reversedIndex(index) * 0.1,
          }}
          className='h-full w-full bg-accent-default relative'
        />
      ))}
    </LazyMotion>
  )
}

export default Stairs

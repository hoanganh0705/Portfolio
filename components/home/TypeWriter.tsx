'use client'

import { domAnimation, LazyMotion, m } from 'framer-motion'
import { useEffect, useState } from 'react'
interface TypeWriterProps {
  mySelf: string[]
}

const TypeWriter = ({ mySelf }: TypeWriterProps) => {
  const LETTER_DELAY = 0.1
  const BOX_FADE_DURATION = 0.125

  const FADE_DELAY = 5
  const MAIN_FADE_DURATION = 0.4

  const SWAP_DELAY_IN_MS = 7000
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((pv) => (pv + 1) % mySelf.length)
    }, SWAP_DELAY_IN_MS)

    return () => clearInterval(intervalId)
  }, [mySelf.length])

  return (
    <p className=''>
      <span className='text-accent-default'>
        <LazyMotion features={domAnimation}>
          {mySelf[index].split('').map((l, i) => {
            return (
              <m.span
                key={`${index}-${i}`}
                className='relative'
                initial={{
                  opacity: 1,
                }}
                animate={{
                  opacity: 0,
                }}
                transition={{
                  delay: FADE_DELAY,
                  duration: MAIN_FADE_DURATION,
                  ease: 'easeInOut',
                }}
              >
                <m.span
                  className='relative'
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: i * LETTER_DELAY,
                    duration: 0,
                  }}
                >
                  {l}
                </m.span>
                <m.span
                  className='absolute bottom-[3px] left-px right-0 top-[3px] bg-accent-default'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    delay: i * LETTER_DELAY,
                    times: [0, 0.1, 1],
                    duration: BOX_FADE_DURATION,
                    ease: 'easeInOut',
                  }}
                />
              </m.span>
            )
          })}
        </LazyMotion>
      </span>
    </p>
  )
}

export default TypeWriter

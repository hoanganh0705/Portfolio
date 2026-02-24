'use client'

import React, { useRef, useEffect, useState } from 'react'
import { whyMe as whyMeData } from '@/constants/whyme'
import {
  m,
  LazyMotion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { useLocale } from '@/lib/locale-context'

const loadFeatures = () =>
  import('framer-motion').then((mod) => mod.domMax)

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    rotateX: -18,
    rotateY: 8,
    scale: 0.85,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70 + i * 4,
      damping: 14,
      mass: 0.5,
    },
  }),
}

const iconVariants: Variants = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 20,
      mass: 0.5,
    },
  },
}

export default function WhyMe() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [viewportAmount, setViewportAmount] = useState(0.8)
  const { dict } = useLocale()

  const whyMeKeys = [
    'problemSolving',
    'fastService',
    'secureSolutions',
    'transparent',
  ] as const
  const whyMe = whyMeData.map((item, i) => ({
    ...item,
    whyMe: dict.whyMe[whyMeKeys[i]]?.title || item.whyMe,
    briefDesc:
      dict.whyMe[whyMeKeys[i]]?.description ||
      item.briefDesc,
  }))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '-15%'],
  )

  useEffect(() => {
    const updateViewportAmount = () => {
      const width =
        typeof window !== 'undefined'
          ? window.innerWidth
          : 0
      if (width >= 1280) {
        setViewportAmount(0.8)
      } else if (width >= 1024 && width < 1280) {
        setViewportAmount(0.6)
      } else {
        setViewportAmount(0.5)
      }
    }

    updateViewportAmount()
    // client-passive-event-listeners: use passive listener since we don't call preventDefault
    window.addEventListener(
      'resize',
      updateViewportAmount,
      { passive: true },
    )
    return () =>
      window.removeEventListener(
        'resize',
        updateViewportAmount,
      )
  }, [])

  return (
    <LazyMotion features={loadFeatures}>
      <m.section
        ref={sectionRef}
        variants={sectionVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: viewportAmount }}
        style={
          !prefersReducedMotion
            ? { y: parallaxY, willChange: 'transform' }
            : {}
        }
        className='mt-5 xl:mb-20'
      >
        <div className='pt-8 pb-12 xl:pt-16 xl:pb-20 xl:px-10 xl:h-[600px]'>
          <div className='container mx-auto px-4'>
            <m.h2
              className='text-3xl font-bold text-center text-primary/90 mb-8 xl:mb-12'
              variants={iconVariants}
            >
              {dict.home.whyWorkWithMe}
            </m.h2>

            <m.div
              variants={containerVariants}
              className='flex flex-col lg:flex-row gap-8 xl:gap-12 justify-center items-center xl:mt-12'
            >
              {whyMe.map((item, i) => (
                <m.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.06,
                    rotateX: 0,
                    rotateY: 0,
                    boxShadow:
                      '0px 14px 28px rgba(0,0,0,0.18)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className=' flex flex-col items-center text-center p-6 rounded-lg transition-colors duration-300 hover:bg-accent-hover/50 select-none cursor-pointer'
                  style={{ perspective: 800 }}
                >
                  <m.span
                    variants={iconVariants}
                    className='text-5xl text-primary font-extralight mb-6'
                  >
                    {item.icon}
                  </m.span>

                  <h3 className='text-lg font-semibold text-primary mb-3'>
                    {item.whyMe}
                  </h3>
                  <p className='text-primary/80 text-base leading-relaxed max-w-full max-h-full'>
                    {item.briefDesc}
                  </p>
                </m.div>
              ))}
            </m.div>
          </div>
        </div>
      </m.section>
    </LazyMotion>
  )
}

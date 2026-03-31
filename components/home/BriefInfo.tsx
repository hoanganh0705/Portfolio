'use client'
import { useEffect, useRef } from 'react'
import {
  domAnimation,
  LazyMotion,
  m,
  useAnimation,
  useInView,
  type Transition,
  type Variants,
} from 'framer-motion'
import { useLocale } from '@/lib/locale-context'

const smoothEase: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
]

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: smoothEase,
      staggerChildren: 0.1,
    },
  },
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: smoothEase,
    },
  },
}

const skillContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: smoothEase,
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
}

const skillSpring: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 18,
}

const skillVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: skillSpring,
  },
}

export default function BriefInfo() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const controls = useAnimation()
  const { dict } = useLocale()

  const skills = [
    dict.skills.seo,
    dict.skills.frontend,
    dict.skills.backend,
    dict.skills.teaching,
  ]

  const inView = useInView(sectionRef, {
    once: true,
    // Start animating just before the section fully enters the viewport to avoid a late trigger.
    margin: '0px 0px -20% 0px',
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        ref={sectionRef}
        initial='hidden'
        animate={controls}
        variants={sectionVariants}
        className='xl:pt-50 pt-10 xl:pb-50 pb-10'
      >
        <div className='p-10 xl:p-20'>
          <m.h2
            className='text-4xl font-bold mb-3 text-center'
            variants={textVariants}
          >
            {dict.home.whatIDo}
          </m.h2>
          <m.p
            className='mt-5 text-base text-muted-foreground text-center'
            variants={textVariants}
          >
            {dict.home.findOutAboutMe}
          </m.p>
          <m.div
            className='grid grid-cols-1 xl:grid-cols-4 xl:gap-8 xl:mt-40 mt-33 gap-30'
            variants={skillContainerVariants}
          >
            {skills.map((skill) => (
              <m.div
                key={skill.key}
                variants={skillVariants}
              >
                <div className='flex items-center text-center flex-row'>
                  <span
                    aria-hidden
                    className='-translate-y-12 text-[160px] leading-none font-extrabold text-accent-default pointer-events-none select-none will-change-transform'
                  >
                    {skill.key}
                  </span>
                  <h3 className='text-lg font-semibold tracking-tight'>
                    {skill.title}
                  </h3>
                </div>
                <p className='-mt-6 pl-2 text-muted-foreground text-left'>
                  {skill.body}
                </p>
              </m.div>
            ))}
          </m.div>
        </div>
      </m.section>
    </LazyMotion>
  )
}

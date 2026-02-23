'use client'

import { BsArrowDownRight } from 'react-icons/bs'
import Link from 'next/link'
import { domAnimation, LazyMotion, m } from 'framer-motion'
import { services, Service } from '@/constants/services'

const initialOpacity = { opacity: 0 }
const fadeInAnimation = {
  opacity: 1,
  transition: {
    delay: 2.4,
    duration: 0.4,
    ease: 'easeInOut' as const,
  },
}

export default function ServicesClient() {
  return (
    <section className='min-h-[80vh] flex flex-col justify-center py-12 xl:py-0 '>
      <div className='container mx-auto px-2 xl:px-0'>
        <LazyMotion features={domAnimation}>
          <m.div
            initial={initialOpacity}
            animate={fadeInAnimation}
            className='grid grid-cols-1 md:grid-cols-2 gap-[60px]'
          >
            {services.map((service: Service) => (
              <div
                key={service.num}
                className='flex-1 flex flex-col justify-center gap-6 group'
              >
                {/* Top */}
                <div className='w-full flex items-center justify-between'>
                  <div className='text-5xl font-extrabold text-outline text-transparent text-outline-hover transition-all duration-500'>
                    {service.num}
                  </div>
                  <Link
                    aria-label={`View my ${service.title} works`}
                    href={service.href}
                    className='lg:w-[60px] lg:h-[60px] w-[50px] h-[50px] rounded-full bg-white group-hover:bg-accent-default transition-all duration-500 flex justify-center items-center hover:-rotate-45 xl:translate-x-0 -translate-x-3'
                  >
                    <BsArrowDownRight className='text-primary text-2xl' />
                  </Link>
                </div>
                {/* Title */}
                <h2 className='text-[42px] font-bold leading-none text-foreground group-hover:text-accent-default transition-all duration-500 '>
                  {service.title}
                </h2>
                {/* Description */}
                <p className='text-muted-foreground'>
                  {service.description}
                </p>
                {/* Border */}
                <div className='border-b border-border w-full xl:mb-5'>
                  {service.title}
                </div>
              </div>
            ))}
          </m.div>
        </LazyMotion>
      </div>
    </section>
  )
}

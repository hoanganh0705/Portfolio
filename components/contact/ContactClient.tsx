'use client'

import { info } from '@/constants/info'
import { domAnimation, LazyMotion, m } from 'framer-motion'
import Form from './ContactForm'
import { useLocale } from '@/lib/locale-context'

// rendering-hoist-jsx: hoist static animation config outside component
const fadeInAnimation = {
  opacity: 1,
  transition: {
    delay: 2.4,
    duration: 0.4,
    ease: 'easeInOut' as const,
  },
}

const initialOpacity = { opacity: 0 }

export default function ContactClient() {
  const { dict } = useLocale()

  return (
    // bundle-dynamic-imports: use m + LazyMotion instead of motion for smaller bundle
    <LazyMotion features={domAnimation}>
      <m.section
        initial={initialOpacity}
        animate={fadeInAnimation}
        className='py-6'
      >
        <div className='container mx-auto px-2 xl:px-0'>
          <div className='flex flex-col xl:flex-row gap-[30px]'>
            {/* form */}
            <Form />

            {/* info */}
            <div className='flex-1 flex items-center xl:justify-end order-1 xl:order-0 mb-8 xl:mb-0 xl:w-[40%]'>
              <ul className='flex flex-col gap-10 xl:bg-secondary xl:rounded-xl xl:h-full xl:w-full xl:justify-center'>
                {info.map((item) => {
                  const key = item.title.toLowerCase()
                  const translatedTitle =
                    key in dict.contact.infoLabels
                      ? dict.contact.infoLabels[
                          key as keyof typeof dict.contact.infoLabels
                        ]
                      : item.title

                  return (
                    <li
                      key={item.title}
                      className='flex items-center gap-6 xl:ml-2'
                    >
                      <div className='w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] rounded-md text-accent-default flex justify-center items-center'>
                        <div className='text-[28px]'>
                          {item.icon}
                        </div>
                      </div>
                      <div className='flex-1'>
                        <p className='text-muted-foreground'>
                          {translatedTitle}
                        </p>
                        <h3 className='text-xl'>
                          {item.description}
                        </h3>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </m.section>
    </LazyMotion>
  )
}

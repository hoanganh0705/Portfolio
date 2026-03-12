'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  about,
  education,
  experience,
  skills,
} from '@/constants/about'
import { domAnimation, LazyMotion, m } from 'framer-motion'
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

// architecture-avoid-boolean-props + patterns-explicit-variants:
// Extract repeated experience/education list pattern into a reusable component
function TimelineSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-[30px] text-center xl:text-left'>
      <h3 className='text-4xl font-bold'>{title}</h3>
      <p className='max-w-[600px] text-muted-foreground mx-auto xl:mx-0'>
        {description}
      </p>
      <ScrollArea className='h-[400px]'>
        {children}
      </ScrollArea>
    </div>
  )
}

export default function ResumeClient() {
  const { dict } = useLocale()

  return (
    // bundle-defer-third-party: use m + LazyMotion instead of motion
    <LazyMotion features={domAnimation}>
      <m.div
        initial={initialOpacity}
        animate={fadeInAnimation}
        className='min-h-[80vh] flex items-center justify-center py-12 xl:py-0'
      >
        <div className='container mx-auto px-2 xl:px-0'>
          <Tabs
            defaultValue='experience'
            className='flex flex-col xl:flex-row gap-[60px]'
          >
            <TabsList className='flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6'>
              <TabsTrigger value='experience'>
                {dict.resume.experience}
              </TabsTrigger>
              <TabsTrigger value='education'>
                {dict.resume.education}
              </TabsTrigger>
              <TabsTrigger value='skills'>
                {dict.resume.skills}
              </TabsTrigger>
              <TabsTrigger value='about'>
                {dict.resume.aboutMe}
              </TabsTrigger>
            </TabsList>

            {/* content */}
            <div className='min-h-[70vh] w-full'>
              {/* experience */}
              <TabsContent value='experience'>
                <TimelineSection
                  title={dict.resume.myExperience}
                  description={dict.resume.experienceDesc}
                >
                  <ul className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
                    {experience.items.map((item) => (
                      <li
                        key={`${item.duration}-${item.company}`}
                        className='bg-secondary h-[148px] py-6 px-10 rounded-xl flex flex-col justify-center items-center xl:items-start gap-1'
                      >
                        <span className='text-accent-default'>
                          {item.duration}
                        </span>
                        <h3 className='text-xl max-w-[260px] min-h-[60px] text-center lg:text-left'>
                          {item.position}
                        </h3>
                        <div>
                          <span className='w-1.5 h-1.5 rounded-full bg-accent-default' />
                          <p className='text-muted-foreground'>
                            {item.company}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TimelineSection>
              </TabsContent>

              {/* education */}
              <TabsContent value='education'>
                <TimelineSection
                  title={dict.resume.myEducation}
                  description={dict.resume.educationDesc}
                >
                  <ul className='grid grid-cols-1 lg:grid-cols-2 gap-[30px]'>
                    {education.items.map((item) => (
                      <li
                        key={`${item.duration}-${item.institution}`}
                        className='bg-secondary h-[148px] py-6 px-10 rounded-xl flex flex-col justify-center items-center xl:items-start gap-1'
                      >
                        <span className='text-accent-default'>
                          {item.duration}
                        </span>
                        <h3 className='text-xl max-w-[260px] min-h-[60px] text-center lg:text-left'>
                          {item.degree}
                        </h3>
                        <div>
                          <span className='w-1.5 h-1.5 rounded-full bg-accent-default' />
                          <p className='text-muted-foreground'>
                            {item.institution}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TimelineSection>
              </TabsContent>

              {/* skills - rerender-memo: single TooltipProvider wrapping all tooltips */}
              <TabsContent
                value='skills'
                className='w-full h-full'
              >
                <div className='flex flex-col gap-[30px]'>
                  <div className='flex flex-col gap-[30px] text-center xl:text-left'>
                    <h3 className='text-4xl font-bold'>
                      {dict.resume.mySkills}
                    </h3>
                    <p className='max-w-[600px] text-muted-foreground mx-auto xl:mx-0'>
                      {dict.resume.skillsDesc}
                    </p>
                  </div>
                  <TooltipProvider delayDuration={100}>
                    <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:gap-[30px] gap-4 sm:ml-2 sm:mr-2'>
                      {skills.skillList.map(
                        (skill) => (
                          <li key={skill.name}>
                            <Tooltip>
                              <TooltipTrigger className='w-full h-[150px] bg-secondary rounded-xl flex justify-center items-center group'>
                                <div className='text-5xl group-hover:text-accent-default transition-all duration-500'>
                                  {skill.icon}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className='capitalize'>
                                  {skill.name}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </li>
                        ),
                      )}
                    </ul>
                  </TooltipProvider>
                </div>
              </TabsContent>

              {/* about */}
              <TabsContent
                value='about'
                className='w-full text-center xl:text-left'
              >
                <div className='flex flex-col gap-[30px]'>
                  <h3 className='text-4xl font-bold'>
                    {dict.resume.aboutTitle}
                  </h3>
                  <p className='max-w-[600px] text-muted-foreground mx-auto xl:mx-0'>
                    {dict.resume.aboutDesc}
                  </p>
                  <ul className='grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0'>
                    {about.info.map((item) => (
                      <li
                        key={item.fieldName}
                        className='flex items-center justify-center xl:justify-start gap-4'
                      >
                        <span className='text-muted-foreground'>
                          {item.fieldName}
                        </span>
                        <span className='text-xl'>
                          {item.fieldValue}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </m.div>
    </LazyMotion>
  )
}

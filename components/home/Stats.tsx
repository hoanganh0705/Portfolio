// components/Stats.jsx
'use client' // Required because react-countup uses client-side features

import CountUp from 'react-countup'

type Stat = {
  num: number
  text: string
}

interface StatsProps {
  statsData: Stat[]
}

const Stats = ({ statsData }: StatsProps) => {
  return (
    <section className='pt-4 pb-12 xl:pt-0 xl:pb-0'>
      <div className='container mx-auto relative top-3'>
        <div className='flex flex-wrap items-center justify-center gap-6 max-w-[80vw] mx-auto xl:max-w-none'>
          {statsData.map((stat, index) => {
            return (
              <div
                key={index}
                className='flex-1 flex gap-4 items-center justify-center xl:justify-start'
              >
                <CountUp
                  end={stat.num}
                  duration={5}
                  delay={2}
                  className='text-4xl xl:text-6xl font-extrabold'
                />
                <p
                  className={`${
                    stat.text.length < 15
                      ? 'max-w-[100px]'
                      : 'max-w-[159px]'
                  } leading-snug text-muted-foreground`}
                >
                  {stat.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Stats

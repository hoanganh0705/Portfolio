'use client'

import { useSwiper } from 'swiper/react'

import {
  PiCaretLeftBold,
  PiCaretRightBold,
} from 'react-icons/pi'

interface WorkSliderBtnsProps {
  containerStyles: string
  btnStyles: string
}

export default function WorkSliderBtns({
  containerStyles,
  btnStyles,
}: WorkSliderBtnsProps) {
  const swiper = useSwiper()
  return (
    <div className={containerStyles}>
      <button
        aria-label='Move to previous project'
        className={btnStyles}
        onClick={() => swiper.slidePrev()}
      >
        <PiCaretLeftBold className='cursor-pointer' />
      </button>
      <button
        aria-label='Move to next project'
        className={btnStyles}
        onClick={() => swiper.slideNext()}
      >
        <PiCaretRightBold className='cursor-pointer' />
      </button>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, {
      passive: true,
    })
    return () =>
      window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className='fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-accent-default text-primary shadow-lg hover:bg-accent-hover transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95'
      aria-label='Back to top'
    >
      <FiArrowUp size={20} />
    </button>
  )
}

'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const article = document.querySelector('article')
      if (!article) return

      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = article.scrollHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      // Calculate how far through the article the user has scrolled
      const start = articleTop
      const end = articleTop + articleHeight - windowHeight
      const current = scrollY - start
      const total = end - start

      if (total <= 0) {
        setProgress(100)
        return
      }

      const pct = Math.min(
        Math.max((current / total) * 100, 0),
        100,
      )
      setProgress(pct)
    }

    window.addEventListener('scroll', updateProgress, {
      passive: true,
    })
    updateProgress()
    return () =>
      window.removeEventListener('scroll', updateProgress)
  }, [])

  if (progress <= 0) return null

  return (
    <div
      className='fixed top-0 left-0 z-[200] h-[3px] bg-accent-default transition-[width] duration-150 ease-out'
      style={{ width: `${progress}%` }}
      role='progressbar'
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label='Reading progress'
    />
  )
}

'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { PiCloudSun } from 'react-icons/pi'
import { PiMoonStarsDuotone } from 'react-icons/pi'

export function ThemeToggle({
  scrolled = false,
}: {
  scrolled?: boolean
}) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!mounted) {
    return (
      <div className='w-10 h-10 rounded-full bg-foreground/10 animate-pulse' />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-10 h-10 flex items-center justify-center transition-all duration-300 cursor-pointer ${
        scrolled
          ? 'text-primary hover:text-primary/80'
          : 'text-foreground hover:text-foreground/80'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <PiCloudSun
        size={19}
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <PiMoonStarsDuotone
        size={19}
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  )
}

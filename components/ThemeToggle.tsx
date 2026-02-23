'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export function ThemeToggle({
  scrolled = false,
}: {
  scrolled?: boolean
}) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className='w-10 h-10 rounded-full bg-foreground/10 animate-pulse' />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
        scrolled
          ? 'bg-primary/10 hover:bg-primary/20 text-primary'
          : 'bg-foreground/10 hover:bg-foreground/20 text-foreground'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <FiSun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      <FiMoon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </button>
  )
}

'use client'

import { useState } from 'react'
import {
  FiCheck,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi'

interface CodeBlockClientProps {
  language: string
  code: string
  highlightedHtml: string
  lineCount: number
  showLineNumbers?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  highlightLines?: number[]
}

export default function CodeBlockClient({
  language,
  code,
  highlightedHtml,
  lineCount,
  showLineNumbers = true,
  collapsible = false,
  defaultCollapsed = false,
  highlightLines = [],
}: CodeBlockClientProps) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(
    defaultCollapsed,
  )

  const highlightSet = new Set(highlightLines)
  const lines = code.split('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API may not be available
    }
  }

  return (
    <div className='relative rounded-lg border border-[#d1d5db] dark:border-white/10 overflow-hidden font-mono text-sm my-4 bg-[#f6f8fa] dark:bg-[#0d1117] shadow-sm dark:shadow-none'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-2.5 border-b border-[#d1d5db] dark:border-white/10 bg-[#ebeef1] dark:bg-[#161b22]'>
        <div className='flex items-center gap-3'>
          <span className='text-xs font-semibold uppercase text-[#57606a] dark:text-white/40'>
            {language}
          </span>
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className='p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#57606a] dark:text-white/40'
              aria-label={
                collapsed ? 'Expand code' : 'Collapse code'
              }
            >
              {collapsed ? (
                <FiChevronDown size={14} />
              ) : (
                <FiChevronUp size={14} />
              )}
            </button>
          )}
        </div>
        <button
          onClick={handleCopy}
          aria-label='Copy code'
          className={`p-1.5 rounded transition-colors ${
            copied
              ? 'text-accent-default'
              : 'text-[#57606a] dark:text-white/40 hover:text-[#24292f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          {copied ? (
            <FiCheck size={14} />
          ) : (
            <FiCopy size={14} />
          )}
        </button>
      </div>

      {/* Code */}
      <div
        className={`${collapsed ? 'max-h-0 overflow-hidden' : ''}`}
      >
        <div className='flex overflow-x-auto text-[13px]'>
          {showLineNumbers && (
            <div className='shrink-0 py-3 pl-3 pr-1 select-none border-r border-[#d1d5db] dark:border-white/10 bg-[#ebeef1] dark:bg-[#0d1117] text-[#8b949e] dark:text-white/30'>
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className={`text-right leading-relaxed pr-2 cursor-pointer hover:text-accent-default transition-colors ${
                    highlightSet.has(i + 1)
                      ? 'text-accent-default'
                      : ''
                  }`}
                  onClick={() =>
                    navigator.clipboard.writeText(lines[i])
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigator.clipboard.writeText(lines[i])
                    }
                  }}
                  role='button'
                  tabIndex={0}
                  title={typeof window !== 'undefined' ? 'Click to copy line' : ''}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <div
            className='shiki-wrapper flex-1 overflow-x-auto py-3 px-4 [&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_pre]:leading-relaxed! [&_code]:bg-transparent! [&_code]:p-0! [&_code]:m-0! [&_code]:text-[13px]! [&_code]:leading-relaxed! [&_.line]:leading-relaxed [&_.line]:block'
            dangerouslySetInnerHTML={{
              __html: highlightedHtml,
            }}
          />
        </div>
      </div>
    </div>
  )
}

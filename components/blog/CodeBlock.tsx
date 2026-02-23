'use client'

import { useState, useEffect } from 'react'
import {
  FiCheck,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css'
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml'

SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('js', js)
SyntaxHighlighter.registerLanguage('jsx', js)
SyntaxHighlighter.registerLanguage('typescript', ts)
SyntaxHighlighter.registerLanguage('ts', ts)
SyntaxHighlighter.registerLanguage('tsx', ts)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('shell', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('html', xml)
SyntaxHighlighter.registerLanguage('xml', xml)

const codeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: '#e5e7eb',
    background: '#1a1a2e',
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    color: '#e5e7eb',
    background: '#1a1a2e',
    margin: 0,
    padding: 0,
  },
  comment: { color: '#6b7280', fontStyle: 'italic' },
  punctuation: { color: '#9ca3af' },
  property: { color: '#f87171' },
  tag: { color: '#f87171' },
  boolean: { color: '#f87171' },
  number: { color: '#f87171' },
  selector: { color: '#34d399' },
  'attr-name': { color: '#34d399' },
  string: { color: '#34d399' },
  char: { color: '#34d399' },
  builtin: { color: '#34d399' },
  operator: { color: '#93c5fd' },
  entity: { color: '#93c5fd' },
  url: { color: '#93c5fd' },
  atrule: { color: '#c084fc' },
  'attr-value': { color: '#c084fc' },
  keyword: { color: '#c084fc' },
  function: { color: '#fbbf24' },
  'class-name': { color: '#fbbf24' },
  regex: { color: '#fb923c' },
  important: { color: '#fb923c' },
  variable: { color: '#fb923c' },
}

interface CodeBlockProps {
  language?: string
  showLineNumbers?: boolean
  children: string
  highlight?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export default function CodeBlock({
  children,
  language: propLanguage = 'text',
  showLineNumbers = true,
  highlight,
  collapsible = false,
  defaultCollapsed = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(
    defaultCollapsed,
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const codeString = children.trim()

  const highlightLines = new Set<number>()
  if (highlight) {
    highlight.split(',').forEach((part) => {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number)
        for (let i = start; i <= end; i++)
          highlightLines.add(i)
      } else {
        highlightLines.add(Number(trimmed))
      }
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) {
    return (
      <div className='rounded-lg border border-white/10 overflow-hidden my-4 bg-[#1a1a2e]'>
        <div className='px-4 py-2.5 border-b border-white/10'>
          <span className='text-xs font-semibold uppercase text-white/40'>
            {propLanguage}
          </span>
        </div>
        <pre className='p-4 text-sm text-white/80 overflow-x-auto'>
          <code>{codeString}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className='relative rounded-lg border border-white/10 overflow-hidden font-mono text-sm my-4 bg-[#1a1a2e]'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#1a1a2e]'>
        <div className='flex items-center gap-3'>
          <span className='text-xs font-semibold uppercase text-white/40'>
            {propLanguage}
          </span>
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className='p-1 rounded hover:bg-white/10 transition-colors text-white/40'
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
          className={`p-1.5 rounded transition-colors ${
            copied
              ? 'text-accent-default'
              : 'text-white/40 hover:text-white hover:bg-white/10'
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
        className={`flex ${collapsed ? 'max-h-0 overflow-hidden' : ''}`}
      >
        {showLineNumbers && (
          <div className='px-3 py-4 select-none border-r border-white/10 bg-[#1a1a2e] text-white/30'>
            {codeString.split('\n').map((_, i) => (
              <div
                key={i}
                className='text-right leading-6 pr-2 cursor-pointer hover:text-accent-default transition-colors'
                onClick={() => {
                  const line = codeString.split('\n')[i]
                  navigator.clipboard.writeText(line)
                }}
                title='Click to copy line'
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <SyntaxHighlighter
          language={propLanguage}
          style={codeTheme}
          showLineNumbers={false}
          wrapLines
          lineProps={(lineNumber) => {
            const isHighlighted =
              highlightLines.has(lineNumber)
            return {
              'data-line': lineNumber - 1,
              style: {
                display: 'block',
                width: '100%',
                backgroundColor: isHighlighted
                  ? 'rgba(133, 209, 219, 0.15)'
                  : 'transparent',
                paddingLeft: '1rem',
                marginLeft: '-1rem',
                borderLeft: isHighlighted
                  ? '3px solid oklch(0.8542 0.0517 199.29)'
                  : 'none',
              },
            }
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

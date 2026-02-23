import { codeToHtml } from 'shiki'
import CodeBlockClient from './CodeBlockClient'

interface CodeBlockProps {
  language?: string
  showLineNumbers?: boolean
  children: string
  highlight?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

function parseHighlightLines(highlight?: string): number[] {
  if (!highlight) return []
  const lines: number[] = []
  highlight.split(',').forEach((part) => {
    const trimmed = part.trim()
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number)
      for (let i = start; i <= end; i++) lines.push(i)
    } else {
      lines.push(Number(trimmed))
    }
  })
  return lines
}

export default async function CodeBlock({
  children,
  language: propLanguage = 'text',
  showLineNumbers = true,
  highlight,
  collapsible = false,
  defaultCollapsed = false,
}: CodeBlockProps) {
  const code = children.trim()
  const lineCount = code.split('\n').length
  const highlightLines = parseHighlightLines(highlight)

  let highlightedHtml: string
  try {
    highlightedHtml = await codeToHtml(code, {
      lang: propLanguage,
      theme: 'github-dark',
    })
    // Shiki puts \n between .line spans. Inside <pre> (white-space:pre),
    // these render as line breaks ON TOP of .line being display:block → double spacing.
    highlightedHtml = highlightedHtml.replace(
      /<\/span>\n<span class="line">/g,
      '</span><span class="line">',
    )
  } catch {
    // Fallback for unsupported languages — wrap in pre/code with escaped HTML
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    highlightedHtml = `<pre><code>${escaped}</code></pre>`
  }

  return (
    <CodeBlockClient
      language={propLanguage}
      code={code}
      highlightedHtml={highlightedHtml}
      lineCount={lineCount}
      showLineNumbers={showLineNumbers}
      collapsible={collapsible}
      defaultCollapsed={defaultCollapsed}
      highlightLines={highlightLines}
    />
  )
}

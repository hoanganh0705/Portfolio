import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(
  _components?: MDXComponents,
): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className='text-3xl font-bold mt-16 mb-8 text-foreground leading-tight'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-2xl font-semibold mt-12 mb-6 text-foreground scroll-mt-28'>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='text-xl font-semibold mt-8 mb-4 text-foreground scroll-mt-28'>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className='text-lg leading-relaxed text-foreground/80 my-5'>
        {children}
      </p>
    ),
    pre: ({ children }) => (
      <pre className='not-prose bg-secondary text-foreground/90 p-5 rounded-xl overflow-x-auto text-sm my-8 border border-border'>
        {children}
      </pre>
    ),
    code: ({ children, className }) => {
      // Inline code (no className means it's inline)
      if (!className) {
        return (
          <code className='bg-accent-default/20 text-accent-default px-1.5 py-0.5 rounded text-sm font-mono'>
            {children}
          </code>
        )
      }
      // Block code (has className from syntax highlighting)
      return <code className={className}>{children}</code>
    },
    ul: ({ children }) => (
      <ul
        role='list'
        className='list-none space-y-2 pl-5 my-4'
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='list-decimal space-y-2 pl-5 my-4 text-foreground/80 [&>li]:before:content-none [&>li]:before:mr-0'>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-foreground/80 before:content-['▹'] before:mr-2 before:text-accent-default">
        {children}
      </li>
    ),
    a: ({ children, href }) => {
      const isExternal = href?.startsWith('http')
      return (
        <a
          href={href}
          className='text-accent-default hover:text-accent-hover underline underline-offset-4 transition-colors'
          target={isExternal ? '_blank' : undefined}
          rel={
            isExternal ? 'noopener noreferrer' : undefined
          }
        >
          {children}
          {isExternal && (
            <span className='sr-only'>
              {' '}
              (opens in new tab)
            </span>
          )}
        </a>
      )
    },
    blockquote: ({ children }) => (
      <blockquote className='border-l-4 border-accent-default pl-6 my-6 italic text-muted-foreground'>
        {children}
      </blockquote>
    ),
    hr: () => <hr className='border-border my-8' />,
    strong: ({ children }) => (
      <strong className='font-bold text-foreground'>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className='italic text-foreground/90'>
        {children}
      </em>
    ),
    table: ({ children }) => (
      <div className='my-8 overflow-x-auto rounded-lg border border-border'>
        <table className='w-full min-w-[600px] table-auto border-collapse'>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className='border border-border px-4 py-3 text-left text-sm font-semibold text-foreground bg-foreground/5'>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className='border border-border px-4 py-3 text-sm text-foreground/80'>
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className='hover:bg-foreground/5 transition-colors'>
        {children}
      </tr>
    ),
  }
}

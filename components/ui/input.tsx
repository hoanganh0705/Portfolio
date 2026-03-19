import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'flex h-12 rounded-md border border-border bg-background px-4 py-5 text-base text-foreground placeholder:text-muted-foreground font-light focus-visible:outline-none focus-visible:border-accent-default focus-visible:ring-2 focus-visible:ring-accent-default/40 focus-visible:ring-offset-0',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

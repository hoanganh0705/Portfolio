import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  cva,
  type VariantProps,
} from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-semibold ring-offset-white transition-colors cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-accent-default text-primary hover:bg-accent-hover',
        primary: 'bg-primary text-primary-foreground',
        outline:
          'border border-accent-default bg-transparent text-accent-default hover:bg-accent-default hover:text-primary',
      },
      size: {
        default: 'h-[44px] px-6',
        md: 'h-[48px] px-6',
        lg: 'h-[50px] px-8 text-sm uppercase tracking-[2px]',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot='button'
      className={cn(
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }

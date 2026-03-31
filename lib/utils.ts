import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Blog detail routes like /en/blog/some-slug should not trigger full-page transitions */
export const isBlogDetail = (path: string) =>
  /^\/(en|vi)\/blog\/.+/.test(path)

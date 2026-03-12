import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

const WorkClient = dynamic(
  () => import('@/components/work/WorkClient'),
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  return createMetadata({
    title: dict.work.pageTitle,
    description: dict.work.pageDesc,
    keywords: [
      'projects',
      'portfolio',
      'web development projects',
      'full-stack applications',
      'next.js projects',
    ],
    path: '/work',
    locale,
    ogImage:
      'https://github.com/hoanganh0705/image_container/blob/main/portfolio-image/service.png?raw=true',
  })
}

export default function Work() {
  return <WorkClient />
}

import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

// bundle-dynamic-imports: lazy-load heavy client component
const ResumeClient = dynamic(
  () => import('@/components/resume/ResumeClient'),
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  return createMetadata({
    title: dict.resume.experience,
    description: dict.resume.experienceDesc,
    keywords: [
      'resume',
      'education',
      'experience',
      'web developer skills',
      'next.js',
      'react',
      'tailwind css',
    ],
    path: '/resume',
    locale,
    ogImage:
      'https://github.com/hoanganh0705/image_container/blob/main/portfolio-image/resume.png?raw=true',
  })
}

export default function Resume() {
  return <ResumeClient />
}

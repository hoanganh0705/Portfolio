import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'

// bundle-dynamic-imports: lazy-load heavy client component
const ResumeClient = dynamic(
  () => import('@/components/resume/ResumeClient'),
)

export const metadata = createMetadata({
  title: 'Resume',
  description:
    'View the resume of Nguyen Hoang Anh (Anh Nguyen Dev) — education, professional experience, and technical skills in web development and teaching.',
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
  ogImage:
    'https://github.com/hoanganh0705/image_container/blob/main/portfolio-image/resume.png?raw=true',
})

export default function Resume() {
  return <ResumeClient />
}

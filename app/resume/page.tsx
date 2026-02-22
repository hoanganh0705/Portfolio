import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'

// bundle-dynamic-imports: lazy-load heavy client component
const ResumeClient = dynamic(
  () => import('@/components/ResumeClient'),
)

export const metadata = createMetadata({
  title: 'Resume',
  description:
    'Learn about my educational background and professional experience as a web developer and educator.',
  keywords: [
    'resume',
    'education',
    'experience',
    'web developer',
  ],
  ogImage:
    'https://github.com/nguyennanhcd/image_container/blob/main/portfolio-image/resume.png?raw=true',
})

export default function Resume() {
  return <ResumeClient />
}

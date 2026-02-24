import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'

const WorkClient = dynamic(
  () => import('@/components/work/WorkClient'),
)

export const metadata = createMetadata({
  title: 'Work & Projects',
  description:
    'Browse the portfolio of Anh Nguyen Dev — showcasing innovative web development projects, creative solutions, and full-stack applications.',
  keywords: [
    'projects',
    'portfolio',
    'web development projects',
    'full-stack applications',
    'next.js projects',
  ],
  path: '/work',
  ogImage:
    'https://github.com/hoanganh0705/image_container/blob/main/portfolio-image/service.png?raw=true',
})

export default function Work() {
  return <WorkClient />
}

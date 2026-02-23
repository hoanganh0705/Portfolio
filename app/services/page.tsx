import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'

const ServicesClient = dynamic(
  () => import('@/components/ServicesClient'),
)

export const metadata = createMetadata({
  title: 'Services',
  description:
    'Professional services by Anh Nguyen Dev: full-stack web development, personalized tutoring, English teaching, and SEO optimization in Vietnam.',
  keywords: [
    'web development services',
    'freelance web developer',
    'english teacher vietnam',
    'private tutor',
    'seo optimization',
    'hire developer',
  ],
  path: '/services',
  ogImage:
    'https://gitlab.com/nguyennanhcd1/image-container/-/raw/main/portfolio-image/Screenshot%202025-06-21%20073227.png?ref_type=heads',
})

export default function Services() {
  return <ServicesClient />
}

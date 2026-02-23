import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'

// bundle-dynamic-imports: lazy-load heavy client component with motion animations
const ContactClient = dynamic(
  () => import('@/components/ContactClient'),
)

export const metadata = createMetadata({
  title: 'Contact',
  description:
    'Get in touch with Anh Nguyen Dev for web development projects, tutoring inquiries, or collaboration opportunities.',
  keywords: [
    'contact',
    'hire web developer',
    'collaboration',
    'freelance inquiry',
  ],
  path: '/contact',
  ogImage:
    'https://github.com/nguyennanhcd/image_container/blob/main/portfolio-image/contact.png?raw=true',
})

export default function Contact() {
  return <ContactClient />
}

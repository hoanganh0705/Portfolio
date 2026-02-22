import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'

// bundle-dynamic-imports: lazy-load heavy client component with motion animations
const ContactClient = dynamic(
  () => import('@/components/ContactClient'),
)

export const metadata = createMetadata({
  title: 'Contact',
  description:
    'Get in touch with me for collaboration, inquiries, or project discussions.',
  keywords: [
    'contact',
    'web developer',
    'collaboration',
    'freelance',
  ],
  ogImage:
    'https://github.com/nguyennanhcd/image_container/blob/main/portfolio-image/contact.png?raw=true',
})

export default function Contact() {
  return <ContactClient />
}

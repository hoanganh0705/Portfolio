import dynamic from 'next/dynamic'
import { createMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

// bundle-dynamic-imports: lazy-load heavy client component with motion animations
const ContactClient = dynamic(
  () => import('@/components/contact/ContactClient'),
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  return createMetadata({
    title: dict.contact.title,
    description: dict.contact.description,
    keywords: [
      'contact',
      'hire web developer',
      'collaboration',
      'freelance inquiry',
    ],
    path: '/contact',
    locale,
    ogImage:
      'https://github.com/hoanganh0705/image_container/blob/main/portfolio-image/contact.png?raw=true',
  })
}

export default function Contact() {
  return <ContactClient />
}

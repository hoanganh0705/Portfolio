import dynamic from 'next/dynamic'
import { services } from '@/constants/services'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/lib/site-config'

const ServicePages = dynamic(
  () => import('@/components/PagesService'),
)

export async function generateStaticParams() {
  return services.map(({ href }) => ({
    slug: href.split('/').pop(),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((s) =>
    s.href.endsWith(slug),
  )
  if (!service) return {}

  const canonicalUrl = `${siteConfig.url}/services/${slug}`
  return {
    title: `${service.title} — Services by Anh Nguyen Dev`,
    description: service.description,
    keywords: [
      'anh nguyen dev',
      'anhnguyendev',
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} service`,
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = services.find((s) =>
    s.href.endsWith(slug),
  )

  if (!service) return notFound()

  return <ServicePages service={service} />
}

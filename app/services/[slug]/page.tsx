import dynamic from 'next/dynamic'
import { services } from '@/constants/services'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
  return {
    title: `${service.title} | Services`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
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

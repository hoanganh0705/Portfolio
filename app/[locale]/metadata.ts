import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isVietnamese = locale === 'vi'

  const title = isVietnamese
    ? 'Nguyễn Hoàng Anh | Full-Stack Developer'
    : 'Anh Nguyen | Full-Stack Developer'

  const description = isVietnamese
    ? 'Nguyễn Hoàng Anh (Anh Nguyen / anhnguyendev) là Full-Stack Developer ở Việt Nam, xây dựng sản phẩm web hiện đại bằng Next.js, React, TypeScript và tối ưu SEO.'
    : 'Anh Nguyen (anhnguyendev) is a Full-Stack Developer in Vietnam, building modern web experiences with Next.js, React, TypeScript, and SEO-focused engineering.'

  return createMetadata({
    title,
    description,
    keywords: [
      'Nguyễn Hoàng Anh',
      'Anh Nguyen',
      'Full-Stack Developer',
      'full stack developer',
      'anhnguyendev',
      'portfolio',
      'web developer vietnam',
      'next.js developer',
      'react developer',
      'seo specialist',
    ],
    path: '',
    locale,
    ogImage: '/og/portfolio-default.png',
  })
}

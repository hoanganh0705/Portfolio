import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

import Header from '@/components/layout/Header'
import PageTransition from '@/components/layout/PageTransition'
import StairTransition from '@/components/layout/StairTransition'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { json_ld } from '@/lib/json-ld'
import { siteConfig } from '@/lib/site-config'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: [
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
  ],
  variable: '--font-jetbrainsMono',
  preload: true,
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'anh nguyen dev',
    'anhnguyendev',
    'nguyen hoang anh',
    'web developer vietnam',
    'full-stack developer',
    'next.js developer',
    'english teacher vietnam',
    'private tutor',
    'seo specialist',
    'freelance developer',
  ],
  authors: [
    { name: siteConfig.author.name, url: siteConfig.url },
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={jetbrainsMono.variable}>
        <ThemeProvider>
          <Header />
          <StairTransition />
          <PageTransition>{children}</PageTransition>
          <Toaster
            toastOptions={{
              style: {
                textAlign: 'center',
              },
            }}
          />
          <Script
            id='organization-ld-json'
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(json_ld),
            }}
            strategy='afterInteractive'
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

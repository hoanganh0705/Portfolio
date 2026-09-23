import type { NextConfig } from 'next'
import BundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'
import { securityHeaders } from '@/lib/security-headers'

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // Redirect www → non-www (covers both http and https)
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.anhnguyendev.tech' },
        ],
        destination: 'https://anhnguyendev.tech/:path*',
        permanent: true,
      },
    ]
  },
}

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'metadata' }],
    ],
    rehypePlugins: ['rehype-slug'],
  },
})

export default withMDX(withBundleAnalyzer(nextConfig))

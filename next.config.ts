import type { NextConfig } from 'next';
import BundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  async redirects() {
    return [
      // Redirect www → non-www (covers both http and https)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.anhnguyendev.me' }],
        destination: 'https://anhnguyendev.me/:path*',
        permanent: true,
      },
    ]
  },
};

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'metadata' }],
    ],
    rehypePlugins: [],
  },
});

export default withMDX(withBundleAnalyzer(nextConfig));
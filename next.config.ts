import type { NextConfig } from 'next';
import BundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',
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

export default withBundleAnalyzer(nextConfig);
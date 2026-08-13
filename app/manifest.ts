import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// manifest file is used to provide metadata about the web application, such as its name, description, icons, and theme colors. It allows users to install the web app on their devices and provides a more native app-like experience. The manifest file is essential for Progressive Web Apps (PWAs) and helps improve user engagement and accessibility.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#1A202C',
    theme_color: '#FF5733',
    scope: '/',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Anh Nguyen Dev — Full-Stack Web Developer & Educator',
    short_name: 'Anh Nguyen Dev',
    description:
      'Portfolio of Nguyen Hoang Anh (anhnguyendev), a full-stack web developer and educator offering web development, tutoring, and SEO services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A202C',
    theme_color: '#FF5733',
    lang: 'en-US',
    scope: '/',
  }
}
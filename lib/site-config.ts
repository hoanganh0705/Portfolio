/** Centralized site configuration — single source of truth for SEO */
export const siteConfig = {
  url: 'https://anhnguyendev.tech',
  name: 'Anh Nguyen Dev',
  shortName: 'anhnguyendev',
  title: 'Nguyễn Hoàng Anh | Full-Stack Developer',
  description:
    'Nguyễn Hoàng Anh (Anh Nguyen / anhnguyendev) is a Full-Stack Developer based in Vietnam, building modern web experiences with Next.js, React, TypeScript, and SEO-focused engineering.',
  locale: 'en-US',
  author: {
    name: 'Nguyễn Hoàng Anh',
    alternateName: [
      'Anh Nguyen',
      'Anh Nguyen Dev',
      'anhnguyendev',
      'Nguyen Hoang Anh',
    ],
    email:
      process.env.CONTACT_TO_EMAIL || 'anh487303@gmail.com',
    phone: process.env.CONTACT_PHONE || '(+84) 985 335 735',
    jobTitle: 'Full-Stack Developer',
    location: 'Ho Chi Minh City, Vietnam',
  },
  social: {
    github: 'https://github.com/hoanganh0705',
    facebook: 'https://www.facebook.com/hoang.aanh.225907',
    linkedin:
      'https://www.linkedin.com/in/nguyen-anh-3974a4305/',
  },
  defaultOgImage: '/og/portfolio-default.png',
  cvFilePath: '/CV/main.pdf',
} as const

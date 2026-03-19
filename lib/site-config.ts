/** Centralized site configuration — single source of truth for SEO */
export const siteConfig = {
  url: 'https://anhnguyendev.me',
  name: 'Anh Nguyen Dev',
  shortName: 'Anh Nguyen Dev',
  title: 'Anh Nguyen Dev — Full-Stack Web Developer & Educator',
  description:
    'Nguyen Hoang Anh (anhnguyendev) is a full-stack web developer and educator based in Vietnam. Specializing in Next.js, React, Tailwind CSS, private tutoring, English teaching, and SEO optimization.',
  locale: 'en-US',
  author: {
    name: 'Nguyen Hoang Anh',
    alternateName: ['Anh Nguyen Dev', 'anhnguyendev', 'anh nguyen dev', 'Nguyễn Hoàng Anh'],
    email: process.env.CONTACT_TO_EMAIL || 'anh487303@gmail.com',
    phone: process.env.CONTACT_PHONE || '(+84) 985 335 735',
    jobTitle: 'Full-Stack Web Developer & Educator',
    location: 'Ho Chi Minh City, Vietnam',
  },
  social: {
    github: 'https://github.com/hoanganh0705',
    facebook: 'https://www.facebook.com/hoang.aanh.225907',
    linkedin: 'https://www.linkedin.com/in/nguyen-anh-3974a4305/',
  },
  defaultOgImage:
    'https://gitlab.com/nguyennanhcd1/image-container/-/raw/main/portfolio-image/Screenshot%202025-06-21%20072326.png?ref_type=heads',
  cvFilePath: '/cv/nguyen-hoang-anh-cv.pdf',
} as const

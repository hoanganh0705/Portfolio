export const projects = [
  {
    num: '01',
    category: 'fullstack',
    title: 'Portfolio Website',
    description:
      'My personal portfolio and blog built with Next.js 16, featuring i18n support (EN/VI), MDX blog with syntax highlighting, dark/light themes, Framer Motion page transitions, and full SEO optimization with JSON-LD structured data.',
    stack: [
      { name: 'Next.js' },
      { name: 'React' },
      { name: 'Tailwind CSS' },
      { name: 'MDX' },
    ],
    image: '/assets/work/thumb1.png',
    live: 'https://anhnguyendev.me',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },

  {
    num: '02',
    category: 'fullstack',
    title: 'Blog Platform',
    description:
      'A content-rich blog platform with featured posts, category filtering, table of contents, code syntax highlighting via Shiki, and responsive design. Supports bilingual content with automatic locale detection.',
    stack: [
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'MDX' },
      { name: 'Shiki' },
    ],
    image: '/assets/work/thumb1.png',
    live: 'https://anhnguyendev.me/en/blog',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
  {
    num: '03',
    category: 'frontend',
    title: 'Contact & Email System',
    description:
      'A production-ready contact system with form validation (Zod), rate limiting, and automated email delivery via Resend. Includes custom email templates and real-time toast notifications for user feedback.',
    stack: [
      { name: 'React' },
      { name: 'Zod' },
      { name: 'Resend' },
      { name: 'Server Actions' },
    ],
    image: '/assets/work/thumb1.png',
    live: 'https://anhnguyendev.me/en/contact',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
]

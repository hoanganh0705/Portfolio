export interface Project {
  slug: string
  num: string
  category: string
  title: string
  description: string
  stack: { name: string }[]
  image: string
  live: string
  github: string
  caseStudy: {
    challenge: string
    approach: string
    result: string
  }
}

export const projects: Project[] = [
  {
    slug: 'portfolio-website',
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
    caseStudy: {
      challenge:
        'Create a portfolio that presents development work, content, and services in both English and Vietnamese while staying fast and SEO-friendly.',
      approach:
        'Built on Next.js App Router with locale routing, MDX content pipelines, reusable UI primitives, and server-rendered metadata utilities for each route.',
      result:
        'Delivered a bilingual portfolio/blog with consistent UX, strong discoverability signals (JSON-LD, sitemap, Open Graph), and maintainable content workflows.',
    },
  },

  {
    slug: 'blog-platform',
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
    caseStudy: {
      challenge:
        'Design a developer blog that is easy to author in MDX while still readable and useful for technical audiences.',
      approach:
        'Implemented frontmatter-driven MDX posts with featured sections, search/filter UI, heading-based table of contents, and Shiki code highlighting.',
      result:
        'Created a scalable content platform with richer reading UX and improved retention through recommendations and internal navigation.',
    },
  },
  {
    slug: 'contact-email-system',
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
    caseStudy: {
      challenge:
        'Build a contact workflow that feels instant for users while preventing low-quality or abusive form submissions.',
      approach:
        'Used a server action with Zod validation, honeypot checks, in-memory throttling, and parallel email delivery via Resend + React Email templates.',
      result:
        'Shipped a production contact pipeline with improved resilience and clear feedback via toast notifications for success and failure states.',
    },
  },
]

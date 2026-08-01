// Language-independent project metadata only.
// All user-facing strings (title, description, category, case study)
// live in the i18n dictionary under `dict.work.projects[]`, keyed by slug.
export interface ProjectMeta {
  slug: string
  num: string
  image: string
  live: string
  github: string
}

export const projects: ProjectMeta[] = [
  {
    slug: 'portfolio-website',
    num: '01',
    image: '/assets/work/thumb1.png',
    live: 'https://anhnguyendev.me',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
  {
    slug: 'blog-platform',
    num: '02',
    image: '/assets/work/thumb1.png',
    live: 'https://anhnguyendev.me/en/blog',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
  {
    slug: 'contact-email-system',
    num: '03',
    image: '/assets/work/thumb1.png',
    live: 'https://anhnguyendev.me/en/contact',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
]

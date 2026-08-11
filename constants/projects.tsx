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
    image: '/assets/work/portfolio.png',
    live: 'https://anhnguyendev.me',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
  {
    slug: 'quiz-system',
    num: '02',
    image: '/assets/work/quiz.png',
    live: 'https://anhnguyendev.me/en/quiz-system',
    github: 'https://github.com/hoanganh0705/Portfolio',
  },
]

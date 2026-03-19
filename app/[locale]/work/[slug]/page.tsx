import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { projects } from '@/constants/projects'
import { createMetadata } from '@/lib/metadata'
import { getDictionary } from '@/lib/dictionaries'
import { locales, type Locale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({
      locale,
      slug: project.slug,
    })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = projects.find(
    (item) => item.slug === slug,
  )

  if (!project) {
    return createMetadata({
      title: 'Case study',
      path: `/work/${slug}`,
      locale,
    })
  }

  return createMetadata({
    title: `${project.title} Case Study`,
    description: project.description,
    path: `/work/${slug}`,
    locale,
  })
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const project = projects.find(
    (item) => item.slug === slug,
  )

  if (!project) notFound()

  const dict = await getDictionary(locale as Locale)

  return (
    <section className='min-h-[80vh] py-12 xl:py-20'>
      <div className='container mx-auto px-2 xl:px-0 max-w-4xl'>
        <p className='text-sm uppercase tracking-[2px] text-muted-foreground'>
          {project.category} {dict.work.project}
        </p>
        <h1 className='h2 mt-2 mb-6'>{project.title}</h1>
        <p className='text-muted-foreground mb-10'>
          {project.description}
        </p>

        <div className='grid gap-6'>
          <article className='rounded-xl border border-border p-6 bg-secondary/50'>
            <h2 className='text-xl font-semibold mb-3'>
              Challenge
            </h2>
            <p className='text-muted-foreground'>
              {project.caseStudy.challenge}
            </p>
          </article>

          <article className='rounded-xl border border-border p-6 bg-secondary/50'>
            <h2 className='text-xl font-semibold mb-3'>
              Approach
            </h2>
            <p className='text-muted-foreground'>
              {project.caseStudy.approach}
            </p>
          </article>

          <article className='rounded-xl border border-border p-6 bg-secondary/50'>
            <h2 className='text-xl font-semibold mb-3'>
              Result
            </h2>
            <p className='text-muted-foreground'>
              {project.caseStudy.result}
            </p>
          </article>
        </div>

        <div className='mt-10 flex flex-wrap gap-4'>
          <Button asChild>
            <Link href={project.live}>
              {dict.work.liveProject}
            </Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href={project.github}>
              {dict.work.githubRepo}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

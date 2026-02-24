export default function BlogPostLoading() {
  return (
    <div className='min-h-screen'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Back button skeleton */}
        <div className='h-10 w-32 bg-foreground/10 rounded-lg mb-8 animate-pulse' />

        <article>
          {/* Header skeleton */}
          <div className='mb-8'>
            <div className='flex flex-wrap items-center gap-3 mb-4'>
              <div className='h-6 w-16 bg-foreground/10 rounded-full animate-pulse' />
              <div className='h-4 w-4 bg-foreground/10 rounded-full animate-pulse' />
              <div className='h-4 w-20 bg-foreground/10 rounded animate-pulse' />
            </div>
            <div className='h-12 w-3/4 bg-foreground/10 rounded-lg mb-4 animate-pulse' />
            <div className='h-4 w-1/2 bg-foreground/10 rounded animate-pulse mb-6' />
            <div className='flex items-center gap-3'>
              <div className='h-12 w-12 bg-foreground/10 rounded-full animate-pulse' />
              <div className='space-y-2'>
                <div className='h-4 w-24 bg-foreground/10 rounded animate-pulse' />
                <div className='h-3 w-32 bg-foreground/10 rounded animate-pulse' />
              </div>
            </div>
          </div>

          {/* Hero image skeleton */}
          <div className='h-96 bg-foreground/10 rounded-lg mb-8 animate-pulse' />

          {/* Excerpt skeleton */}
          <div className='mb-8 rounded-lg border border-border bg-foreground/5 p-6'>
            <div className='space-y-2'>
              <div className='h-4 w-full bg-foreground/10 rounded animate-pulse' />
              <div className='h-4 w-4/5 bg-foreground/10 rounded animate-pulse' />
            </div>
          </div>

          {/* Content skeleton */}
          <div className='space-y-6 mb-12'>
            <div className='h-8 w-1/3 bg-foreground/10 rounded animate-pulse' />
            <div className='space-y-3'>
              <div className='h-4 w-full bg-foreground/10 rounded animate-pulse' />
              <div className='h-4 w-full bg-foreground/10 rounded animate-pulse' />
              <div className='h-4 w-3/4 bg-foreground/10 rounded animate-pulse' />
            </div>
            <div className='h-8 w-1/4 bg-foreground/10 rounded animate-pulse' />
            <div className='space-y-3'>
              <div className='h-4 w-full bg-foreground/10 rounded animate-pulse' />
              <div className='h-4 w-full bg-foreground/10 rounded animate-pulse' />
              <div className='h-4 w-5/6 bg-foreground/10 rounded animate-pulse' />
            </div>
            <div className='h-32 bg-foreground/10 rounded-lg animate-pulse' />
          </div>
        </article>
      </div>
    </div>
  )
}

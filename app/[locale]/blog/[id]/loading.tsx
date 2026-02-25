export default function BlogPostLoading() {
  return (
    <div className='min-h-screen'>
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Breadcrumb skeleton */}
        <div className='flex items-center gap-2 mb-6'>
          <div className='h-4 w-4 bg-foreground/10 rounded animate-pulse' />
          <div className='h-3 w-1 bg-foreground/10 rounded animate-pulse' />
          <div className='h-4 w-12 bg-foreground/10 rounded animate-pulse' />
          <div className='h-3 w-1 bg-foreground/10 rounded animate-pulse' />
          <div className='h-4 w-40 bg-foreground/10 rounded animate-pulse' />
        </div>

        {/* Back button skeleton */}
        <div className='h-10 w-32 bg-foreground/10 rounded-lg mb-8 animate-pulse' />

        {/* 3-column grid matching PostDetailLayout */}
        <div className='grid grid-cols-1 xl:grid-cols-[220px_1fr_220px] gap-8'>
          {/* Left sidebar — TOC skeleton */}
          <aside className='hidden xl:block'>
            <div className='sticky top-24 space-y-3'>
              <div className='h-4 w-24 bg-foreground/10 rounded animate-pulse mb-4' />
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='h-3 bg-foreground/10 rounded animate-pulse'
                  style={{
                    width: `${70 + Math.random() * 30}%`,
                  }}
                />
              ))}
            </div>
          </aside>

          {/* Center column */}
          <div className='min-w-0 max-w-3xl mx-auto w-full'>
            <article>
              {/* Header skeleton */}
              <div className='mb-8'>
                <div className='flex flex-wrap items-center gap-3 mb-4'>
                  <div className='h-6 w-16 bg-foreground/10 rounded-full animate-pulse' />
                  <div className='h-4 w-4 bg-foreground/10 rounded-full animate-pulse' />
                  <div className='h-4 w-20 bg-foreground/10 rounded animate-pulse' />
                  <div className='h-4 w-16 bg-foreground/10 rounded animate-pulse' />
                </div>
                <div className='h-12 w-3/4 bg-foreground/10 rounded-lg mb-4 animate-pulse' />
                <div className='h-8 w-1/2 bg-foreground/10 rounded-lg mb-6 animate-pulse' />
                <div className='flex items-center gap-3 pt-4 border-t border-border'>
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

          {/* Right sidebar — Recommendations skeleton */}
          <aside className='hidden xl:block'>
            <div className='sticky top-24 space-y-4'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='h-4 w-4 bg-foreground/10 rounded animate-pulse' />
                <div className='h-3 w-16 bg-foreground/10 rounded animate-pulse' />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className='rounded-lg border border-border/50 bg-foreground/2 p-3 space-y-2'
                >
                  <div className='h-4 w-12 bg-foreground/10 rounded-full animate-pulse' />
                  <div className='h-3 w-full bg-foreground/10 rounded animate-pulse' />
                  <div className='h-3 w-3/4 bg-foreground/10 rounded animate-pulse' />
                  <div className='h-2 w-1/2 bg-foreground/10 rounded animate-pulse mt-2' />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

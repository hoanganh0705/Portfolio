export default function BlogLoading() {
  return (
    <div className='container mx-auto px-4 py-12'>
      {/* Title skeleton */}
      <div className='mb-12'>
        <div className='h-10 w-64 bg-foreground/10 rounded animate-pulse mb-4' />
        <div className='h-4 w-full max-w-lg bg-foreground/10 rounded animate-pulse' />
      </div>

      {/* Featured section skeleton */}
      <div className='mb-16'>
        <div className='h-7 w-48 bg-foreground/10 rounded mb-8 animate-pulse' />
        <div className='grid md:grid-cols-3 gap-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='h-52 rounded-xl border border-border bg-foreground/5 animate-pulse'
            />
          ))}
        </div>
      </div>

      {/* Post grid skeleton */}
      <div className='mb-8'>
        <div className='h-7 w-36 bg-foreground/10 rounded mb-8 animate-pulse' />
      </div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-64 rounded-xl border border-border bg-foreground/5 animate-pulse'
          />
        ))}
      </div>
    </div>
  )
}

export default function ResumeLoading() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex flex-col xl:flex-row gap-8'>
        {/* Sidebar tabs skeleton */}
        <div className='xl:w-[200px] flex xl:flex-col gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-10 bg-foreground/10 rounded-lg animate-pulse'
            />
          ))}
        </div>

        {/* Content area skeleton */}
        <div className='flex-1 space-y-6'>
          <div className='h-8 w-48 bg-foreground/10 rounded animate-pulse' />
          <div className='h-4 w-full max-w-md bg-foreground/10 rounded animate-pulse' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='h-28 rounded-xl border border-border bg-foreground/5 animate-pulse'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

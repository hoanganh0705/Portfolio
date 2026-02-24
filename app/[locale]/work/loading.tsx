export default function WorkLoading() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex flex-col xl:flex-row gap-8'>
        {/* Project info skeleton */}
        <div className='xl:w-1/2 space-y-6 order-2 xl:order-0'>
          <div className='h-6 w-20 bg-foreground/10 rounded animate-pulse' />
          <div className='h-10 w-3/4 bg-foreground/10 rounded animate-pulse' />
          <div className='h-4 w-full bg-foreground/10 rounded animate-pulse' />
          <div className='h-4 w-2/3 bg-foreground/10 rounded animate-pulse' />
          <div className='flex gap-3 mt-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='h-9 w-9 rounded-full bg-foreground/10 animate-pulse'
              />
            ))}
          </div>
          <div className='border-t border-border pt-4 flex gap-4'>
            <div className='h-10 w-10 rounded-full bg-foreground/10 animate-pulse' />
            <div className='h-10 w-10 rounded-full bg-foreground/10 animate-pulse' />
          </div>
        </div>

        {/* Image skeleton */}
        <div className='xl:w-1/2'>
          <div className='h-[400px] rounded-xl bg-foreground/5 border border-border animate-pulse' />
        </div>
      </div>
    </div>
  )
}

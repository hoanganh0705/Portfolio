export default function ContactLoading() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='flex flex-col xl:flex-row gap-8'>
        {/* Form skeleton */}
        <div className='xl:w-[54%] space-y-6 order-2 xl:order-0'>
          <div className='h-8 w-48 bg-foreground/10 rounded animate-pulse' />
          <div className='h-4 w-full max-w-sm bg-foreground/10 rounded animate-pulse' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='h-12 rounded-lg bg-foreground/5 border border-border animate-pulse' />
            <div className='h-12 rounded-lg bg-foreground/5 border border-border animate-pulse' />
            <div className='h-12 rounded-lg bg-foreground/5 border border-border animate-pulse' />
            <div className='h-12 rounded-lg bg-foreground/5 border border-border animate-pulse' />
          </div>
          <div className='h-32 rounded-lg bg-foreground/5 border border-border animate-pulse' />
          <div className='h-12 w-40 rounded-full bg-foreground/10 animate-pulse' />
        </div>

        {/* Info skeleton */}
        <div className='xl:w-[46%] space-y-8'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-4'
            >
              <div className='h-12 w-12 rounded-lg bg-foreground/10 animate-pulse' />
              <div className='space-y-2 flex-1'>
                <div className='h-3 w-16 bg-foreground/10 rounded animate-pulse' />
                <div className='h-4 w-40 bg-foreground/10 rounded animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'h-4 w-full',
    card: 'h-32 w-full rounded-2xl',
    avatar: 'h-10 w-10 rounded-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    button: 'h-10 w-24 rounded-lg',
    stat: 'h-16 w-32 rounded-lg',
  }

  return (
    <div
      className={`animate-shimmer rounded-md bg-subtle ${variants[variant]} ${className}`}
    />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-6 rounded-2xl border border-border bg-surface ${className}`}>
      <Skeleton variant="avatar" className="mb-4" />
      <Skeleton variant="title" className="mb-2" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4 rounded-lg bg-subtle">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" className="flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 p-4 rounded-lg bg-surface border border-border">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonStat({ className = '' }) {
  return (
    <div className={`p-6 rounded-2xl border border-border bg-surface ${className}`}>
      <Skeleton variant="stat" className="mb-4" />
      <Skeleton variant="title" className="mb-2" />
      <Skeleton variant="text" />
    </div>
  )
}

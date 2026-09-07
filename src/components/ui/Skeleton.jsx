export function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-32 w-full',
    circle: 'h-12 w-12 rounded-full',
  }

  return (
    <div
      className={`skeleton rounded-md ${variants[variant] || variants.default} ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-[16px] border border-slate-700/50 bg-[#1E293B] p-6 ${className}`}>
      <div className="space-y-4">
        <Skeleton variant="avatar" className="mb-4" />
        <Skeleton variant="title" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="rounded-[16px] border border-slate-700/50 bg-[#1E293B] overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" className="h-3 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-700/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} variant="text" className="h-3 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

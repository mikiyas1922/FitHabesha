export function Card({ children, className = '', padding = 'md', hover = false }) {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={`bg-[var(--app-surface)] rounded-[16px] border border-[var(--app-border)] shadow-sm ${hover ? 'hover:border-[var(--app-primary)]/40 hover:shadow-[0_0_15px_rgba(0,223,130,0.2)] hover:-translate-y-0.5 transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1)' : ''} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', action }) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      {children}
      {action && <div className="flex shrink-0">{action}</div>}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-[var(--app-foreground)] ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-[var(--app-muted)] mt-1 ${className}`}>{children}</p>
}

export function CardContent({ children, className = '' }) {
  return <div className={`mt-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return <div className={`flex items-center gap-2 mt-6 pt-4 border-t border-[var(--app-border)] ${className}`}>{children}</div>
}

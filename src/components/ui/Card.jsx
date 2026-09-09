export function Card({ children, className = '', padding = 'md' }) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={`bg-gradient-to-br from-surface to-surface/80 rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 backdrop-blur-sm ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">{children}</div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h3>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-muted mt-1 ${className}`}>{children}</p>
}

export function Card({ children, className = '', padding = 'md' }) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={`bg-surface rounded-[var(--radius-card)] border border-border/80 shadow-card ${paddings[padding]} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h3>
}

export function PageHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 ${className}`}>
      <div className="flex-1">
        {title && (
          <h1 className="text-2xl font-bold text-[var(--app-foreground)] tracking-tight">{title}</h1>
        )}
        {subtitle && (
          <p className="text-sm text-[var(--app-muted)] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}

import { Button } from './Button'

export function PageHeader({
  title,
  subtitle,
  actions,
  className = '',
}) {
  return (
    <div className={`mb-7 rounded-2xl border border-border/70 bg-surface/45 p-5 shadow-sm sm:p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink;0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

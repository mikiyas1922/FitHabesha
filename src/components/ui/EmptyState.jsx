import { Button } from './Button'

export function EmptyState({
  icon,
  title = 'No data found',
  description = 'There is no data to display at this time.',
  action,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {icon && (
        <div className="mb-6 text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted max-w-md mb-6">
        {description}
      </p>
      {(action || onAction) && (
        <Button onClick={onAction}>
          {actionLabel || 'Take action'}
        </Button>
      )}
    </div>
  )
}

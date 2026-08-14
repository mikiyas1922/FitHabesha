import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { Button } from './Button'

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertCircle className="size-6" />
      </div>
      <div>
        <p className="font-medium text-foreground">Unable to load data</p>
        <p className="text-sm text-muted mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="gap-2">
          <RefreshCw className="size-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'No data yet', description }) {
  return (
    <div className="py-16 px-6 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
    </div>
  )
}

export function DataSourceBadge({ source }) {
  if (source !== 'fallback') return null

  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20">
      Showing demo data — API unavailable
    </span>
  )
}

export function AsyncState({
  loading,
  error,
  empty,
  onRetry,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
}) {
  if (loading) return loadingComponent || <LoadingState />
  if (error) return errorComponent || <ErrorState message={error} onRetry={onRetry} />
  if (empty) return emptyComponent || <EmptyState />
  return children
}

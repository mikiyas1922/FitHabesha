import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const variants = {
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300',
    icon: CheckCircle,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300',
    icon: AlertCircle,
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300',
    icon: AlertTriangle,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300',
    icon: Info,
  },
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className={`relative flex items-start gap-3 rounded-lg border p-4 ${config.container} ${className}`}>
      <Icon className="size-5 flex-shrink:0; mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold text-sm mb-1">
            {title}
          </h4>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink:0; p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

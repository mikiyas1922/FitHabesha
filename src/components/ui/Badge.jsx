const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20',
  default: 'bg-subtle text-muted ring-border',
}

export function Badge({
  children,
  variant = 'default',
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function statusBadge(status) {
  const map = {
    active: 'success',
    available: 'success',
    completed: 'success',
    'checked-in': 'success',
    'in-use': 'info',
    occupied: 'info',
    inactive: 'default',
    expired: 'danger',
    failed: 'danger',
    broken: 'danger',
    maintenance: 'warning',
    pending: 'warning',
    upcoming: 'info',
  }
  return map[status] || 'default'
}

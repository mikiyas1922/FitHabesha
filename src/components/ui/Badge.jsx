const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20',
  default: 'bg-subtle text-muted ring-border',
  dot: 'bg-transparent text-foreground',
}

export function Badge({
  children,
  variant = 'default',
  dotColor,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}
    >
      {variant === 'dot' && dotColor && (
        <span className={`mr-1.5 size-2 rounded-full ${dotColor}`} />
      )}
      {children}
    </span>
  )
}

export function statusBadge(status) {
  const map = {
    active: { variant: 'success', dotColor: 'bg-emerald-500' },
    available: { variant: 'success', dotColor: 'bg-emerald-500' },
    completed: { variant: 'success', dotColor: 'bg-emerald-500' },
    'checked-in': { variant: 'success', dotColor: 'bg-emerald-500' },
    'in-use': { variant: 'info', dotColor: 'bg-blue-500' },
    occupied: { variant: 'info', dotColor: 'bg-blue-500' },
    inactive: { variant: 'default', dotColor: 'bg-muted' },
    expired: { variant: 'danger', dotColor: 'bg-red-500' },
    failed: { variant: 'danger', dotColor: 'bg-red-500' },
    broken: { variant: 'danger', dotColor: 'bg-red-500' },
    maintenance: { variant: 'warning', dotColor: 'bg-amber-500' },
    pending: { variant: 'warning', dotColor: 'bg-amber-500' },
    upcoming: { variant: 'info', dotColor: 'bg-blue-500' },
    scheduled: { variant: 'info', dotColor: 'bg-blue-500' },
    cancelled: { variant: 'danger', dotColor: 'bg-red-500' },
    draft: { variant: 'default', dotColor: 'bg-muted' },
    published: { variant: 'success', dotColor: 'bg-emerald-500' },
    archived: { variant: 'default', dotColor: 'bg-muted' },
  }
  return map[status] || { variant: 'default', dotColor: 'bg-muted' }
}

const variants = {
  success: 'bg-[#00DF82]/10 text-[#00DF82] border border-[#00DF82]/30',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  default: 'bg-[var(--app-surface)] text-[var(--app-muted)] border border-[var(--app-border)]',
  primary: 'bg-[#00DF82]/20 text-[#00DF82] border border-[#00DF82]/40',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[10px] rounded-[6px]',
  md: 'px-2.5 py-0.5 text-xs rounded-[6px]',
  lg: 'px-3 py-1 text-sm rounded-[12px]',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ring-1 ring-inset transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span className="size-1.5 rounded-full bg-current animate-pulse" />
      )}
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
    frozen: 'warning',
    cancelled: 'danger',
  }
  return map[status] || 'default'
}

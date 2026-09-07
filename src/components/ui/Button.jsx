const variants = {
  primary: 'bg-primary text-dark hover:bg-primary-dark shadow-sm font-semibold hover:-translate-y-px',
  secondary: 'bg-surface text-foreground border border-border hover:bg-hover hover:border-primary/40',
  ghost: 'text-muted hover:bg-hover hover:text-foreground',
  danger: 'bg-red-500 text-foreground hover:bg-red-600',
  dark: 'bg-dark text-foreground hover:bg-dark/90 shadow-sm',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] font-medium transition-all active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

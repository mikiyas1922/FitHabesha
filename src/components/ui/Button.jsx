const variants = {
  primary: 'bg-primary text-dark hover:bg-primary-dark shadow-sm font-semibold',
  secondary: 'bg-surface text-foreground border border-border hover:bg-hover',
  ghost: 'text-muted hover:bg-hover hover:text-foreground',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  dark: 'bg-dark text-white hover:bg-dark/90 shadow-sm',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

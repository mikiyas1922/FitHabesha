const variants = {
  primary: 'bg-gradient-to-r from-primary to-primary-dark text-dark hover:from-primary-light hover:to-primary shadow-lg shadow-primary/30 font-semibold relative overflow-hidden group',
  secondary: 'bg-gradient-to-br from-surface to-surface/80 text-foreground border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20',
  ghost: 'text-muted hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:text-foreground hover:shadow-md',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-foreground hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30',
  dark: 'bg-gradient-to-br from-dark to-dark/90 text-foreground hover:from-dark/95 hover:to-dark/80 shadow-lg shadow-black/50',
  outline: 'bg-transparent text-foreground border-2 border-border hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent hover:shadow-lg hover:shadow-primary/20',
}

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2',
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 active:shadow-sm backdrop-blur-sm ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const variants = {
  primary: 'bg-primary text-dark shadow-lg shadow-primary/30 font-semibold border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 hover:shadow-xl hover:shadow-primary/40',
  secondary: 'bg-surface text-foreground border border-border hover:border-primary/50 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-muted hover:bg-primary/10 hover:text-foreground hover:shadow-md active:scale-95',
  danger: 'bg-red-500 text-foreground hover:bg-red-400 shadow-lg shadow-red-500/30 border-b-4 border-red-700 active:border-b-0 active:translate-y-1',
  dark: 'bg-dark text-foreground hover:bg-dark/80 shadow-lg shadow-black/30 border-b-4 border-black active:border-b-0 active:translate-y-1',
  outline: 'bg-transparent text-foreground border-2 border-border hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
  glow: 'bg-primary text-dark shadow-lg shadow-primary/50 font-semibold hover:shadow-2xl hover:shadow-primary/70 hover:scale-105',
}

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:rotate-1 active:scale-95 active:rotate-0 disabled:hover:scale-100 disabled:hover:rotate-0 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

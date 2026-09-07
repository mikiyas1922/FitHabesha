const variants = {
  primary: 'bg-[#00DF82] text-[#0A1128] hover:bg-[#00c473] border border-[#00DF82]/20 hover:border-[#00DF82]/40 shadow-sm hover:shadow-[0_0_15px_rgba(0,223,130,0.2)] font-semibold',
  secondary: 'bg-[var(--app-surface)] text-[var(--app-foreground)] border border-[var(--app-border)] hover:border-[#00DF82]/40 hover:bg-[var(--app-hover)]',
  ghost: 'text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-foreground)]',
  danger: 'bg-red-500 text-[#F8FAFC] hover:bg-red-600 border border-red-500/20 hover:border-red-400/40',
  dark: 'bg-[#0A1128] text-[#F8FAFC] hover:bg-[#0A1128]/90 border border-[var(--app-border)] shadow-sm',
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-[6px]',
  sm: 'px-3 py-1.5 text-sm rounded-[6px]',
  md: 'px-4 py-2 text-sm rounded-[12px]',
  lg: 'px-6 py-3 text-base rounded-[16px]',
  xl: 'px-8 py-4 text-lg rounded-[24px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 focus-visible:ring-2 focus-visible:ring-[#00DF82] focus-visible:outline-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="flex shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex shrink-0">{rightIcon}</span>}
    </button>
  )
}

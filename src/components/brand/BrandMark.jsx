export function BrandMark({ size = 'md', showText = true, theme = 'light', className = '' }) {
  const sizes = {
    sm: { box: 'size-8 text-sm', text: 'text-lg' },
    md: { box: 'size-10 text-sm', text: 'text-2xl' },
    lg: { box: 'size-12 text-base', text: 'text-3xl' },
  }

  const styles = sizes[size] || sizes.md
  const textColor = theme === 'dark' ? 'text-white' : 'text-foreground'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`flex ${styles.box} items-center justify-center rounded-lg bg-primary font-bold text-white`}>
        FH
      </div>
      {showText && <span className={`${styles.text} font-bold ${textColor}`}>Fit Habesha</span>}
    </div>
  )
}

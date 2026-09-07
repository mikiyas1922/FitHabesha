import { X } from 'lucide-react'

const variants = {
  success: 'bg-[#00DF82]/10 border-[#00DF82]/30 text-[#00DF82]',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  danger: 'bg-red-500/10 border-red-500/30 text-red-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  default: 'bg-[var(--app-surface)] border-[var(--app-border)] text-[var(--app-muted)]',
}

export function Alert({ variant = 'default', title, message, onClose, className = '', icon }) {
  return (
    <div className={`rounded-[12px] border p-4 transition-all duration-200 ${variants[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        {icon && <div className="flex shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold mb-1">{title}</h4>
          )}
          {message && (
            <p className="text-sm leading-relaxed">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Close alert"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

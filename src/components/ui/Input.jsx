import { AlertCircle, ChevronDown } from 'lucide-react'

export function Input({ label, error, hint, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          id={inputId}
          className={`w-full rounded-xl border-2 border-border bg-input px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 ${error ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400 focus:shadow-red-400/20' : ''} ${className}`}
          {...props}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-red-400 animate-glow" />
        )}
      </div>
      {error && <p className="text-xs text-red-500 animate-slide-up">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, error, hint, className = '', id, ...props }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative group">
        <textarea
          id={textareaId}
          className={`w-full rounded-xl border-2 border-border bg-input px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 resize-none ${error ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400 focus:shadow-red-400/20' : ''} ${className}`}
          rows={4}
          {...props}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-3 size-4 text-red-400 animate-glow" />
        )}
      </div>
      {error && <p className="text-xs text-red-500 animate-slide-up">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

export function Select({ label, options = [], className = '', id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const safeOptions = Array.isArray(options) ? options : []

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-lg border border-border bg-input px-3 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors cursor-pointer ${className}`}
          {...props}
        >
          {safeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
      </div>
    </div>
  )
}

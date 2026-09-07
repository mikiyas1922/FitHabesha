export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && (
        <div className="flex size-16 items-center justify-center rounded-full bg-[#1E293B] border border-slate-700/50 text-[#94A3B8] mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-[#94A3B8] max-w-md mb-6">{description}</p>
      )}
      {action && <div className="flex shrink-0">{action}</div>}
    </div>
  )
}

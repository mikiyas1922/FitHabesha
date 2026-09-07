import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatCard({ label, value, change, trend, icon }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp className="size-3.5 text-primary" />
              ) : (
                <TrendingDown className="size-3.5 text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-primary' : 'text-red-500'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

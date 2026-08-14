import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { roleLabels } from '../../config/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { getSettingsPath, getUserDisplay, mapBackendRole } from '../../utils/auth'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Header({ role, title, subtitle, showSearch = true, actions }) {
  const { user } = useAuth()
  const displayUser = getUserDisplay(user, role)
  const frontendRole = user ? mapBackendRole(user.role) : role

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <div>
        {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
        {subtitle ? (
          <p className="text-xs text-muted">{subtitle}</p>
        ) : (
          <p className="text-xs text-muted">Fit Habesha {roleLabels[frontendRole]}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="search"
              placeholder="Search..."
              className="w-56 rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        )}

        {actions}

        <ThemeToggle />

        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted hover:bg-hover hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
        </button>

        <Link
          to={user ? getSettingsPath(user.role) : getSettingsPath(role)}
          className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm hover:ring-2 hover:ring-primary/40 transition-all"
          title="Profile & settings"
        >
          {displayUser.initials}
        </Link>
      </div>
    </header>
  )
}

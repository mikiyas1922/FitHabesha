import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, forwardRef } from 'react'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  Apple,
  Star,
  Wrench,
  Lock,
  UserPlus,
  LogOut,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  UserCheck,
  Home,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { navByRole } from '../../config/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { getSettingsPath, getUserDisplay } from '../../utils/auth'

const iconMap = {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  Apple,
  Star,
  Wrench,
  Lock,
  UserPlus,
  LogOut,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  UserCheck,
  Home,
  Clock,
  TrendingUp,
}


export const Sidebar = forwardRef(({ role }, ref) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayUser = getUserDisplay(user, role)
  const settingsPath = user ? getSettingsPath(user.role) : getSettingsPath(role)
  const items = navByRole[role]
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <aside 
      ref={ref}
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[var(--app-sidebar)] border-r border-[var(--app-border)] transition-all duration-300 ${
        isCollapsed ? 'w-[64px]' : 'w-[260px]'
      }`}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b border-[var(--app-border)]">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[var(--app-primary)]">
              <Dumbbell className="size-4 text-[var(--app-sidebar)]" />
            </div>
            <p className="text-base font-bold text-[var(--app-sidebar-text)]">Fit Habesha</p>
          </div>
        )}
        <button
          type="button"
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-[var(--app-sidebar-text-muted)] hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-text)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--app-primary)] focus-visible:outline-none"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--app-primary)]/10 text-[var(--app-primary)] border-l-2 border-[var(--app-primary)]'
                    : 'text-[var(--app-sidebar-text-muted)] hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-text)] border-l-2 border-transparent'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="size-4 shrink-0 text-[var(--app-sidebar-text-muted)]" />}
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-[var(--app-sidebar-text)]">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {!isCollapsed && (
        <div className="border-t border-[var(--app-border)] p-4">
          <NavLink
            to={settingsPath}
            className="flex items-center gap-3 mb-3 rounded-lg px-2 py-2 hover:bg-[var(--app-sidebar-hover)] transition-all duration-200 group"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[var(--app-primary)]/20 text-[var(--app-primary)] font-semibold text-sm ring-2 ring-transparent group-hover:ring-[var(--app-primary)]/40 transition-all duration-200">
              {displayUser.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--app-sidebar-text)] truncate">{displayUser.name}</p>
              <p className="text-xs text-[var(--app-sidebar-text-muted)] truncate">{displayUser.title}</p>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--app-sidebar-text-muted)] hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-text)] transition-all duration-200"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}

      {isCollapsed && (
        <div className="border-t border-[var(--app-border)] p-4">
          <NavLink
            to={settingsPath}
            className="flex items-center justify-center mb-3 rounded-lg px-2 py-2 hover:bg-[var(--app-sidebar-hover)] transition-all duration-200 group"
            title={displayUser.name}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[var(--app-primary)]/20 text-[var(--app-primary)] font-semibold text-sm ring-2 ring-transparent group-hover:ring-[var(--app-primary)]/40 transition-all duration-200">
              {displayUser.initials}
            </div>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-[var(--app-sidebar-text-muted)] hover:bg-[var(--app-sidebar-hover)] hover:text-[var(--app-sidebar-text)] transition-all duration-200"
            title="Sign Out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      )}
    </aside>
  )
})

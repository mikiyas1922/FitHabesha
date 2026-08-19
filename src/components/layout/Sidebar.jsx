import { NavLink, useNavigate } from 'react-router-dom'
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
}

export function Sidebar({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayUser = getUserDisplay(user, role)
  const settingsPath = user ? getSettingsPath(user.role) : getSettingsPath(role)
  const items = navByRole[role]

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex flex-col bg-dark border-r border-border" style={{ width: '260px', padding: '24px' }}>
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary">
          <Dumbbell className="size-4 text-foreground" />
        </div>
        <p className="text-base font-bold text-foreground">Fit Habesha</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-foreground'
                    : 'text-muted hover:bg-sidebar-hover hover:text-foreground'
                }`
              }
            >
              {Icon && <Icon className="size-[18px] shrink-0" />}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-foreground">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-6">
        <NavLink
          to={settingsPath}
          className="flex items-center gap-3 mb-3 rounded-lg px-2 py-2 hover:bg-sidebar-hover transition-colors"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
            {displayUser.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{displayUser.name}</p>
            <p className="text-xs text-muted truncate">{displayUser.title}</p>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

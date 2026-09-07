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


export function Sidebar({ role, isMinimized, onToggle, isMobileOpen, onMobileClose }) {
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
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-dark border-r border-border transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ width: isMinimized ? '80px' : '260px', padding: isMinimized ? '16px 12px' : '24px' }}
      >
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0">
              <Dumbbell className="size-4 text-foreground" />
            </div>
            {!isMinimized && <p className="text-base font-bold text-foreground">Fit Habesha</p>}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-sidebar-hover hover:shadow-md hover:shadow-black/5 transition-all duration-200 text-muted hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="hidden md:block p-1.5 rounded-lg hover:bg-sidebar-hover hover:shadow-md hover:shadow-black/5 transition-all duration-200 text-muted hover:text-foreground hover:scale-110"
            >
              {isMinimized ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>
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
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-foreground shadow-lg shadow-primary/25'
                    : 'text-muted hover:bg-sidebar-hover hover:text-foreground hover:shadow-md hover:shadow-black/5 hover:scale-[1.02]'
                } ${isMinimized ? 'justify-center' : ''}`
              }
              title={isMinimized ? item.label : undefined}
            >
              {Icon && <Icon className="size-[18px] shrink-0 transition-transform duration-200" />}
              {!isMinimized && <span className="flex-1">{item.label}</span>}
              {!isMinimized && item.badge && (
                <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-foreground shadow-sm">
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
          className={`flex items-center gap-3 mb-3 rounded-lg px-2 py-2 hover:bg-sidebar-hover hover:shadow-md hover:shadow-black/5 transition-all duration-200 ${isMinimized ? 'justify-center' : ''}`}
          title={isMinimized ? displayUser.name : undefined}
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm shrink-0 hover:scale-110 transition-transform duration-200">
            {displayUser.initials}
          </div>
          {!isMinimized && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayUser.name}</p>
              <p className="text-xs text-muted truncate">{displayUser.title}</p>
            </div>
          )}
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-sidebar-hover hover:text-foreground hover:shadow-md hover:shadow-black/5 transition-all duration-200 ${isMinimized ? 'justify-center' : ''}`}
          title={isMinimized ? 'Sign Out' : undefined}
        >
          <LogOut className="size-4 shrink-0 hover:scale-110 transition-transform duration-200" />
          {!isMinimized && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
    </>
  )
}

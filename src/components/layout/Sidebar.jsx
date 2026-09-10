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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-dark to-dark/95 border-r border-border/50 transition-all duration-500 backdrop-blur-xl pointer-events-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ width: isMinimized ? '80px' : '260px', padding: isMinimized ? '16px 12px' : '24px' }}
      >
        <div className={`flex h-16 items-center gap-2.5 border-b border-border/50 justify-between ${isMinimized ? 'px-2' : 'px-6'}`}>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark shrink-0 shadow-lg shadow-primary/30 hover:scale-110 transition-transform duration-300">
              <Dumbbell className="size-4 text-foreground" />
            </div>
            {!isMinimized && <p className="text-base font-bold text-foreground">Fit Habesha</p>}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-sidebar-hover hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-gray-300 hover:text-white hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={onToggle}
              className="hidden md:block p-1.5 rounded-lg hover:bg-sidebar-hover hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-gray-300 hover:text-white hover:scale-110 cursor-pointer"
            >
              {isMinimized ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>
        </div>

      <nav className={`flex-1 overflow-y-auto ${isMinimized ? 'px-2 py-4' : 'px-3 py-4'} space-y-1`}>
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length <= 2}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-foreground shadow-xl shadow-primary/40'
                    : 'text-gray-300 hover:bg-gradient-to-r hover:from-sidebar-hover hover:to-transparent hover:text-white hover:shadow-lg hover:shadow-primary/20'
                } ${isMinimized ? 'justify-center w-full min-h-[44px] px-2 py-3' : 'px-3 py-2.5'}`
              }
              title={isMinimized ? item.label : undefined}
            >
              {Icon && <Icon className={`size-[18px] shrink-0 transition-transform duration-300 hover:scale-110 ${isMinimized ? 'text-gray-300' : ''}`} />}
              {!isMinimized && <span className="flex-1">{item.label}</span>}
              {!isMinimized && item.badge && (
                <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-[10px] font-bold text-foreground shadow-lg shadow-red-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className={`border-t border-border/50 ${isMinimized ? 'p-4' : 'p-6'}`}>
        <NavLink
          to={settingsPath}
          className={`flex items-center gap-3 mb-3 rounded-xl hover:bg-gradient-to-r hover:from-sidebar-hover hover:to-transparent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer ${
            isMinimized ? 'justify-center w-full min-h-[44px] px-2 py-3' : 'px-2 py-2'
          }`}
          title={isMinimized ? displayUser.name : undefined}
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold text-sm shrink-0 hover:scale-110 shadow-lg shadow-primary/20 transition-transform duration-300">
            {displayUser.initials}
          </div>
          {!isMinimized && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{displayUser.title}</p>
            </div>
          )}
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className={`flex items-center gap-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-gradient-to-r hover:from-sidebar-hover hover:to-transparent hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer ${
            isMinimized ? 'justify-center w-full min-h-[44px] px-2 py-3' : 'px-3 py-2'
          }`}
          title={isMinimized ? 'Sign Out' : undefined}
        >
          <LogOut className="size-4 shrink-0 hover:scale-110 transition-transform duration-300 text-gray-300" />
          {!isMinimized && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
    </>
  )
}

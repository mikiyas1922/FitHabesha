import { useState, useEffect } from 'react'
import { Bell, Search, X, Check, Trash2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { roleLabels } from '../../config/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { getSettingsPath, getUserDisplay, mapBackendRole } from '../../utils/auth'
import { ThemeToggle } from '../ui/ThemeToggle'
import { notificationsService } from '../../services/notificationsService'

export function Header({ role, title, subtitle, showSearch = true, actions }) {
  const { user } = useAuth()
  const displayUser = getUserDisplay(user, role)
  const frontendRole = user ? mapBackendRole(user.role) : role

  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount()
      setUnreadCount(response.unread_count || 0)
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationsService.listNotifications({ limit: 10 })
      setNotifications(response.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id)
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, is_read: true } : n
      ))
      fetchUnreadCount()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleDeleteNotification = async (id) => {
    try {
      await notificationsService.deleteNotification(id)
      setNotifications(notifications.filter(n => n._id !== id))
      fetchUnreadCount()
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications()
    }
  }, [showNotifications])

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

        <div className="relative">
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-lg text-muted hover:bg-hover hover:text-foreground transition-colors"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-lg border border-border bg-card shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-muted" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-border last:border-b-0 ${
                        !notification.is_read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted mt-1">{notification.message}</p>
                          <p className="text-xs text-muted mt-2">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1 text-muted hover:text-primary"
                              title="Mark as read"
                            >
                              <Check className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="p-1 text-muted hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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

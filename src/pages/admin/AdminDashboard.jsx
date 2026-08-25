import { useState, useEffect } from 'react'
import { Users, DollarSign, Calendar, Star, TrendingUp, ArrowUpRight, ArrowDownRight, MessageSquare, MoreVertical, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminService } from '../../services/adminService'
import { checkinService } from '../../services/checkinService'
import { notificationsService } from '../../services/notificationsService'
import { normalizeListResponse } from '../../utils/apiHelpers'

export function AdminDashboard() {
  const { user } = useAuth()
  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'Admin'
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [members, setMembers] = useState([])
  const [trainers, setTrainers] = useState([])
  const [checkins, setCheckins] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch members, trainers, check-ins, and notifications in parallel
      const [memberResponse, trainerResponse, checkinResponse, notificationResponse] = await Promise.all([
        adminService.getMembers(),
        adminService.getTrainers(),
        checkinService.getTodayCheckins(),
        notificationsService.listNotifications({ limit: 10 })
      ])

      // Handle members
      const memberData = normalizeListResponse(memberResponse)
      setMembers(memberData)

      // Handle trainers
      const trainerData = normalizeListResponse(trainerResponse)
      setTrainers(trainerData)

      // Handle check-ins
      const checkinData = normalizeListResponse(checkinResponse)
      setCheckins(checkinData)

      // Handle notifications
      const notificationData = notificationResponse || []
      setNotifications(notificationData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      console.error('Admin dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const stats = [
    { 
      label: 'Active Members', 
      value: members.filter(m => m.is_active !== false).length.toString(), 
      change: 'Total', 
      trend: 'up', 
      icon: Users 
    },
    { 
      label: 'Active Trainers', 
      value: trainers.filter(t => t.is_active !== false).length.toString(), 
      change: 'Total', 
      trend: 'up', 
      icon: Users 
    },
    { 
      label: "Today's Check-ins", 
      value: checkins.length.toString(), 
      change: 'Today', 
      trend: 'up', 
      icon: Calendar 
    },
    { 
      label: 'Unread Notifications', 
      value: notifications.filter(n => !n.is_read).length.toString(), 
      change: 'Pending', 
      trend: 'up', 
      icon: MessageSquare 
    },
    { 
      label: 'Total Staff', 
      value: trainers.length.toString(), 
      change: 'Active', 
      trend: 'up', 
      icon: Star 
    },
  ]

  // Get top trainers
  const topTrainers = trainers.slice(0, 3).map(t => ({
    name: t.name || t.first_name && t.last_name ? `${t.first_name} ${t.last_name}` : 'Trainer',
    sessions: t.sessions || 50,
    rating: t.rating || 4.5,
    earnings: t.earnings || '$30k',
    specialty: t.specialty || 'Fitness Trainer',
  }))

  // Get recent check-ins
  const recentCheckIns = checkins.slice(0, 5).map(c => ({
    id: c.unique_id || c.id || 'N/A',
    name: c.name || c.member_name || 'Member',
    time: c.check_in_time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    status: c.status || 'Approved',
  }))

  // Get feedback from notifications
  const feedbackFeed = notifications.slice(0, 5).map(n => ({
    name: n.sender_name || 'Member',
    message: n.message || n.title || 'Feedback',
    time: new Date(n.created_at).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    urgent: n.urgent || false,
  }))

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-600 font-medium">Error loading dashboard</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <Button onClick={loadDashboardData} className="mt-3">Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Executive Console</h1>
              <p className="text-sm text-muted">Search records, financials, audits...</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="gap-2">
                Export PDF
              </Button>
              <Link to="/admin/staff">
                <Button className="gap-2">
                  Manage Staff
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Revenue Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <h3 className="font-semibold text-foreground">Revenue Trend (6 Months)</h3>
                <p className="text-sm text-muted">Total: $289.4K</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">This Month</Button>
                <Button variant="ghost" size="sm">Last 30 Days</Button>
                <Button variant="ghost" size="sm">Custom</Button>
              </div>
            </div>
            <div className="h-48 flex items-end gap-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                    style={{ height: `${40 + (i * 15)}%` }}
                  />
                  <span className="text-xs text-muted">{month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Trainers */}
            <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Top Performing Trainers</h3>
              <div className="space-y-4">
                {topTrainers.length === 0 ? (
                  <p className="text-sm text-muted">No trainers available</p>
                ) : (
                  topTrainers.map((trainer, i) => (
                    <div key={trainer.name} className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {trainer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{trainer.name}</p>
                        <p className="text-xs text-muted truncate">{trainer.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm">{trainer.earnings}</p>
                        <p className="text-xs text-muted">{trainer.sessions} sessions</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Check-ins */}
            <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Today's Checked-In Members</h3>
              <div className="space-y-3">
                {recentCheckIns.length === 0 ? (
                  <p className="text-sm text-muted">No check-ins today</p>
                ) : (
                  recentCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{checkIn.name}</p>
                        <p className="text-xs text-muted">{checkIn.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{checkIn.time}</p>
                        <span className="text-xs text-green-600">{checkIn.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Live Feedback Feed */}
            <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Live Member Feedback Feed</h3>
                <span className="text-xs text-red-600 font-medium">Attention Req.</span>
              </div>
              <div className="space-y-3">
                {feedbackFeed.length === 0 ? (
                  <p className="text-sm text-muted">No recent feedback</p>
                ) : (
                  feedbackFeed.map((feedback) => (
                    <div key={feedback.name} className={`p-3 rounded-lg ${feedback.urgent ? 'bg-red-50 border border-red-200' : 'bg-surface'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground text-sm">{feedback.name}</p>
                        {feedback.urgent && <span className="text-xs text-red-600 font-medium">Urgent</span>}
                      </div>
                      <p className="text-sm text-muted mt-1 line-clamp-2">{feedback.message}</p>
                      <p className="text-xs text-muted mt-2">{feedback.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

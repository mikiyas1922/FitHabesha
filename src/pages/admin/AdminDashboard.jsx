import { useState, useEffect } from 'react'
import { Users, DollarSign, Calendar, Star, TrendingUp, ArrowUpRight, ArrowDownRight, MessageSquare, MoreVertical, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
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
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch members, trainers, check-ins, and notifications in parallel
      const [memberResponse, trainerResponse, checkinResponse, notificationResponse, unreadResponse] = await Promise.all([
        adminService.getMembers(),
        adminService.getTrainers(),
        checkinService.getTodayCheckins(),
        notificationsService.listNotifications({ page: 1, limit: 10 }),
        notificationsService.getUnreadCount(),
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

      setNotifications(Array.isArray(notificationResponse) ? notificationResponse : [])
      setUnreadCount(Number(unreadResponse) || 0)
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
      value: unreadCount.toString(), 
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
          <Loader2 className="size-8 animate-spin text-[var(--app-primary)]" />
        </div>
      ) : error ? (
        <Alert variant="danger" title="Error loading dashboard" message={error} action={<Button onClick={loadDashboardData}>Retry</Button>} />
      ) : (
        <>
          <PageHeader 
            title="Executive Console" 
            subtitle="Search records, financials, audits..."
            action={
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
            }
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} padding="md" hover className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20">
                      <Icon className="size-4 text-[var(--app-primary)]" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[var(--app-foreground)]">{stat.value}</p>
                  <p className="text-xs text-[var(--app-muted)] mt-1">{stat.label}</p>
                </Card>
              )
            })}
          </div>

          {/* Revenue Chart */}
          <Card padding="lg">
            <CardHeader action={
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">This Month</Button>
                <Button variant="ghost" size="sm">Last 30 Days</Button>
                <Button variant="ghost" size="sm">Custom</Button>
              </div>
            }>
              <CardTitle>Revenue Trend (6 Months)</CardTitle>
              <p className="text-sm text-[var(--app-muted)]">Total: $289.4K</p>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end gap-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t bg-[var(--app-primary)] transition-all hover:bg-[var(--app-primary)]/80"
                      style={{ height: `${40 + (i * 15)}%` }}
                    />
                    <span className="text-xs text-[var(--app-muted)]">{month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Trainers */}
            <Card padding="lg">
              <CardTitle className="mb-4">Top Performing Trainers</CardTitle>
              <CardContent>
                <div className="space-y-4">
                  {topTrainers.length === 0 ? (
                    <p className="text-sm text-[var(--app-muted)]">No trainers available</p>
                  ) : (
                    topTrainers.map((trainer, i) => (
                      <div key={trainer.name} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] hover:border-[var(--app-primary)]/40 transition-all duration-200">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[var(--app-primary)]/10 text-[var(--app-primary)] font-semibold">
                          {trainer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--app-foreground)] text-sm">{trainer.name}</p>
                          <p className="text-xs text-[var(--app-muted)] truncate">{trainer.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[var(--app-foreground)] text-sm">{trainer.earnings}</p>
                          <p className="text-xs text-[var(--app-muted)]">{trainer.sessions} sessions</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Check-ins */}
            <Card padding="lg">
              <CardTitle className="mb-4">Today's Checked-In Members</CardTitle>
              <CardContent>
                <div className="space-y-3">
                  {recentCheckIns.length === 0 ? (
                    <p className="text-sm text-[var(--app-muted)]">No check-ins today</p>
                  ) : (
                    recentCheckIns.map((checkIn) => (
                      <div key={checkIn.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)]">
                        <div className="flex-1">
                          <p className="font-medium text-[var(--app-foreground)] text-sm">{checkIn.name}</p>
                          <p className="text-xs text-[var(--app-muted)]">{checkIn.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--app-foreground)]">{checkIn.time}</p>
                          <span className="text-xs text-[var(--app-primary)]">{checkIn.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Feedback Feed */}
            <Card padding="lg">
              <CardHeader action={<span className="text-xs text-red-400 font-medium">Attention Req.</span>}>
                <CardTitle>Live Member Feedback Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackFeed.length === 0 ? (
                    <p className="text-sm text-[var(--app-muted)]">No recent feedback</p>
                  ) : (
                    feedbackFeed.map((feedback) => (
                      <div key={feedback.name} className={`p-3 rounded-lg border ${feedback.urgent ? 'bg-red-500/10 border-red-500/30' : 'bg-[var(--app-surface)] border-[var(--app-border)]'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-[var(--app-foreground)] text-sm">{feedback.name}</p>
                          {feedback.urgent && <span className="text-xs text-red-400 font-medium">Urgent</span>}
                        </div>
                        <p className="text-sm text-[var(--app-muted)] mt-1 line-clamp-2">{feedback.message}</p>
                        <p className="text-xs text-[var(--app-muted)] mt-2">{feedback.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

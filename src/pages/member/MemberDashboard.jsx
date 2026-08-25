import { useState, useEffect } from 'react'
import { Dumbbell, Calendar, TrendingUp, Target, Clock, Award, Play, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { memberService } from '../../services/memberService'
import { bookingService } from '../../services/bookingService'
import { classesService } from '../../services/classesService'
import { notificationsService } from '../../services/notificationsService'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'

export function MemberDashboard() {
  const { user } = useAuth()
  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'Member'
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [memberData, setMemberData] = useState(null)
  const [bookings, setBookings] = useState([])
  const [classes, setClasses] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch member profile
      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)
      setMemberData(profile)

      const profileId = profile?.id

      if (profileId) {
        // Fetch bookings, classes, and notifications in parallel
        const [bookingResponse, classResponse, notificationResponse] = await Promise.all([
          bookingService.getMemberBookings(profileId, { page: 1, limit: 10 }),
          classesService.getClasses({ limit: 10 }),
          notificationsService.listNotifications({ limit: 5 })
        ])

        // Handle bookings - Backend returns { success: true, data: { count, bookings: [...] }, message }
        const bookingData = bookingResponse?.data?.data?.bookings || []
        setBookings(bookingData)

        // Handle classes
        const classData = normalizeListResponse(classResponse)
        setClasses(classData)

        // Handle notifications
        const notificationData = notificationResponse || []
        setNotifications(notificationData)
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      console.error('Dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const memberStats = [
    { 
      label: 'Workouts This Week', 
      value: bookings.filter(b => {
        const bookingDate = new Date(b.start_time)
        const now = new Date()
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        return bookingDate >= weekAgo && b.status !== 'cancelled'
      }).length.toString(),
      change: 'This week', 
      icon: Dumbbell 
    },
    { 
      label: 'Booked Classes', 
      value: bookings.filter(b => b.status !== 'cancelled').length.toString(), 
      change: 'Upcoming', 
      icon: Calendar 
    },
    { 
      label: 'Available Classes', 
      value: classes.filter(c => c.available_spots > 0).length.toString(), 
      change: 'Open spots', 
      icon: Target 
    },
    { 
      label: 'Notifications', 
      value: notifications.filter(n => !n.is_read).length.toString(), 
      change: 'Unread', 
      icon: Award 
    },
  ]

  // Get today's workout from bookings
  const todayWorkout = bookings.find(b => {
    const bookingDate = new Date(b.start_time)
    const today = new Date()
    return bookingDate.toDateString() === today.toDateString() && b.status !== 'cancelled'
  }) || {
    name: 'No workout scheduled today',
    trainer: 'N/A',
    time: '—',
    exercises: 0,
    duration: '—',
    status: 'No Session',
  }

  // Calculate weekly progress from bookings
  const weeklyProgress = [
    { day: 'Mon', completed: false, duration: 0 },
    { day: 'Tue', completed: false, duration: 0 },
    { day: 'Wed', completed: false, duration: 0 },
    { day: 'Thu', completed: false, duration: 0 },
    { day: 'Fri', completed: false, duration: 0 },
    { day: 'Sat', completed: false, duration: 0 },
    { day: 'Sun', completed: false, duration: 0 },
  ]

  bookings.filter(b => b.status !== 'cancelled').forEach(booking => {
    const bookingDate = new Date(booking.start_time)
    const dayIndex = bookingDate.getDay()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayName = dayNames[dayIndex]
    const dayProgress = weeklyProgress.find(d => d.day === dayName)
    if (dayProgress) {
      dayProgress.completed = true
      const duration = booking.duration || 60
      dayProgress.duration += duration
    }
  })

  // Get upcoming classes
  const upcomingClasses = classes
    .filter(c => new Date(c.start_time) > new Date())
    .slice(0, 2)
    .map(c => ({
      name: c.name,
      time: new Date(c.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' + 
            new Date(c.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      instructor: c.trainer_name || 'TBD',
      spots: c.available_spots > 0 ? `${c.available_spots} spots left` : 'Fully Booked',
    }))

  // Get recent activity from notifications
  const recentActivity = notifications.slice(0, 4).map(n => ({
    activity: n.title || n.message,
    time: new Date(n.created_at).toLocaleString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }),
    type: 'notification',
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {firstName}!</h1>
              <p className="text-sm text-muted">Track your fitness journey and stay motivated</p>
            </div>
            <div className="flex gap-3">
              <Link to="/member/workouts">
                <Button className="gap-2">
                  <Play className="size-4" />
                  Start Workout
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                  <p className="text-xs text-muted mt-2">{stat.change}</p>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Workout */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Today's Scheduled Workout</h3>
                <Link to="/member/workouts">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                  <div>
                    <p className="font-medium text-foreground text-lg">{todayWorkout.name}</p>
                    <p className="text-sm text-muted">with {todayWorkout.trainer}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 w-fit">
                    {todayWorkout.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>{todayWorkout.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="size-4" />
                    <span>{todayWorkout.exercises} exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="size-4" />
                    <span>{todayWorkout.duration}</span>
                  </div>
                </div>
                <Button className="w-full sm:w-auto gap-2">
                  <Play className="size-4" />
                  Start Workout
                </Button>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Weekly Progress</h3>
              <div className="space-y-3">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-8">{day.day}</span>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          day.completed ? 'bg-primary' : 'bg-surface'
                        }`}
                        style={{ width: day.completed ? '100%' : '0%' }}
                      />
                    </div>
                    <span className="text-xs text-muted w-12 text-right">
                      {day.completed ? `${day.duration}m` : '-'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Weekly Goal</span>
                  <span className="font-medium text-foreground">3/5 workouts</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted">No recent activity</p>
                ) : (
                  recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                      <div className={`flex size-8 items-center justify-center rounded-full ${
                        activity.type === 'workout' ? 'bg-blue-100' :
                        activity.type === 'meal' ? 'bg-green-100' :
                        activity.type === 'achievement' ? 'bg-yellow-100' :
                        activity.type === 'notification' ? 'bg-purple-100' :
                        'bg-surface'
                      }`}>
                        {activity.type === 'workout' && <Dumbbell className="size-4 text-blue-600" />}
                        {activity.type === 'meal' && <Target className="size-4 text-green-600" />}
                        {activity.type === 'achievement' && <Award className="size-4 text-yellow-600" />}
                        {activity.type === 'booking' && <Calendar className="size-4 text-purple-600" />}
                        {activity.type === 'notification' && <Award className="size-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Upcoming Classes</h3>
                <Link to="/member/classes">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingClasses.length === 0 ? (
                  <p className="text-sm text-muted">No upcoming classes</p>
                ) : (
                  upcomingClasses.map((classItem, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{classItem.name}</p>
                        <p className="text-xs text-muted">{classItem.instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{classItem.time}</p>
                        <span className={`text-xs ${classItem.spots.includes('Fully') ? 'text-red-600' : 'text-green-600'}`}>
                          {classItem.spots}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/member/workouts">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Dumbbell className="size-4" />
                  View Workouts
                </Button>
              </Link>
              <Link to="/member/meals">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Target className="size-4" />
                  Meal Plans
                </Button>
              </Link>
              <Link to="/member/classes">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Calendar className="size-4" />
                  Book Classes
                </Button>
              </Link>
              <Link to="/member/trainers">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Award className="size-4" />
                  My Trainers
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

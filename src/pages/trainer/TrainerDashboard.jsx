import { useState, useEffect } from 'react'
import { Users, Calendar, TrendingUp, Clock, MessageSquare, Plus, Search, Filter, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { trainerService } from '../../services/trainerService'
import { classesService } from '../../services/classesService'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'
import { formatLocalDate } from '../../utils/format'

export function TrainerDashboard() {
  const { user } = useAuth()
  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'Trainer'
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trainerData, setTrainerData] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [clients, setClients] = useState([])
  const [classes, setClasses] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch trainer profile
      const profileResponse = await trainerService.getCurrentTrainerProfile()
      const profile = unwrapResource(profileResponse)
      setTrainerData(profile)

      const trainerId = profile?.id

      if (trainerId) {
        // Fetch schedule, clients, and classes in parallel
        const [scheduleResult, rosterResult, classResponse] = await Promise.all([
          trainerService.getTrainerSchedule(trainerId, { date: formatLocalDate() }),
          trainerService.getTrainerRoster(trainerId),
          classesService.getClasses({ limit: 10 }),
        ])

        setSchedule(scheduleResult.schedule)
        setClients(rosterResult.roster)

        const classData = normalizeListResponse(classResponse)
        setClasses(classData)
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      console.error('Trainer dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const trainerStats = [
    { 
      label: 'Total Active Clients', 
      value: clients.length.toString(), 
      change: 'Assigned to you', 
      icon: Users 
    },
    { 
      label: "Today's Sessions", 
      value: schedule.length.toString(),
      change: 'Today', 
      icon: Calendar 
    },
    { 
      label: 'Upcoming Classes', 
      value: classes.filter(c => new Date(c.start_time) > new Date()).length.toString(), 
      change: 'Available', 
      icon: TrendingUp 
    },
  ]

  // Get today's schedule
  const todaySchedule = schedule.map((s) => {
    const start = s.start_time ? new Date(s.start_time) : null
    const end = s.end_time ? new Date(s.end_time) : null
    const durationMins = start && end ? Math.round((end - start) / 60000) : null
    return {
      id: s.id,
      time: start ? start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—',
      name: s.name || 'Class',
      type: [s.category, s.location].filter(Boolean).join(' · ') || 'Class',
      duration: durationMins ? `${durationMins}m` : '—',
      sessionType: `${s.current_bookings || 0}/${s.capacity || 0} booked`,
    }
  })

  const assignedClients = clients.slice(0, 3).map((c) => ({
    name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.email || 'Client',
    progress: c.is_active === false ? 0 : 100,
    goal: c.fitness_goal || c.active_workout_plan || 'General Fitness',
  }))

  // Get upcoming classes
  const upcomingClasses = classes
    .filter(c => new Date(c.start_time) > new Date())
    .slice(0, 3)
    .map(c => ({
      name: c.name,
      time: new Date(c.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      instructor: c.trainer_name || 'TBD',
      spots: c.available_spots > 0 ? `${c.available_spots} spots left` : 'Fully Booked',
    }))

  // Get recent activity (placeholder for now)
  const recentActivity = []

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
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {firstName}!</h1>
              <p className="text-sm text-muted">Search clients, logs, custom workouts...</p>
            </div>
            <div className="flex gap-3">
              <Link to="/trainer/workouts">
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Create Workout Plan
                </Button>
              </Link>
              <Link to="/trainer/meals">
                <Button variant="secondary" className="gap-2">
                  <Plus className="size-4" />
                  Create Meal Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainerStats.map((stat) => {
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
            {/* Today's Session Schedule */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Today's Session Schedule</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Search className="size-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Filter className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {todaySchedule.length === 0 ? (
                  <p className="text-sm text-muted">No sessions scheduled for today</p>
                ) : (
                  todaySchedule.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
                      <div className="text-center min-w-16">
                        <p className="text-sm font-medium text-foreground">{session.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{session.name}</p>
                        <p className="text-xs text-muted">{session.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{session.duration}</p>
                        <span className="text-xs text-muted">{session.sessionType}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Assigned Clients */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">My Assigned Clients</h3>
                <Link to="/trainer/clients">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {assignedClients.length === 0 ? (
                  <p className="text-sm text-muted">No assigned clients</p>
                ) : (
                  assignedClients.map((client, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground text-sm">{client.name}</p>
                        <span className="text-xs text-muted">{client.progress ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-1">{client.goal}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Client Activity */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Athlete Logs</h3>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted">No recent activity</p>
                ) : (
                  recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted">{activity.client}</p>
                      </div>
                      <span className="text-xs text-muted">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Upcoming Classes Today</h3>
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
                        <span className="text-xs text-muted">{classItem.spots}</span>
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
              <Link to="/trainer/clients">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Users className="size-4" />
                  View All Clients
                </Button>
              </Link>
              <Link to="/trainer/schedule">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Calendar className="size-4" />
                  Manage Schedule
                </Button>
              </Link>
              <Link to="/trainer/workouts">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Plus className="size-4" />
                  Create Workout
                </Button>
              </Link>
              <Link to="/trainer/meals">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Plus className="size-4" />
                  Create Meal Plan
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

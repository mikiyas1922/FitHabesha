import { useState, useEffect } from 'react'
import { Users, Calendar, TrendingUp, Clock, Plus, Search, Filter, Loader2, Star, Dumbbell, Utensils } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { trainerService } from '../../services/trainerService'
import { classesService } from '../../services/classesService'
import { ratingService } from '../../services/ratingService'
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
  const [ratingSummary, setRatingSummary] = useState(ratingService.emptyTrainerAverage())

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
        const [scheduleResult, rosterResult, classResponse, average] = await Promise.all([
          trainerService.getTrainerSchedule(trainerId, { date: formatLocalDate() }),
          trainerService.getTrainerRoster(trainerId),
          classesService.getClasses({ limit: 10 }),
          ratingService.getTrainerAverage(trainerId).catch(() => ratingService.emptyTrainerAverage()),
        ])

        setSchedule(scheduleResult.schedule)
        setClients(rosterResult.roster)
        setRatingSummary(average)

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
    {
      label: 'Average Rating',
      value: ratingSummary.total_reviews > 0 ? `${Number(ratingSummary.average_rating).toFixed(1)} / 5` : '—',
      change: `${ratingSummary.total_reviews} reviews`,
      icon: Star,
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
        <Alert variant="error" title="Error loading dashboard">
          {error}
          <Button onClick={loadDashboardData} className="mt-3">Retry</Button>
        </Alert>
      ) : (
        <>
          <PageHeader
            title={`Welcome back, ${firstName}!`}
            subtitle="Search clients, logs, custom workouts..."
            actions={
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
            }
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainerStats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} padding="md" className="hover:-translate-y-1 transition-transform">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                  <p className="text-xs text-muted mt-2">{stat.change}</p>
                </Card>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Session Schedule */}
            <Card padding="md" className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Session Schedule</CardTitle>
                <CardDescription>Your training sessions for today</CardDescription>
              </CardHeader>
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
                        <Badge variant="info" className="text-xs">{session.sessionType}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* My Assigned Clients - Athlete Roster Preview */}
            <Card padding="md">
              <CardHeader>
                <CardTitle>My Assigned Clients</CardTitle>
                <CardDescription>Athlete roster preview</CardDescription>
              </CardHeader>
              <div className="space-y-3">
                {assignedClients.length === 0 ? (
                  <p className="text-sm text-muted">No assigned clients</p>
                ) : (
                  assignedClients.map((client, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground text-sm">{client.name}</p>
                        <Badge variant={client.progress > 0 ? 'success' : 'warning'} className="text-xs">
                          {client.progress > 0 ? 'Active' : 'Inactive'}
                        </Badge>
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
              <Link to="/trainer/clients" className="mt-4 block">
                <Button variant="ghost" size="sm" className="w-full">View All Clients</Button>
              </Link>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Client Activity */}
            <Card padding="md">
              <CardHeader>
                <CardTitle>Recent Athlete Logs</CardTitle>
                <CardDescription>Latest client activity</CardDescription>
              </CardHeader>
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
            </Card>

            {/* Upcoming Classes */}
            <Card padding="md">
              <CardHeader>
                <CardTitle>Upcoming Classes Today</CardTitle>
                <CardDescription>Your scheduled classes</CardDescription>
              </CardHeader>
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
            </Card>
          </div>

          {/* Quick Actions - Builder Links */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Builder links for plans and schedules</CardDescription>
            </CardHeader>
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
                  <Dumbbell className="size-4" />
                  Create Workout
                </Button>
              </Link>
              <Link to="/trainer/meals">
                <Button variant="secondary" className="w-full justify-start gap-2">
                  <Utensils className="size-4" />
                  Create Meal Plan
                </Button>
              </Link>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

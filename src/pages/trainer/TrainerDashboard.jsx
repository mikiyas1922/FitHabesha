import { Users, Calendar, TrendingUp, Clock, MessageSquare, Plus, Search, Filter } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const trainerStats = [
  { label: 'Total Active Clients', value: '12', change: '+4% progress since last Monday', icon: Users },
  { label: 'Sessions This Week', value: '18', change: 'Steady roster this month', icon: Calendar },
  { label: 'Avg Client Progress', value: '67%', change: '8 remaining on schedule', icon: TrendingUp },
]

const todaySchedule = [
  { time: '09:00 AM', client: 'Sarah Connor', type: 'Power Pilates', duration: '60m', sessionType: 'PT Session' },
  { time: '10:00 AM', client: 'Emma Watson', type: 'Group Class', duration: '90m', sessionType: 'Group Class' },
  { time: '11:00 AM', client: 'David Hassel', type: 'HIIT / Cardio', duration: '45m', sessionType: 'PT Session' },
  { time: '12:00 PM', client: 'Marcus Vance', type: 'Strength Build', duration: '50m', sessionType: 'PT Strength Session' },
  { time: '01:00 PM', client: 'Spin Cycle', type: 'Aero Yoga Class', duration: '45m', sessionType: 'Group Class' },
  { time: '02:00 PM', client: 'David Hassel', type: 'Cardio Focus', duration: '45m', sessionType: 'Group Endurance' },
  { time: '03:00 PM', client: 'Sarah Connor', type: 'PT Flexibility', duration: '45m', sessionType: 'PT Session' },
]

const recentActivity = [
  { action: 'Completed 5 consecutive days of power endurance routines', client: 'Marcus Vance', time: '2 hours ago' },
  { action: 'Completed Biometric Body Re-scan', client: 'Marcus Vance', time: '2 hours ago' },
  { action: 'Calculated body fat drop of 1.4% with Devon Carter', client: 'Devon Carter', time: '6 hours ago' },
  { action: 'Signed In at Smart Terminal #2', client: 'Marcus Vance', time: '6 hours ago' },
  { action: 'Touchless entry recognized', client: 'Marcus Vance', time: '6 hours ago' },
]

const upcomingClasses = [
  { name: 'Power Yoga', time: '4:00 PM', instructor: 'Elena Rostova', spots: '2 spots left' },
  { name: 'HIIT Explosion', time: '5:30 PM', instructor: 'Marcus Vance (You)', spots: 'Fully Booked' },
  { name: 'Spin & Sweat', time: '7:00 PM', instructor: 'Coach Daniel', spots: '15 spots left' },
]

export function TrainerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Elena!</h1>
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
            {todaySchedule.map((session, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
                <div className="text-center min-w-16">
                  <p className="text-sm font-medium text-foreground">{session.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{session.client}</p>
                  <p className="text-xs text-muted">{session.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{session.duration}</p>
                  <span className="text-xs text-muted">{session.sessionType}</span>
                </div>
              </div>
            ))}
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
            {[
              { name: 'Sarah Connor', progress: 78, goal: 'Weight Loss' },
              { name: 'David Hassel', progress: 91, goal: 'Muscle Building' },
              { name: 'Marcus Vance', progress: 42, goal: 'Weight Loss' },
            ].map((client, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground text-sm">{client.name}</p>
                  <span className="text-xs text-muted">{client.progress}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">{client.goal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Client Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Athlete Logs</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
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
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Upcoming Classes Today</h3>
          <div className="space-y-3">
            {upcomingClasses.map((classItem, i) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
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
    </div>
  )
}

import { Search, Filter, MoreVertical, Dumbbell, Target, Calendar, TrendingUp, MessageSquare, Plus, Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const trainerStats = [
  { label: 'Total Active Clients', value: '12', icon: Users },
  { label: 'Sessions This Week', value: '18', icon: Calendar },
  { label: 'Avg Client Progress', value: '67%', icon: TrendingUp },
]

const clients = [
  {
    id: 'FC-8942',
    name: 'Sarah Connor',
    goal: 'Weight Loss',
    progress: 78,
    status: 'Active',
    lastSession: '2 days ago',
    assignedPlan: 'Push / Pull / Legs Hypertrophy',
    avatar: 'SC',
  },
  {
    id: 'FC-7711',
    name: 'David Hassel',
    goal: 'Muscle Building',
    progress: 91,
    status: 'Active',
    lastSession: 'Today',
    assignedPlan: 'Intermediate Strength',
    avatar: 'DH',
  },
  {
    id: 'FC-2204',
    name: 'Marcus Vance',
    goal: 'Weight Loss',
    progress: 42,
    status: 'Active',
    lastSession: 'Yesterday',
    assignedPlan: 'HIIT Cardio Focus',
    avatar: 'MV',
  },
  {
    id: 'FC-4012',
    name: 'Emily Watson',
    goal: 'Weight Loss',
    progress: 65,
    status: 'Active',
    lastSession: '3 days ago',
    assignedPlan: 'Full Body Strength',
    avatar: 'EW',
  },
  {
    id: 'FC-3398',
    name: 'John Carter',
    goal: 'Muscle Building',
    progress: 55,
    status: 'Active',
    lastSession: '1 week ago',
    assignedPlan: 'Power Building',
    avatar: 'JC',
  },
  {
    id: 'FC-5114',
    name: 'Clara Oswald',
    goal: 'Muscle Building',
    progress: 72,
    status: 'Active',
    lastSession: '4 days ago',
    assignedPlan: 'Hypertrophy Focus',
    avatar: 'CO',
  },
]

const weeklyActivity = [4, 5, 3, 6, 4, 5, 2]

export function MyClients() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Clients</h1>
          <p className="text-sm text-muted">Monitor and assign personal workout and nutrition plans</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <MessageSquare className="size-4" />
            Messages
          </Button>
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
            </div>
          )
        })}
      </div>

      {/* Weekly Activity */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Weekly Activity</h3>
        <div className="flex items-end gap-2 h-32">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                style={{ height: `${(weeklyActivity[i] / 6) * 100}%` }}
              />
              <span className="text-xs text-muted">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clients List */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Active Clients</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="p-4 rounded-xl border border-border bg-surface hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {client.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-xs text-muted">{client.id}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="size-4" />
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Goal Progress</span>
                  <span className="text-xs font-medium text-foreground">{client.progress}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Target className="size-3" />
                  <span>{client.goal}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Dumbbell className="size-3" />
                  <span className="truncate">{client.assignedPlan}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Calendar className="size-3" />
                  <span>Last session: {client.lastSession}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/trainer/workouts?client=${client.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    Assign Plan
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted">Showing 6 of 12 clients</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

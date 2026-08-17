import { Users, Calendar, LogIn, AlertTriangle, TrendingUp, Plus, Search, Clock, DoorOpen } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const receptionistStats = [
  { label: 'Today\'s Check-ins', value: '142', change: '+12% vs yesterday', icon: LogIn },
  { label: 'Active Members', value: '892', change: '+5 new this week', icon: Users },
  { label: 'Classes Today', value: '8', change: '3 spots remaining', icon: Calendar },
  { label: 'Equipment Issues', value: '2', change: 'Needs attention', icon: AlertTriangle },
]

const recentCheckIns = [
  { name: 'Sarah Connor', time: '10:45 AM', type: 'Member', avatar: 'SC' },
  { name: 'David Hassel', time: '10:42 AM', type: 'Member', avatar: 'DH' },
  { name: 'Marcus Vance', time: '10:38 AM', type: 'Member', avatar: 'MV' },
  { name: 'Emma Watson', time: '10:35 AM', type: 'Member', avatar: 'EW' },
  { name: 'John Carter', time: '10:30 AM', type: 'Walk-in', avatar: 'JC' },
]

const upcomingClasses = [
  { name: 'Power Yoga', time: '11:00 AM', instructor: 'Elena Rostova', capacity: '18/20' },
  { name: 'HIIT Explosion', time: '12:00 PM', instructor: 'Marcus Vance', capacity: '15/15' },
  { name: 'Spin & Sweat', time: '1:00 PM', instructor: 'Coach Daniel', capacity: '12/20' },
  { name: 'Core Strength', time: '2:00 PM', instructor: 'Sarah Jenkins', capacity: '8/15' },
]

const equipmentAlerts = [
  { item: 'Treadmill #4', issue: 'Maintenance Required', location: 'Cardio Zone', priority: 'High' },
  { item: 'Smith Machine', issue: 'Cable Replacement', location: 'Strength Zone', priority: 'Medium' },
]

const lockerStatus = {
  total: 200,
  occupied: 167,
  available: 33,
}

export function ReceptionistDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Receptionist!</h1>
          <p className="text-sm text-muted">Manage check-ins, classes, and facility operations</p>
        </div>
        <div className="flex gap-3">
          <Link to="/receptionist/walk-in">
            <Button className="gap-2">
              <Plus className="size-4" />
              Walk-in Registration
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {receptionistStats.map((stat) => {
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
        {/* Recent Check-ins */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Check-ins</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Search className="size-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {recentCheckIns.map((checkIn, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {checkIn.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{checkIn.name}</p>
                  <p className="text-xs text-muted">{checkIn.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{checkIn.time}</p>
                  <span className={`text-xs ${checkIn.type === 'Walk-in' ? 'text-orange-600' : 'text-green-600'}`}>
                    {checkIn.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locker Status */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Locker Status</h3>
          <div className="text-center mb-4">
            <div className="relative inline-flex items-center justify-center">
              <svg className="size-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-border"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(lockerStatus.occupied / lockerStatus.total) * 352} 352`}
                  className="text-primary"
                />
              </svg>
              <div className="absolute">
                <p className="text-2xl font-bold text-foreground">{Math.round((lockerStatus.occupied / lockerStatus.total) * 100)}%</p>
                <p className="text-xs text-muted">Occupied</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Total Lockers</span>
              <span className="font-medium text-foreground">{lockerStatus.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Occupied</span>
              <span className="font-medium text-foreground">{lockerStatus.occupied}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Available</span>
              <span className="font-medium text-foreground">{lockerStatus.available}</span>
            </div>
          </div>
          <Link to="/receptionist/lockers" className="block mt-4">
            <Button variant="secondary" size="sm" className="w-full gap-2">
              <DoorOpen className="size-4" />
              Manage Lockers
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Classes Today</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
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
                  <span className={`text-xs ${classItem.capacity.includes('15/15') ? 'text-red-600' : 'text-green-600'}`}>
                    {classItem.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Alerts */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-600" />
              <h3 className="font-semibold text-foreground">Equipment Alerts</h3>
            </div>
            <Link to="/receptionist/equipment">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {equipmentAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-red-100">
                <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="size-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{alert.item}</p>
                  <p className="text-xs text-muted">{alert.issue}</p>
                  <p className="text-xs text-muted">{alert.location}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  alert.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Link to="/receptionist/walk-in">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <Plus className="size-4" />
              Walk-in Registration
            </Button>
          </Link>
          <Link to="/receptionist/equipment">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <AlertTriangle className="size-4" />
              Equipment Tracking
            </Button>
          </Link>
          <Link to="/receptionist/lockers">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <DoorOpen className="size-4" />
              Locker Management
            </Button>
          </Link>
          <Link to="/receptionist/members">
            <Button variant="secondary" className="w-full justify-start gap-2">
              <Users className="size-4" />
              Members Directory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Calendar, Clock, Users, Plus, Filter, Search, CheckCircle, XCircle, Star } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const classStats = [
  { label: 'Classes This Week', value: '3', icon: Calendar },
  { label: 'Upcoming Bookings', value: '2', icon: Clock },
  { label: 'Favorite Class', value: 'HIIT', icon: Star },
]

const upcomingClasses = [
  {
    id: 1,
    name: 'Power Yoga',
    instructor: 'Elena Rostova',
    time: 'Tomorrow 10:00 AM',
    duration: '60 min',
    capacity: '17/20',
    location: 'Studio A',
    booked: true,
  },
  {
    id: 2,
    name: 'HIIT Explosion',
    instructor: 'Marcus Vance',
    time: 'Friday 5:00 PM',
    duration: '45 min',
    capacity: '15/15',
    location: 'Studio B',
    booked: true,
  },
  {
    id: 3,
    name: 'Spin & Sweat',
    instructor: 'Coach Daniel',
    time: 'Saturday 9:00 AM',
    duration: '50 min',
    capacity: '12/20',
    location: 'Studio C',
    booked: false,
  },
  {
    id: 4,
    name: 'Core Strength',
    instructor: 'Sarah Jenkins',
    time: 'Saturday 11:00 AM',
    duration: '40 min',
    capacity: '8/15',
    location: 'Studio A',
    booked: false,
  },
]

const availableClasses = [
  {
    id: 5,
    name: 'Pilates Flow',
    instructor: 'Emma Watson',
    time: 'Today 6:00 PM',
    duration: '55 min',
    capacity: '10/15',
    location: 'Studio A',
    difficulty: 'Beginner',
  },
  {
    id: 6,
    name: 'Boxing Basics',
    instructor: 'John Carter',
    time: 'Tomorrow 7:00 AM',
    duration: '45 min',
    capacity: '8/12',
    location: 'Studio B',
    difficulty: 'Intermediate',
  },
  {
    id: 7,
    name: 'Dance Fitness',
    instructor: 'Clara Oswald',
    time: 'Wednesday 6:30 PM',
    duration: '60 min',
    capacity: '18/25',
    location: 'Studio C',
    difficulty: 'Beginner',
  },
  {
    id: 8,
    name: 'CrossFit',
    instructor: 'Thomas Anderson',
    time: 'Thursday 5:30 PM',
    duration: '60 min',
    capacity: '6/10',
    location: 'Studio B',
    difficulty: 'Advanced',
  },
]

const myBookings = [
  { name: 'Power Yoga', date: 'Oct 16, 2026', time: '10:00 AM', instructor: 'Elena Rostova', status: 'confirmed' },
  { name: 'HIIT Explosion', date: 'Oct 17, 2026', time: '5:00 PM', instructor: 'Marcus Vance', status: 'confirmed' },
  { name: 'Spin Class', date: 'Oct 10, 2026', time: '9:00 AM', instructor: 'Coach Daniel', status: 'completed' },
]

export function MemberClasses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Group Classes</h1>
          <p className="text-sm text-muted">Browse and book group fitness classes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter Classes
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {classStats.map((stat) => {
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Bookings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">My Bookings</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="space-y-3">
            {myBookings.map((booking, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                <div className={`flex size-10 items-center justify-center rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {booking.status === 'confirmed' ? (
                    <CheckCircle className="size-5 text-green-600" />
                  ) : (
                    <Calendar className="size-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{booking.name}</p>
                  <p className="text-xs text-muted">{booking.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{booking.date}</p>
                  <p className="text-xs text-muted">{booking.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Classes</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-3 rounded-lg border border-border bg-surface">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">{classItem.name}</p>
                    <p className="text-xs text-muted">{classItem.instructor}</p>
                  </div>
                  {classItem.booked && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Booked
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-3" />
                    <span>{classItem.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📍 {classItem.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Classes */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Available Classes</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search classes..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableClasses.map((classItem) => (
            <div key={classItem.id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{classItem.name}</p>
                  <p className="text-xs text-muted">{classItem.instructor}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  classItem.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  classItem.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {classItem.difficulty}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>{classItem.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-3" />
                  <span>{classItem.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍 {classItem.location}</span>
                </div>
              </div>

              <Button size="sm" className="w-full">
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Calendar className="size-4" />
            View Schedule
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Filter by Instructor
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Star className="size-4" />
            Favorite Classes
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Users className="size-4" />
            Invite Friends
          </Button>
        </div>
      </div>
    </div>
  )
}

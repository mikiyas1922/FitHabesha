import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus, MoreVertical } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dates = [12, 13, 14, 15, 16, 17, 18]

const sessions = {
  12: [
    { time: '08:00', client: 'Jonathan Vance', type: 'Focus: Chest & Shoulder Strength', duration: '60m', status: 'completed' },
    { time: '12:00', client: 'Sarah Connor', type: 'Power Pilates', duration: '60m', status: 'completed' },
    { time: '10:00', client: 'Emma Watson', type: 'Group Class', duration: '90m', status: 'completed' },
  ],
  13: [
    { time: '09:00', client: 'Sarah Connor', type: 'Power Pilates', duration: '60m', status: 'completed' },
    { time: '10:00', client: 'Emma Watson', type: 'Group Class', duration: '90m', status: 'completed' },
    { time: '11:00', client: 'David Hassel', type: 'HIIT / Cardio', duration: '45m', status: 'completed' },
  ],
  14: [
    { time: '08:00', client: 'Jonathan Vance', type: 'Focus: Chest & Shoulder Strength', duration: '60m', status: 'completed' },
    { time: '12:00', client: 'Marcus Vance', type: 'Strength Build', duration: '50m', status: 'completed' },
    { time: '01:00', client: 'Spin Cycle', type: 'Aero Yoga Class', duration: '45m', status: 'completed' },
  ],
  15: [
    { time: '09:00', client: 'Sarah Connor', type: 'Power Pilates', duration: '60m', status: 'completed' },
    { time: '10:00', client: 'Emma Watson', type: 'Group Class', duration: '90m', status: 'completed' },
    { time: '11:00', client: 'David Hassel', type: 'HIIT / Cardio', duration: '45m', status: 'completed' },
    { time: '12:00', client: 'Marcus Vance', type: 'Strength Build', duration: '50m', status: 'completed' },
  ],
  16: [
    { time: '08:00', client: 'Jonathan Vance', type: 'Focus: Chest & Shoulder Strength', duration: '60m', status: 'upcoming' },
    { time: '12:00', client: 'Marcus Vance', type: 'Strength Build', duration: '50m', status: 'upcoming' },
    { time: '02:00', client: 'David Hassel', type: 'Cardio Focus', duration: '45m', status: 'upcoming' },
    { time: '03:00', client: 'Sarah Connor', type: 'PT Flexibility', duration: '45m', status: 'upcoming' },
  ],
  17: [
    { time: '10:00', client: 'Emma Watson', type: 'Group Class', duration: '90m', status: 'upcoming' },
    { time: '04:00', client: 'Power Yoga', type: 'HIIT Explosion', duration: '45m', status: 'upcoming' },
  ],
  18: [],
}

const scheduleStats = {
  totalSessions: '6 Sessions',
  completed: '3/6 Done',
  totalBookings: 'Total Bookings',
}

export function TrainerSchedule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trainer Schedule</h1>
          <p className="text-sm text-muted">Manage and organize your weekly client bookings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <ChevronLeft className="size-4" />
            Previous Week
          </Button>
          <Button variant="secondary" className="gap-2">
            Next Week
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Week Header */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Oct 12 - Oct 18, 2026</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Week</Button>
            <Button variant="ghost" size="sm">Day</Button>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => (
            <div key={day} className="text-center">
              <p className="text-xs text-muted mb-1">{day}</p>
              <div className={`size-8 flex items-center justify-center rounded-full mx-auto ${
                i === 4 ? 'bg-primary text-dark' : 'bg-surface'
              }`}>
                <span className="text-sm font-medium">{dates[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Today's Overview (Wed)</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-muted">{scheduleStats.totalSessions}</span>
            <span className="text-muted">{scheduleStats.completed}</span>
          </div>
        </div>

        <div className="space-y-3">
          {sessions[14]?.map((session, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
              <div className="text-center min-w-20">
                <p className="text-sm font-medium text-foreground">{session.time}</p>
                <p className="text-xs text-muted">{session.duration}</p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{session.client}</p>
                <p className="text-sm text-muted">{session.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {session.status}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-6">Weekly Schedule</h3>
        
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, dayIndex) => (
            <div key={day} className="space-y-2">
              <div className="text-center pb-2 border-b border-border">
                <p className="text-xs text-muted">{day}</p>
                <p className="text-sm font-medium text-foreground">{dates[dayIndex]}</p>
              </div>
              
              <div className="space-y-2 min-h-32">
                {sessions[dates[dayIndex]]?.map((session, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-lg text-xs ${
                      session.status === 'completed' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <p className="font-medium text-foreground">{session.time}</p>
                    <p className="text-muted truncate">{session.client}</p>
                    <p className="text-muted truncate">{session.type}</p>
                  </div>
                ))}
                {sessions[dates[dayIndex]]?.length === 0 && (
                  <div className="p-2 rounded-lg bg-surface text-xs text-muted text-center">
                    No sessions
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Plus className="size-4" />
            Add Session
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Calendar className="size-4" />
            Set Availability
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <User className="size-4" />
            Client Requests
          </Button>
        </div>
      </div>
    </div>
  )
}

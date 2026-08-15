import { Award, Calendar, Star, MessageSquare, Plus, Filter, Search, Clock, Dumbbell } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const myTrainers = [
  {
    id: 1,
    name: 'Elena Rostova',
    role: 'Personal Trainer',
    specialty: 'Strength & Conditioning',
    rating: 4.9,
    sessions: 24,
    nextSession: 'Today 4:00 PM',
    avatar: 'ER',
    status: 'active',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'HIIT Specialist',
    specialty: 'High Intensity Training',
    rating: 4.8,
    sessions: 12,
    nextSession: 'Friday 5:00 PM',
    avatar: 'MV',
    status: 'active',
  },
]

const availableTrainers = [
  {
    id: 3,
    name: 'Sarah Jenkins',
    role: 'Yoga Instructor',
    specialty: 'Yoga & Pilates',
    rating: 4.7,
    reviews: 89,
    experience: '5 years',
    avatar: 'SJ',
    availability: 'Mon, Wed, Fri',
  },
  {
    id: 4,
    name: 'Coach Daniel',
    role: 'Cardio Specialist',
    specialty: 'Cardio & Endurance',
    rating: 4.6,
    reviews: 67,
    experience: '3 years',
    avatar: 'CD',
    availability: 'Tue, Thu, Sat',
  },
  {
    id: 5,
    name: 'Thomas Anderson',
    role: 'CrossFit Coach',
    specialty: 'Functional Training',
    rating: 4.9,
    reviews: 112,
    experience: '7 years',
    avatar: 'TA',
    availability: 'Mon, Tue, Thu, Fri',
  },
  {
    id: 6,
    name: 'Emma Watson',
    role: 'Nutrition Coach',
    specialty: 'Diet & Nutrition',
    rating: 4.8,
    reviews: 45,
    experience: '4 years',
    avatar: 'EW',
    availability: 'Wed, Fri',
  },
]

const upcomingSessions = [
  { trainer: 'Elena Rostova', type: 'Personal Training', date: 'Oct 15, 2026', time: '4:00 PM', location: 'Training Zone A' },
  { trainer: 'Marcus Vance', type: 'HIIT Session', date: 'Oct 17, 2026', time: '5:00 PM', location: 'Studio B' },
  { trainer: 'Elena Rostova', type: 'Nutrition Consult', date: 'Oct 20, 2026', time: '10:00 AM', location: 'Meeting Room' },
]

export function MemberTrainers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Trainers</h1>
          <p className="text-sm text-muted">View your assigned trainers and book sessions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter Trainers
          </Button>
        </div>
      </div>

      {/* My Trainers */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">My Assigned Trainers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {myTrainers.map((trainer) => (
            <div key={trainer.id} className="p-4 rounded-lg border border-border bg-surface">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
                  {trainer.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{trainer.name}</p>
                  <p className="text-xs text-muted">{trainer.role}</p>
                  <p className="text-xs text-muted">{trainer.specialty}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">{trainer.rating}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Sessions Completed</span>
                  <span className="font-medium text-foreground">{trainer.sessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Next Session</span>
                  <span className="font-medium text-foreground">{trainer.nextSession}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1 gap-1">
                  <Calendar className="size-3" />
                  Book Session
                </Button>
                <Button size="sm" variant="ghost" className="gap-1">
                  <MessageSquare className="size-3" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Upcoming Sessions</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>

        <div className="space-y-3">
          {upcomingSessions.map((session, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{session.trainer}</p>
                <p className="text-xs text-muted">{session.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{session.date}</p>
                <p className="text-xs text-muted">{session.time}</p>
              </div>
              <Button variant="ghost" size="sm">
                Reschedule
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Available Trainers */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Available Trainers</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search trainers..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Specialties</option>
              <option>Strength</option>
              <option>Cardio</option>
              <option>Yoga</option>
              <option>Nutrition</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableTrainers.map((trainer) => (
            <div key={trainer.id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {trainer.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{trainer.name}</p>
                  <p className="text-xs text-muted">{trainer.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-foreground">{trainer.rating}</span>
                </div>
              </div>

              <div className="space-y-1 mb-3 text-xs text-muted">
                <p>🎯 {trainer.specialty}</p>
                <p>⭐ {trainer.reviews} reviews</p>
                <p>📅 {trainer.experience} experience</p>
                <p>🕐 {trainer.availability}</p>
              </div>

              <Button size="sm" className="w-full gap-1">
                <Plus className="size-3" />
                Request Training
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
            Book Session
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <MessageSquare className="size-4" />
            Message Trainer
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Award className="size-4" />
            View Progress
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Dumbbell className="size-4" />
            Training History
          </Button>
        </div>
      </div>
    </div>
  )
}

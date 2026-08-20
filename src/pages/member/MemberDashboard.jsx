import { Dumbbell, Calendar, TrendingUp, Target, Clock, Award, Play, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const memberStats = [
  { label: 'Workouts This Week', value: '4', change: 'Goal: 5', icon: Dumbbell },
  { label: 'Calories Burned', value: '2,450', change: 'This week', icon: TrendingUp },
  { label: 'Active Streak', value: '12 days', change: 'Personal best!', icon: Award },
  { label: 'Next Session', value: 'Today 4PM', change: 'With Coach Elena', icon: Calendar },
]

const todayWorkout = {
  name: 'Upper Body Strength',
  trainer: 'Coach Elena',
  time: '4:00 PM - 5:00 PM',
  exercises: 8,
  duration: '60 min',
  status: 'Upcoming',
}

const weeklyProgress = [
  { day: 'Mon', completed: true, duration: 45 },
  { day: 'Tue', completed: true, duration: 60 },
  { day: 'Wed', completed: true, duration: 50 },
  { day: 'Thu', completed: false, duration: 0 },
  { day: 'Fri', completed: false, duration: 0 },
  { day: 'Sat', completed: false, duration: 0 },
  { day: 'Sun', completed: false, duration: 0 },
]

const upcomingClasses = [
  { name: 'Power Yoga', time: 'Tomorrow 10AM', instructor: 'Elena Rostova', spots: '3 spots left' },
  { name: 'HIIT Explosion', time: 'Fri 5PM', instructor: 'Marcus Vance', spots: 'Fully Booked' },
]

const recentActivity = [
  { activity: 'Completed Chest & Back Workout', time: '2 hours ago', type: 'workout' },
  { activity: 'Logged meal: Grilled Chicken Salad', time: '5 hours ago', type: 'meal' },
  { activity: 'Achieved 12-day streak!', time: 'Yesterday', type: 'achievement' },
  { activity: 'Booked session with Coach Elena', time: '2 days ago', type: 'booking' },
]

export function MemberDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back !</h1>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-medium text-foreground text-lg">{todayWorkout.name}</p>
                <p className="text-sm text-muted">with {todayWorkout.trainer}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {todayWorkout.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted mb-4">
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
            <Button className="w-full gap-2">
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
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                <div className={`flex size-8 items-center justify-center rounded-full ${
                  activity.type === 'workout' ? 'bg-blue-100' :
                  activity.type === 'meal' ? 'bg-green-100' :
                  activity.type === 'achievement' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'workout' && <Dumbbell className="size-4 text-blue-600" />}
                  {activity.type === 'meal' && <Target className="size-4 text-green-600" />}
                  {activity.type === 'achievement' && <Award className="size-4 text-yellow-600" />}
                  {activity.type === 'booking' && <Calendar className="size-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.activity}</p>
                  <p className="text-xs text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
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
                  <span className={`text-xs ${classItem.spots.includes('Fully') ? 'text-red-600' : 'text-green-600'}`}>
                    {classItem.spots}
                  </span>
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
    </div>
  )
}

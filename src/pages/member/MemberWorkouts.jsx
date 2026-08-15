import { Dumbbell, Play, Clock, Target, Calendar, CheckCircle, Plus, Filter, Search, TrendingUp } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'

const workoutStats = [
  { label: 'Workouts This Week', value: '4', icon: Dumbbell },
  { label: 'Total Calories', value: '2,450', icon: TrendingUp },
  { label: 'Active Streak', value: '12 days', icon: CheckCircle },
]

const assignedWorkouts = [
  {
    id: 1,
    name: 'Upper Body Strength',
    trainer: 'Coach Elena',
    exercises: 8,
    duration: '60 min',
    difficulty: 'Intermediate',
    lastCompleted: 'Oct 13, 2026',
    status: 'assigned',
  },
  {
    id: 2,
    name: 'Lower Body Power',
    trainer: 'Coach Elena',
    exercises: 10,
    duration: '75 min',
    difficulty: 'Advanced',
    lastCompleted: 'Oct 12, 2026',
    status: 'assigned',
  },
  {
    id: 3,
    name: 'HIIT Cardio Blast',
    trainer: 'Coach Marcus',
    exercises: 6,
    duration: '45 min',
    difficulty: 'Beginner',
    lastCompleted: 'Oct 11, 2026',
    status: 'completed',
  },
  {
    id: 4,
    name: 'Core & Abs Focus',
    trainer: 'Coach Elena',
    exercises: 7,
    duration: '40 min',
    difficulty: 'Intermediate',
    lastCompleted: 'Oct 10, 2026',
    status: 'assigned',
  },
]

const workoutHistory = [
  { name: 'Chest & Back Workout', date: 'Oct 13, 2026', duration: '55 min', calories: 420, completed: true },
  { name: 'Leg Day', date: 'Oct 12, 2026', duration: '70 min', calories: 580, completed: true },
  { name: 'HIIT Cardio', date: 'Oct 11, 2026', duration: '45 min', calories: 350, completed: true },
  { name: 'Shoulders & Arms', date: 'Oct 10, 2026', duration: '50 min', calories: 380, completed: true },
  { name: 'Full Body', date: 'Oct 9, 2026', duration: '60 min', calories: 450, completed: true },
]

export function MemberWorkouts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Workouts</h1>
          <p className="text-sm text-muted">View assigned workouts and track your progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Custom Workout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {workoutStats.map((stat) => {
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
        {/* Assigned Workouts */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Assigned Workouts</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {assignedWorkouts.map((workout) => (
              <div key={workout.id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{workout.name}</p>
                    <p className="text-xs text-muted">by {workout.trainer}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {workout.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                  <div className="flex items-center gap-1">
                    <Dumbbell className="size-3" />
                    <span>{workout.exercises} exercises</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>Last: {workout.lastCompleted}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-1">
                    <Play className="size-3" />
                    Start
                  </Button>
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout History */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Workout History</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="space-y-3">
            {workoutHistory.map((workout, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="size-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{workout.name}</p>
                  <p className="text-xs text-muted">{workout.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{workout.duration}</p>
                  <p className="text-xs text-muted">{workout.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Workout Detail */}
      <div className="rounded-xl border border-primary bg-primary/5 p-6">
        <h3 className="font-semibold text-foreground mb-4">Today's Focus</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="size-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Target Area</p>
            </div>
            <p className="text-lg font-bold text-foreground">Upper Body</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="size-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Exercises</p>
            </div>
            <p className="text-lg font-bold text-foreground">8</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="size-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Duration</p>
            </div>
            <p className="text-lg font-bold text-foreground">60 min</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Intensity</p>
            </div>
            <p className="text-lg font-bold text-foreground">Medium</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Play className="size-4" />
            Start Today's Workout
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Plus className="size-4" />
            Create Custom Workout
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Calendar className="size-4" />
            Schedule Session
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <TrendingUp className="size-4" />
            View Progress
          </Button>
        </div>
      </div>
    </div>
  )
}

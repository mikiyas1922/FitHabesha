import { useState, useEffect } from 'react'
import { Dumbbell, Play, Clock, Target, Calendar, CheckCircle, Plus, Filter, Search, TrendingUp, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { templatesService } from '../../services/templatesService'

export function MemberWorkouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await templatesService.listWorkoutTemplates({ include_public: true })
      setWorkouts(response)
    } catch (err) {
      setError(err.message || 'Failed to load workouts')
      setWorkouts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const workoutStats = [
    { label: 'Available Workouts', value: String(workouts.length), icon: Dumbbell },
    { label: 'Public Templates', value: String(workouts.filter(w => w.is_public).length), icon: TrendingUp },
    { label: 'Total Exercises', value: String(workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0)), icon: CheckCircle },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Workouts</h1>
          <p className="text-sm text-muted">View available workout templates and track your progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Custom Workout
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
        <>
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

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Available Workout Templates</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Dumbbell className="size-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No workout templates available</p>
            <p className="text-xs mt-1">Check back later for new workouts</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {workouts.map((workout) => (
              <div key={workout._id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{workout.name}</p>
                    <p className="text-xs text-muted">{workout.description || 'No description'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workout.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {workout.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                  <div className="flex items-center gap-1">
                    <Dumbbell className="size-3" />
                    <span>{workout.exercises?.length || 0} exercises</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{workout.duration_weeks || 0} weeks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="size-3" />
                    <span>{workout.goal_type || 'General'}</span>
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
        )}
      </div>
      </>
      )}
    </div>
  )
}

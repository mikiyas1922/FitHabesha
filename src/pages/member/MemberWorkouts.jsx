import { useState, useEffect } from 'react'
import { Dumbbell, Play, Clock, Target, CheckCircle, Plus, Filter, Search, TrendingUp, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { EmptyState } from '../../components/ui/EmptyState'
import { templatesService } from '../../services/templatesService'
import { useAuth } from '../../contexts/AuthContext'
import { memberService } from '../../services/memberService'
import { assignedTrainerId, unwrapResource } from '../../utils/apiHelpers'

export function MemberWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get member profile
      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)

      const trainerId = assignedTrainerId(profile) || user?.trainer_id

      let workoutData = []
      if (trainerId) {
        const response = await templatesService.listWorkoutTemplates({
          trainer_id: trainerId,
          include_public: true,
        })
        workoutData = response
      }
      setWorkouts(workoutData)
    } catch (err) {
      setError(err.message || 'Failed to load workouts')
      setWorkouts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?.trainer_id])

  const workoutStats = [
    { label: 'Available Workouts', value: String(workouts.length), icon: Dumbbell },
    { label: 'Total Exercises', value: String(workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0)), icon: CheckCircle },
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Workouts" 
        subtitle="View available workout templates and track your progress"
        action={
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Custom Workout
          </Button>
        }
      />

      {error && (
        <Alert variant="danger" message={error} />
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-8 animate-spin text-[var(--app-primary)]" />
        </div>
      )}

      {!loading && (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {workoutStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} padding="md" hover className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20">
                  <Icon className="size-5 text-[var(--app-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-[var(--app-foreground)]">{stat.value}</p>
                  <p className="text-xs text-[var(--app-muted)] mt-1">{stat.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card padding="lg">
        <CardHeader action={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        }>
          <CardTitle>Available Workout Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <EmptyState 
              icon={<Dumbbell className="size-12" />}
              title="No workout templates available"
              description="Check back later for new workouts"
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {workouts.map((workout) => (
                <div key={workout._id} className="p-4 rounded-[12px] border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-primary)]/40 transition-all duration-200">
                  <div className={`flex items-start justify-between mb-3 border-l-2 ${
                    workout.difficulty === 'beginner' ? 'border-green-400' :
                    workout.difficulty === 'intermediate' ? 'border-yellow-400' :
                    'border-red-400'
                  } pl-3`}>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--app-foreground)]">{workout.name}</p>
                      <p className="text-xs text-[var(--app-muted)]">{workout.description || 'No description'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workout.difficulty === 'beginner' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                      workout.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {workout.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--app-muted)] mb-3">
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
        </CardContent>
      </Card>
      </>
      )}
    </div>
  )
}

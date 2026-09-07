import { useState, useEffect } from 'react'
import { Dumbbell, Play, Clock, Target, CheckCircle, Plus, Filter, Search, TrendingUp, Loader2, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

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

  const filteredWorkouts = workouts.filter(w => {
    const matchesSearch = w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       w.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || w.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const difficultyOptions = ['beginner', 'intermediate', 'advanced']

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Workouts"
        subtitle="View available workout templates and track your progress"
        actions={
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Custom Workout
          </Button>
        }
      />

      {error && (
        <Alert variant="error" title="Error loading workouts">
          {error}
        </Alert>
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
            <Card key={stat.label} padding="md" className="hover:-translate-y-1 transition-transform">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      <Card padding="md">
        <CardHeader>
          <CardTitle>Available Workout Templates</CardTitle>
          <CardDescription>Browse and start workout programs tailored to your fitness level</CardDescription>
        </CardHeader>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {difficultyOptions.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-primary text-foreground'
                    : 'bg-surface text-muted hover:bg-hover'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredWorkouts.length === 0 ? (
          <EmptyState
            icon={<Dumbbell className="size-12" />}
            title="No workout templates found"
            description={searchTerm || selectedDifficulty ? "Try adjusting your search or filters" : "Check back later for new workouts"}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredWorkouts.map((workout) => (
              <Card key={workout._id} padding="md" className="hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{workout.name}</p>
                    <p className="text-xs text-muted">{workout.description || 'No description'}</p>
                  </div>
                  <Badge variant={
                    workout.difficulty === 'beginner' ? 'success' :
                    workout.difficulty === 'intermediate' ? 'warning' :
                    'danger'
                  }>
                    {workout.difficulty}
                  </Badge>
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
                  <Button variant="outline" size="sm" onClick={() => { setSelectedWorkout(workout); setShowPreview(true) }}>
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
      </>
      )}
    </div>
  )
}

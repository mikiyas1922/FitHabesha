import { useState, useEffect } from 'react'
import { Dumbbell, Apple, Search, Filter, Loader2, Star, Clock, Target } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { templateService } from '../../services/templateService'

export function TemplateLibrary() {
  const [activeTab, setActiveTab] = useState('workouts')
  const [workouts, setWorkouts] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    goal_type: '',
    difficulty: '',
    search: ''
  })

  useEffect(() => {
    loadTemplates()
  }, [activeTab, filters])

  const loadTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const query = {
        include_public: true,
        ...(filters.goal_type && { goal_type: filters.goal_type }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
      }

      if (activeTab === 'workouts') {
        const { items } = await templateService.getWorkoutTemplates(query)
        setWorkouts(items)
      } else {
        const { items } = await templateService.getMealTemplates(query)
        setMealPlans(items)
      }
    } catch (err) {
      setError(err.message || 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkouts = workouts.filter(w => 
    !filters.search || w.name.toLowerCase().includes(filters.search.toLowerCase())
  )

  const filteredMealPlans = mealPlans.filter(m => 
    !filters.search || m.name.toLowerCase().includes(filters.search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Template Library</h1>
        <p className="text-sm text-muted mt-1">Browse workout and meal plan templates created by our trainers</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'workouts' ? 'default' : 'secondary'}
          onClick={() => setActiveTab('workouts')}
          className="gap-2"
        >
          <Dumbbell className="size-4" />
          Workouts
        </Button>
        <Button
          variant={activeTab === 'meals' ? 'default' : 'secondary'}
          onClick={() => setActiveTab('meals')}
          className="gap-2"
        >
          <Apple className="size-4" />
          Meal Plans
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              placeholder="Search templates..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={filters.goal_type}
            onChange={(e) => setFilters({ ...filters, goal_type: e.target.value })}
            className="px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Goals</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_building">Muscle Building</option>
            <option value="endurance">Endurance</option>
            <option value="general_fitness">General Fitness</option>
          </select>
          {activeTab === 'workouts' && (
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : activeTab === 'workouts' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted">
              <Dumbbell className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No workout templates found</p>
            </div>
          ) : (
            filteredWorkouts.map((workout) => (
              <div key={workout.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{workout.name}</h3>
                    <p className="text-xs text-muted mt-1">{workout.description}</p>
                  </div>
                  {workout.is_public && (
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">Public</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 rounded text-xs bg-surface border border-border">
                    {workout.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-surface border border-border">
                    {workout.goal_type}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-surface border border-border">
                    {workout.duration_weeks} weeks
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Dumbbell className="size-3" />
                    {workout.exercises?.length || 0} exercises
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {workout.duration_weeks} weeks
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMealPlans.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted">
              <Apple className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No meal plan templates found</p>
            </div>
          ) : (
            filteredMealPlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted mt-1">{plan.description}</p>
                  </div>
                  {plan.is_public && (
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">Public</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 rounded text-xs bg-surface border border-border">
                    {plan.goal_type}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-surface border border-border">
                    {plan.duration_weeks} weeks
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Apple className="size-3" />
                    {plan.meals?.length || 0} meals
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="size-3" />
                    {plan.goal_type}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Apple, Calendar, TrendingUp, Target, Plus, Filter, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { templatesService } from '../../services/templatesService'
import { useAuth } from '../../contexts/AuthContext'

export function MemberMeals() {
  const { user } = useAuth()
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMealPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Members can only access meal plans assigned through their trainer
      if (!user?.trainer_id) {
        setError('No trainer assigned. Please contact support to get a trainer assigned.')
        setMealPlans([])
        return
      }
      
      const response = await templatesService.listMealPlans({ trainer_id: user.trainer_id })
      setMealPlans(response)
    } catch (err) {
      setError(err.message || 'Failed to load meal plans')
      setMealPlans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMealPlans()
  }, [user?.trainer_id])

  const mealStats = [
    { label: 'Available Plans', value: String(mealPlans.length), icon: Apple },
    { label: 'Total Items', value: String(mealPlans.reduce((sum, p) => sum + (p.items?.length || 0), 0)), icon: Target },
    { label: 'Avg Calories', value: mealPlans.length > 0 ? String(Math.round(mealPlans.reduce((sum, p) => sum + (p.calories_target || 0), 0) / mealPlans.length)) : '—', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Meals</h1>
          <p className="text-sm text-muted">View available meal plans and nutrition templates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Log Custom Meal
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
        {mealStats.map((stat) => {
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
          <h3 className="font-semibold text-foreground">Available Meal Plans</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        {mealPlans.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Apple className="size-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No meal plans available</p>
            <p className="text-xs mt-1">Check back later for new nutrition plans</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {mealPlans.map((plan) => (
              <div key={plan._id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted">{plan.description || 'No description'}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {plan.goal_type || 'General'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                  <div className="flex items-center gap-1">
                    <Target className="size-3" />
                    <span>{plan.calories_target || 0} cal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Apple className="size-3" />
                    <span>{plan.protein_g || 0}g protein</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{plan.items?.length || 0} items</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-1">
                    View Plan
                  </Button>
                  <Button variant="secondary" size="sm">
                    Details
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

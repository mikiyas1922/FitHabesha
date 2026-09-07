import { useState, useEffect } from 'react'
import { Apple, Calendar, TrendingUp, Target, Plus, Filter, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { EmptyState } from '../../components/ui/EmptyState'
import { templatesService } from '../../services/templatesService'
import { useAuth } from '../../contexts/AuthContext'
import { memberService } from '../../services/memberService'
import { assignedTrainerId, unwrapResource } from '../../utils/apiHelpers'

export function MemberMeals() {
  const { user } = useAuth()
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMealPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)
      const trainerId = assignedTrainerId(profile) || user?.trainer_id

      if (!trainerId) {
        setError('No trainer assigned. Please contact support to get a trainer assigned.')
        setMealPlans([])
        return
      }
      
      const response = await templatesService.listMealPlans({
        trainer_id: trainerId,
        include_public: true,
      })
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
      <PageHeader 
        title="My Meals" 
        subtitle="View available meal plans and nutrition templates"
        action={
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Log Custom Meal
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
        {mealStats.map((stat) => {
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
          <CardTitle>Available Meal Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {mealPlans.length === 0 ? (
            <EmptyState 
              icon={<Apple className="size-12" />}
              title="No meal plans available"
              description="Check back later for new nutrition plans"
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {mealPlans.map((plan) => (
                <div key={plan._id} className="p-4 rounded-[12px] border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-primary)]/40 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-[var(--app-foreground)]">{plan.name}</p>
                      <p className="text-xs text-[var(--app-muted)]">{plan.description || 'No description'}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--app-primary)]/10 text-[var(--app-primary)] border border-[var(--app-primary)]/30">
                      {plan.goal_type || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--app-muted)] mb-3">
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
        </CardContent>
      </Card>
      </>
      )}
    </div>
  )
}

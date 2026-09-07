import { useState, useEffect } from 'react'
import { Apple, Calendar, TrendingUp, Target, Plus, Filter, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge, statusBadge } from '../../components/ui/Badge'
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
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPlanModal, setShowPlanModal] = useState(false)

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
        actions={
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Log Custom Meal
          </Button>
        }
      />

      {error && (
        <Alert variant="error" title="Error loading meal plans">
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
        {mealStats.map((stat) => {
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
          <CardTitle>Available Meal Plans</CardTitle>
          <CardDescription>Nutrition plans tailored to your fitness goals</CardDescription>
        </CardHeader>

        {mealPlans.length === 0 ? (
          <EmptyState
            icon={<Apple className="size-12" />}
            title="No meal plans available"
            description="Check back later for new nutrition plans"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {mealPlans.map((plan) => (
              <Card key={plan._id} padding="md" className="hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted">{plan.description || 'No description'}</p>
                  </div>
                  <Badge variant="info">{plan.goal_type || 'General'}</Badge>
                </div>

                {/* Macro Targets */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <p className="text-xs text-muted">Calories</p>
                    <p className="text-sm font-semibold text-foreground">{plan.calories_target || 0}</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <p className="text-xs text-muted">Protein</p>
                    <p className="text-sm font-semibold text-foreground">{plan.protein_g || 0}g</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <p className="text-xs text-muted">Carbs</p>
                    <p className="text-sm font-semibold text-foreground">{plan.carbs_g || 0}g</p>
                  </div>
                </div>

                {/* Meal Items Breakdown */}
                {plan.items && plan.items.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-foreground mb-2">Meal Items ({plan.items.length})</p>
                    <div className="space-y-1">
                      {plan.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                          <CheckCircle className="size-3 text-green-500" />
                          <span>{item.name || `Item ${idx + 1}`}</span>
                        </div>
                      ))}
                      {plan.items.length > 3 && (
                        <p className="text-xs text-muted">+{plan.items.length - 3} more items</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-1" onClick={() => { setSelectedPlan(plan); setShowPlanModal(true) }}>
                    View Plan
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Plan Modal */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <CardTitle>{selectedPlan.name}</CardTitle>
                <CardDescription>{selectedPlan.description || 'No description'}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowPlanModal(false)}>
                <Plus className="size-4 rotate-45" />
              </Button>
            </div>

            {/* Full Macro Breakdown */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Calories</p>
                <p className="text-lg font-bold text-foreground">{selectedPlan.calories_target || 0}</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Protein</p>
                <p className="text-lg font-bold text-foreground">{selectedPlan.protein_g || 0}g</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Carbs</p>
                <p className="text-lg font-bold text-foreground">{selectedPlan.carbs_g || 0}g</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-xs text-muted">Fat</p>
                <p className="text-lg font-bold text-foreground">{selectedPlan.fat_g || 0}g</p>
              </div>
            </div>

            {/* Full Meal Items */}
            {selectedPlan.items && selectedPlan.items.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Meal Items</p>
                <div className="space-y-2">
                  {selectedPlan.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                      <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.name || `Item ${idx + 1}`}</p>
                        <p className="text-xs text-muted">{item.calories || 0} cal · {item.protein || 0}g protein</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button className="flex-1" onClick={() => setShowPlanModal(false)}>Close</Button>
              <Button variant="secondary" onClick={() => setShowPlanModal(false)}>Adopt Plan</Button>
            </div>
          </Card>
        </div>
      )}
      </>
      )}
    </div>
  )
}

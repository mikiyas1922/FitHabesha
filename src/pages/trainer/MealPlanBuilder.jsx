import { Plus, Trash2, Search, Save, Apple, Beef, Fish, Wheat, Clock, Target, Loader2, Edit } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState, useEffect, useCallback } from 'react'
import { templatesService } from '../../services/templatesService'
import { trainerService } from '../../services/trainerService'
import { unwrapResource } from '../../utils/apiHelpers'

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Post-Workout']

const foodLibrary = [
  { id: 1, name: 'Grilled Chicken Breast', category: 'Protein', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 2, name: 'Brown Rice', category: 'Carbs', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: 3, name: 'Broccoli', category: 'Vegetables', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: 4, name: 'Salmon Fillet', category: 'Protein', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 5, name: 'Sweet Potato', category: 'Carbs', calories: 103, protein: 2, carbs: 24, fat: 0.1 },
  { id: 6, name: 'Greek Yogurt', category: 'Dairy', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { id: 7, name: 'Almonds', category: 'Nuts', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: 8, name: 'Oatmeal', category: 'Carbs', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { id: 9, name: 'Eggs', category: 'Protein', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { id: 10, name: 'Avocado', category: 'Fats', calories: 160, protein: 2, carbs: 9, fat: 15 },
  { id: 11, name: 'Spinach', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: 12, name: 'Quinoa', category: 'Carbs', calories: 222, protein: 8, carbs: 39, fat: 3.5 },
  { id: 13, name: 'Tuna', category: 'Protein', calories: 132, protein: 28, carbs: 0, fat: 1 },
  { id: 14, name: 'Banana', category: 'Fruits', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: 15, name: 'Olive Oil', category: 'Fats', calories: 119, protein: 0, carbs: 0, fat: 14 },
]

export function MealPlanBuilder() {
  const [selectedFoods, setSelectedFoods] = useState([])
  const [planName, setPlanName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [mealPlans, setMealPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [trainerId, setTrainerId] = useState(null)
  const [editingPlan, setEditingPlan] = useState(null)

  const [planDetails, setPlanDetails] = useState({
    goal_type: 'weight_loss',
    calories_target: 2000,
    protein_g: 150,
    carbs_g: 180,
    fat_g: 60,
    description: ''
  })

  const fetchMealPlans = useCallback(async () => {
    if (!trainerId) {
      setMealPlans([])
      return
    }
    try {
      setLoadingPlans(true)
      setError(null)
      const items = await trainerService.getTrainerMealPlans(trainerId)
      setMealPlans(items)
    } catch (err) {
      setError(err.message || 'Failed to load meal plans')
      setMealPlans([])
    } finally {
      setLoadingPlans(false)
    }
  }, [trainerId])

  useEffect(() => {
    const loadTrainerProfile = async () => {
      try {
        const profileResponse = await trainerService.getCurrentTrainerProfile()
        const profile = unwrapResource(profileResponse)
        if (profile?.id) {
          setTrainerId(profile.id)
        }
      } catch (err) {
        console.error('Failed to load trainer profile:', err)
      }
    }
    loadTrainerProfile()
  }, [])

  useEffect(() => {
    fetchMealPlans()
  }, [fetchMealPlans])

  const filteredFoods = selectedCategory === 'All'
    ? foodLibrary
    : foodLibrary.filter(food => food.category === selectedCategory)

  const addFood = (food) => {
    setSelectedFoods([...selectedFoods, { ...food, meal_name: 'Snack', quantity: '100g', day_number: selectedFoods.length + 1 }])
  }

  const removeFood = (index) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
  }

  const updateFood = (index, field, value) => {
    const updated = [...selectedFoods]
    updated[index][field] = value
    setSelectedFoods(updated)
  }

  const loadPlan = async (plan) => {
    try {
      setEditingPlan(plan)
      setPlanName(plan.name)
      setPlanDetails({
        goal_type: plan.goal_type,
        calories_target: plan.calories_target,
        protein_g: plan.protein_g,
        carbs_g: plan.carbs_g,
        fat_g: plan.fat_g,
        description: plan.description || ''
      })
      setSelectedFoods((plan.items || []).map((item) => ({
        ...item,
        name: item.food_item || item.name || '',
        protein: item.protein ?? item.protein_g ?? 0,
        carbs: item.carbs ?? item.carbs_g ?? 0,
        fat: item.fat ?? item.fat_g ?? 0,
      })))
    } catch (err) {
      setError(err.message || 'Failed to load meal plan')
    }
  }

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      setError('Plan name is required')
      return
    }

    if (!trainerId) {
      setError('Trainer profile is required to save a meal plan')
      return
    }

    if (selectedFoods.length === 0) {
      setError('At least one food item is required')
      return
    }

    const nutritionFields = ['calories_target', 'protein_g', 'carbs_g', 'fat_g']
    if (nutritionFields.some((field) => {
      const value = Number(planDetails[field])
      return !Number.isInteger(value) || value < 0
    })) {
      setError('All nutrition targets must be non-negative whole numbers')
      return
    }

    if (selectedFoods.some((food) =>
      !food.food_item && !food.name ||
      !food.meal_name?.trim() ||
      !food.quantity?.trim() ||
      !Number.isFinite(Number(food.day_number)) ||
      !Number.isInteger(Number(food.day_number)) ||
      !Number.isInteger(Number(food.calories)) ||
      Number(food.calories) < 0 ||
      !Number.isFinite(Number(food.protein_g ?? food.protein)) ||
      Number(food.protein_g ?? food.protein) < 0 ||
      !Number.isFinite(Number(food.carbs_g ?? food.carbs)) ||
      Number(food.carbs_g ?? food.carbs) < 0 ||
      !Number.isFinite(Number(food.fat_g ?? food.fat)) ||
      Number(food.fat_g ?? food.fat) < 0
    )) {
      setError('Each meal item must have a name and non-negative nutrition values')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const planData = {
        trainer_id: trainerId,
        name: planName,
        description: planDetails.description,
        goal_type: planDetails.goal_type,
        calories_target: Math.round(Number(planDetails.calories_target)),
        protein_g: Math.round(Number(planDetails.protein_g)),
        carbs_g: Math.round(Number(planDetails.carbs_g)),
        fat_g: Math.round(Number(planDetails.fat_g)),
        items: selectedFoods.map((food, index) => ({
          day_number: Number(food.day_number) || index + 1,
          meal_name: food.meal_name.trim(),
          food_item: (food.food_item || food.name).trim(),
          quantity: food.quantity.trim(),
          calories: Math.round(Number(food.calories)),
          protein_g: Math.round(Number(food.protein_g ?? food.protein)),
          carbs_g: Math.round(Number(food.carbs_g ?? food.carbs)),
          fat_g: Math.round(Number(food.fat_g ?? food.fat))
        }))
      }

      let response
      if (editingPlan) {
        response = await templatesService.updateMealPlan(editingPlan._id, planData)
      } else {
        response = await templatesService.createMealPlan(planData)
      }

      setEditingPlan(null)
      setPlanName('')
      setPlanDetails({
        goal_type: 'weight_loss',
        calories_target: 2000,
        protein_g: 150,
        carbs_g: 180,
        fat_g: 60,
        description: ''
      })
      setSelectedFoods([])
      fetchMealPlans()
    } catch (err) {
      const validationDetails =
        err.details?.errors ||
        err.details?.validation_errors ||
        err.details?.detail ||
        err.details?.details
      setError(
        validationDetails
          ? `${err.message || 'Validation failed'}: ${JSON.stringify(validationDetails)}`
          : err.message || 'Failed to save meal plan'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return

    try {
      await templatesService.deleteMealPlan(planId)
      fetchMealPlans()
    } catch (err) {
      setError(err.message || 'Failed to delete meal plan')
    }
  }

  const handleClearForm = () => {
    setEditingPlan(null)
    setPlanName('')
    setPlanDetails({
      goal_type: 'weight_loss',
      calories_target: 2000,
      protein_g: 150,
      carbs_g: 180,
      fat_g: 60,
      description: ''
    })
    setSelectedFoods([])
    setError(null)
  }

  const totalNutrition = selectedFoods.reduce((acc, food) => ({
    calories: acc.calories + food.calories,
    protein: acc.protein + food.protein,
    carbs: acc.carbs + food.carbs,
    fat: acc.fat + food.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meal Plan Builder</h1>
          <p className="text-sm text-muted">Create and assign custom nutrition plans to clients</p>
        </div>
        <div className="flex gap-3">
          {editingPlan && (
            <Button variant="secondary" className="gap-2" onClick={handleClearForm}>
              Cancel
            </Button>
          )}
          <Button className="gap-2" onClick={handleSavePlan} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {editingPlan ? 'Update Plan' : 'Save Template'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Plan Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Plan Details</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-2">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter plan name..."
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Goal Type</label>
            <select
              value={planDetails.goal_type}
              onChange={(e) => setPlanDetails({ ...planDetails, goal_type: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_building">Muscle Building</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Target Calories</label>
            <input
              type="number"
              value={planDetails.calories_target}
              onChange={(e) => setPlanDetails({ ...planDetails, calories_target: parseInt(e.target.value) })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm text-muted mb-2">Protein (g)</label>
            <input
              type="number"
              value={planDetails.protein_g}
              onChange={(e) => setPlanDetails({ ...planDetails, protein_g: parseInt(e.target.value) })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Carbs (g)</label>
            <input
              type="number"
              value={planDetails.carbs_g}
              onChange={(e) => setPlanDetails({ ...planDetails, carbs_g: parseInt(e.target.value) })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Fat (g)</label>
            <input
              type="number"
              value={planDetails.fat_g}
              onChange={(e) => setPlanDetails({ ...planDetails, fat_g: parseInt(e.target.value) })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-muted mb-2">Description</label>
          <input
            type="text"
            value={planDetails.description}
            onChange={(e) => setPlanDetails({ ...planDetails, description: e.target.value })}
            placeholder="Plan description..."
            className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* My Meal Plans */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">My Meal Plans</h3>
          {loadingPlans && <Loader2 className="size-4 animate-spin text-muted" />}
        </div>
        {mealPlans.length === 0 && !loadingPlans ? (
          <p className="text-sm text-muted">No meal plans created yet</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {mealPlans.map((plan) => (
              <div
                key={plan._id}
                className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{plan.name}</p>
                    <p className="text-xs text-muted">{plan.items?.length || 0} items</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="ghost" onClick={() => loadPlan(plan)} className="gap-1">
                    <Edit className="size-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeletePlan(plan._id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Food Library */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Food Library</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search foods..."
                  className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Categories</option>
                {['Protein', 'Carbs', 'Vegetables', 'Fats', 'Dairy', 'Nuts', 'Fruits'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{food.name}</p>
                  <div className="flex gap-3 text-xs text-muted mt-1">
                    <span>{food.calories} cal</span>
                    <span>{food.protein}g P</span>
                    <span>{food.carbs}g C</span>
                    <span>{food.fat}g F</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addFood(food)}
                  className="gap-1"
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Foods */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Selected Foods ({selectedFoods.length})</h3>
            {selectedFoods.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedFoods([])}>
                Clear All
              </Button>
            )}
          </div>

          {selectedFoods.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <Apple className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No foods selected yet</p>
              <p className="text-xs mt-1">Add foods from the library to build your meal plan</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedFoods.map((food, index) => (
                <div key={index} className="p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{food.name}</p>
                      <p className="text-xs text-muted">{food.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFood(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-muted mb-1">Day</label>
                      <input
                        type="number"
                        value={food.day_number}
                        onChange={(e) => updateFood(index, 'day_number', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Meal</label>
                      <select
                        value={food.meal_name}
                        onChange={(e) => updateFood(index, 'meal_name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {mealTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Quantity</label>
                      <input
                        type="text"
                        value={food.quantity}
                        onChange={(e) => updateFood(index, 'quantity', e.target.value)}
                        placeholder="100g"
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    <div>
                      <label className="block text-xs text-muted mb-1">Calories</label>
                      <input
                        type="number"
                        value={food.calories}
                        onChange={(e) => updateFood(index, 'calories', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Protein (g)</label>
                      <input
                        type="number"
                        value={food.protein}
                        onChange={(e) => updateFood(index, 'protein', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Carbs (g)</label>
                      <input
                        type="number"
                        value={food.carbs}
                        onChange={(e) => updateFood(index, 'carbs', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Fat (g)</label>
                      <input
                        type="number"
                        value={food.fat}
                        onChange={(e) => updateFood(index, 'fat', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nutrition Summary */}
      {selectedFoods.length > 0 && (
        <div className="rounded-xl border border-primary bg-primary/5 p-6">
          <h3 className="font-semibold text-foreground mb-4">Nutrition Summary</h3>
          <div className="grid md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-muted">Total Calories</p>
              <p className="text-xl font-bold text-foreground">{Math.round(totalNutrition.calories)} / {planDetails.calories_target}</p>
              <div className="h-2 bg-border rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min((totalNutrition.calories / planDetails.calories_target) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-muted">Protein</p>
              <p className="text-xl font-bold text-foreground">{Math.round(totalNutrition.protein)}g</p>
            </div>
            <div>
              <p className="text-muted">Carbs</p>
              <p className="text-xl font-bold text-foreground">{Math.round(totalNutrition.carbs)}g</p>
            </div>
            <div>
              <p className="text-muted">Fat</p>
              <p className="text-xl font-bold text-foreground">{Math.round(totalNutrition.fat)}g</p>
            </div>
            <div>
              <p className="text-muted">Total Foods</p>
              <p className="text-xl font-bold text-foreground">{selectedFoods.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

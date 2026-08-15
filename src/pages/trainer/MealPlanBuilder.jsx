import { Plus, Trash2, Search, Save, Apple, Beef, Fish, Wheat, Clock, Target } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState } from 'react'

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

const mealTemplates = [
  { name: 'High Protein Muscle Building', calories: 2500, protein: 180, carbs: 250, fat: 80 },
  { name: 'Balanced Weight Loss', calories: 1800, protein: 150, carbs: 150, fat: 60 },
  { name: 'Low Carb Keto', calories: 2000, protein: 140, carbs: 50, fat: 140 },
  { name: 'Endurance Athlete', calories: 3000, protein: 160, carbs: 400, fat: 80 },
]

export function MealPlanBuilder() {
  const [selectedFoods, setSelectedFoods] = useState([])
  const [planName, setPlanName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [targetCalories, setTargetCalories] = useState(2000)

  const filteredFoods = selectedCategory === 'All' 
    ? foodLibrary 
    : foodLibrary.filter(food => food.category === selectedCategory)

  const addFood = (food) => {
    setSelectedFoods([...selectedFoods, { ...food, meal: 'Snack', portion: 1 }])
  }

  const removeFood = (index) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
  }

  const updateFood = (index, field, value) => {
    const updated = [...selectedFoods]
    updated[index][field] = value
    setSelectedFoods(updated)
  }

  const totalNutrition = selectedFoods.reduce((acc, food) => ({
    calories: acc.calories + (food.calories * food.portion),
    protein: acc.protein + (food.protein * food.portion),
    carbs: acc.carbs + (food.carbs * food.portion),
    fat: acc.fat + (food.fat * food.portion),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meal Plan Builder</h1>
          <p className="text-sm text-muted">Create and assign custom nutrition plans to clients</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Save className="size-4" />
            Save as Template
          </Button>
          <Button className="gap-2">
            Assign to Client
          </Button>
        </div>
      </div>

      {/* Plan Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Plan Details</h3>
        <div className="grid md:grid-cols-4 gap-4">
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
            <label className="block text-sm text-muted mb-2">Target Calories</label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(parseInt(e.target.value))}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Goal</label>
            <select className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Muscle Building</option>
              <option>Weight Loss</option>
              <option>Maintenance</option>
              <option>Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Dietary Preference</label>
            <select className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>None</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
              <option>Paleo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Templates</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {mealTemplates.map((template, i) => (
            <button
              key={i}
              className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Apple className="size-4 text-primary" />
                <p className="font-medium text-foreground text-sm">{template.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                <span>{template.calories} cal</span>
                <span>{template.protein}g protein</span>
                <span>{template.carbs}g carbs</span>
                <span>{template.fat}g fat</span>
              </div>
            </button>
          ))}
        </div>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted mb-1">Meal</label>
                      <select
                        value={food.meal}
                        onChange={(e) => updateFood(index, 'meal', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {mealTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Portion</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={food.portion}
                        onChange={(e) => updateFood(index, 'portion', parseFloat(e.target.value))}
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
              <p className="text-xl font-bold text-foreground">{Math.round(totalNutrition.calories)} / {targetCalories}</p>
              <div className="h-2 bg-border rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min((totalNutrition.calories / targetCalories) * 100, 100)}%` }}
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

import { Apple, Calendar, TrendingUp, Target, Plus, Filter, CheckCircle, Clock } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const mealStats = [
  { label: 'Calories Today', value: '1,850 / 2,000', icon: TrendingUp },
  { label: 'Meals Logged', value: '3 / 5', icon: Apple },
  { label: 'Protein Intake', value: '120g / 150g', icon: Target },
]

const todayMeals = [
  {
    id: 1,
    name: 'Breakfast',
    time: '8:00 AM',
    foods: ['Oatmeal with berries', 'Greek yogurt', 'Black coffee'],
    calories: 450,
    protein: 25,
    completed: true,
  },
  {
    id: 2,
    name: 'Lunch',
    time: '12:30 PM',
    foods: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli'],
    calories: 650,
    protein: 45,
    completed: true,
  },
  {
    id: 3,
    name: 'Snack',
    time: '3:30 PM',
    foods: ['Almonds', 'Apple'],
    calories: 200,
    protein: 8,
    completed: true,
  },
  {
    id: 4,
    name: 'Dinner',
    time: '7:00 PM',
    foods: ['Salmon fillet', 'Quinoa', 'Mixed greens'],
    calories: 550,
    protein: 42,
    completed: false,
  },
  {
    id: 5,
    name: 'Post-Workout',
    time: 'After workout',
    foods: ['Protein shake', 'Banana'],
    calories: 300,
    protein: 30,
    completed: false,
  },
]

const mealPlan = {
  name: 'Muscle Building Plan',
  trainer: 'Coach Elena',
  startDate: 'Oct 1, 2026',
  endDate: 'Oct 31, 2026',
  targetCalories: 2000,
  targetProtein: 150,
}

const weeklyProgress = [
  { day: 'Mon', calories: 1950, target: 2000, completed: true },
  { day: 'Tue', calories: 2100, target: 2000, completed: true },
  { day: 'Wed', calories: 1850, target: 2000, completed: true },
  { day: 'Thu', calories: 0, target: 2000, completed: false },
  { day: 'Fri', calories: 0, target: 2000, completed: false },
  { day: 'Sat', calories: 0, target: 2000, completed: false },
  { day: 'Sun', calories: 0, target: 2000, completed: false },
]

export function MemberMeals() {
  const totalCalories = todayMeals.filter(m => m.completed).reduce((sum, m) => sum + m.calories, 0)
  const totalProtein = todayMeals.filter(m => m.completed).reduce((sum, m) => sum + m.protein, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Meals</h1>
          <p className="text-sm text-muted">Track your nutrition and follow your meal plan</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Log Custom Meal
          </Button>
        </div>
      </div>

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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Meals */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Today's Meals</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div key={meal.id} className={`p-4 rounded-lg border ${
                meal.completed ? 'border-border bg-surface' : 'border-dashed border-border bg-surface/50'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-full ${
                      meal.completed ? 'bg-green-100' : 'bg-surface'
                    }`}>
                      {meal.completed ? (
                        <CheckCircle className="size-4 text-green-600" />
                      ) : (
                        <Clock className="size-4 text-muted" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{meal.name}</p>
                      <p className="text-xs text-muted">{meal.time}</p>
                    </div>
                  </div>
                  {meal.completed && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{meal.calories} cal</p>
                      <p className="text-xs text-muted">{meal.protein}g protein</p>
                    </div>
                  )}
                </div>

                {meal.completed ? (
                  <div className="flex flex-wrap gap-2">
                    {meal.foods.map((food, i) => (
                      <span key={i} className="text-xs text-muted bg-surface px-2 py-1 rounded">
                        {food}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Button size="sm" variant="secondary" className="gap-1">
                    <Plus className="size-3" />
                    Log Meal
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Meal Plan */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Current Meal Plan</h3>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
            <p className="font-medium text-foreground">{mealPlan.name}</p>
            <p className="text-xs text-muted mt-1">by {mealPlan.trainer}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted">
              <Calendar className="size-3" />
              <span>{mealPlan.startDate} - {mealPlan.endDate}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Daily Calories</span>
              <span className="text-sm font-medium text-foreground">{mealPlan.targetCalories}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Daily Protein</span>
              <span className="text-sm font-medium text-foreground">{mealPlan.targetProtein}g</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(totalCalories / mealPlan.targetCalories) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted text-center">{totalCalories} / {mealPlan.targetCalories} cal</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Weekly Calorie Progress</h3>
        <div className="space-y-3">
          {weeklyProgress.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-8">{day.day}</span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    day.completed ? 'bg-primary' : 'bg-surface'
                  }`}
                  style={{ width: day.completed ? `${(day.calories / day.target) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-muted w-20 text-right">
                {day.completed ? `${day.calories} cal` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Plus className="size-4" />
            Log New Meal
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Apple className="size-4" />
            View Meal Plan
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <TrendingUp className="size-4" />
            Nutrition Report
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  )
}

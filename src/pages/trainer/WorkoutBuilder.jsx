import { Plus, Trash2, Search, Filter, Save, Dumbbell, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState } from 'react'

const exerciseCategories = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio', 'Full Body'
]

const exerciseLibrary = [
  { id: 1, name: 'Bench Press', category: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: 2, name: 'Incline Dumbbell Press', category: 'Chest', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: 3, name: 'Cable Flyes', category: 'Chest', equipment: 'Cable Machine', difficulty: 'Beginner' },
  { id: 4, name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight', difficulty: 'Advanced' },
  { id: 5, name: 'Lat Pulldown', category: 'Back', equipment: 'Cable Machine', difficulty: 'Beginner' },
  { id: 6, name: 'Barbell Rows', category: 'Back', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: 7, name: 'Shoulder Press', category: 'Shoulders', equipment: 'Dumbbells', difficulty: 'Intermediate' },
  { id: 8, name: 'Lateral Raises', category: 'Shoulders', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: 9, name: 'Bicep Curls', category: 'Arms', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: 10, name: 'Tricep Pushdown', category: 'Arms', equipment: 'Cable Machine', difficulty: 'Beginner' },
  { id: 11, name: 'Squats', category: 'Legs', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: 12, name: 'Leg Press', category: 'Legs', equipment: 'Machine', difficulty: 'Beginner' },
  { id: 13, name: 'Plank', category: 'Core', equipment: 'Bodyweight', difficulty: 'Beginner' },
  { id: 14, name: 'Crunches', category: 'Core', equipment: 'Bodyweight', difficulty: 'Beginner' },
  { id: 15, name: 'Treadmill Run', category: 'Cardio', equipment: 'Treadmill', difficulty: 'Beginner' },
]

const workoutTemplates = [
  { name: 'Push / Pull / Legs Hypertrophy', focus: 'Muscle Building', duration: '45-60 min', exercises: 18 },
  { name: 'HIIT Cardio Focus', focus: 'Weight Loss', duration: '30 min', exercises: 8 },
  { name: 'Full Body Strength', focus: 'Strength', duration: '60 min', exercises: 12 },
  { name: 'Power Building', focus: 'Strength & Hypertrophy', duration: '75 min', exercises: 15 },
]

export function WorkoutBuilder() {
  const [selectedExercises, setSelectedExercises] = useState([])
  const [workoutName, setWorkoutName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredExercises = selectedCategory === 'All' 
    ? exerciseLibrary 
    : exerciseLibrary.filter(ex => ex.category === selectedCategory)

  const addExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, { ...exercise, sets: 3, reps: '10-12', rest: '60s' }])
  }

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index, field, value) => {
    const updated = [...selectedExercises]
    updated[index][field] = value
    setSelectedExercises(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workout Builder</h1>
          <p className="text-sm text-muted">Create and assign custom workout plans to clients</p>
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

      {/* Workout Details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Workout Details</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-2">Workout Name</label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name..."
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Focus</label>
            <select className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Muscle Building</option>
              <option>Weight Loss</option>
              <option>Strength</option>
              <option>Endurance</option>
              <option>Flexibility</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Duration</label>
            <select className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>30 min</option>
              <option>45 min</option>
              <option>60 min</option>
              <option>75 min</option>
              <option>90 min</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Templates</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {workoutTemplates.map((template, i) => (
            <button
              key={i}
              className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="size-4 text-primary" />
                <p className="font-medium text-foreground text-sm">{template.name}</p>
              </div>
              <p className="text-xs text-muted">{template.focus}</p>
              <div className="flex gap-2 mt-2 text-xs text-muted">
                <span>{template.duration}</span>
                <span>•</span>
                <span>{template.exercises} exercises</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Exercise Library */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Exercise Library</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Categories</option>
                {exerciseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{exercise.name}</p>
                  <div className="flex gap-2 text-xs text-muted mt-1">
                    <span>{exercise.category}</span>
                    <span>•</span>
                    <span>{exercise.equipment}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addExercise(exercise)}
                  className="gap-1"
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Exercises */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Selected Exercises ({selectedExercises.length})</h3>
            {selectedExercises.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedExercises([])}>
                Clear All
              </Button>
            )}
          </div>

          {selectedExercises.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <Dumbbell className="size-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No exercises selected yet</p>
              <p className="text-xs mt-1">Add exercises from the library to build your workout</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedExercises.map((exercise, index) => (
                <div key={index} className="p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{exercise.name}</p>
                      <p className="text-xs text-muted">{exercise.category} • {exercise.equipment}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-muted mb-1">Sets</label>
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Reps</label>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Rest</label>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) => updateExercise(index, 'rest', e.target.value)}
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

      {/* Workout Summary */}
      {selectedExercises.length > 0 && (
        <div className="rounded-xl border border-primary bg-primary/5 p-6">
          <h3 className="font-semibold text-foreground mb-4">Workout Summary</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted">Total Exercises</p>
              <p className="text-xl font-bold text-foreground">{selectedExercises.length}</p>
            </div>
            <div>
              <p className="text-muted">Total Sets</p>
              <p className="text-xl font-bold text-foreground">{selectedExercises.reduce((sum, ex) => sum + ex.sets, 0)}</p>
            </div>
            <div>
              <p className="text-muted">Estimated Duration</p>
              <p className="text-xl font-bold text-foreground">{selectedExercises.length * 5 + selectedExercises.reduce((sum, ex) => sum + ex.sets, 0) * 2} min</p>
            </div>
            <div>
              <p className="text-muted">Target Areas</p>
              <p className="text-xl font-bold text-foreground">{[...new Set(selectedExercises.map(ex => ex.category))].join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

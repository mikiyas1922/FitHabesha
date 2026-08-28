import { Plus, Trash2, Search, Filter, Save, Dumbbell, Clock, Target, ChevronDown, ChevronUp, Loader2, Edit } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState, useEffect } from 'react'
import { templatesService } from '../../services/templatesService'
import { trainerService } from '../../services/trainerService'
import { unwrapResource } from '../../utils/apiHelpers'

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

export function WorkoutBuilder() {
  const [selectedExercises, setSelectedExercises] = useState([])
  const [workoutName, setWorkoutName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [trainerId, setTrainerId] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)

  const [workoutDetails, setWorkoutDetails] = useState({
    difficulty: 'beginner',
    goal_type: 'general_fitness',
    duration_weeks: 4,
    is_public: false,
    description: ''
  })

  const fetchTemplates = async () => {
    if (!trainerId) {
      setTemplates([])
      return
    }
    try {
      setLoadingTemplates(true)
      setError(null)
      const response = await trainerService.getTrainerTemplates(trainerId)
      const payload = unwrapResource(response)
      setTemplates(Array.isArray(payload) ? payload : [])
    } catch (err) {
      setError(err.message || 'Failed to load templates')
      setTemplates([])
    } finally {
      setLoadingTemplates(false)
    }
  }

  useEffect(() => {
    const loadTrainerProfile = async () => {
      try {
        const profileResponse = await trainerService.getCurrentTrainerProfile()
        const profile = unwrapResource(profileResponse)
        if (profile?.id) {
          setTrainerId(profile.id)
          fetchTemplates()
        }
      } catch (err) {
        console.error('Failed to load trainer profile:', err)
      }
    }
    loadTrainerProfile()
  }, [])

  useEffect(() => {
    if (trainerId) {
      fetchTemplates()
    }
  }, [trainerId])

  const filteredExercises = selectedCategory === 'All'
    ? exerciseLibrary
    : exerciseLibrary.filter(ex => ex.category === selectedCategory)

  const addExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, { ...exercise, sets: 3, reps_per_set: 10, weight_kg: 0, rest_seconds: 60, day_number: selectedExercises.length + 1 }])
  }

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index, field, value) => {
    const updated = [...selectedExercises]
    updated[index][field] = value
    setSelectedExercises(updated)
  }

  const loadTemplate = async (template) => {
    try {
      setEditingTemplate(template)
      setWorkoutName(template.name)
      setWorkoutDetails({
        difficulty: template.difficulty,
        goal_type: template.goal_type,
        duration_weeks: template.duration_weeks,
        is_public: template.is_public,
        description: template.description || ''
      })
      setSelectedExercises(template.exercises || [])
    } catch (err) {
      setError(err.message || 'Failed to load template')
    }
  }

  const handleSaveTemplate = async () => {
    if (!workoutName.trim()) {
      setError('Workout name is required')
      return
    }

    if (selectedExercises.length === 0) {
      setError('At least one exercise is required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const templateData = {
        trainer_id: trainerId,
        name: workoutName,
        description: workoutDetails.description,
        difficulty: workoutDetails.difficulty,
        goal_type: workoutDetails.goal_type,
        duration_weeks: workoutDetails.duration_weeks,
        is_public: workoutDetails.is_public,
        exercises: selectedExercises.map((ex, index) => ({
          day_number: ex.day_number || index + 1,
          exercise_name: ex.name,
          sets: ex.sets,
          reps_per_set: ex.reps_per_set,
          weight_kg: ex.weight_kg,
          rest_seconds: ex.rest_seconds,
          notes: ex.notes || ''
        }))
      }

      let response
      if (editingTemplate) {
        response = await templatesService.updateWorkoutTemplate(editingTemplate._id, templateData)
      } else {
        response = await templatesService.createWorkoutTemplate(templateData)
      }

      setEditingTemplate(null)
      setWorkoutName('')
      setWorkoutDetails({
        difficulty: 'beginner',
        goal_type: 'general_fitness',
        duration_weeks: 4,
        is_public: false,
        description: ''
      })
      setSelectedExercises([])
      fetchTemplates()
    } catch (err) {
      setError(err.message || 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      await templatesService.deleteWorkoutTemplate(templateId)
      fetchTemplates()
    } catch (err) {
      setError(err.message || 'Failed to delete template')
    }
  }

  const handleClearForm = () => {
    setEditingTemplate(null)
    setWorkoutName('')
    setWorkoutDetails({
      difficulty: 'beginner',
      goal_type: 'general_fitness',
      duration_weeks: 4,
      is_public: false,
      description: ''
    })
    setSelectedExercises([])
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workout Builder</h1>
          <p className="text-sm text-muted">Create and assign custom workout plans to clients</p>
        </div>
        <div className="flex gap-3">
          {editingTemplate && (
            <Button variant="secondary" className="gap-2" onClick={handleClearForm}>
              Cancel
            </Button>
          )}
          <Button className="gap-2" onClick={handleSaveTemplate} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {editingTemplate ? 'Update Template' : 'Save as Template'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

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
            <label className="block text-sm text-muted mb-2">Goal Type</label>
            <select
              value={workoutDetails.goal_type}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, goal_type: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_building">Muscle Building</option>
              <option value="strength">Strength</option>
              <option value="endurance">Endurance</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Duration (weeks)</label>
            <select
              value={workoutDetails.duration_weeks}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, duration_weeks: parseInt(e.target.value) })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={2}>2 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={6}>6 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-muted mb-2">Difficulty</label>
            <select
              value={workoutDetails.difficulty}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, difficulty: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Description</label>
            <input
              type="text"
              value={workoutDetails.description}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, description: e.target.value })}
              placeholder="Workout description..."
              className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={workoutDetails.is_public}
              onChange={(e) => setWorkoutDetails({ ...workoutDetails, is_public: e.target.checked })}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Make this template public (visible to all members)
          </label>
        </div>
      </div>

      {/* My Templates */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">My Templates</h3>
          {loadingTemplates && <Loader2 className="size-4 animate-spin text-muted" />}
        </div>
        {templates.length === 0 && !loadingTemplates ? (
          <p className="text-sm text-muted">No templates created yet</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template._id}
                className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{template.name}</p>
                    <p className="text-xs text-muted">{template.exercises?.length || 0} exercises</p>
                  </div>
                  {template.is_public && (
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">Public</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="ghost" onClick={() => loadTemplate(template)} className="gap-1">
                    <Edit className="size-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template._id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-muted mb-1">Day</label>
                      <input
                        type="number"
                        value={exercise.day_number}
                        onChange={(e) => updateExercise(index, 'day_number', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
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
                        type="number"
                        value={exercise.reps_per_set}
                        onChange={(e) => updateExercise(index, 'reps_per_set', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Rest (sec)</label>
                      <input
                        type="number"
                        value={exercise.rest_seconds}
                        onChange={(e) => updateExercise(index, 'rest_seconds', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="block text-xs text-muted mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={exercise.weight_kg}
                        onChange={(e) => updateExercise(index, 'weight_kg', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted mb-1">Notes</label>
                      <input
                        type="text"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                        placeholder="Optional notes..."
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

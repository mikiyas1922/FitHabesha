import { useState, useEffect } from 'react'
import { X, Loader2, Calendar, Clock, MapPin, Users, Dumbbell } from 'lucide-react'
import { Button } from './ui/Button'
import { classesService } from '../services/classesService'
import { trainerService } from '../services/trainerService'
import { useAuth } from '../contexts/AuthContext'

export function ClassFormModal({ open, onClose, classData, onSuccess }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isTrainer = user?.role === 'trainer'
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trainers, setTrainers] = useState([])
  const [loadingTrainers, setLoadingTrainers] = useState(false)
  
  const [formData, setFormData] = useState({
    trainer_id: classData?.trainer_id || (isTrainer ? user?.id : '') || '',
    name: classData?.name || '',
    description: classData?.description || '',
    category: classData?.category || 'hiit',
    difficulty: classData?.difficulty || 'intermediate',
    capacity: classData?.capacity || 20,
    start_time: classData?.start_time || '',
    end_time: classData?.end_time || '',
    location: classData?.location || '',
  })

  // Fetch trainers when modal opens (for admins)
  useEffect(() => {
    if (open && isAdmin) {
      fetchTrainers()
    }
  }, [open, isAdmin])

  const fetchTrainers = async () => {
    try {
      setLoadingTrainers(true)
      const response = await trainerService.getAllTrainers()
      console.log('Trainers response:', response)
      setTrainers(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Failed to fetch trainers:', err)
      // Don't redirect on 401, just show empty trainers list
      if (err.status === 401) {
        console.warn('Authentication error fetching trainers, using empty list')
      }
      setTrainers([])
    } finally {
      setLoadingTrainers(false)
    }
  }

  const isEditing = !!classData?.id

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name || !formData.capacity || !formData.start_time || !formData.end_time) {
        throw new Error('Please fill in all required fields')
      }

      const trainerId = formData.trainer_id
      if (!trainerId) {
        if (isAdmin) {
          throw new Error('Please select a trainer from the dropdown')
        } else {
          throw new Error('Trainer ID is required. Please ensure you are logged in as a trainer.')
        }
      }
      console.log('Using trainer_id:', trainerId)
      console.log('User role:', user?.role)
      console.log('Is admin?', isAdmin)
      console.log('Is trainer?', isTrainer)

      if (new Date(formData.start_time) >= new Date(formData.end_time)) {
        throw new Error('End time must be after start time')
      }

      // Format dates to ISO 8601 with timezone
      const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return ''
        const date = new Date(dateTimeString)
        return date.toISOString()
      }

      const payload = {
        trainer_id: trainerId,
        name: formData.name,
        capacity: Number(formData.capacity),
        start_time: formatDateTime(formData.start_time),
        end_time: formatDateTime(formData.end_time),
        // Optional fields - only include if they have values
        ...(formData.description && { description: formData.description }),
        ...(formData.category && { category: formData.category }),
        ...(formData.difficulty && { difficulty: formData.difficulty }),
        ...(formData.location && { location: formData.location }),
      }

      console.log('Submitting class data:', JSON.stringify(payload, null, 2))
      console.log('User context:', { userId: user?.id, userRole: user?.role, trainerId: formData.trainer_id })
      console.log('Form data types:', {
        capacity: typeof formData.capacity,
        capacityValue: formData.capacity,
        start_time: typeof formData.start_time,
        end_time: typeof formData.end_time
      })

      let response
      if (isEditing) {
        response = await classesService.updateClass(classData.id, payload)
      } else {
        response = await classesService.createClass(payload)
      }

      console.log('Class creation response:', response)

      if (onSuccess) {
        onSuccess(response)
      }
      onClose()
    } catch (err) {
      console.error('Class creation error:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        details: err.details,
        fullError: err
      })
      setError(err.message || 'Failed to save class')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Convert capacity to number
    if (name === 'capacity') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Set trainer_id when user changes or modal opens for trainers (only for new classes)
  useEffect(() => {
    if (open && isTrainer && user?.id && !classData?.trainer_id) {
      setFormData(prev => ({ ...prev, trainer_id: user.id }))
    }
  }, [open, isTrainer, user?.id, classData?.trainer_id])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Dumbbell className="size-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? 'Edit Class' : 'Create New Class'}
                </h2>
                <p className="text-sm text-muted">
                  {isEditing ? 'Update class details' : 'Add a new class to the schedule'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-hover text-muted transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
              <span className="text-red-500 dark:text-red-400 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Trainer Selection (Admin only) */}
          {isAdmin && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                Trainer <span className="text-red-500">*</span>
              </label>
              {loadingTrainers ? (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="size-4 animate-spin" />
                  Loading trainers...
                </div>
              ) : (
                <select
                  name="trainer_id"
                  value={formData.trainer_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name} {trainer.email ? `(${trainer.email})` : ''}
                    </option>
                  ))}
                </select>
              )}
              {trainers.length === 0 && !loadingTrainers && (
                <p className="text-xs text-amber-600">
                  No trainers available. Please register trainers first.
                </p>
              )}
            </div>
          )}

          {/* Class Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              placeholder="e.g., Morning HIIT Blast"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
              placeholder="Describe the class and what participants can expect..."
            />
          </div>

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="yoga">🧘 Yoga</option>
                <option value="pilates">🤸 Pilates</option>
                <option value="hiit">💪 HIIT</option>
                <option value="spin">🚴 Spin</option>
                <option value="strength">🏋️ Strength</option>
                <option value="dance">💃 Dance</option>
                <option value="other">✨ Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="beginner">🌱 Beginner</option>
                <option value="intermediate">⚡ Intermediate</option>
                <option value="advanced">🔥 Advanced</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Capacity <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                max="50"
                className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                placeholder="e.g., Studio A"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 h-12 text-base font-medium"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Class' : 'Create Class'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

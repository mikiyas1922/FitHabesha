import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { bookingService } from '../../services/bookingService'
import { classesService } from '../../services/classesService'
import { memberService } from '../../services/memberService'
import { ratingService } from '../../services/ratingService'
import { trainerService } from '../../services/trainerService'
import {
  assignedTrainerId,
  assignedTrainerName,
  formatPersonName,
  normalizeListResponse,
  unwrapResource,
} from '../../utils/apiHelpers'

function resolveMemberProfile(profileResponse) {
  const profile = profileResponse ? unwrapResource(profileResponse) : null
  if (!profile || typeof profile !== 'object') return null
  if (profile.id) return profile
  const nested = profile.member
  if (nested && typeof nested === 'object') {
    return {
      ...nested,
      trainer: profile.trainer || nested.trainer,
      assignment: profile.assignment || profile.current_assignment || nested.assignment,
      current_assignment: profile.current_assignment || profile.assignment || nested.current_assignment,
    }
  }
  return profile
}

function addTrainerOption(seen, id, name) {
  if (!id) return
  const value = String(id)
  const label = (name && String(name).trim()) || 'Trainer'
  const existing = seen.get(value)
  if (existing) {
    if (existing.label === 'Trainer' || existing.label === 'Assigned trainer') {
      seen.set(value, { value, label })
    }
    return
  }
  seen.set(value, { value, label })
}

const RATING_TYPES = [
  { value: 'trainer', label: 'Trainer' },
  { value: 'class', label: 'Class' },
  { value: 'facility', label: 'Facility' },
]

const DIMENSIONS = {
  trainer: [
    { value: 'overall', label: 'Overall' },
    { value: 'punctuality', label: 'Punctuality' },
    { value: 'knowledge', label: 'Knowledge' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'communication', label: 'Communication' },
  ],
  class: [
    { value: 'overall', label: 'Overall' },
    { value: 'instruction', label: 'Instruction' },
    { value: 'energy', label: 'Energy' },
    { value: 'difficulty', label: 'Difficulty' },
  ],
  facility: [
    { value: 'overall', label: 'Overall' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'staff', label: 'Staff' },
  ],
}

function formatRatingDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString()
}

export function MemberFeedback() {
  const [history, setHistory] = useState([])
  const [bookings, setBookings] = useState([])
  const [classes, setClasses] = useState([])
  const [catalogTrainers, setCatalogTrainers] = useState([])
  const [assignedTrainer, setAssignedTrainer] = useState({ id: null, name: '' })
  const [facilitySummary, setFacilitySummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [form, setForm] = useState({
    type: 'trainer',
    trainer_id: '',
    class_id: '',
    rating_stars: '5',
    rating_dimension: 'overall',
    comment: '',
    is_anonymous: false,
  })

  const loadPage = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const [profileResponse, facility, classResponse, trainersResponse] = await Promise.all([
        memberService.getCurrentMemberProfile().catch((err) => {
          console.warn('Member profile could not be loaded:', err)
          return null
        }),
        ratingService.getFacilityRating().catch((err) => {
          console.warn('Facility rating could not be loaded:', err)
          return null
        }),
        classesService.getClasses({ limit: 50 }).catch((err) => {
          console.warn('Classes could not be loaded:', err)
          return []
        }),
        trainerService.getAllTrainers({ page: 1, limit: 100 }).catch((err) => {
          console.warn('Trainers list could not be loaded:', err)
          return null
        }),
      ])

      const profile = resolveMemberProfile(profileResponse)
      const trainerId = assignedTrainerId(profile)
      const trainerName = assignedTrainerName(profile)
      const trainerIdValue = trainerId ? String(trainerId) : ''

      if (trainerIdValue) {
        setAssignedTrainer({
          id: trainerIdValue,
          name: trainerName || 'Assigned trainer',
        })
        setForm((prev) => ({ ...prev, trainer_id: prev.trainer_id || trainerIdValue }))
      }

      setClasses(normalizeListResponse(classResponse))
      setCatalogTrainers(normalizeListResponse(trainersResponse))

      const profileId = profile?.id || profile?.member_profile_id
      if (profileId) {
        try {
          const bookingResponse = await bookingService.getMemberBookings(profileId, { page: 1, limit: 50 })
          const items = normalizeListResponse(bookingResponse)
          setBookings(items.filter((booking) => booking && booking.status !== 'cancelled'))
        } catch (bookingErr) {
          console.warn('Member bookings could not be loaded:', bookingErr)
          setBookings([])
        }
      }

      setFacilitySummary(facility)
    } catch (err) {
      setLoadError(err.message || 'Unable to load rating options.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  const trainerOptions = useMemo(() => {
    const seen = new Map()
    if (assignedTrainer?.id) {
      addTrainerOption(seen, assignedTrainer.id, assignedTrainer.name || 'Assigned trainer')
    }
    const safeCatalog = Array.isArray(catalogTrainers) ? catalogTrainers : []
    safeCatalog.forEach((trainer) => {
      if (!trainer || typeof trainer !== 'object') return
      addTrainerOption(seen, trainer.id || trainer.trainer_id, formatPersonName(trainer) || trainer.email)
    })
    const safeBookings = Array.isArray(bookings) ? bookings : []
    safeBookings.forEach((booking) => {
      if (!booking || typeof booking !== 'object') return
      addTrainerOption(seen, assignedTrainerId(booking), assignedTrainerName(booking))
    })
    const safeClasses = Array.isArray(classes) ? classes : []
    safeClasses.forEach((cls) => {
      if (!cls || typeof cls !== 'object') return
      addTrainerOption(seen, assignedTrainerId(cls) || cls.trainer_id, assignedTrainerName(cls) || cls.trainer_name)
    })
    return [...seen.values()]
  }, [assignedTrainer, bookings, catalogTrainers, classes])

  const classOptions = useMemo(() => {
    const seen = new Map()
    const addClass = (id, name) => {
      if (!id) return
      const value = String(id)
      if (seen.has(value)) return
      seen.set(value, { value, label: name || 'Class' })
    }
    const safeBookings = Array.isArray(bookings) ? bookings : []
    safeBookings.forEach((booking) => {
      if (!booking || typeof booking !== 'object') return
      const nestedClass = booking.class && typeof booking.class === 'object' ? booking.class : null
      addClass(
        booking.class_id || booking.classId || nestedClass?.id,
        booking.class_name || booking.className || nestedClass?.name || booking.name
      )
    })
    const safeClasses = Array.isArray(classes) ? classes : []
    safeClasses.forEach((cls) => {
      if (!cls || typeof cls !== 'object') return
      addClass(cls.id || cls.class_id, cls.name || cls.class_name)
    })
    return [...seen.values()]
  }, [bookings, classes])

  useEffect(() => {
    if (form.type === 'trainer' && !form.trainer_id && trainerOptions.length > 0) {
      setForm((prev) => ({ ...prev, trainer_id: trainerOptions[0].value }))
    }
    if (form.type === 'class' && !form.class_id && classOptions.length > 0) {
      setForm((prev) => ({ ...prev, class_id: classOptions[0].value }))
    }
  }, [trainerOptions, classOptions, form.type, form.trainer_id, form.class_id])

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      rating_dimension: 'overall',
      trainer_id: prev.trainer_id || assignedTrainer?.id || (trainerOptions[0]?.value || ''),
      class_id: prev.class_id || (classOptions[0]?.value || ''),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSuccessMessage('')

    const payload = {
      rating_stars: Number(form.rating_stars),
      rating_dimension: form.rating_dimension,
      comment: form.comment,
      is_anonymous: form.is_anonymous,
      trainer_id: form.trainer_id,
      class_id: form.class_id,
    }

    setSubmitting(true)
    try {
      const result = await ratingService.submitRating(form.type, payload)
      const saved = result.data || {}
      setHistory((prev) => [
        {
          id: saved.id || `${form.type}-${Date.now()}`,
          rating_type: saved.rating_type || form.type,
          rating_stars: saved.rating_stars ?? payload.rating_stars,
          rating_dimension: saved.rating_dimension || form.rating_dimension,
          comment: saved.comment || form.comment,
          created_at: saved.created_at || new Date().toISOString(),
          trainer_name: saved.trainer_name,
        },
        ...prev,
      ])
      setSuccessMessage(result.message || 'Rating submitted successfully.')
      setForm((prev) => ({ ...prev, comment: '', is_anonymous: false, rating_stars: '5' }))
      if (form.type === 'facility') {
        ratingService.getFacilityRating().then(setFacilitySummary).catch(() => {})
      }
    } catch (err) {
      if (err.status === 409) {
        setFormError(
          err.message ||
            (form.type === 'facility'
              ? 'You have already rated the facility. That can only be done once.'
              : `You have already rated this ${form.type}. Each one can only be rated once.`)
        )
      } else {
        setFormError(err.message || 'Unable to submit this rating.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Feedback</h2>
        <p className="text-sm text-muted mt-1">Rate a trainer, class, or the facility. Each target can only be rated once.</p>
      </div>

      {facilitySummary && (
        <Card>
          <div className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Facility rating</p>
              <p className="text-xs text-muted">Based on member reviews</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {facilitySummary.average_rating ? Number(facilitySummary.average_rating).toFixed(1) : '—'} / 5
              </p>
              <p className="text-xs text-muted">{facilitySummary.total_reviews} reviews</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Submit a rating</CardTitle>
        </CardHeader>
        {loadError && <p className="text-sm text-red-600 mb-3">{loadError}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              options={RATING_TYPES}
            />
            <Select
              label="Stars"
              value={form.rating_stars}
              onChange={(e) => setForm({ ...form, rating_stars: e.target.value })}
              options={[
                { value: '5', label: '5 - Excellent' },
                { value: '4', label: '4 - Good' },
                { value: '3', label: '3 - Average' },
                { value: '2', label: '2 - Poor' },
                { value: '1', label: '1 - Very Poor' },
              ]}
            />
          </div>

          {form.type === 'trainer' && (
            <Select
              label="Trainer"
              value={form.trainer_id}
              onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
              options={
                trainerOptions.length > 0
                  ? trainerOptions
                  : [{ value: '', label: loading ? 'Loading trainers...' : 'No trainer available' }]
              }
              required
            />
          )}

          {form.type === 'class' && (
            <Select
              label="Class"
              value={form.class_id}
              onChange={(e) => setForm({ ...form, class_id: e.target.value })}
              options={
                classOptions.length > 0
                  ? classOptions
                  : [{ value: '', label: loading ? 'Loading classes...' : 'Book a class before rating it' }]
              }
              required
            />
          )}

          <Select
            label="Dimension"
            value={form.rating_dimension}
            onChange={(e) => setForm({ ...form, rating_dimension: e.target.value })}
            options={DIMENSIONS[form.type] || []}
          />

          <Input
            label="Comment"
            placeholder="Tell us about your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.is_anonymous}
              onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
            />
            Submit anonymously
          </label>

          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          <Button type="submit" disabled={submitting || loading}>
            {submitting ? 'Submitting...' : 'Submit rating'}
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ratings submitted this session</CardTitle>
        </CardHeader>
        <div className="p-4">
          {history.length === 0 ? (
            <p className="text-sm text-muted">Submitted ratings will appear here after you send them.</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Badge variant="default">{entry.rating_type}</Badge>
                    <span className="text-sm font-medium text-primary">{entry.rating_stars}/5</span>
                  </div>
                  {entry.rating_dimension && (
                    <p className="text-xs text-muted capitalize">{entry.rating_dimension}</p>
                  )}
                  {entry.comment && <p className="text-sm text-foreground mt-1">{entry.comment}</p>}
                  <p className="text-xs text-muted mt-2">{formatRatingDate(entry.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
  
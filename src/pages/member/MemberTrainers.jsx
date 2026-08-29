import { useEffect, useMemo, useState } from 'react'
import { Calendar, Star, Clock } from 'lucide-react'
import { classesService } from '../../services/classesService'
import { memberService } from '../../services/memberService'
import { ratingService } from '../../services/ratingService'
import { assignedTrainerId, assignedTrainerName, normalizeListResponse, unwrapResource } from '../../utils/apiHelpers'

export function MemberTrainers() {
  const [classes, setClasses] = useState([])
  const [assigned, setAssigned] = useState({ id: null, name: '' })
  const [average, setAverage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [classResponse, profileResponse] = await Promise.all([
          classesService.getClasses({ limit: 50 }).catch(() => []),
          memberService.getCurrentMemberProfile().catch(() => null),
        ])
        setClasses(normalizeListResponse(classResponse))

        const profile = profileResponse ? unwrapResource(profileResponse) : null
        const trainerId = assignedTrainerId(profile)
        const trainerName = assignedTrainerName(profile)
        setAssigned({ id: trainerId, name: trainerName })

        if (trainerId) {
          try {
            setAverage(await ratingService.getTrainerAverage(trainerId))
          } catch {
            setAverage(null)
          }
        }
      } catch (err) {
        setError(err.message || 'Unable to load trainers from the class schedule.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const trainers = useMemo(() => {
    const seen = new Map()
    if (assigned.id) {
      seen.set(assigned.id, {
        id: assigned.id,
        name: assigned.name || 'Assigned trainer',
        category: 'Assigned',
        assigned: true,
      })
    }
    classes.forEach((cls) => {
      const key = cls.trainer_id || cls.trainer_name
      if (!key || seen.has(key)) return
      seen.set(key, {
        id: key,
        name: cls.trainer_name || 'Trainer',
        category: cls.category,
        nextClass: cls.name,
        nextTime: cls.start_time,
        location: cls.location,
        assigned: key === assigned.id,
      })
    })
    return [...seen.values()]
  }, [classes, assigned])

  if (loading) return <p className="text-sm text-muted">Loading trainers...</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trainers</h1>
        <p className="text-sm text-muted">
          Ratings are shown for your assigned trainer.
        </p>
      </div>

      {trainers.length === 0 ? (
        <p className="text-sm text-muted">No scheduled class instructors yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground">{trainer.name}</p>
              <p className="text-xs text-muted capitalize">{trainer.category || 'Instructor'}</p>
              {trainer.assigned && average && (
                <div className="mt-2 flex items-center gap-1 text-sm text-foreground">
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {average.total_reviews > 0 ? Number(average.average_rating).toFixed(1) : '—'}
                  </span>
                  <span className="text-xs text-muted">({average.total_reviews} reviews)</span>
                </div>
              )}
              <div className="mt-3 space-y-1 text-xs text-muted">
                {trainer.nextClass && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3" />
                    <span>{trainer.nextClass}</span>
                  </div>
                )}
                {trainer.nextTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-3" />
                    <span>{new Date(trainer.nextTime).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

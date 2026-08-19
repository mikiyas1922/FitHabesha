import { useEffect, useMemo, useState } from 'react'
import { Calendar, Star, Clock } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { classesService } from '../../services/classesService'
import { normalizeListResponse } from '../../utils/apiHelpers'

export function MemberTrainers() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const response = await classesService.getClasses({ limit: 50 })
        setClasses(normalizeListResponse(response))
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
      })
    })
    return [...seen.values()]
  }, [classes])

  if (loading) return <p className="text-sm text-muted">Loading trainers...</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trainers</h1>
        <p className="text-sm text-muted">
          Trainer listing is admin/reception only. This view shows instructors from GET /classes.
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
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3" />
                  <span>{trainer.nextClass}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>{trainer.nextTime ? new Date(trainer.nextTime).toLocaleString() : 'TBD'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

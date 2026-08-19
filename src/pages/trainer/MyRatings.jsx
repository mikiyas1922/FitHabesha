import { useCallback, useEffect, useState } from 'react'
import { Star, MessageSquare, TrendingUp, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { trainerService } from '../../services/trainerService'
import { unwrapResource } from '../../utils/apiHelpers'

export function MyRatings() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadFeedback = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const profileResponse = await trainerService.getCurrentTrainerProfile()
      const profile = unwrapResource(profileResponse)
      if (!profile?.id) throw new Error('Trainer profile not found.')

      const response = await trainerService.getTrainerFeedback(profile.id)
      const payload = unwrapResource(response)
      setFeedback(Array.isArray(payload?.feedback) ? payload.feedback : [])
    } catch (err) {
      setError(err.message || 'Failed to load feedback')
      setFeedback([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeedback()
  }, [loadFeedback])

  const average =
    feedback.length > 0
      ? (
          feedback.reduce((sum, item) => sum + Number(item.rating_stars || 0), 0) / feedback.length
        ).toFixed(1)
      : '—'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600 font-medium">Error loading ratings</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <Button onClick={loadFeedback} className="mt-3">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Ratings & Reviews</h1>
        <p className="text-sm text-muted">Client feedback from GET /trainers/{'{id}'}/feedback</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Average Rating', value: average === '—' ? average : `${average} / 5.0`, icon: Star },
          { label: 'Total Reviews', value: String(feedback.length), icon: MessageSquare },
          { label: 'Anonymous', value: String(feedback.filter((item) => item.is_anonymous).length), icon: TrendingUp },
        ].map((stat) => {
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

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        {feedback.length === 0 && <p className="text-sm text-muted">No client feedback yet.</p>}
        {feedback.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">
                  {item.is_anonymous
                    ? 'Anonymous member'
                    : `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Member'}
                </p>
                <p className="text-xs text-muted">
                  {item.rating_type || 'rating'} · {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground">{item.rating_stars || 0}/5</span>
            </div>
            {item.comment && <p className="text-sm text-muted mt-2">{item.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

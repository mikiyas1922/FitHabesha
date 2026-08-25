import { useState, useEffect } from 'react'
import { Star, MessageSquare, TrendingUp, AlertTriangle, Search, Filter, MoreVertical, Flag, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { trainerService } from '../../services/trainerService'
import { adminService } from '../../services/adminService'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'

export function AdminFeedback() {
  const [feedback, setFeedback] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingTrainers, setLoadingTrainers] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTrainerId, setSelectedTrainerId] = useState(null)

  const loadTrainers = async () => {
    setLoadingTrainers(true)
    try {
      const response = await adminService.getTrainers()
      const trainersList = normalizeListResponse(response)
      setTrainers(trainersList || [])
    } catch (err) {
      console.error('Failed to load trainers:', err)
      setTrainers([])
    } finally {
      setLoadingTrainers(false)
    }
  }

  const loadFeedback = async (trainerId) => {
    if (!trainerId) return

    setLoading(true)
    setError(null)
    try {
      const response = await trainerService.getTrainerFeedback(trainerId)
      const payload = unwrapResource(response)
      setFeedback(Array.isArray(payload?.feedback) ? payload.feedback : [])
    } catch (err) {
      setError(err.message || 'Failed to load feedback')
      setFeedback([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrainers()
  }, [])

  useEffect(() => {
    if (selectedTrainerId) {
      loadFeedback(selectedTrainerId)
    }
  }, [selectedTrainerId])

  const average =
    feedback.length > 0
      ? (feedback.reduce((sum, item) => sum + Number(item.rating_stars || 0), 0) / feedback.length).toFixed(1)
      : '—'

  const feedbackStats = [
    { label: 'Average Rating', value: average === '—' ? average : `${average} / 5.0`, change: 'Based on reviews', icon: Star },
    { label: 'Total Reviews', value: String(feedback.length), change: 'For selected trainer', icon: MessageSquare },
    { label: 'Anonymous Reviews', value: String(feedback.filter((item) => item.is_anonymous).length), change: 'Hidden identity', icon: TrendingUp },
    { label: 'Public Reviews', value: String(feedback.filter((item) => !item.is_anonymous).length), change: 'Visible identity', icon: AlertTriangle },
  ]

  const trainerRatingDistribution = [
    { stars: 5, count: feedback.filter((f) => f.rating_stars === 5).length, percentage: feedback.length > 0 ? Math.round((feedback.filter((f) => f.rating_stars === 5).length / feedback.length) * 100) : 0 },
    { stars: 4, count: feedback.filter((f) => f.rating_stars === 4).length, percentage: feedback.length > 0 ? Math.round((feedback.filter((f) => f.rating_stars === 4).length / feedback.length) * 100) : 0 },
    { stars: 3, count: feedback.filter((f) => f.rating_stars === 3).length, percentage: feedback.length > 0 ? Math.round((feedback.filter((f) => f.rating_stars === 3).length / feedback.length) * 100) : 0 },
    { stars: 2, count: feedback.filter((f) => f.rating_stars === 2).length, percentage: feedback.length > 0 ? Math.round((feedback.filter((f) => f.rating_stars === 2).length / feedback.length) * 100) : 0 },
    { stars: 1, count: feedback.filter((f) => f.rating_stars === 1).length, percentage: feedback.length > 0 ? Math.round((feedback.filter((f) => f.rating_stars === 1).length / feedback.length) * 100) : 0 },
  ]

  const flaggedReviews = feedback.filter((f) => f.rating_stars <= 2)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trainer Feedback</h1>
          <p className="text-sm text-muted">View and analyze client feedback for trainers</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedTrainerId || ''}
            onChange={(e) => setSelectedTrainerId(e.target.value || null)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface"
            disabled={loadingTrainers}
          >
            <option value="">Select a trainer...</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.name || trainer.first_name && trainer.last_name 
                  ? `${trainer.first_name} ${trainer.last_name}` 
                  : 'Unknown Trainer'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && !selectedTrainerId && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted">Select a trainer to view their feedback</p>
        </div>
      )}

      {!loading && selectedTrainerId && (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {feedbackStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
              <p className="text-xs text-muted mt-2">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trainer Rating Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Rating Distribution</h3>
          <p className="text-sm text-muted mb-6">Avg: {average} Stars</p>
          <div className="space-y-3">
            {trainerRatingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Reviews */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-600" />
              <h3 className="font-semibold text-foreground">Low Ratings (≤2 stars)</h3>
              <span className="text-xs text-red-600 font-medium">{flaggedReviews.length} Urgent</span>
            </div>
          </div>
          {flaggedReviews.length === 0 ? (
            <p className="text-sm text-muted">No low ratings found</p>
          ) : (
            <div className="space-y-3">
              {flaggedReviews.map((review, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-red-100">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <Flag className="size-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {review.is_anonymous ? 'Anonymous' : `${review.first_name || ''} ${review.last_name || ''}`.trim()}
                        </p>
                        <p className="text-xs text-muted">{review.rating_type || 'General'}</p>
                      </div>
                      <span className="text-xs text-muted">{review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}</span>
                    </div>
                    {review.comment && <p className="text-sm text-muted mt-2">{review.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All Reviews */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">All Reviews</h3>
        </div>

        {feedback.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">No feedback available for this trainer</p>
        ) : (
          <div className="space-y-4">
            {feedback.map((review) => (
              <div key={review.id} className="p-4 rounded-lg border border-border bg-surface">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-foreground">
                        {review.is_anonymous ? 'Anonymous' : `${review.first_name || ''} ${review.last_name || ''}`.trim()}
                      </p>
                      {review.is_anonymous && <span className="text-xs text-muted">(ANONYMOUS)</span>}
                    </div>
                    {review.rating_type && <p className="text-sm text-muted mb-2">{review.rating_type}</p>}
                    <div className="flex gap-1 mb-2">
                      {[...Array(review.rating_stars || 0)].map((_, starIndex) => (
                        <Star key={starIndex} className="size-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm text-muted">&ldquo;{review.comment}&rdquo;</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  )
}

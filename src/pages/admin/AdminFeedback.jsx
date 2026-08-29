import { useEffect, useState } from 'react'
import { Star, MessageSquare, TrendingUp, AlertTriangle, Flag, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { trainerService } from '../../services/trainerService'
import { adminService } from '../../services/adminService'
import { ratingService } from '../../services/ratingService'
import { normalizeListResponse, formatPersonName } from '../../utils/apiHelpers'

function reviewName(review) {
  if (review.is_anonymous) return 'Anonymous'
  return review.member_name || `${review.first_name || ''} ${review.last_name || ''}`.trim() || 'Member'
}

export function AdminFeedback() {
  const [feedback, setFeedback] = useState([])
  const [summary, setSummary] = useState(ratingService.emptyTrainerAverage())
  const [trainers, setTrainers] = useState([])
  const [flagged, setFlagged] = useState([])
  const [threshold, setThreshold] = useState(3)
  const [loading, setLoading] = useState(false)
  const [loadingTrainers, setLoadingTrainers] = useState(true)
  const [loadingFlagged, setLoadingFlagged] = useState(true)
  const [error, setError] = useState(null)
  const [flaggedError, setFlaggedError] = useState(null)
  const [selectedTrainerId, setSelectedTrainerId] = useState(null)
  const [moderatingId, setModeratingId] = useState(null)
  const [moderationNotes, setModerationNotes] = useState('')
  const [moderationError, setModerationError] = useState(null)

  const loadTrainers = async () => {
    setLoadingTrainers(true)
    try {
      const response = await adminService.getTrainers()
      setTrainers(normalizeListResponse(response) || [])
    } catch (err) {
      console.error('Failed to load trainers:', err)
      setTrainers([])
    } finally {
      setLoadingTrainers(false)
    }
  }

  const loadFlagged = async (nextThreshold = threshold) => {
    setLoadingFlagged(true)
    setFlaggedError(null)
    try {
      const result = await ratingService.getFlaggedRatings(nextThreshold)
      setFlagged(result.data)
    } catch (err) {
      setFlaggedError(err.message || 'Failed to load flagged ratings')
      setFlagged([])
    } finally {
      setLoadingFlagged(false)
    }
  }

  const loadFeedback = async (trainerId) => {
    if (!trainerId) return

    setLoading(true)
    setError(null)
    try {
      const [average, { feedback: items }] = await Promise.all([
        ratingService.getTrainerAverage(trainerId),
        trainerService.getTrainerFeedback(trainerId),
      ])
      setSummary(average)
      setFeedback(items)
    } catch (err) {
      setError(err.message || 'Failed to load feedback')
      setFeedback([])
      setSummary(ratingService.emptyTrainerAverage())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrainers()
    loadFlagged(3)
  }, [])

  useEffect(() => {
    if (selectedTrainerId) {
      loadFeedback(selectedTrainerId)
    }
  }, [selectedTrainerId])

  const handleModerate = async (ratingId) => {
    setModerationError(null)
    try {
      await ratingService.moderateRating(ratingId, moderationNotes)
      setModeratingId(null)
      setModerationNotes('')
      await loadFlagged(threshold)
    } catch (err) {
      setModerationError(err.message || 'Unable to moderate this rating.')
    }
  }

  const average =
    summary.total_reviews > 0 ? Number(summary.average_rating).toFixed(1) : '—'

  const feedbackStats = [
    { label: 'Average Rating', value: average === '—' ? average : `${average} / 5.0`, change: 'Based on reviews', icon: Star },
    { label: 'Total Reviews', value: String(summary.total_reviews), change: 'For selected trainer', icon: MessageSquare },
    { label: 'Anonymous Reviews', value: String(feedback.filter((item) => item.is_anonymous).length), change: 'Hidden identity', icon: TrendingUp },
    { label: 'Unmoderated flags', value: String(flagged.length), change: `Below ${threshold} stars`, icon: AlertTriangle },
  ]

  const trainerRatingDistribution = [
    { stars: 5, count: summary.five_star_count },
    { stars: 4, count: summary.four_star_count },
    { stars: 3, count: summary.three_star_count },
    { stars: 2, count: summary.two_star_count },
    { stars: 1, count: summary.one_star_count },
  ].map((item) => ({
    ...item,
    percentage: summary.total_reviews > 0 ? Math.round((item.count / summary.total_reviews) * 100) : 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trainer Feedback</h1>
          <p className="text-sm text-muted">Moderate flagged ratings and review trainer feedback</p>
        </div>
        <select
          value={selectedTrainerId || ''}
          onChange={(e) => setSelectedTrainerId(e.target.value || null)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-surface"
          disabled={loadingTrainers}
        >
          <option value="">Select a trainer...</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {formatPersonName(trainer) || trainer.email || 'Trainer'}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-600" />
            <h3 className="font-semibold text-foreground">Flagged ratings</h3>
            <span className="text-xs text-red-600 font-medium">{flagged.length} unmoderated</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted" htmlFor="flag-threshold">Below</label>
            <select
              id="flag-threshold"
              value={threshold}
              onChange={(e) => {
                const next = Number(e.target.value)
                setThreshold(next)
                loadFlagged(next)
              }}
              className="px-2 py-1 text-sm border border-border rounded-lg bg-card"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>{value} stars</option>
              ))}
            </select>
          </div>
        </div>

        {flaggedError && <p className="text-sm text-red-600 mb-3">{flaggedError}</p>}
        {moderationError && <p className="text-sm text-red-600 mb-3">{moderationError}</p>}

        {loadingFlagged ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : flagged.length === 0 ? (
          <p className="text-sm text-muted">No unmoderated ratings below this threshold.</p>
        ) : (
          <div className="space-y-3">
            {flagged.map((review) => (
              <div key={review.id} className="p-4 rounded-lg bg-card border border-red-100">
                <div className="flex items-start gap-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <Flag className="size-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{reviewName(review)}</p>
                        <p className="text-xs text-muted">
                          {[review.rating_type, review.trainer_name, review.rating_dimension].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{review.rating_stars}/5</span>
                    </div>
                    {review.comment && <p className="text-sm text-muted mt-2">{review.comment}</p>}
                    {moderatingId === review.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                          rows={2}
                          placeholder="Moderation notes"
                          value={moderationNotes}
                          onChange={(e) => setModerationNotes(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleModerate(review.id)}>Save notes</Button>
                          <Button size="sm" variant="secondary" onClick={() => { setModeratingId(null); setModerationNotes('') }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" className="mt-3" variant="secondary" onClick={() => { setModeratingId(review.id); setModerationNotes('') }}>
                        Moderate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <p className="text-muted">Select a trainer to view their rating summary and reviews</p>
        </div>
      )}

      {!loading && selectedTrainerId && (
        <>
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

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-6">All Reviews</h3>
            {feedback.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">No feedback available for this trainer</p>
            ) : (
              <div className="space-y-4">
                {feedback.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg border border-border bg-surface">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{reviewName(review)}</p>
                        {review.rating_type && <p className="text-sm text-muted mb-2">{review.rating_type}</p>}
                        <div className="flex gap-1 mb-2">
                          {[...Array(review.rating_stars || 0)].map((_, starIndex) => (
                            <Star key={starIndex} className="size-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        {review.comment && <p className="text-sm text-muted">&ldquo;{review.comment}&rdquo;</p>}
                      </div>
                      <p className="text-xs text-muted">{review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}</p>
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

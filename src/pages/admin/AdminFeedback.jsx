import { useEffect, useState } from 'react'
import { Star, MessageSquare, TrendingUp, AlertTriangle, Flag, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
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
  const [trainerRatings, setTrainerRatings] = useState([])
  const [facilitySummary, setFacilitySummary] = useState(null)
  const [flagged, setFlagged] = useState([])
  const [threshold, setThreshold] = useState(5)
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
      const trainerList = normalizeListResponse(response) || []
      setTrainers(trainerList)
      const trainerResults = await Promise.all(
        trainerList
          .map((trainer) => trainer.id)
          .filter(Boolean)
          .map(async (trainerId) => {
            const [average, feedbackResult] = await Promise.all([
              ratingService.getTrainerAverage(trainerId).catch(() => ratingService.emptyTrainerAverage()),
              trainerService.getTrainerFeedback(trainerId).catch(() => ({ feedback: [] })),
            ])
            const trainer = trainerList.find((item) => item.id === trainerId)
            return { trainer, average, feedback: feedbackResult.feedback || [] }
          })
      )
      setTrainerRatings(trainerResults)
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
    loadFlagged(5)
    ratingService.getFacilityRating()
      .then(setFacilitySummary)
      .catch(() => setFacilitySummary(null))
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

  const classRatings = flagged.filter((review) => review.rating_type === 'class')
  const facilityRatings = flagged.filter((review) => review.rating_type === 'facility')

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trainer Feedback" 
        subtitle="Moderate flagged ratings and review trainer feedback"
        action={
          <select
            value={selectedTrainerId || ''}
            onChange={(e) => setSelectedTrainerId(e.target.value || null)}
            className="px-3 py-2 text-sm border border-[var(--app-border)] rounded-[12px] bg-[var(--app-input)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200"
            disabled={loadingTrainers}
          >
            <option value="">Select a trainer...</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {formatPersonName(trainer) || trainer.email || 'Trainer'}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="size-5 text-yellow-400" />
            <h3 className="font-semibold text-[var(--app-foreground)]">Trainer ratings</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--app-foreground)]">
            {trainerRatings.reduce((total, item) => total + item.feedback.length, 0)}
          </p>
          <p className="text-sm text-[var(--app-muted)] mt-1">Feedback across {trainers.length} trainers</p>
          <Button size="sm" variant="secondary" className="mt-4" onClick={() => setSelectedTrainerId(trainers[0]?.id || null)} disabled={!trainers.length}>
            View trainer feedback
          </Button>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="size-5 text-[var(--app-primary)]" />
            <h3 className="font-semibold text-[var(--app-foreground)]">Facility rating</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--app-foreground)]">
            {facilitySummary?.total_reviews ? `${Number(facilitySummary.average_rating).toFixed(1)} / 5` : '—'}
          </p>
          <p className="text-sm text-[var(--app-muted)] mt-1">{facilitySummary?.total_reviews || 0} total reviews</p>
          <p className="text-xs text-[var(--app-muted)] mt-4">Individual facility reviews are available only when returned as flagged.</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="size-5 text-red-400" />
            <h3 className="font-semibold text-[var(--app-foreground)]">Class ratings</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--app-foreground)]">{classRatings.length}</p>
          <p className="text-sm text-[var(--app-muted)] mt-1">Flagged class ratings</p>
          <p className="text-xs text-[var(--app-muted)] mt-4">Class reviews are currently exposed through the flagged-ratings endpoint.</p>
        </Card>
      </div>

      {facilityRatings.length > 0 && (
        <Card padding="lg">
          <CardTitle className="mb-4">Flagged facility feedback</CardTitle>
          <CardContent>
            <div className="space-y-3">
              {facilityRatings.map((review) => (
                <div key={review.id} className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-[var(--app-foreground)]">{reviewName(review)}</p>
                    <span className="font-semibold text-[var(--app-foreground)]">{review.rating_stars}/5</span>
                  </div>
                  {review.comment && <p className="text-sm text-[var(--app-muted)] mt-2">{review.comment}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card padding="lg">
        <CardTitle className="mb-4">Class ratings and feedback</CardTitle>
        <CardContent>
          {classRatings.length === 0 ? (
            <p className="text-sm text-[var(--app-muted)]">No flagged class ratings are available.</p>
          ) : (
            <div className="space-y-3">
              {classRatings.map((review) => (
                <div key={review.id} className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--app-foreground)]">{reviewName(review)}</p>
                      <p className="text-xs text-[var(--app-muted)]">Class rating{review.class_name ? ` · ${review.class_name}` : ''}</p>
                    </div>
                    <span className="font-semibold text-[var(--app-foreground)]">{review.rating_stars || 0}/5</span>
                  </div>
                  {review.comment && <p className="text-sm text-[var(--app-muted)] mt-2">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-[var(--app-foreground)]">Feedback by trainer</h3>
        {trainerRatings.length === 0 ? (
          <Card padding="lg">
            <p className="text-sm text-[var(--app-muted)]">No trainers or trainer feedback are available.</p>
          </Card>
        ) : (
          trainerRatings.map(({ trainer, average: trainerAverage, feedback: trainerFeedback }) => (
            <Card key={trainer.id} padding="lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="font-semibold text-[var(--app-foreground)]">{formatPersonName(trainer) || trainer.email || 'Trainer'}</h4>
                  <p className="text-sm text-[var(--app-muted)]">{trainerFeedback.length} feedback items</p>
                </div>
                <div className="text-sm font-medium text-[var(--app-foreground)]">
                  {trainerAverage.total_reviews ? `${Number(trainerAverage.average_rating).toFixed(1)} / 5` : 'No ratings'}
                </div>
              </div>
              {trainerFeedback.length === 0 ? (
                <p className="text-sm text-[var(--app-muted)]">No feedback for this trainer.</p>
              ) : (
                <div className="space-y-3">
                  {trainerFeedback.map((review) => (
                    <div key={review.id} className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-[var(--app-foreground)]">{reviewName(review)}</p>
                          <p className="text-xs text-[var(--app-muted)]">{review.rating_dimension || 'Overall'}</p>
                        </div>
                        <span className="font-semibold text-[var(--app-foreground)]">{review.rating_stars || 0}/5</span>
                      </div>
                      {review.comment && <p className="text-sm text-[var(--app-muted)] mt-2">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <Card padding="lg" className="border-red-500/30 bg-red-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-400" />
            <h3 className="font-semibold text-[var(--app-foreground)]">Flagged ratings</h3>
            <span className="text-xs text-red-400 font-medium">{flagged.length} unmoderated</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--app-muted)]" htmlFor="flag-threshold">Below</label>
            <select
              id="flag-threshold"
              value={threshold}
              onChange={(e) => {
                const next = Number(e.target.value)
                setThreshold(next)
                loadFlagged(next)
              }}
              className="px-2 py-1 text-sm border border-[var(--app-border)] rounded-[12px] bg-[var(--app-input)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>{value} stars</option>
              ))}
            </select>
          </div>
        </div>

        {flaggedError && <Alert variant="danger" message={flaggedError} className="mb-3" />}
        {moderationError && <Alert variant="danger" message={moderationError} className="mb-3" />}

        {loadingFlagged ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-6 animate-spin text-[var(--app-primary)]" />
          </div>
        ) : flagged.length === 0 ? (
          <p className="text-sm text-[var(--app-muted)]">No unmoderated ratings below this threshold.</p>
        ) : (
          <div className="space-y-3">
            {flagged.map((review) => (
              <div key={review.id} className="p-4 rounded-lg bg-[var(--app-surface)] border border-red-500/30">
                <div className="flex items-start gap-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-500/20">
                    <Flag className="size-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--app-foreground)]">{reviewName(review)}</p>
                        <p className="text-xs text-[var(--app-muted)]">
                          {[review.rating_type, review.trainer_name, review.rating_dimension].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-[var(--app-foreground)]">{review.rating_stars}/5</span>
                    </div>
                    {review.comment && <p className="text-sm text-[var(--app-muted)] mt-2">{review.comment}</p>}
                    {moderatingId === review.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          className="w-full rounded-[12px] border border-[var(--app-border)] bg-[var(--app-input)] px-3 py-2 text-sm text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200"
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
      </Card>

      {error && (
        <Alert variant="danger" message={error} />
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-8 animate-spin text-[var(--app-primary)]" />
        </div>
      )}

      {!loading && !selectedTrainerId && (
        <Card padding="lg">
          <p className="text-[var(--app-muted)] text-center">Select a trainer to view their rating summary and reviews</p>
        </Card>
      )}

      {!loading && selectedTrainerId && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {feedbackStats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} padding="md" hover className="p-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20 mb-3">
                    <Icon className="size-4 text-[var(--app-primary)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--app-foreground)]">{stat.value}</p>
                  <p className="text-xs text-[var(--app-muted)] mt-1">{stat.label}</p>
                  <p className="text-xs text-[var(--app-muted)] mt-2">{stat.change}</p>
                </Card>
              )
            })}
          </div>

          <Card padding="lg">
            <CardTitle className="mb-4">Rating Distribution</CardTitle>
            <p className="text-sm text-[var(--app-muted)] mb-6">Avg: {average} Stars</p>
            <div className="space-y-3">
              {trainerRatingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-[var(--app-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-[var(--app-muted)] w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <CardTitle className="mb-6">All Reviews</CardTitle>
            <CardContent>
              {feedback.length === 0 ? (
                <p className="text-sm text-[var(--app-muted)] text-center py-8">No feedback available for this trainer</p>
              ) : (
                <div className="space-y-4">
                  {feedback.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-[var(--app-foreground)]">{reviewName(review)}</p>
                          {review.rating_type && <p className="text-sm text-[var(--app-muted)] mb-2">{review.rating_type}</p>}
                          <div className="flex gap-1 mb-2">
                            {[...Array(review.rating_stars || 0)].map((_, starIndex) => (
                              <Star key={starIndex} className="size-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          {review.comment && <p className="text-sm text-[var(--app-muted)]">&ldquo;{review.comment}&rdquo;</p>}
                        </div>
                        <p className="text-xs text-[var(--app-muted)]">{review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

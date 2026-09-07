import { useEffect, useMemo, useState } from 'react'
import { Calendar, Star, Clock, Award, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
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
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState(null)

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

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
  if (error) return (
    <Alert variant="error" title="Error loading trainers">
      {error}
    </Alert>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainers"
        subtitle="View your assigned trainer and available coaches"
      />

      {trainers.length === 0 ? (
        <EmptyState
          icon={<Award className="size-12" />}
          title="No trainers available"
          description="Check back later for new trainers"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((trainer) => (
            <Card key={trainer.id} padding="md" className="hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{trainer.name}</p>
                  <p className="text-xs text-muted capitalize">{trainer.category || 'Instructor'}</p>
                </div>
                {trainer.assigned && (
                  <Badge variant="success">Assigned</Badge>
                )}
              </div>
              
              {trainer.assigned && average && (
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= Math.round(average.average_rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {average.total_reviews > 0 ? Number(average.average_rating).toFixed(1) : '—'}
                  </span>
                  <span className="text-xs text-muted">({average.total_reviews} reviews)</span>
                </div>
              )}
              
              <div className="space-y-2 text-xs text-muted mb-4">
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
              
              {trainer.assigned && (
                <Button size="sm" className="w-full gap-2" onClick={() => { setSelectedTrainer(trainer); setShowReviewModal(true) }}>
                  <MessageSquare className="size-3" />
                  Leave Review
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedTrainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <div>
                <CardTitle>Review {selectedTrainer.name}</CardTitle>
                <CardDescription>Share your experience with your trainer</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowReviewModal(false)}>
                <Calendar className="size-4 rotate-45" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className="size-6 text-muted hover:text-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Your Review</p>
                <textarea
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowReviewModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={() => setShowReviewModal(false)}>Submit Review</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

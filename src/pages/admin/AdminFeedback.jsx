import { Star, MessageSquare, TrendingUp, AlertTriangle, Search, Filter, MoreVertical, Flag, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const feedbackStats = [
  { label: 'Overall Satisfaction', value: '4.2 / 5.0', change: '+4.2% this month', icon: Star },
  { label: 'Total Reviews This Month', value: '412', change: '+12.5% vs last month', icon: MessageSquare },
  { label: 'Trainer Avg Rating', value: '4.8 / 5.0', change: 'Top tier scores', icon: TrendingUp },
  { label: 'Facility Avg Rating', value: '4.1 / 5.0', change: 'Standard index', icon: AlertTriangle },
]

const trainerRatingDistribution = [
  { stars: 5, count: 280, percentage: 68 },
  { stars: 4, count: 85, percentage: 21 },
  { stars: 3, count: 24, percentage: 6 },
  { stars: 2, count: 8, percentage: 2 },
  { stars: 1, count: 3, percentage: 1 },
]

const facilityCategories = [
  { category: 'Cleanliness', rating: 4.6 },
  { category: 'Equipment Quality', rating: 4.3 },
  { category: 'Atmosphere', rating: 4.1 },
  { category: 'Peak Hour Congestion', rating: 3.2 },
  { category: 'Locker Room Hygiene', rating: 3.9 },
]

const recentReviews = [
  {
    name: 'Sarah Connor',
    trainer: 'Coach Sarah Jenkins (HIIT Session)',
    date: 'Oct 10, 2026',
    rating: 5,
    text: 'Amazing energy as always! Sarah pushes me past limits but keeps strict eye on form safety.',
    anonymous: false,
  },
  {
    name: 'Robert T.',
    trainer: null,
    date: 'Today, 04:12 PM',
    rating: 4,
    text: 'Very clean overall. Steam room was slightly busy at peak hours but water quality is top notch.',
    anonymous: true,
  },
  {
    name: 'Thomas K.',
    trainer: null,
    date: 'Yesterday, 06:45 PM',
    rating: 2,
    text: 'Locker room B was quite messy around 4 PM. Wet towels everywhere and showers were not cleaned.',
    anonymous: true,
    urgent: true,
  },
  {
    name: 'Clarissa H.',
    trainer: null,
    date: 'Oct 30, 2024',
    rating: 2,
    text: 'The peak hour congestion is getting worse. Waited almost 20 minutes for a free bench during the 6 PM slot.',
    anonymous: false,
    urgent: true,
  },
]

const flaggedReviews = [
  {
    name: 'Thomas K.',
    category: 'Cleanliness',
    text: 'Locker room B was quite messy around 4 PM. Wet towels everywhere and showers were not cleaned.',
    date: 'Yesterday, 06:45 PM',
    rating: 2,
  },
  {
    name: 'Clarissa H.',
    category: 'Congestion',
    text: 'The peak hour congestion is getting worse. Waited almost 20 minutes for a free bench during the 6 PM slot.',
    date: 'Oct 30, 2024',
    rating: 2,
  },
]

export function AdminFeedback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback & Member Sentiment Audits</h1>
          <p className="text-sm text-muted">Analyze trends, inspect complaints, and moderate staff execution indexes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            Configure Surveys
          </Button>
        </div>
      </div>

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
          <h3 className="font-semibold text-foreground mb-4">Trainer Rating Distribution</h3>
          <p className="text-sm text-muted mb-6">Avg: 4.8 Stars</p>
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

        {/* Facility Category Breakdown */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Facility Category Breakdown</h3>
          <p className="text-sm text-muted mb-6">Avg: 4.1 Stars</p>
          <div className="space-y-3">
            {facilityCategories.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-32">{item.category}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(item.rating / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">{item.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Reviews */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-600" />
            <h3 className="font-semibold text-foreground">Flagged Reviews Feed (Urgent Attention)</h3>
            <span className="text-xs text-red-600 font-medium">4 Urgent</span>
          </div>
          <p className="text-sm text-muted">Showing reviews rated below 3 stars</p>
        </div>
        <div className="space-y-3">
          {flaggedReviews.map((review, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-white border border-red-100">
              <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                <Flag className="size-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-xs text-muted">{review.category}</p>
                  </div>
                  <span className="text-xs text-muted">{review.date}</span>
                </div>
                <p className="text-sm text-muted mt-2">{review.text}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="secondary">Dismiss</Button>
                  <Button size="sm" variant="primary">Respond</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Latest Member Reviews</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search reviews..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {recentReviews.map((review, i) => (
            <div key={i} className={`p-4 rounded-lg border ${review.urgent ? 'border-red-200 bg-red-50' : 'border-border bg-surface'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-foreground">{review.name}</p>
                    {review.anonymous && <span className="text-xs text-muted">(ANONYMOUS FEEDBACK)</span>}
                    {review.urgent && <span className="text-xs text-red-600 font-medium">URGENT</span>}
                  </div>
                  {review.trainer && <p className="text-sm text-muted mb-2">{review.trainer}</p>}
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted">&ldquo;{review.text}&rdquo;</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">{review.date}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted">Showing 4 of 412 reviews</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

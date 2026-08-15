import { Star, TrendingUp, MessageSquare, Filter, Search, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const ratingStats = [
  { label: 'Overall Rating', value: '4.8 / 5.0', change: 'Top tier scores', icon: Star },
  { label: 'Total Reviews', value: '127', change: '12 this month', icon: MessageSquare },
  { label: 'Response Rate', value: '94%', change: 'Excellent engagement', icon: TrendingUp },
]

const ratingDistribution = [
  { stars: 5, count: 98, percentage: 77 },
  { stars: 4, count: 22, percentage: 17 },
  { stars: 3, count: 5, percentage: 4 },
  { stars: 2, count: 1, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
]

const recentReviews = [
  {
    name: 'Sarah Connor',
    date: 'Oct 10, 2026',
    rating: 5,
    text: 'Amazing energy as always! Elena pushes me past limits but keeps strict eye on form safety.',
    session: 'HIIT Session',
    responded: false,
  },
  {
    name: 'David Hassel',
    date: 'Oct 8, 2026',
    rating: 5,
    text: 'Best trainer in the gym. The strength program has helped me gain 10kg of muscle in 3 months.',
    session: 'Strength Training',
    responded: true,
    response: 'Thank you David! Your dedication is incredible. Keep pushing!',
  },
  {
    name: 'Marcus Vance',
    date: 'Oct 5, 2026',
    rating: 4,
    text: 'Great workouts, but sometimes the sessions run a bit late. Overall very satisfied.',
    session: 'Cardio Focus',
    responded: false,
  },
  {
    name: 'Emma Watson',
    date: 'Oct 3, 2026',
    rating: 5,
    text: 'Elena is fantastic! She really understands my goals and customizes everything perfectly.',
    session: 'Group Class',
    responded: true,
    response: 'Thanks Emma! I love working with you too!',
  },
  {
    name: 'John Carter',
    date: 'Sep 28, 2026',
    rating: 5,
    text: 'Professional, knowledgeable, and motivating. Highly recommend!',
    session: 'Power Building',
    responded: true,
    response: 'Appreciate the kind words, John!',
  },
]

const performanceMetrics = [
  { metric: 'Punctuality', score: 4.9 },
  { metric: 'Knowledge', score: 4.9 },
  { metric: 'Communication', score: 4.8 },
  { metric: 'Motivation', score: 4.9 },
  { metric: 'Form Correction', score: 4.7 },
]

export function MyRatings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Ratings & Reviews</h1>
          <p className="text-sm text-muted">Track your performance and client feedback</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter Reviews
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {ratingStats.map((stat) => {
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
        {/* Rating Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Rating Distribution</h3>
          <p className="text-sm text-muted mb-6">Avg: 4.8 Stars</p>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
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

        {/* Performance Metrics */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            {performanceMetrics.map((item) => (
              <div key={item.metric} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-32">{item.metric}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-12 text-right">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Recent Reviews</h3>
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
            <div key={i} className="p-4 rounded-lg border border-border bg-surface">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-foreground">{review.name}</p>
                    <span className="text-xs text-muted">{review.date}</span>
                    <span className="text-xs text-muted">•</span>
                    <span className="text-xs text-muted">{review.session}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted">&ldquo;{review.text}&rdquo;</p>
                  
                  {review.responded && review.response && (
                    <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted mb-1">Your Response:</p>
                      <p className="text-sm text-foreground">{review.response}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="size-4" />
                  </Button>
                  {!review.responded && (
                    <Button size="sm" variant="secondary" className="mt-2 gap-1">
                      <MessageSquare className="size-3" />
                      Respond
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted">Showing 5 of 127 reviews</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <MessageSquare className="size-4" />
            Respond to All Pending
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <TrendingUp className="size-4" />
            View Performance Report
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Export Reviews
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Users, DollarSign, Calendar, Star, TrendingUp, ArrowUpRight, ArrowDownRight, MessageSquare, MoreVertical } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const stats = [
  { label: 'Active Members', value: '1,240', change: '+4%', trend: 'up', icon: Users },
  { label: 'Monthly Revenue', value: '$48,250', change: '+12%', trend: 'up', icon: DollarSign },
  { label: "Today's Check-ins", value: '342', change: '+8%', trend: 'up', icon: Calendar },
  { label: 'Avg Trainer Rating', value: '4.8/5.0', change: '0.2', trend: 'up', icon: Star },
  { label: 'Satisfaction Index', value: '94%', change: '+2%', trend: 'up', icon: TrendingUp },
]

const topTrainers = [
  { name: 'Elena Rostova', sessions: 142, rating: 4.9, earnings: '$50k', specialty: 'Performance Architect' },
  { name: 'Daniel Park', sessions: 118, rating: 4.7, earnings: '$40k', specialty: 'HIIT Specialist' },
  { name: 'Marcus Vance', sessions: 98, rating: 4.6, earnings: '$30k', specialty: 'Strength Coach' },
]

const recentCheckIns = [
  { id: 'GYM-8829-X', name: 'Marcus Vance', time: '04:12 PM', status: 'Approved' },
  { id: 'GYM-1029-A', name: 'Sarah Connor', time: '03:55 PM', status: 'Approved' },
  { id: 'GYM-4920-Y', name: 'David Hassel', time: '03:40 PM', status: 'Approved' },
]

const feedbackFeed = [
  { name: 'Robert T.', message: '"Locker room B was quite messy around 4 PM."', time: 'Today, 04:12 PM', urgent: true },
  { name: 'Thomas K.', message: '"Dumbbell pairs are often disorganized."', time: 'Yesterday, 06:45 PM', urgent: true },
  { name: 'Clarissa H.', message: '"The peak hour congestion is getting worse."', time: 'Oct 30, 2024', urgent: false },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Console</h1>
          <p className="text-sm text-muted">Search records, financials, audits...</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            Export PDF
          </Button>
          <Button className="gap-2">
            Manage Staff
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Revenue Trend (6 Months)</h3>
            <p className="text-sm text-muted">Total: $289.4K</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">This Month</Button>
            <Button variant="ghost" size="sm">Last 30 Days</Button>
            <Button variant="ghost" size="sm">Custom</Button>
          </div>
        </div>
        <div className="h-48 flex items-end gap-4">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                style={{ height: `${40 + (i * 15)}%` }}
              />
              <span className="text-xs text-muted">{month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Trainers */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Top Performing Trainers</h3>
          <div className="space-y-4">
            {topTrainers.map((trainer, i) => (
              <div key={trainer.name} className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {trainer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{trainer.name}</p>
                  <p className="text-xs text-muted truncate">{trainer.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground text-sm">{trainer.earnings}</p>
                  <p className="text-xs text-muted">{trainer.sessions} sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Today's Checked-In Members</h3>
          <div className="space-y-3">
            {recentCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{checkIn.name}</p>
                  <p className="text-xs text-muted">{checkIn.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{checkIn.time}</p>
                  <span className="text-xs text-green-600">{checkIn.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feedback Feed */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Live Member Feedback Feed</h3>
            <span className="text-xs text-red-600 font-medium">Attention Req.</span>
          </div>
          <div className="space-y-3">
            {feedbackFeed.map((feedback) => (
              <div key={feedback.name} className={`p-3 rounded-lg ${feedback.urgent ? 'bg-red-50 border border-red-200' : 'bg-surface'}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-foreground text-sm">{feedback.name}</p>
                  {feedback.urgent && <span className="text-xs text-red-600 font-medium">Urgent</span>}
                </div>
                <p className="text-sm text-muted mt-1 line-clamp-2">{feedback.message}</p>
                <p className="text-xs text-muted mt-2">{feedback.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

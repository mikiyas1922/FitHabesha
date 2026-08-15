import { CreditCard, Calendar, CheckCircle, AlertTriangle, TrendingUp, Plus, Filter } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const currentSubscription = {
  plan: 'Premium',
  status: 'Active',
  startDate: 'Jan 15, 2024',
  endDate: 'Jan 15, 2025',
  price: '$149/month',
  features: ['Unlimited gym access', 'All group classes', 'Personal trainer sessions (4/month)', 'Locker included', 'Nutrition consultation', 'Priority booking'],
}

const availablePlans = [
  {
    id: 1,
    name: 'Basic',
    price: '$49/month',
    features: ['Gym access (off-peak)', 'Basic equipment', 'Locker rental available'],
    popular: false,
  },
  {
    id: 2,
    name: 'Standard',
    price: '$89/month',
    features: ['Unlimited gym access', 'Group classes', 'Locker included', 'Basic equipment'],
    popular: false,
  },
  {
    id: 3,
    name: 'Premium',
    price: '$149/month',
    features: ['Unlimited gym access', 'All group classes', 'Personal trainer sessions (4/month)', 'Locker included', 'Nutrition consultation', 'Priority booking'],
    popular: true,
  },
  {
    id: 4,
    name: 'Elite',
    price: '$249/month',
    features: ['All Premium features', 'Unlimited personal training', 'Private locker room', 'Massage therapy (2/month)', 'Nutrition meal plans', '24/7 gym access'],
    popular: false,
  },
]

const paymentHistory = [
  { date: 'Oct 15, 2026', amount: '$149', method: 'Visa ending 4242', status: 'Paid' },
  { date: 'Sep 15, 2026', amount: '$149', method: 'Visa ending 4242', status: 'Paid' },
  { date: 'Aug 15, 2026', amount: '$149', method: 'Visa ending 4242', status: 'Paid' },
  { date: 'Jul 15, 2026', amount: '$149', method: 'Visa ending 4242', status: 'Paid' },
]

export function MemberSubscriptions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Subscriptions</h1>
          <p className="text-sm text-muted">Manage your membership and billing</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter History
          </Button>
        </div>
      </div>

      {/* Current Subscription */}
      <div className="rounded-xl border border-primary bg-primary/5 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-lg">Current Plan: {currentSubscription.plan}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {currentSubscription.status}
              </span>
            </div>
            <p className="text-sm text-muted">{currentSubscription.price}</p>
          </div>
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Upgrade Plan
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-primary" />
              <span className="text-sm text-muted">Start Date</span>
            </div>
            <p className="font-medium text-foreground">{currentSubscription.startDate}</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-primary" />
              <span className="text-sm text-muted">Renewal Date</span>
            </div>
            <p className="font-medium text-foreground">{currentSubscription.endDate}</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="size-4 text-primary" />
              <span className="text-sm text-muted">Payment Method</span>
            </div>
            <p className="font-medium text-foreground">Visa ending 4242</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Plan Features</p>
          <div className="grid md:grid-cols-2 gap-2">
            {currentSubscription.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted">
                <CheckCircle className="size-4 text-green-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Available Plans</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availablePlans.map((plan) => (
            <div key={plan.id} className={`p-4 rounded-lg border-2 text-center transition-all ${
              plan.popular 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-surface hover:border-primary/30'
            }`}>
              {plan.popular && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary text-white mb-3">
                  Most Popular
                </span>
              )}
              <p className="font-semibold text-foreground text-lg">{plan.name}</p>
              <p className="text-2xl font-bold text-foreground mb-4">{plan.price}</p>
              <ul className="space-y-2 text-left mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted">
                    <CheckCircle className="size-3 text-green-600 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="sm" 
                variant={plan.popular ? 'default' : 'secondary'}
                className="w-full"
              >
                {plan.name === currentSubscription.plan ? 'Current Plan' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Payment History</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>

        <div className="space-y-3">
          {paymentHistory.map((payment, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{payment.date}</p>
                <p className="text-xs text-muted">{payment.method}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{payment.amount}</p>
                <span className="text-xs text-green-600">{payment.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <CreditCard className="size-4" />
            Update Payment Method
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Plus className="size-4" />
            Upgrade Plan
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <TrendingUp className="size-4" />
            View Usage Stats
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Download Invoices
          </Button>
        </div>
      </div>
    </div>
  )
}

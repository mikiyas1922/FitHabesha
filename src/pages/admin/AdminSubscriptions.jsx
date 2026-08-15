import { DollarSign, AlertCircle, CheckCircle, Clock, Search, Filter, Download, TrendingUp } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const subscriptionStats = [
  { label: 'Monthly Revenue', value: '$48,250', change: '+12%', trend: 'up', icon: DollarSign },
  { label: 'Outstanding Payments', value: '14 Accounts', change: 'Requires follow-up', trend: 'down', icon: AlertCircle },
  { label: 'Renewals Due (Week)', value: '82 Members', change: 'Auto-renew enabled', trend: 'up', icon: Clock },
  { label: 'Cancellations (Month)', value: '3 Members', change: '-1.2% churn rate', trend: 'down', icon: TrendingUp },
]

const subscriptionHistory = [
  { date: 'Today, 14:32', member: 'Marcus Sterling', memberId: 'GYM-4029-A', amount: '$120.00', type: 'Renewal', status: 'Completed', method: 'TB' },
  { date: 'Today, 11:20', member: 'Helena Rostova', memberId: 'GYM-8821-B', amount: '$350.00', type: 'Upgrade', status: 'Completed', method: 'CH' },
  { date: 'Yesterday, 09:15', member: 'Jonathan Vance', memberId: 'GYM-1094-C', amount: '$75.00', type: 'New', status: 'Pending', method: 'TB' },
  { date: 'Yesterday, 16:45', member: 'Clarissa Hayes', memberId: 'GYM-3051-A', amount: '$120.00', type: 'Renewal', status: 'Completed', method: 'CH' },
  { date: 'Jan 24, 2025', member: 'Devon Lane', memberId: 'GYM-9920-F', amount: '$75.00', type: 'New', status: 'Failed', method: 'CC' },
  { date: 'Jan 23, 2025', member: 'Arlene McCoy', memberId: 'GYM-7551-D', amount: '$350.00', type: 'Upgrade', status: 'Completed', method: 'Chapa' },
]

const membershipTiers = [
  {
    name: 'Basic Plan',
    price: '$29/month',
    features: ['Gym floor access', 'Basic workout tracking', 'Mobile app', 'Locker room'],
    popular: false,
  },
  {
    name: 'Premium Membership',
    price: '$49/month',
    features: ['All Basic features', '4 trainer sessions/month', 'Nutrition planning', 'Class priority', 'Progress analytics'],
    popular: true,
    badge: 'CURRENT',
  },
  {
    name: 'VIP Elite Pass',
    price: '$89/month',
    features: ['All Premium features', 'Unlimited sessions', 'Custom meal plans', '24/7 support', 'Spa access'],
    popular: false,
  },
]

export function AdminSubscriptions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions & Billing</h1>
          <p className="text-sm text-muted">Monitor gym financial performance, outstanding dues, and subscription logs.</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Download className="size-4" />
          Export Sheet
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-muted'
                }`}>
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Membership Tiers */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Membership Tier Options</h3>
        <p className="text-sm text-muted mb-6">Upgrade or scale your plan option any time with immediate activation.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {membershipTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl p-6 border-2 ${
                tier.popular
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-dark uppercase tracking-wide">
                  {tier.badge}
                </span>
              )}
              <h4 className={`font-bold text-lg mb-2 ${tier.popular ? 'text-primary' : 'text-foreground'}`}>
                {tier.name}
              </h4>
              <p className={`text-2xl font-bold mb-4 ${tier.popular ? 'text-primary' : 'text-foreground'}`}>
                {tier.price}
              </p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle className="size-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.popular ? 'primary' : 'secondary'}
                className="w-full"
                size="sm"
              >
                {tier.popular ? 'Currently Selected' : 'Change to Plan'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription History */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Billing & Invoices History</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search by member, ID or email..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Member</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionHistory.map((record, i) => (
                <tr key={i} className="border-b border-border hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{record.date}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{record.type}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{record.member}</p>
                      <p className="text-xs text-muted">{record.memberId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{record.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status === 'Completed' && <CheckCircle className="size-3" />}
                      {record.status === 'Pending' && <Clock className="size-3" />}
                      {record.status === 'Failed' && <AlertCircle className="size-3" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">{record.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted">Showing 6 of 148 records</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

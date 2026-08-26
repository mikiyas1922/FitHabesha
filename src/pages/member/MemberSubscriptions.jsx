import { useState, useEffect } from 'react'
import { CreditCard, Calendar, CheckCircle, AlertTriangle, TrendingUp, Plus, Filter, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { memberService } from '../../services/memberService'
import { subscriptionService } from '../../services/subscriptionService'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'

export function MemberSubscriptions() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [memberData, setMemberData] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch member profile
      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)
      setMemberData(profile)

      const profileId = profile?.id

      if (profileId) {
        // Try to fetch member subscriptions, but handle 404 gracefully
        try {
          const subscriptionResponse = await subscriptionService.getMemberSubscriptions(profileId)
          const subscriptionData = normalizeListResponse(subscriptionResponse)
          setSubscriptions(subscriptionData)
        } catch (subErr) {
          // If subscription API returns 404, use empty array
          console.warn('Subscription API not available, using fallback data')
          setSubscriptions([])
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load subscription data')
      console.error('Subscription data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get current subscription from real data
  const currentSubscription = subscriptions.length > 0 ? subscriptions[0] : {
    plan: 'No Active Plan',
    status: 'Inactive',
    startDate: '—',
    endDate: '—',
    price: 'ETB 0/month',
    features: [],
  }

  const availablePlans = [
    {
      id: 1,
      name: 'Basic',
      price: 'ETB 1,450/month',
      features: ['Gym access (off-peak)', 'Basic equipment', 'Locker rental available'],
      popular: false,
    },
    {
      id: 2,
      name: 'Standard',
      price: 'ETB 2,450/month',
      features: ['Unlimited gym access', 'Group classes', 'Locker included', 'Basic equipment'],
      popular: false,
    },
    {
      id: 3,
      name: 'Premium',
      price: 'ETB 4,450/month',
      features: ['Unlimited gym access', 'All group classes', 'Personal trainer sessions (4/month)', 'Locker included', 'Nutrition consultation', 'Priority booking'],
      popular: true,
    },
    {
      id: 4,
      name: 'Elite',
      price: 'ETB 7,450/month',
      features: ['All Premium features', 'Unlimited personal training', 'Private locker room', 'Massage therapy (2/month)', 'Nutrition meal plans', '24/7 gym access'],
      popular: false,
    },
  ]

  // Calculate payment history from real data
  const paymentHistory = subscriptions.slice(0, 4).map(s => ({
    date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    amount: `ETB ${(s.price || 0).toLocaleString()}`,
    method: s.payment_method === 'chapa' ? 'Chapa' : s.payment_method === 'telebirr' ? 'Telebirr' : s.payment_method || 'Bank Transfer',
    status: s.status === 'active' ? 'Paid' : s.status === 'pending' ? 'Pending' : 'Failed',
  }))

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-red-600 font-medium">Error loading subscriptions</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <Button onClick={loadSubscriptionData} className="mt-3">Retry</Button>
        </div>
      ) : (
        <>
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
          <div className="p-4 rounded-lg bg-card border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-primary" />
              <span className="text-sm text-muted">Start Date</span>
            </div>
            <p className="font-medium text-foreground">{currentSubscription.startDate}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-primary" />
              <span className="text-sm text-muted">Renewal Date</span>
            </div>
            <p className="font-medium text-foreground">{currentSubscription.endDate}</p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-primary/20">
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
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary text-foreground mb-3">
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
        </>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { DollarSign, AlertCircle, CheckCircle, Clock, Search, Filter, Download, TrendingUp, Loader2, Plus, Edit, CreditCard, Trash2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { subscriptionService } from '../../services/subscriptionService'
import { adminService } from '../../services/adminService'
import { SubscriptionManagementModal } from '../../components/SubscriptionManagementModal'
import { PaymentInitiationModal } from '../../components/PaymentInitiationModal'
import { PaymentVerification } from '../../components/PaymentVerification'
import { normalizeListResponse } from '../../utils/apiHelpers'

export function AdminSubscriptions() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [members, setMembers] = useState([])
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState(null)

  // TODO: Replace these with REAL membership tier UUIDs from your backend database
  const membershipTiers = [
    {
      id: 'REPLACE_WITH_REAL_UUID_1',
      name: 'Basic Plan',
      price: 'ETB 1,450/month',
      features: ['Gym floor access', 'Basic workout tracking', 'Mobile app', 'Locker room'],
      popular: false,
      duration_months: 1,
    },
    {
      id: 'REPLACE_WITH_REAL_UUID_2',
      name: 'Premium Membership',
      price: 'ETB 2,450/month',
      features: ['All Basic features', '4 trainer sessions/month', 'Nutrition planning', 'Class priority', 'Progress analytics'],
      popular: true,
      badge: 'CURRENT',
      duration_months: 1,
    },
    {
      id: 'REPLACE_WITH_REAL_UUID_3',
      name: 'VIP Elite Pass',
      price: 'ETB 4,450/month',
      features: ['All Premium features', 'Unlimited sessions', 'Custom meal plans', '24/7 support', 'Spa access'],
      popular: false,
      duration_months: 1,
    },
  ]

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch members (no endpoint to list all subscriptions in backend)
      const memberResponse = await adminService.getMembers()
      const memberData = normalizeListResponse(memberResponse)
      
      setMembers(memberData)
      setSubscriptions([]) // No endpoint to list all subscriptions
    } catch (err) {
      // Handle specific error codes from API spec
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view subscriptions.')
      } else {
        setError(err.message || 'Failed to load subscription data')
      }
      console.error('Subscription data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const monthlyRevenue = activeSubscriptions.reduce((acc, s) => acc + (s.price || 0), 0)
  const pendingPayments = subscriptions.filter(s => s.status === 'pending').length
  
  const subscriptionStats = [
    { label: 'Monthly Revenue', value: `ETB ${monthlyRevenue.toLocaleString()}`, change: '+12%', trend: 'up', icon: DollarSign },
    { label: 'Active Subscriptions', value: String(activeSubscriptions.length), change: 'Current', trend: 'up', icon: CheckCircle },
    { label: 'Pending Payments', value: String(pendingPayments), change: 'Requires action', trend: 'down', icon: AlertCircle },
    { label: 'Total Subscriptions', value: String(subscriptions.length), change: 'All time', trend: 'up', icon: TrendingUp },
  ]

  const handleCreateSubscription = () => {
    setSelectedSubscription(null)
    setShowSubscriptionModal(true)
  }

  const handleEditSubscription = (subscription) => {
    setSelectedSubscription(subscription)
    setShowSubscriptionModal(true)
  }

  const handleSubscriptionSuccess = (result) => {
    console.log('Subscription operation successful:', result)
    loadSubscriptionData()
  }

  const handleInitiatePayment = (member) => {
    setSelectedMemberForPayment(member)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (result) => {
    console.log('Payment successful:', result)
    loadSubscriptionData()
  }

  const handlePaymentVerified = (result) => {
    console.log('Payment verified:', result)
    loadSubscriptionData()
  }

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
              <h1 className="text-2xl font-bold text-foreground">Subscriptions & Billing</h1>
              <p className="text-sm text-muted">Monitor gym financial performance, outstanding dues, and subscription logs.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="gap-2">
                <Download className="size-4" />
                Export Sheet
              </Button>
              <Button onClick={handleCreateSubscription} className="gap-2">
                <Plus className="size-4" />
                Create Subscription
              </Button>
              <Button variant="primary" className="gap-2" onClick={() => setShowPaymentModal(true)}>
                <CreditCard className="size-4" />
                Initiate Payment
              </Button>
            </div>
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

      {/* Subscriptions List */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">All Subscriptions</h3>
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Member</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Period</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-muted">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">
                      {subscription.created_at ? new Date(subscription.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {subscription.member_name || members.find(m => m.id === subscription.member_id)?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted">{subscription.member_id || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{subscription.tier_name || subscription.plan || '—'}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {subscription.price ? `ETB ${subscription.price.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : subscription.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : subscription.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {subscription.status === 'active' && <CheckCircle className="size-3" />}
                        {subscription.status === 'pending' && <Clock className="size-3" />}
                        {subscription.status === 'cancelled' && <AlertCircle className="size-3" />}
                        {subscription.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted">
                      {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : '—'} - {subscription.expiry_date ? new Date(subscription.expiry_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSubscription(subscription)}
                          className="gap-2"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted">Showing {subscriptions.length} subscriptions</p>
        </div>
      </div>

      {/* Payment Verification */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Verify Payment Status</h3>
        <p className="text-sm text-muted mb-4">
          If a member completed a payment but their subscription hasn't been activated yet, enter the StarPay order ID to verify the payment status.
        </p>
        <PaymentVerification onPaymentVerified={handlePaymentVerified} />
      </div>

        </>
      )}

      {/* Subscription Management Modal */}
      <SubscriptionManagementModal
        open={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        subscriptionData={selectedSubscription}
        members={members}
        membershipTiers={membershipTiers}
        onSuccess={handleSubscriptionSuccess}
      />

      {/* Payment Initiation Modal */}
      <PaymentInitiationModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        memberProfileId={selectedMemberForPayment?.id}
        membershipTiers={membershipTiers}
        members={members}
        isAdmin={true}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

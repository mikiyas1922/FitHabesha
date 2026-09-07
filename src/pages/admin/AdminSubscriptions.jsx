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
  const [selectedMemberForView, setSelectedMemberForView] = useState(null)
  const [memberSubscriptions, setMemberSubscriptions] = useState([])
  const [memberActiveSubscription, setMemberActiveSubscription] = useState(null)
  const [loadingMemberSubscriptions, setLoadingMemberSubscriptions] = useState(false)

  // Real membership tiers from backend database
  const membershipTiers = [
    {
      id: 'f3240ec6-18fd-4953-a105-6d7231b82949',
      name: 'Basic Monthly',
      description: 'Access to gym floor and basic equipment.',
      price: 'ETB 50/month',
      features: ['Gym floor access', 'Basic equipment'],
      popular: false,
      duration_months: 1,
      includes_trainer: false,
      includes_nutrition_plan: false,
    },
    {
      id: 'a164a03d-bf07-4b41-a70a-f2f697f13dc0',
      name: 'Basic 6-Month',
      description: 'Access to gym floor (6-month commitment, save 20%).',
      price: 'ETB 240/6 months',
      features: ['Gym floor access', 'Basic equipment', '20% savings'],
      popular: false,
      duration_months: 6,
      includes_trainer: false,
      includes_nutrition_plan: false,
    },
    {
      id: 'a69ca379-65ab-43ff-a156-683cccda86c4',
      name: 'Basic Yearly',
      description: 'Access to gym floor (1-year commitment, save 30%).',
      price: 'ETB 420/year',
      features: ['Gym floor access', 'Basic equipment', '30% savings'],
      popular: false,
      duration_months: 12,
      includes_trainer: false,
      includes_nutrition_plan: false,
    },
    {
      id: '18a93582-c1e0-4d6e-bc35-6e3ff914964d',
      name: 'Premium Monthly',
      description: 'Unlimited classes + personal trainer access.',
      price: 'ETB 80/month',
      features: ['Unlimited classes', 'Personal trainer access', 'Nutrition plan'],
      popular: true,
      duration_months: 1,
      includes_trainer: true,
      includes_nutrition_plan: true,
    },
    {
      id: '2ddd9d36-4724-41b2-86e1-0ee17e56cc94',
      name: 'Premium 6-Month',
      description: 'Unlimited classes + trainer (save 12%).',
      price: 'ETB 420/6 months',
      features: ['Unlimited classes', 'Personal trainer access', 'Nutrition plan', '12% savings'],
      popular: false,
      duration_months: 6,
      includes_trainer: true,
      includes_nutrition_plan: true,
    },
    {
      id: '3cd193b1-d0ed-47aa-bf4b-ee6c6763bc94',
      name: 'Premium Yearly',
      description: 'Ultimate package (save 25%).',
      price: 'ETB 720/year',
      features: ['Unlimited classes', 'Personal trainer access', 'Nutrition plan', '25% savings'],
      popular: false,
      duration_months: 12,
      includes_trainer: true,
      includes_nutrition_plan: true,
    },
  ]

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch members
      const memberResponse = await adminService.getMembers()
      const memberData = normalizeListResponse(memberResponse)
      setMembers(memberData)

      // Fetch subscriptions for all members (workaround since no global list endpoint exists)
      console.log('Fetching subscriptions for all members...')
      const allSubscriptions = []

      for (const member of memberData) {
        try {
          const subResponse = await subscriptionService.getMemberAllSubscriptions(member.id, { page: 1, limit: 100 })
          const memberSubs = normalizeListResponse(subResponse)
          // Add member name to each subscription for display
          const subsWithMemberInfo = memberSubs.map(sub => ({
            ...sub,
            member_name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            member_email: member.email,
          }))
          allSubscriptions.push(...subsWithMemberInfo)
        } catch (subErr) {
          // Skip members with no subscriptions (404 is expected)
          console.log(`No subscriptions for member ${member.id}:`, subErr.response?.status)
        }
      }

      console.log(`Total subscriptions fetched: ${allSubscriptions.length}`)
      setSubscriptions(allSubscriptions)
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
  const monthlyRevenue = activeSubscriptions.reduce((acc, s) => acc + (Number(s.price) || 0), 0)
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

  const handleViewMemberSubscriptions = async (member) => {
    setSelectedMemberForView(member)
    setLoadingMemberSubscriptions(true)
    setMemberSubscriptions([])
    setMemberActiveSubscription(null)

    try {
      console.log('=== Loading member subscriptions ===')
      console.log('Member ID:', member.id)
      console.log('Member object:', member)

      // Try to get active subscription first
      try {
        const activeResponse = await subscriptionService.getActiveSubscription(member.id)
        console.log('Active subscription response:', activeResponse)
        const activeSub = unwrapResource(activeResponse)
        console.log('Active subscription:', activeSub)
        setMemberActiveSubscription(activeSub)
      } catch (activeErr) {
        console.log('No active subscription (404):', activeErr)
        console.log('Error status:', activeErr.response?.status)
        // 404 is expected if no active subscription
        setMemberActiveSubscription(null)
      }

      // Get all subscriptions for the member
      try {
        const allResponse = await subscriptionService.getMemberAllSubscriptions(member.id, { page: 1, limit: 20 })
        console.log('All subscriptions response:', allResponse)
        const allSubs = normalizeListResponse(allResponse)
        console.log('All subscriptions:', allSubs)
        setMemberSubscriptions(allSubs)
      } catch (subErr) {
        console.warn('Error fetching all subscriptions for member:', subErr)
        console.warn('Error status:', subErr.response?.status)
        console.warn('Error data:', subErr.response?.data)
        // 404 is expected if member has no subscriptions
        setMemberSubscriptions([])
      }
    } catch (err) {
      console.error('Error loading member subscriptions:', err)
      setError('Failed to load member subscriptions')
    } finally {
      setLoadingMemberSubscriptions(false)
    }
  }

  const handleCloseMemberView = () => {
    setSelectedMemberForView(null)
    setMemberSubscriptions([])
    setMemberActiveSubscription(null)
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

          {/* Member Subscription View */}
          {selectedMemberForView ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedMemberForView.first_name} {selectedMemberForView.last_name}'s Subscriptions
                  </h2>
                  <p className="text-sm text-muted">{selectedMemberForView.email}</p>
                </div>
                <Button onClick={handleCloseMemberView} variant="secondary">
                  Close
                </Button>
              </div>

              {loadingMemberSubscriptions ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active Subscription */}
                  {memberActiveSubscription ? (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="size-5 text-green-600" />
                        <h3 className="font-semibold text-green-700 dark:text-green-300">Active Subscription</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted">Tier</p>
                          <p className="font-medium text-foreground">{memberActiveSubscription.tier_name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-muted">Status</p>
                          <p className="font-medium text-foreground capitalize">{memberActiveSubscription.status}</p>
                        </div>
                        <div>
                          <p className="text-muted">Start Date</p>
                          <p className="font-medium text-foreground">
                            {memberActiveSubscription.start_date ? new Date(memberActiveSubscription.start_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Expiry Date</p>
                          <p className="font-medium text-foreground">
                            {memberActiveSubscription.expiry_date ? new Date(memberActiveSubscription.expiry_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSubscription(memberActiveSubscription)}
                        >
                          Manage Subscription
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-xl">
                      <p className="text-sm text-muted">No active subscription</p>
                    </div>
                  )}

                  {/* Subscription History */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Subscription History</h3>
                    {(() => {
                      const historySubscriptions = memberActiveSubscription
                        ? memberSubscriptions.filter(sub => sub.id !== memberActiveSubscription.id)
                        : memberSubscriptions
                      return historySubscriptions.length === 0 ? (
                        <p className="text-sm text-muted">No subscription history</p>
                      ) : (
                        <div className="space-y-2">
                          {historySubscriptions.map((sub) => (
                            <div
                              key={sub.id}
                              className="p-3 border border-border rounded-lg bg-surface"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{sub.tier_name || 'Unknown Tier'}</p>
                                  <p className="text-xs text-muted">
                                    {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : 'N/A'} - {' '}
                                    {sub.expiry_date ? new Date(sub.expiry_date).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  sub.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : sub.status === 'expired'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {sub.status?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Member Selection */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">View Member Subscriptions</h3>
                <div className="flex gap-3">
                  <select
                    onChange={(e) => {
                      const member = members.find(m => m.id === e.target.value)
                      if (member) handleViewMemberSubscriptions(member)
                    }}
                    className="flex-1 px-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select a member to view subscriptions</option>
                    {members?.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.first_name} {member.last_name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
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
                            <td className="py-3 px-4 text-sm font-medium text-foreground whitespace-nowrap">
                              {subscription.price ? `ETB ${Number(subscription.price).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—'}
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

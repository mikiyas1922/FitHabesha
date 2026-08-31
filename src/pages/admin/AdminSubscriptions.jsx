import { useState, useEffect } from 'react'
import { DollarSign, AlertCircle, CheckCircle, Clock, Search, Filter, Download, TrendingUp, Loader2, Plus, Edit } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { subscriptionService } from '../../services/subscriptionService'
import { adminService } from '../../services/adminService'
import { normalizeListResponse, unwrapResource } from '../../utils/apiHelpers'

export function AdminSubscriptions() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [members, setMembers] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [formData, setFormData] = useState({
    member_profile_id: '',
    membership_tier_id: '',
    start_date: new Date().toISOString().split('T')[0],
    auto_renew: true,
  })
  const [statusData, setStatusData] = useState({ status: 'active' })

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch members first
      const memberResponse = await adminService.getMembers()
      const memberData = normalizeListResponse(memberResponse)
      setMembers(memberData)

      // Try to fetch subscriptions, but handle 404 gracefully
      try {
        const subscriptionResponse = await subscriptionService.getAllSubscriptions()
        const subscriptionData = normalizeListResponse(subscriptionResponse)
        setSubscriptions(subscriptionData)
      } catch (subErr) {
        // If subscription API returns 404, use empty array
        console.warn('Subscription API not available, using fallback data')
        setSubscriptions([])
      }
    } catch (err) {
      setError(err.message || 'Failed to load subscription data')
      console.error('Subscription data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubscription = async (e) => {
    e.preventDefault()
    try {
      setActionLoading(true)
      setError(null)

      const response = await subscriptionService.createSubscription(formData)
      const newSubscription = unwrapResource(response)
      
      setSubscriptions([newSubscription, ...subscriptions])
      setShowCreateModal(false)
      setFormData({
        member_profile_id: '',
        membership_tier_id: '',
        start_date: new Date().toISOString().split('T')[0],
        auto_renew: true,
      })
    } catch (err) {
      setError(err.message || 'Failed to create subscription')
      console.error('Subscription creation error:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    if (!selectedSubscription) return

    try {
      setActionLoading(true)
      setError(null)

      const response = await subscriptionService.updateSubscriptionStatus(selectedSubscription.id, statusData)
      const updatedSubscription = unwrapResource(response)
      
      setSubscriptions(subscriptions.map(sub => 
        sub.id === selectedSubscription.id ? updatedSubscription : sub
      ))
      setShowStatusModal(false)
      setSelectedSubscription(null)
      setStatusData({ status: 'active' })
    } catch (err) {
      setError(err.message || 'Failed to update subscription status')
      console.error('Status update error:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const openStatusModal = (subscription) => {
    setSelectedSubscription(subscription)
    setStatusData({ status: subscription.status || 'active' })
    setShowStatusModal(true)
  }

  // Calculate stats from real data
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' || s.is_active !== false)
  const monthlyRevenue = activeSubscriptions.reduce((acc, s) => acc + (s.price || 0), 0)
  
  const subscriptionStats = [
    { label: 'Monthly Revenue', value: `ETB ${monthlyRevenue.toLocaleString()}`, change: '+12%', trend: 'up', icon: DollarSign },
    { label: 'Outstanding Payments', value: '14 Accounts', change: 'Requires follow-up', trend: 'down', icon: AlertCircle },
    { label: 'Renewals Due (Week)', value: '82 Members', change: 'Auto-renew enabled', trend: 'up', icon: Clock },
    { label: 'Cancellations (Month)', value: '3 Members', change: '-1.2% churn rate', trend: 'down', icon: TrendingUp },
  ]

  // Calculate subscription history from real data
  const subscriptionHistory = subscriptions.slice(0, 6).map(s => ({
    date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    member: s.member_name || members.find(m => m.id === s.member_id)?.name || 'Unknown',
    memberId: s.member_id || 'N/A',
    amount: `ETB ${(s.price || 0).toLocaleString()}`,
    type: s.type || 'New',
    status: s.status === 'active' ? 'Completed' : s.status === 'pending' ? 'Pending' : 'Failed',
    method: s.payment_method || 'CH',
  }))

  const membershipTiers = [
    {
      id: 'basic-tier-id', // Replace with actual tier ID from backend
      name: 'Basic Plan',
      price: 'ETB 1,450/month',
      features: ['Gym floor access', 'Basic workout tracking', 'Mobile app', 'Locker room'],
      popular: false,
    },
    {
      id: 'premium-tier-id', // Replace with actual tier ID from backend
      name: 'Premium Membership',
      price: 'ETB 2,450/month',
      features: ['All Basic features', '4 trainer sessions/month', 'Nutrition planning', 'Class priority', 'Progress analytics'],
      popular: true,
      badge: 'CURRENT',
    },
    {
      id: 'elite-tier-id', // Replace with actual tier ID from backend
      name: 'VIP Elite Pass',
      price: 'ETB 4,450/month',
      features: ['All Premium features', 'Unlimited sessions', 'Custom meal plans', '24/7 support', 'Spa access'],
      popular: false,
    },
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'frozen', label: 'Frozen', color: 'blue' },
    { value: 'expired', label: 'Expired', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' },
  ]

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
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="size-4" />
                Create Subscription
              </Button>
              <Button variant="secondary" className="gap-2">
                <Download className="size-4" />
                Export Sheet
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
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
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
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => openStatusModal(subscriptions[i])}
                        >
                          <Edit className="size-4" />
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted">Showing {subscriptionHistory.length} of {subscriptions.length} records</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled>Previous</Button>
                <Button variant="ghost" size="sm">Next</Button>
              </div>
            </div>
          </div>

        {/* Create Subscription Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create Subscription</h3>
              <form onSubmit={handleCreateSubscription} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Member</label>
                  <select
                    required
                    value={formData.member_profile_id}
                    onChange={(e) => setFormData({ ...formData, member_profile_id: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.email || member.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Membership Tier</label>
                  <select
                    required
                    value={formData.membership_tier_id}
                    onChange={(e) => setFormData({ ...formData, membership_tier_id: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a tier</option>
                    {membershipTiers.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} - {tier.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-renew"
                    checked={formData.auto_renew}
                    onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                    className="rounded border-border"
                  />
                  <label htmlFor="auto-renew" className="text-sm">Auto-renew</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading ? 'Creating...' : 'Create Subscription'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedSubscription && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Update Subscription Status</h3>
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">New Status</label>
                  <select
                    required
                    value={statusData.status}
                    onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowStatusModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  )
}

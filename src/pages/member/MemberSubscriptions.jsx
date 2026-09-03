import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { DollarSign, AlertCircle, CheckCircle, Clock, CreditCard, Plus, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { memberService } from '../../services/memberService'
import { subscriptionService } from '../../services/subscriptionService'
import { PaymentInitiationModal } from '../../components/PaymentInitiationModal'
import { PaymentVerification } from '../../components/PaymentVerification'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'

export function MemberSubscriptions() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [memberData, setMemberData] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)

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
      console.log('=== Loading subscription data ===')

      // Fetch member profile
      const profileResponse = await memberService.getCurrentMemberProfile()
      console.log('Profile response:', profileResponse)
      const profile = unwrapResource(profileResponse)
      console.log('Unwrapped profile:', profile)
      setMemberData(profile)

      const profileId = profile?.id
      console.log('Member profile ID:', profileId)

      if (profileId) {
        // Try to fetch active subscription first
        try {
          console.log('Fetching active subscription for:', profileId)
          const activeResponse = await subscriptionService.getActiveSubscription(profileId)
          console.log('Active subscription response:', activeResponse)
          const activeSubscription = unwrapResource(activeResponse)
          console.log('Unwrapped active subscription:', activeSubscription)
          if (activeSubscription) {
            console.log('Setting active subscription:', activeSubscription)
            setSubscriptions([activeSubscription])
          } else {
            console.log('Active subscription is null/undefined')
          }
        } catch (activeErr) {
          console.log('Active subscription error:', activeErr)
          console.log('Error status:', activeErr.response?.status)
          // If no active subscription (404), try to get all subscriptions
          const is404 = activeErr.response?.status === 404 || activeErr.status === 404
          if (is404) {
            console.log('No active subscription (404), fetching all subscriptions')
            try {
              const subscriptionResponse = await subscriptionService.getMemberAllSubscriptions(profileId, { page: 1, limit: 10 })
              console.log('All subscriptions response:', subscriptionResponse)
              const subscriptionData = normalizeListResponse(subscriptionResponse)
              console.log('Normalized subscription data:', subscriptionData)
              setSubscriptions(subscriptionData)
            } catch (subErr) {
              // If subscription API returns 404, use empty array (no subscriptions is valid state)
              console.warn('No subscriptions found for member (this is normal for new members)')
              console.warn('Error:', subErr)
              console.warn('Error status:', subErr.response?.status)
              console.warn('Error data:', subErr.response?.data)
              setSubscriptions([])
            }
          } else {
            console.log('Non-404 error, throwing:', activeErr)
            throw activeErr
          }
        }
      } else {
        console.log('No profile ID found')
      }
    } catch (err) {
      // Handle specific error codes from API spec
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view subscriptions.')
      } else if (err.response?.status === 404) {
        setError('Member not found.')
      } else {
        setError(err.message || 'Failed to load subscription data')
      }
      console.error('Subscription data fetch error:', err)
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-2xl font-bold text-foreground">My Subscriptions</h1>
              <p className="text-sm text-muted">Manage your membership and billing</p>
            </div>
            <Button onClick={() => setShowPaymentModal(true)} className="gap-2">
              <Plus className="size-4" />
              New Subscription
            </Button>
          </div>

          {subscriptions.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm text-muted">No active subscription. Choose a membership plan to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {subscription.tier_name || 'Unknown Tier'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : subscription.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : subscription.status === 'expired'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {subscription.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted">Price</p>
                          <p className="font-medium text-foreground">
                            {subscription.price ? `ETB ${subscription.price.toLocaleString()}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Duration</p>
                          <p className="font-medium text-foreground">
                            {subscription.duration_months ? `${subscription.duration_months} month${subscription.duration_months > 1 ? 's' : ''}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Start Date</p>
                          <p className="font-medium text-foreground">
                            {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">End Date</p>
                          <p className="font-medium text-foreground">
                            {subscription.expiry_date ? new Date(subscription.expiry_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {subscription.frozen_until && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Frozen until:</strong> {new Date(subscription.frozen_until).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {subscription.auto_renew && (
                      <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="size-4" />
                        <span>Auto-renew enabled</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Verify Payment Status</h3>
            <p className="text-sm text-muted mb-4">
              If you completed a payment but your subscription hasn't been activated yet, enter your StarPay order ID to verify the payment status.
            </p>
            <PaymentVerification onPaymentVerified={handlePaymentVerified} />
          </div>
        </>
      )}

      <PaymentInitiationModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        memberProfileId={memberData?.id}
        membershipTiers={membershipTiers}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

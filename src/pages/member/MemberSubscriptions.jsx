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

  // TODO: Replace these with REAL membership tier UUIDs from your backend database
  const membershipTiers = [
    {
      id: 'REPLACE_WITH_REAL_UUID_1',
      name: 'Basic',
      price: 'ETB 1,450/month',
      features: ['Gym access (off-peak)', 'Basic equipment', 'Locker rental available'],
      popular: false,
      duration_months: 1,
    },
    {
      id: 'REPLACE_WITH_REAL_UUID_2',
      name: 'Standard',
      price: 'ETB 2,450/month',
      features: ['Unlimited gym access', 'Group classes', 'Locker included', 'Basic equipment'],
      popular: false,
      duration_months: 1,
    },
    {
      id: 'REPLACE_WITH_REAL_UUID_3',
      name: 'Premium',
      price: 'ETB 4,450/month',
      features: ['Unlimited gym access', 'All group classes', 'Personal trainer sessions (4/month)', 'Locker included', 'Nutrition consultation', 'Priority booking'],
      popular: true,
      duration_months: 1,
    },
    {
      id: 'REPLACE_WITH_REAL_UUID_4',
      name: 'Elite',
      price: 'ETB 7,450/month',
      features: ['All Premium features', 'Unlimited personal training', 'Private locker room', 'Massage therapy (2/month)', 'Nutrition meal plans', '24/7 gym access'],
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

      // Fetch member profile
      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)
      setMemberData(profile)

      const profileId = profile?.id

      if (profileId) {
        // Try to fetch active subscription first
        try {
          const activeResponse = await subscriptionService.getActiveSubscription(profileId)
          const activeSubscription = unwrapResource(activeResponse)
          if (activeSubscription) {
            setSubscriptions([activeSubscription])
          }
        } catch (activeErr) {
          // If no active subscription (404), try to get all subscriptions
          const is404 = activeErr.response?.status === 404 || activeErr.status === 404
          if (is404) {
            try {
              const subscriptionResponse = await subscriptionService.getMemberAllSubscriptions(profileId, { page: 1, limit: 10 })
              const subscriptionData = normalizeListResponse(subscriptionResponse)
              setSubscriptions(subscriptionData)
            } catch (subErr) {
              // If subscription API returns 404, use empty array (no subscriptions is valid state)
              console.warn('No subscriptions found for member (this is normal for new members)')
              setSubscriptions([])
            }
          } else {
            throw activeErr
          }
        }
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

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">No subscription data available at this time.</p>
          </div>

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

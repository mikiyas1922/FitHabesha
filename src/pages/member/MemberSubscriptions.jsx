import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { DollarSign, AlertCircle, CheckCircle, Clock, CreditCard, Plus, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { EmptyState } from '../../components/ui/EmptyState'
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
          <Loader2 className="size-8 animate-spin text-[var(--app-primary)]" />
        </div>
      ) : error ? (
        <Alert variant="danger" title="Error loading subscriptions" message={error} action={<Button onClick={loadSubscriptionData}>Retry</Button>} />
      ) : (
        <>
          <PageHeader 
            title="My Subscriptions" 
            subtitle="Manage your membership and billing"
            action={
              <Button onClick={() => setShowPaymentModal(true)} className="gap-2">
                <Plus className="size-4" />
                New Subscription
              </Button>
            }
          />

          {subscriptions.length === 0 ? (
            <Card padding="lg">
              <EmptyState 
                icon={<CreditCard className="size-12" />}
                title="No active subscription"
                description="Choose a membership plan to get started."
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id} padding="lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                          {subscription.tier_name || 'Unknown Tier'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : subscription.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            : subscription.status === 'expired'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-[var(--app-muted)]/10 text-[var(--app-muted)] border border-[var(--app-muted)]/30'
                        }`}>
                          {subscription.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[var(--app-muted)]">Price</p>
                          <p className="font-medium text-[var(--app-foreground)]">
                            {subscription.price ? `ETB ${subscription.price.toLocaleString()}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--app-muted)]">Duration</p>
                          <p className="font-medium text-[var(--app-foreground)]">
                            {subscription.duration_months ? `${subscription.duration_months} month${subscription.duration_months > 1 ? 's' : ''}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--app-muted)]">Start Date</p>
                          <p className="font-medium text-[var(--app-foreground)]">
                            {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[var(--app-muted)]">End Date</p>
                          <p className="font-medium text-[var(--app-foreground)]">
                            {subscription.expiry_date ? new Date(subscription.expiry_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      {subscription.frozen_until && (
                        <div className="mt-2 p-2 bg-blue-500/10 rounded-[12px] border border-blue-500/30">
                          <p className="text-sm text-blue-400">
                            <strong>Frozen until:</strong> {new Date(subscription.frozen_until).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {subscription.auto_renew && (
                      <div className="flex items-center gap-1 text-sm text-[var(--app-primary)]">
                        <CheckCircle className="size-4" />
                        <span>Auto-renew enabled</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Card padding="lg">
            <CardTitle className="mb-4">Verify Payment Status</CardTitle>
            <CardContent>
              <p className="text-sm text-[var(--app-muted)] mb-4">
                If you completed a payment but your subscription hasn't been activated yet, enter your StarPay order ID to verify the payment status.
              </p>
              <PaymentVerification onPaymentVerified={handlePaymentVerified} />
            </CardContent>
          </Card>
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

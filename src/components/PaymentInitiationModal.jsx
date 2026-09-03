import { useState, useEffect } from 'react'
import { X, Loader2, CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { paymentService } from '../services/paymentService'
import { unwrapResource } from '../utils/apiHelpers'

export function PaymentInitiationModal({ open, onClose, memberProfileId, membershipTiers, onSuccess, members, isAdmin = false }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentResult, setPaymentResult] = useState(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  
  const [formData, setFormData] = useState({
    member_profile_id: memberProfileId || '',
    membership_tier_id: '',
    start_date: new Date().toISOString().split('T')[0],
    auto_renew: true,
  })

  useEffect(() => {
    if (open) {
      setFormData({
        member_profile_id: memberProfileId || '',
        membership_tier_id: '',
        start_date: new Date().toISOString().split('T')[0],
        auto_renew: true,
      })
      setError('')
      setPaymentResult(null)
    }
  }, [open, memberProfileId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let payload = null

    try {
      if (isAdmin && !formData.member_profile_id) {
        throw new Error('Please select a member')
      }
      if (!formData.membership_tier_id) {
        throw new Error('Please select a membership tier')
      }

      if (!formData.start_date) {
        throw new Error('Please select a start date')
      }

      // Log for debugging
      console.log('Payment initiation payload:', {
        member_profile_id: isAdmin ? formData.member_profile_id : memberProfileId,
        membership_tier_id: formData.membership_tier_id,
        start_date: formData.start_date,
        auto_renew: formData.auto_renew,
      })

      payload = {
        member_profile_id: isAdmin ? formData.member_profile_id : memberProfileId,
        membership_tier_id: formData.membership_tier_id,
        start_date: formData.start_date,
        auto_renew: formData.auto_renew,
      }

      const response = await paymentService.initiatePayment(payload)
      const result = unwrapResource(response)
      setPaymentResult(result)

      // Backend returns: { success: true, data: { subscription: {...}, payment: {...} }, message: "..." }
      // unwrapResource extracts the data object containing subscription and payment
      // If payment URL is returned, open it in a new window
      if (result?.payment?.paymentUrl) {
        window.open(result.payment.paymentUrl, '_blank')
        
        // Start payment verification after a short delay
        // Use billRefNo as the orderId for verification
        setTimeout(() => {
          verifyPayment(result.payment.billRefNo)
        }, 3000)
      } else {
        // If no payment URL, consider it a direct subscription creation
        if (onSuccess) {
          onSuccess(result)
        }
        onClose()
      }
    } catch (err) {
      console.error('Payment initiation error:', err)
      console.error('Request payload:', payload)
      
      // Handle specific error codes from API spec
      if (err.response?.status === 400) {
        // Validation error
        const validationDetails = err.response?.data?.details
        if (Array.isArray(validationDetails) && validationDetails.length > 0) {
          const firstError = validationDetails[0]
          if (typeof firstError === 'string') {
            setError(firstError)
          } else if (typeof firstError === 'object' && firstError.message) {
            setError(firstError.message)
          } else if (typeof firstError === 'object' && firstError.field) {
            setError(`${firstError.field}: ${firstError.message || 'Invalid value'}`)
          } else {
            setError('Validation failed. Please check your input.')
          }
        } else {
          setError('Validation failed. Please check your input.')
        }
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.')
      } else if (err.response?.status === 403) {
        setError('You do not have permission to initiate payments.')
      } else if (err.response?.status === 404) {
        setError('Member or membership tier not found.')
      } else if (err.response?.status === 409) {
        const conflictError = err.response?.data
        if (conflictError?.existing_subscription) {
          const sub = conflictError.existing_subscription
          setError(`Member already has an active subscription (${sub.tier_name || 'Unknown'}) until ${new Date(sub.end_date).toLocaleDateString()}. Please renew or upgrade the existing subscription.`)
        } else {
          setError('Member already has an active subscription. Please renew or upgrade the existing subscription.')
        }
      } else if (err.response?.status === 500) {
        setError('Payment gateway error. Please try again later.')
      } else {
        setError(err.message || 'Failed to initiate payment')
      }
    } finally {
      setLoading(false)
    }
  }

  const verifyPayment = async (orderId) => {
    setVerifyingPayment(true)
    try {
      const response = await paymentService.verifyPayment(orderId)
      const result = unwrapResource(response)
      
      // API returns: { success: true, data: { order_id, status, amount, currency, updated_at }, message }
      // Status can be: PAID, PENDING, FAILED, etc.
      if (result?.status === 'PAID') {
        // Payment successful
        if (onSuccess) {
          onSuccess(result)
        }
        onClose()
      } else if (result?.status === 'FAILED') {
        // Payment failed
        setVerifyingPayment(false)
        setError('Payment failed. Please try again.')
      } else {
        // Payment still pending - continue polling
        setTimeout(() => verifyPayment(orderId), 5000)
      }
    } catch (err) {
      console.error('Payment verification error:', err)
      setVerifyingPayment(false)
      
      // Handle specific error codes from API spec
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.')
      } else if (err.response?.status === 404) {
        setError('Payment not found. Please check the order ID.')
      } else {
        setError('Payment verification failed. Please contact support.')
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <CreditCard className="size-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {paymentResult ? 'Payment in Progress' : 'Initiate Payment'}
                </h2>
                <p className="text-sm text-muted">
                  {paymentResult ? 'Waiting for payment completion...' : 'Select a membership tier to start your subscription'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-hover text-muted transition-colors"
              disabled={loading || verifyingPayment}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
              <AlertCircle className="size-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {paymentResult ? (
            <div className="space-y-4">
              <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                    <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Payment Initiated</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your payment session has been created
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Order ID:</span>
                    <span className="font-medium text-foreground">{paymentResult.payment?.billRefNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Subscription ID:</span>
                    <span className="font-medium text-foreground">{paymentResult.subscription?.id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {verifyingPayment && (
                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <Loader2 className="size-5 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Verifying payment status...
                  </span>
                </div>
              )}

              <div className="p-4 bg-surface border border-border rounded-xl">
                <p className="text-sm text-muted mb-2">
                  <strong>Note:</strong> A new tab should have opened with the StarPay payment page. 
                  Please complete your payment there. We'll automatically verify your payment status.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(paymentResult.payment?.paymentUrl, '_blank')}
                  className="w-full"
                >
                  Reopen Payment Page
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Member Selection (Admin only) */}
              {isAdmin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Member <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="member_profile_id"
                    value={formData.member_profile_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a member</option>
                    {members?.map((member) => {
                      const label = `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email || member.id
                      return (
                        <option key={member.id} value={member.id}>
                          {label} {member.email ? `(${member.email})` : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Membership Tier Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Membership Tier <span className="text-red-500">*</span>
                </label>
                
                {/* Warning about mock tier IDs */}
                {membershipTiers && membershipTiers.length > 0 && !membershipTiers[0].id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>⚠️ Configuration Required:</strong> The membership tiers shown are mock data with non-UUID IDs. The backend requires real UUIDs for membership_tier_id. Please configure real membership tiers in the backend database or update the tier IDs to valid UUIDs.
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                      Current tier ID format: {membershipTiers[0].id}
                    </p>
                  </div>
                )}

                {membershipTiers && membershipTiers.length > 0 ? (
                  <div className="grid gap-3">
                    {membershipTiers?.map((tier) => (
                      <div
                        key={tier.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.membership_tier_id === tier.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-surface hover:border-primary/30'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, membership_tier_id: tier.id }))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{tier.name}</h4>
                            <p className="text-sm text-muted">{tier.description || tier.price}</p>
                            <p className="text-xs text-muted">ID: {tier.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">{tier.price}</p>
                            {tier.duration_months && (
                              <p className="text-xs text-muted">{tier.duration_months} months</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Membership tiers not available:</strong> Payment initiation requires real membership tiers from the backend. Please contact your administrator to configure membership tiers.
                    </p>
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Auto Renew */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="auto_renew"
                  id="auto_renew"
                  checked={formData.auto_renew}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50"
                />
                <label htmlFor="auto_renew" className="text-sm text-foreground cursor-pointer">
                  Enable auto-renewal for this subscription
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1 h-12 text-base font-medium"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 mr-2 animate-spin" />
                      Initiating...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

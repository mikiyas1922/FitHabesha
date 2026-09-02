import { useState, useEffect } from 'react'
import { X, Loader2, CreditCard, Calendar, AlertCircle, CheckCircle, Snowflake, XCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { subscriptionService } from '../services/subscriptionService'
import { unwrapResource } from '../utils/apiHelpers'

export function SubscriptionManagementModal({ open, onClose, subscriptionData, members, membershipTiers, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('create') // 'create' or 'status'
  
  const [formData, setFormData] = useState({
    member_profile_id: '',
    membership_tier_id: '',
    start_date: new Date().toISOString().split('T')[0],
    auto_renew: true,
    status: 'active',
  })

  const statusOptions = [
    { value: 'active', label: 'Active', icon: CheckCircle, color: 'green', description: 'Member has full access' },
    { value: 'frozen', label: 'Frozen', icon: Snowflake, color: 'blue', description: 'Temporarily suspended' },
    { value: 'expired', label: 'Expired', icon: XCircle, color: 'red', description: 'Subscription has ended' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'gray', description: 'Member cancelled or admin terminated' },
  ]

  useEffect(() => {
    if (open) {
      if (subscriptionData?.id) {
        // Edit mode - update subscription status
        setMode('status')
        setFormData({
          ...formData,
          status: subscriptionData.status || 'active',
        })
      } else {
        // Create mode - new subscription
        setMode('create')
        setFormData({
          member_profile_id: '',
          membership_tier_id: '',
          start_date: new Date().toISOString().split('T')[0],
          auto_renew: true,
          status: 'active',
        })
      }
      setError('')
    }
  }, [open, subscriptionData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'create') {
        // Create new subscription (Admin/Reception only)
        if (!formData.member_profile_id) {
          throw new Error('Please select a member')
        }
        if (!formData.membership_tier_id) {
          throw new Error('Please select a membership tier')
        }
        if (!formData.start_date) {
          throw new Error('Please select a start date')
        }

        const payload = {
          member_profile_id: formData.member_profile_id,
          membership_tier_id: formData.membership_tier_id,
          start_date: formData.start_date,
          auto_renew: formData.auto_renew,
        }

        const response = await subscriptionService.createSubscription(payload)
        const result = unwrapResource(response)

        if (onSuccess) {
          onSuccess(result)
        }
        onClose()
      } else {
        // Update subscription status
        if (!subscriptionData?.id) {
          throw new Error('Subscription ID is required')
        }

        const payload = {
          status: formData.status,
        }

        const response = await subscriptionService.updateSubscriptionStatus(subscriptionData.id, payload)
        const result = unwrapResource(response)

        if (onSuccess) {
          onSuccess(result)
        }
        onClose()
      }
    } catch (err) {
      console.error('Subscription management error:', err)
      
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
        setError('You do not have permission to manage subscriptions.')
      } else if (err.response?.status === 404) {
        if (mode === 'create') {
          setError('Member or membership tier not found.')
        } else {
          setError('Subscription not found.')
        }
      } else if (err.response?.status === 409) {
        setError('Member already has an active subscription.')
      } else {
        setError(err.message || 'Failed to manage subscription')
      }
    } finally {
      setLoading(false)
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
                  {mode === 'create' ? 'Create Subscription' : 'Update Subscription Status'}
                </h2>
                <p className="text-sm text-muted">
                  {mode === 'create' 
                    ? 'Create a new subscription directly (bypasses payment)' 
                    : 'Change the status of an existing subscription'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-hover text-muted transition-colors"
              disabled={loading}
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
              <AlertCircle className="size-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'create' ? (
            <>
              {/* Member Selection */}
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

              {/* Membership Tier Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Membership Tier <span className="text-red-500">*</span>
                </label>
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
            </>
          ) : (
            <>
              {/* Current Subscription Info */}
              <div className="p-4 bg-surface border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3">Current Subscription</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Member</p>
                    <p className="font-medium text-foreground">
                      {members?.find(m => m.id === subscriptionData?.member_profile_id)?.first_name || 'N/A'} {' '}
                      {members?.find(m => m.id === subscriptionData?.member_profile_id)?.last_name || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Current Status</p>
                    <p className="font-medium text-foreground capitalize">{subscriptionData?.status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted">Start Date</p>
                    <p className="font-medium text-foreground">
                      {subscriptionData?.start_date ? new Date(subscriptionData.start_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Expiry Date</p>
                    <p className="font-medium text-foreground">
                      {subscriptionData?.expiry_date ? new Date(subscriptionData.expiry_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  New Status <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-3">
                  {statusOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <div
                        key={option.value}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.status === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                            : 'border-border bg-surface hover:border-primary/30'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`size-5 text-${option.color}-600 mt-0.5 shrink-0`} />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{option.label}</h4>
                            <p className="text-sm text-muted">{option.description}</p>
                          </div>
                          {formData.status === option.value && (
                            <CheckCircle className={`size-5 text-${option.color}-600 shrink-0`} />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {formData.status === 'frozen' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Freezing a subscription will temporarily suspend member access. The system will automatically set a frozen_until date based on your subscription tier policy.
                  </p>
                </div>
              )}

              {formData.status === 'cancelled' && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Warning:</strong> Cancelling a subscription will immediately terminate the member's access. This action cannot be undone.
                  </p>
                </div>
              )}
            </>
          )}

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
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                mode === 'create' ? 'Create Subscription' : 'Update Status'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Search, Loader2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { paymentService } from '../services/paymentService'
import { unwrapResource } from '../utils/apiHelpers'

export function PaymentVerification({ onPaymentVerified }) {
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState(null)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setPaymentStatus(null)
    setLoading(true)

    try {
      if (!orderId.trim()) {
        throw new Error('Please enter an order ID')
      }

      const response = await paymentService.verifyPayment(orderId.trim())
      const result = unwrapResource(response)
      setPaymentStatus(result)

      // Handle successful payment verification
      if (onPaymentVerified && result?.status === 'PAID') {
        onPaymentVerified(result)
      }
    } catch (err) {
      console.error('Payment verification error:', err)
      
      // Handle specific error codes from API spec
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.')
      } else if (err.response?.status === 404) {
        setError('Payment not found. Please check the order ID.')
      } else {
        setError(err.message || 'Failed to verify payment status')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus?.status) {
      case 'PAID':
        return <CheckCircle className="size-6 text-green-600" />
      case 'PENDING':
        return <Clock className="size-6 text-yellow-600" />
      case 'FAILED':
        return <XCircle className="size-6 text-red-600" />
      default:
        return <AlertCircle className="size-6 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (paymentStatus?.status) {
      case 'PAID':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'PENDING':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'FAILED':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusTextColor = () => {
    switch (paymentStatus?.status) {
      case 'PAID':
        return 'text-green-700 dark:text-green-300'
      case 'PENDING':
        return 'text-yellow-700 dark:text-yellow-300'
      case 'FAILED':
        return 'text-red-700 dark:text-red-300'
      default:
        return 'text-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleVerify} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter StarPay order ID..."
            className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-6"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
          <AlertCircle className="size-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {paymentStatus && (
        <div className={`p-6 border-2 rounded-xl ${getStatusColor()}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getStatusIcon()}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Payment Status</h3>
                <p className={`text-2xl font-bold ${getStatusTextColor()}`}>
                  {paymentStatus.status}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Order ID</p>
                  <p className="font-medium text-foreground">{paymentStatus.order_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted">Amount</p>
                  <p className="font-medium text-foreground">
                    {paymentStatus.amount ? `${paymentStatus.currency || 'ETB'} ${paymentStatus.amount.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted">Last Updated</p>
                  <p className="font-medium text-foreground">
                    {paymentStatus.updated_at 
                      ? new Date(paymentStatus.updated_at).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {paymentStatus.status === 'PENDING' && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> Your payment is still being processed. Please check back in a few minutes or contact support if it takes longer than expected.
                  </p>
                </div>
              )}

              {paymentStatus.status === 'FAILED' && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Action Required:</strong> Your payment has failed. Please try again or contact support for assistance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

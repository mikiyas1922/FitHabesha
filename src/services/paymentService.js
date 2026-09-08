import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const paymentService = {
  /**
   * Initiate a payment for a new subscription
   * Creates a pending subscription and initiates a StarPay payment session
   * @param {Object} paymentData - Payment initiation data
   * @param {string} paymentData.member_profile_id - Member profile UUID
   * @param {string} paymentData.membership_tier_id - Membership tier UUID
   * @param {string} paymentData.start_date - Subscription start date (YYYY-MM-DD)
   * @param {boolean} paymentData.auto_renew - Auto-renew setting
   * @returns {Promise<Object>} Response with subscription and payment details
   */
  initiatePayment: (paymentData) => {
    console.log('paymentService.initiatePayment called with:', paymentData)
    console.log('Endpoint:', API_ENDPOINTS.PAYMENTS.INIT)
    return api.post(API_ENDPOINTS.PAYMENTS.INIT, paymentData)
  },

  /**
   * Verify payment status using StarPay order ID
   * @param {string} orderId - StarPay order ID from payment initiation
   * @returns {Promise<Object>} Payment status information
   */
  verifyPayment: (orderId) => {
    console.log('paymentService.verifyPayment called with orderId:', orderId)
    console.log('Endpoint:', API_ENDPOINTS.PAYMENTS.VERIFY(orderId))
    return api.get(API_ENDPOINTS.PAYMENTS.VERIFY(orderId))
  },
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const paymentService = {
  /**
   * Initiate a payment for a new subscription
   * Creates a pending subscription and initiates a StarPay payment session
   * @param {Object} data - Payment initiation data
   * @param {string} data.member_profile_id - Member profile UUID
   * @param {string} data.membership_tier_id - Membership tier UUID
   * @param {string} data.start_date - Start date (YYYY-MM-DD format)
   * @param {boolean} data.auto_renew - Auto-renewal flag
   * @returns {Promise<Object>} Response with subscription and payment URL
   */
  initiatePayment: (data) => api.post(API_ENDPOINTS.PAYMENTS.INIT, data),

  /**
   * Verify payment status using StarPay order ID
   * @param {string} orderId - StarPay order ID from /init endpoint
   * @returns {Promise<Object>} Payment status data
   */
  verifyPayment: (orderId) => api.get(API_ENDPOINTS.PAYMENTS.VERIFY(orderId)),
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const subscriptionService = {
  /**
   * Create a new subscription (Admin/Reception only)
   * @param {Object} data - Subscription data
   * @returns {Promise<Object>} Created subscription data
   */
  createSubscription: (data) => {
    console.log('subscriptionService.createSubscription called with:', data)
    console.log('Endpoint:', API_ENDPOINTS.SUBSCRIPTIONS.CREATE)
    return api.post(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, data)
  },

  /**
   * Update subscription status (Admin/Reception only)
   * @param {string} subscriptionId - Subscription UUID
   * @param {Object} statusData - Status update data
   * @param {string} statusData.status - New status (active, frozen, expired, cancelled)
   * @returns {Promise<Object>} Updated subscription data
   */
  updateSubscriptionStatus: (subscriptionId, statusData) => {
    console.log('subscriptionService.updateSubscriptionStatus called with:', subscriptionId, statusData)
    console.log('Endpoint:', API_ENDPOINTS.SUBSCRIPTIONS.UPDATE_STATUS(subscriptionId))
    return api.patch(API_ENDPOINTS.SUBSCRIPTIONS.UPDATE_STATUS(subscriptionId), statusData)
  },

  /**
   * Get active subscription for a member
   * @param {string} memberProfileId - Member profile UUID
   * @returns {Promise<Object>} Active subscription data
   */
  getActiveSubscription: (memberProfileId) => {
    console.log('subscriptionService.getActiveSubscription called with:', memberProfileId)
    console.log('Endpoint:', API_ENDPOINTS.SUBSCRIPTIONS.ACTIVE(memberProfileId))
    return api.get(API_ENDPOINTS.SUBSCRIPTIONS.ACTIVE(memberProfileId))
  },

  /**
   * Get all subscriptions for a member
   * @param {string} memberProfileId - Member profile UUID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @returns {Promise<Object>} Paginated subscriptions data
   */
  getMemberAllSubscriptions: (memberProfileId, params = {}) => {
    console.log('subscriptionService.getMemberAllSubscriptions called with:', memberProfileId, params)
    console.log('Endpoint:', API_ENDPOINTS.SUBSCRIPTIONS.MEMBER(memberProfileId))
    return api.get(API_ENDPOINTS.SUBSCRIPTIONS.MEMBER(memberProfileId), { params })
  },

  /**
   * Get subscription by ID (Admin only)
   * @param {string} subscriptionId - Subscription UUID
   * @returns {Promise<Object>} Subscription data
   */
  getAdminSubscriptionById: (subscriptionId) => {
    console.log('subscriptionService.getAdminSubscriptionById called with:', subscriptionId)
    console.log('Endpoint:', API_ENDPOINTS.SUBSCRIPTIONS.ADMIN_DETAIL(subscriptionId))
    return api.get(API_ENDPOINTS.SUBSCRIPTIONS.ADMIN_DETAIL(subscriptionId))
  },
}

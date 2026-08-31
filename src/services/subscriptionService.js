import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const subscriptionService = {
  /**
   * List all subscriptions
   * @returns {Promise<Object>} Response with subscriptions data
   */
  getAllSubscriptions: () => api.get(API_ENDPOINTS.SUBSCRIPTIONS.LIST),

  /**
   * Get a single subscription by ID
   * @param {string} subscriptionId - Subscription UUID
   * @returns {Promise<Object>} Subscription data
   */
  getSubscriptionById: (subscriptionId) => api.get(API_ENDPOINTS.SUBSCRIPTIONS.DETAIL(subscriptionId)),

  /**
   * Create a new subscription (Admin/Reception only)
   * Creates a subscription directly (bypassing payment)
   * @param {Object} data - Subscription data
   * @param {string} data.member_profile_id - Member profile UUID
   * @param {string} data.membership_tier_id - Membership tier UUID
   * @param {string} data.start_date - Start date (YYYY-MM-DD format)
   * @param {boolean} data.auto_renew - Auto-renewal flag
   * @returns {Promise<Object>} Created subscription data
   */
  createSubscription: (data) => api.post(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, data),

  /**
   * Update an existing subscription
   * @param {string} subscriptionId - Subscription UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated subscription data
   */
  updateSubscription: (subscriptionId, data) => api.put(API_ENDPOINTS.SUBSCRIPTIONS.UPDATE(subscriptionId), data),

  /**
   * Delete a subscription
   * @param {string} subscriptionId - Subscription UUID
   * @returns {Promise<Object>} Deletion response
   */
  deleteSubscription: (subscriptionId) => api.delete(API_ENDPOINTS.SUBSCRIPTIONS.DELETE(subscriptionId)),

  /**
   * Get active subscription for a member
   * @param {string} memberProfileId - Member profile UUID
   * @returns {Promise<Object>} Active subscription data
   */
  getActiveSubscription: (memberProfileId) => api.get(API_ENDPOINTS.SUBSCRIPTIONS.ACTIVE(memberProfileId)),

  /**
   * Get all subscriptions for a member (historical and current)
   * @param {string} memberProfileId - Member profile UUID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @returns {Promise<Object>} Member subscriptions with pagination
   */
  getMemberSubscriptions: (memberProfileId, params = {}) => api.get(API_ENDPOINTS.SUBSCRIPTIONS.MEMBER(memberProfileId), params),

  /**
   * Update subscription status (Admin/Reception only)
   * @param {string} subscriptionId - Subscription UUID
   * @param {Object} data - Status update data
   * @param {string} data.status - New status (active, frozen, expired, cancelled)
   * @returns {Promise<Object>} Updated subscription data
   */
  updateSubscriptionStatus: (subscriptionId, data) => api.patch(API_ENDPOINTS.SUBSCRIPTIONS.UPDATE_STATUS(subscriptionId), data),
}

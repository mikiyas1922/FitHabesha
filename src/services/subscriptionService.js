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
   * Create a new subscription
   * @param {Object} data - Subscription data
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
   * Get subscriptions for a specific member
   * @param {string} memberId - Member UUID
   * @returns {Promise<Object>} Member subscriptions
   */
  getMemberSubscriptions: (memberId) => api.get(`${API_ENDPOINTS.MEMBERS.DETAIL(memberId)}/subscriptions`),
}

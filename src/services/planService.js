import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

export const planService = {
  /**
   * Get all membership plans
   * @returns {Promise<Object>} Response with plans data
   */
  getAllPlans: () => api.get(API_ENDPOINTS.PLANS.LIST),

  /**
   * Get a single plan by ID
   * @param {string} planId - Plan UUID
   * @returns {Promise<Object>} Plan data
   */
  getPlanById: (planId) => api.get(API_ENDPOINTS.PLANS.DETAIL(planId)),

  /**
   * Create a new plan
   * @param {Object} data - Plan data
   * @returns {Promise<Object>} Created plan data
   */
  createPlan: (data) => api.post(API_ENDPOINTS.PLANS.CREATE, data),

  /**
   * Update an existing plan
   * @param {string} planId - Plan UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated plan data
   */
  updatePlan: (planId, data) => api.put(API_ENDPOINTS.PLANS.UPDATE(planId), data),

  /**
   * Delete a plan
   * @param {string} planId - Plan UUID
   * @returns {Promise<Object>} Deletion response
   */
  deletePlan: (planId) => api.delete(API_ENDPOINTS.PLANS.DELETE(planId)),

  unwrapResponse(response) {
    return unwrapResource(response)
  },
}
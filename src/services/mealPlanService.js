import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const mealPlanService = {
  /**
   * List all meal plans
   * @returns {Promise<Object>} Response with meal plans data
   */
  getAllMealPlans: () => api.get(API_ENDPOINTS.MEAL_PLANS.LIST),

  /**
   * Get a single meal plan by ID
   * @param {string} mealPlanId - Meal Plan UUID
   * @returns {Promise<Object>} Meal plan data
   */
  getMealPlanById: (mealPlanId) => api.get(API_ENDPOINTS.MEAL_PLANS.DETAIL(mealPlanId)),

  /**
   * Create a new meal plan
   * @param {Object} data - Meal plan data
   * @returns {Promise<Object>} Created meal plan data
   */
  createMealPlan: (data) => api.post(API_ENDPOINTS.MEAL_PLANS.CREATE, data),

  /**
   * Update an existing meal plan
   * @param {string} mealPlanId - Meal Plan UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated meal plan data
   */
  updateMealPlan: (mealPlanId, data) => api.put(API_ENDPOINTS.MEAL_PLANS.UPDATE(mealPlanId), data),

  /**
   * Delete a meal plan
   * @param {string} mealPlanId - Meal Plan UUID
   * @returns {Promise<Object>} Deletion response
   */
  deleteMealPlan: (mealPlanId) => api.delete(API_ENDPOINTS.MEAL_PLANS.DELETE(mealPlanId)),

  /**
   * Get meal plans for a specific trainer
   * @param {string} trainerId - Trainer UUID
   * @returns {Promise<Object>} Trainer meal plans
   */
  getTrainerMealPlans: (trainerId) => api.get(`${API_ENDPOINTS.TRAINERS.DETAIL(trainerId)}/meal-plans`),

  /**
   * Get meal plans for a specific member
   * @param {string} memberId - Member UUID
   * @returns {Promise<Object>} Member meal plans
   */
  getMemberMealPlans: (memberId) => api.get(`${API_ENDPOINTS.MEMBERS.DETAIL(memberId)}/meal-plans`),
}

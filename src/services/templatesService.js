import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const templatesService = {
  getWorkoutTemplates: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.trainer_id && { trainer_id: filters.trainer_id }),
      ...(filters.goal_type && { goal_type: filters.goal_type }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.include_public !== undefined && { include_public: filters.include_public }),
    }
    return api.get(API_ENDPOINTS.TEMPLATES.WORKOUT_LIST, params)
  },

  listWorkoutTemplates: async (filters = {}) => {
    const response = await templatesService.getWorkoutTemplates(filters)
    // Backend returns { success: true, data: [...], message: "..." }
    return response.data || []
  },

  getWorkoutTemplateById: async (id) => {
    const response = await api.get(API_ENDPOINTS.TEMPLATES.WORKOUT_DETAIL(id))
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  createWorkoutTemplate: async (templateData) => {
    const response = await api.post(API_ENDPOINTS.TEMPLATES.WORKOUT_CREATE, templateData)
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  updateWorkoutTemplate: async (id, updates) => {
    const response = await api.patch(API_ENDPOINTS.TEMPLATES.WORKOUT_UPDATE(id), updates)
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  deleteWorkoutTemplate: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TEMPLATES.WORKOUT_DELETE(id))
    // Backend returns { success: true, data: { message: "..." }, message: "..." }
    return response
  },

  getMealPlans: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.trainer_id && { trainer_id: filters.trainer_id }),
      ...(filters.goal_type && { goal_type: filters.goal_type }),
    }
    return api.get(API_ENDPOINTS.TEMPLATES.MEAL_LIST, params)
  },

  listMealPlans: async (filters = {}) => {
    const response = await templatesService.getMealPlans(filters)
    // Backend returns { success: true, data: [...], message: "..." }
    return response.data || []
  },

  getMealPlanById: async (id) => {
    const response = await api.get(API_ENDPOINTS.TEMPLATES.MEAL_DETAIL(id))
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  createMealPlan: async (mealData) => {
    const response = await api.post(API_ENDPOINTS.TEMPLATES.MEAL_CREATE, mealData)
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  updateMealPlan: async (id, updates) => {
    const response = await api.patch(API_ENDPOINTS.TEMPLATES.MEAL_UPDATE(id), updates)
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  deleteMealPlan: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TEMPLATES.MEAL_DELETE(id))
    // Backend returns { success: true, data: { message: "..." }, message: "..." }
    return response
  },
}

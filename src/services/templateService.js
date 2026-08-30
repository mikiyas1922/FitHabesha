import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Normalize a workout template from the API into a predictable shape.
 */
function normalizeWorkoutTemplate(raw = {}) {
  return {
    id: raw._id || raw.id || null,
    trainer_id: raw.trainer_id || null,
    name: raw.name || '',
    description: raw.description || '',
    difficulty: raw.difficulty || 'beginner',
    goal_type: raw.goal_type || 'general_fitness',
    duration_weeks: raw.duration_weeks || 0,
    is_public: raw.is_public ?? false,
    exercises: Array.isArray(raw.exercises) ? raw.exercises.map(ex => ({
      day_number: ex.day_number || 0,
      exercise_name: ex.exercise_name || '',
      sets: ex.sets || 0,
      reps_per_set: ex.reps_per_set || 0,
      weight_kg: ex.weight_kg || 0,
      rest_seconds: ex.rest_seconds || 0,
      notes: ex.notes || '',
    })) : [],
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
  }
}

/**
 * Normalize a meal template from the API into a predictable shape.
 */
function normalizeMealTemplate(raw = {}) {
  // Handle both 'items' and 'meals' field names from API
  const mealsData = Array.isArray(raw.items) ? raw.items : Array.isArray(raw.meals) ? raw.meals : []
  
  return {
    id: raw._id || raw.id || null,
    trainer_id: raw.trainer_id || null,
    name: raw.name || '',
    description: raw.description || '',
    goal_type: raw.goal_type || 'general_fitness',
    duration_weeks: raw.duration_weeks || 0,
    is_public: raw.is_public ?? false,
    calories_target: raw.calories_target || 0,
    protein_g: raw.protein_g || 0,
    carbs_g: raw.carbs_g || 0,
    fat_g: raw.fat_g || 0,
    meals: mealsData.map(meal => ({
      day_number: meal.day_number || 0,
      meal_type: meal.meal_name || meal.meal_type || '',
      food_items: Array.isArray(meal.food_items) ? meal.food_items : (meal.food_item ? [meal.food_item] : []),
      calories: meal.calories || 0,
      protein_g: meal.protein_g || 0,
      carbs_g: meal.carbs_g || 0,
      fat_g: meal.fat_g || 0,
      quantity: meal.quantity || '',
    })),
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
  }
}

export const templateService = {
  /**
   * GET /templates/workout
   * List workout templates with optional filters.
   * Query params: trainer_id, goal_type, difficulty, include_public, page, limit
   */
  async getWorkoutTemplates(filters = {}) {
    const params = {}
    if (filters.trainer_id) params.trainer_id = filters.trainer_id
    if (filters.goal_type) params.goal_type = filters.goal_type
    if (filters.difficulty) params.difficulty = filters.difficulty
    if (filters.include_public !== undefined) params.include_public = filters.include_public
    params.page = filters.page || 1
    params.limit = filters.limit || 20

    const response = await api.get(API_ENDPOINTS.TEMPLATES.WORKOUT_LIST, params)
    const data = response?.data?.data ?? response?.data ?? []
    const items = Array.isArray(data) ? data : []

    return {
      items: items.map(normalizeWorkoutTemplate),
      pagination: response?.data?.pagination || { page: 1, limit: 20, total: items.length, totalPages: 1 },
    }
  },

  /**
   * POST /templates/workout
   * Create a new workout template.
   */
  async createWorkoutTemplate(templateData) {
    const body = {
      trainer_id: templateData.trainer_id,
      name: templateData.name,
      description: templateData.description || '',
      difficulty: templateData.difficulty || 'beginner',
      goal_type: templateData.goal_type || 'general_fitness',
      duration_weeks: templateData.duration_weeks || 0,
      is_public: templateData.is_public ?? false,
      exercises: Array.isArray(templateData.exercises) ? templateData.exercises : [],
    }

    const response = await api.post(API_ENDPOINTS.TEMPLATES.WORKOUT_CREATE, body)
    const data = response?.data?.data ?? response?.data ?? {}
    return {
      success: response?.success !== false,
      data: normalizeWorkoutTemplate(data),
      message: response?.message || 'Workout template created successfully.',
    }
  },

  /**
   * GET /templates/workout/{id}
   * Get a single workout template by ID.
   */
  async getWorkoutTemplate(id) {
    const response = await api.get(API_ENDPOINTS.TEMPLATES.WORKOUT_DETAIL(id))
    const data = response?.data?.data ?? response?.data ?? {}
    return normalizeWorkoutTemplate(data)
  },

  /**
   * PATCH /templates/workout/{id}
   * Update a workout template.
   */
  async updateWorkoutTemplate(id, updates) {
    const response = await api.patch(API_ENDPOINTS.TEMPLATES.WORKOUT_UPDATE(id), updates)
    const data = response?.data?.data ?? response?.data ?? {}
    return {
      success: response?.success !== false,
      data: normalizeWorkoutTemplate(data),
      message: response?.message || 'Workout template updated successfully.',
    }
  },

  /**
   * DELETE /templates/workout/{id}
   * Delete a workout template.
   */
  async deleteWorkoutTemplate(id) {
    const response = await api.delete(API_ENDPOINTS.TEMPLATES.WORKOUT_DELETE(id))
    return {
      success: response?.success !== false,
      message: response?.message || 'Workout template deleted successfully.',
    }
  },

  /**
   * GET /templates/meal
   * List meal templates with optional filters.
   * Query params: trainer_id, goal_type, include_public, page, limit
   */
  async getMealTemplates(filters = {}) {
    const params = {}
    if (filters.trainer_id) params.trainer_id = filters.trainer_id
    if (filters.goal_type) params.goal_type = filters.goal_type
    if (filters.include_public !== undefined) params.include_public = filters.include_public
    params.page = filters.page || 1
    params.limit = filters.limit || 20

    const response = await api.get(API_ENDPOINTS.TEMPLATES.MEAL_LIST, params)
    const data = response?.data?.data ?? response?.data ?? []
    const items = Array.isArray(data) ? data : []

    return {
      items: items.map(normalizeMealTemplate),
      pagination: response?.data?.pagination || { page: 1, limit: 20, total: items.length, totalPages: 1 },
    }
  },

  /**
   * POST /templates/meal
   * Create a new meal template.
   */
  async createMealTemplate(templateData) {
    const body = {
      trainer_id: templateData.trainer_id,
      name: templateData.name,
      description: templateData.description || '',
      goal_type: templateData.goal_type || 'general_fitness',
      duration_weeks: templateData.duration_weeks || 0,
      is_public: templateData.is_public ?? false,
      meals: Array.isArray(templateData.meals) ? templateData.meals : [],
    }

    const response = await api.post(API_ENDPOINTS.TEMPLATES.MEAL_CREATE, body)
    const data = response?.data?.data ?? response?.data ?? {}
    return {
      success: response?.success !== false,
      data: normalizeMealTemplate(data),
      message: response?.message || 'Meal template created successfully.',
    }
  },

  /**
   * GET /templates/meal/{id}
   * Get a single meal template by ID.
   */
  async getMealTemplate(id) {
    const response = await api.get(API_ENDPOINTS.TEMPLATES.MEAL_DETAIL(id))
    const data = response?.data?.data ?? response?.data ?? {}
    return normalizeMealTemplate(data)
  },

  /**
   * PATCH /templates/meal/{id}
   * Update a meal template.
   */
  async updateMealTemplate(id, updates) {
    const response = await api.patch(API_ENDPOINTS.TEMPLATES.MEAL_UPDATE(id), updates)
    const data = response?.data?.data ?? response?.data ?? {}
    return {
      success: response?.success !== false,
      data: normalizeMealTemplate(data),
      message: response?.message || 'Meal template updated successfully.',
    }
  },

  /**
   * DELETE /templates/meal/{id}
   * Delete a meal template.
   */
  async deleteMealTemplate(id) {
    const response = await api.delete(API_ENDPOINTS.TEMPLATES.MEAL_DELETE(id))
    return {
      success: response?.success !== false,
      message: response?.message || 'Meal template deleted successfully.',
    }
  },
}

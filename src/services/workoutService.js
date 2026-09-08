import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const workoutService = {
  /**
   * List all workouts
   * @returns {Promise<Object>} Response with workouts data
   */
  getAllWorkouts: () => api.get(API_ENDPOINTS.WORKOUTS.LIST),

  /**
   * Get a single workout by ID
   * @param {string} workoutId - Workout UUID
   * @returns {Promise<Object>} Workout data
   */
  getWorkoutById: (workoutId) => api.get(API_ENDPOINTS.WORKOUTS.DETAIL(workoutId)),

  /**
   * Create a new workout
   * @param {Object} data - Workout data
   * @returns {Promise<Object>} Created workout data
   */
  createWorkout: (data) => api.post(API_ENDPOINTS.WORKOUTS.CREATE, data),

  /**
   * Update an existing workout
   * @param {string} workoutId - Workout UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated workout data
   */
  updateWorkout: (workoutId, data) => api.put(API_ENDPOINTS.WORKOUTS.UPDATE(workoutId), data),

  /**
   * Delete a workout
   * @param {string} workoutId - Workout UUID
   * @returns {Promise<Object>} Deletion response
   */
  deleteWorkout: (workoutId) => api.delete(API_ENDPOINTS.WORKOUTS.DELETE(workoutId)),

  /**
   * Get workouts for a specific trainer
   * @param {string} trainerId - Trainer UUID
   * @returns {Promise<Object>} Trainer workouts
   */
  getTrainerWorkouts: (trainerId) => api.get(`${API_ENDPOINTS.TRAINERS.DETAIL(trainerId)}/workouts`),

  /**
   * Get workouts for a specific member
   * @param {string} memberId - Member UUID
   * @returns {Promise<Object>} Member workouts
   */
  getMemberWorkouts: (memberId) => api.get(`${API_ENDPOINTS.MEMBERS.DETAIL(memberId)}/workouts`),
}

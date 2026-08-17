import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const classesService = {
  /**
   * List all classes with optional filters
   * @param {Object} filters - Optional filters
   * @param {string} filters.date - Filter by date (YYYY-MM-DD)
   * @param {string} filters.discipline - Filter by discipline (yoga, pilates, hiit, spin, strength, dance, other)
   * @param {string} filters.trainer_id - Filter by trainer ID
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.limit - Items per page (default: 20)
   * @returns {Promise<Object>} Response with success, count, and data array
   */
  getClasses: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.date && { date: filters.date }),
      ...(filters.discipline && { discipline: filters.discipline }),
      ...(filters.trainer_id && { trainer_id: filters.trainer_id }),
    }
    console.log('Fetching classes with params:', params)
    return await api.get(API_ENDPOINTS.CLASSES.LIST, params)
  },

  /**
   * Get a single class by ID
   * @param {string} classId - Class UUID
   * @returns {Promise<Object>} Class data
   */
  getClassById: async (classId) => {
    return await api.get(API_ENDPOINTS.CLASSES.DETAIL(classId))
  },

  /**
   * Create a new class (Admin or Trainer only)
   * @param {Object} classData - Class data
   * @param {string} classData.trainer_id - Trainer UUID
   * @param {string} classData.name - Class name
   * @param {string} classData.description - Class description
   * @param {string} classData.category - Class category (yoga, pilates, hiit, spin, strength, dance, other)
   * @param {string} classData.difficulty - Difficulty level
   * @param {number} classData.capacity - Maximum capacity
   * @param {string} classData.start_time - Start time (ISO 8601)
   * @param {string} classData.end_time - End time (ISO 8601)
   * @param {string} classData.location - Location
   * @returns {Promise<Object>} Created class data
   */
  createClass: async (classData) => {
    return await api.post(API_ENDPOINTS.CLASSES.CREATE, classData)
  },

  /**
   * Update an existing class (Admin or Trainer only)
   * @param {string} classId - Class UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated class data
   */
  updateClass: async (classId, updates) => {
    return await api.patch(API_ENDPOINTS.CLASSES.UPDATE(classId), updates)
  },

  /**
   * Delete a class (if endpoint exists)
   * @param {string} classId - Class UUID
   * @returns {Promise<Object>} Deletion response
   */
  deleteClass: async (classId) => {
    return await api.delete(API_ENDPOINTS.CLASSES.DELETE(classId))
  },
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { normalizeListResponse } from '../utils/apiHelpers'

export const classesService = {
  getClasses: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.date && { date: filters.date }),
      ...(filters.discipline && { discipline: filters.discipline }),
      ...(filters.trainer_id && { trainer_id: filters.trainer_id }),
    }
    return api.get(API_ENDPOINTS.CLASSES.LIST, params)
  },

  listClasses: async (filters = {}) => {
    const response = await classesService.getClasses(filters)
    return normalizeListResponse(response)
  },

  getClassById: async (classId) => api.get(API_ENDPOINTS.CLASSES.DETAIL(classId)),

  createClass: async (classData) => api.post(API_ENDPOINTS.CLASSES.CREATE, classData),

  updateClass: async (classId, updates) => api.patch(API_ENDPOINTS.CLASSES.UPDATE(classId), updates),

  /** No DELETE /classes/{id} — cancel via PATCH status. */
  cancelClass: async (classId) =>
    api.patch(API_ENDPOINTS.CLASSES.UPDATE(classId), { status: 'cancelled' }),
}

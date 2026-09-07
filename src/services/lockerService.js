import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const lockerService = {
  getAllLockers: () => api.get(API_ENDPOINTS.LOCKERS.LIST),

  getLockerById: (id) => api.get(API_ENDPOINTS.LOCKERS.DETAIL(id)),

  createLocker: (data) => api.post(API_ENDPOINTS.LOCKERS.CREATE, data),

  updateLocker: (id, data) => api.put(API_ENDPOINTS.LOCKERS.UPDATE(id), data),

  deleteLocker: (id) => api.delete(API_ENDPOINTS.LOCKERS.DELETE(id)),

  assignLocker: (id, memberId) =>
    api.post(`${API_ENDPOINTS.LOCKERS.DETAIL(id)}/assign`, { member_id: memberId }),

  releaseLocker: (id) => api.post(`${API_ENDPOINTS.LOCKERS.DETAIL(id)}/release`),
}

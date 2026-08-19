import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

export const trainerService = {
  getAllTrainers: (params = {}) => api.get(API_ENDPOINTS.TRAINERS.LIST, params),

  getCurrentTrainerProfile: () => api.get(API_ENDPOINTS.TRAINERS.ME),

  getTrainerById: (id) => api.get(API_ENDPOINTS.TRAINERS.DETAIL(id)),

  /** PATCH /trainers/{id} */
  updateTrainer: (id, data) => api.patch(API_ENDPOINTS.TRAINERS.UPDATE(id), data),

  getTrainerSchedule: (id, params = {}) => api.get(API_ENDPOINTS.TRAINERS.SCHEDULE(id), params),

  getTrainerRoster: (id) => api.get(API_ENDPOINTS.TRAINERS.ROSTER(id)),

  getClassRoster: (trainerId, classId) =>
    api.get(API_ENDPOINTS.TRAINERS.CLASS_ROSTER(trainerId, classId)),

  getTrainerFeedback: (id) => api.get(API_ENDPOINTS.TRAINERS.FEEDBACK(id)),

  recordAttendance: (memberProfileId, data = {}) =>
    api.post(API_ENDPOINTS.TRAINERS.ATTENDANCE(memberProfileId), data),

  unwrapProfile(response) {
    return unwrapResource(response)
  },
}

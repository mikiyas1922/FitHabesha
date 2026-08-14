import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const trainerService = {
  getAllTrainers: () => api.get(API_ENDPOINTS.TRAINERS.LIST),

  getTrainerById: (id) => api.get(API_ENDPOINTS.TRAINERS.DETAIL(id)),

  createTrainer: (data) => api.post(API_ENDPOINTS.TRAINERS.CREATE, data),

  updateTrainer: (id, data) => api.put(API_ENDPOINTS.TRAINERS.UPDATE(id), data),

  deleteTrainer: (id) => api.delete(API_ENDPOINTS.TRAINERS.DELETE(id)),

  getTrainerClients: (id) => api.get(API_ENDPOINTS.TRAINERS.CLIENTS(id)),

  getTrainerWorkouts: (id) => api.get(`${API_ENDPOINTS.TRAINERS.DETAIL(id)}/workouts`),

  getTrainerMealPlans: (id) => api.get(`${API_ENDPOINTS.TRAINERS.DETAIL(id)}/meal-plans`),
}

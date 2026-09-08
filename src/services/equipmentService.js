import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const equipmentService = {
  getAllEquipment: () => api.get(API_ENDPOINTS.EQUIPMENT.LIST),

  getEquipmentById: (id) => api.get(API_ENDPOINTS.EQUIPMENT.DETAIL(id)),

  createEquipment: (data) => api.post(API_ENDPOINTS.EQUIPMENT.CREATE, data),

  updateEquipment: (id, data) => api.put(API_ENDPOINTS.EQUIPMENT.UPDATE(id), data),

  deleteEquipment: (id) => api.delete(API_ENDPOINTS.EQUIPMENT.DELETE(id)),

  updateEquipmentStatus: (id, status) =>
    api.patch(`${API_ENDPOINTS.EQUIPMENT.DETAIL(id)}/status`, { status }),
}

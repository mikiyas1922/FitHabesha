import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const memberService = {
  getAllMembers: () => api.get(API_ENDPOINTS.MEMBERS.LIST),

  getMemberById: (id) => api.get(API_ENDPOINTS.MEMBERS.DETAIL(id)),

  createMember: (data) => api.post(API_ENDPOINTS.MEMBERS.CREATE, data),

  updateMember: (id, data) => api.put(API_ENDPOINTS.MEMBERS.UPDATE(id), data),

  deleteMember: (id) => api.delete(API_ENDPOINTS.MEMBERS.DELETE(id)),

  getMemberProfile: (id) => api.get(API_ENDPOINTS.MEMBERS.PROFILE(id)),

  updateMemberProfile: (id, data) => api.put(API_ENDPOINTS.MEMBERS.PROFILE(id), data),

  getMemberSubscriptions: (memberId) =>
    api.get(`${API_ENDPOINTS.MEMBERS.DETAIL(memberId)}/subscriptions`),
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const memberService = {
  /**
   * List all members (Admin/Reception only).
   * @param {Object} filters
   * @param {number} [filters.page=1]
   * @param {number} [filters.limit=20]
   * @param {string} [filters.search] - name, email, or unique member ID
   * @param {'active'|'inactive'} [filters.status]
   */
  getAllMembers: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
    }
    return api.get(API_ENDPOINTS.MEMBERS.LIST, params)
  },

  getCurrentMemberProfile: () => api.get('/members/me'),

  getMemberById: (id) => api.get(API_ENDPOINTS.MEMBERS.DETAIL(id)),

  getMemberByUserId: (userId) => api.get(API_ENDPOINTS.MEMBERS.BY_USER_ID(userId)),

  getMemberByUniqueId: (uniqueMemberId) => api.get(API_ENDPOINTS.MEMBERS.BY_UNIQUE_ID(uniqueMemberId)),

  createMember: (data) => api.post(API_ENDPOINTS.MEMBERS.CREATE, data),

  updateMember: (id, data) => api.put(API_ENDPOINTS.MEMBERS.UPDATE(id), data),

  deleteMember: (id) => api.delete(API_ENDPOINTS.MEMBERS.DELETE(id)),

  getMemberProfile: (id) => api.get(API_ENDPOINTS.MEMBERS.PROFILE(id)),

  updateMemberProfile: (id, data) => api.patch(API_ENDPOINTS.MEMBERS.UPDATE(id), data),

  getCheckinMemberByUniqueId: (uniqueId) => api.get(API_ENDPOINTS.CHECKIN.MEMBER_BY_UNIQUE_ID(uniqueId)),

  getMemberSubscriptions: (memberId) =>
    api.get(`${API_ENDPOINTS.MEMBERS.DETAIL(memberId)}/subscriptions`),
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

export const memberService = {
  getCurrentMemberProfile: () => api.get(API_ENDPOINTS.MEMBERS.ME),

  getAllMembers: (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
    }
    return api.get(API_ENDPOINTS.MEMBERS.LIST, params)
  },

  getMemberById: (id) => api.get(API_ENDPOINTS.MEMBERS.DETAIL(id)),

  getMemberByUserId: (userId) => api.get(API_ENDPOINTS.MEMBERS.BY_USER_ID(userId)),

  getMemberByUniqueId: (uniqueMemberId) => api.get(API_ENDPOINTS.MEMBERS.BY_UNIQUE_ID(uniqueMemberId)),

  /** PATCH /members/{id} — member own profile, or admin/reception any member. */
  updateMember: (id, data) => api.patch(API_ENDPOINTS.MEMBERS.UPDATE(id), data),

  /** PATCH /members/me — update current member's own profile (alternative endpoint) */
  updateCurrentMember: (data) => api.patch(API_ENDPOINTS.MEMBERS.ME, data),

  updateMemberProfile: (id, data) => api.patch(API_ENDPOINTS.MEMBERS.UPDATE(id), data),

  unwrapProfile(response) {
    return unwrapResource(response)
  },
}

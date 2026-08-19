import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const memberService = {
  /**
   * Get current member profile (authenticated member)
   * @returns {Promise<Object>} Current member profile
   */
  getCurrentMemberProfile: () => api.get(API_ENDPOINTS.MEMBERS.ME),

  /**
   * List all members (Admin/Reception only)
   * @param {Object} filters
   * @param {number} [filters.page=1]
   * @param {number} [filters.limit=20]
   * @param {string} [filters.search] - name, email, or unique member ID
   * @param {'active'|'inactive'} [filters.status]
   */
  getAllMembers: (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
    }
    return api.get(API_ENDPOINTS.MEMBERS.LIST, params)
  },

  /**
   * Get member by ID
   * @param {string} id - Member profile UUID
   * @returns {Promise<Object>} Member profile
   */
  getMemberById: (id) => api.get(API_ENDPOINTS.MEMBERS.DETAIL(id)),

  /**
   * Get member by user ID (Admin/Reception only)
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Member profile
   */
  getMemberByUserId: (userId) => api.get(API_ENDPOINTS.MEMBERS.BY_USER_ID(userId)),

  /**
   * Get member by unique member ID (GYM-XXXX-X)
   * @param {string} uniqueMemberId - Unique member ID
   * @returns {Promise<Object>} Member profile
   */
  getMemberByUniqueId: (uniqueMemberId) => api.get(API_ENDPOINTS.MEMBERS.BY_UNIQUE_ID(uniqueMemberId)),

  /**
   * Update member profile (PATCH)
   * @param {string} id - Member profile UUID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated member profile
   */
  updateMember: (id, data) => api.patch(API_ENDPOINTS.MEMBERS.UPDATE(id), data),

  /**
   * Update current member profile (PATCH /members/me)
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated member profile
   */
  updateCurrentMemberProfile: (data) => api.patch(API_ENDPOINTS.MEMBERS.ME, data),

  /**
   * Get member subscriptions
   * @param {string} memberId - Member profile UUID
   * @returns {Promise<Object>} Member subscriptions
   */
  getMemberSubscriptions: (memberId) =>
    api.get(`${API_ENDPOINTS.MEMBERS.DETAIL(memberId)}/subscriptions`),
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { normalizeListResponse, unwrapResource } from '../utils/apiHelpers'

function wrapCheckinError(error) {
  if (error?.status === 401) {
    return {
      message: 'Your session expired. Please sign in again.',
      status: 401,
    }
  }

  if (error?.status === 403) {
    return {
      message: error?.message || 'Access denied. Check-in requires reception or admin access, or an active subscription.',
      status: 403,
    }
  }

  return error
}

export const checkinService = {
  async lookupMember(uniqueId) {
    try {
      const response = await api.get(API_ENDPOINTS.CHECKIN.MEMBER_BY_UNIQUE_ID(uniqueId))
      return unwrapResource(response)
    } catch (error) {
      throw wrapCheckinError(error)
    }
  },

  async checkIn(uniqueId) {
    try {
      return await api.post(API_ENDPOINTS.CHECKIN.CHECKIN(uniqueId), {})
    } catch (error) {
      throw wrapCheckinError(error)
    }
  },

  async overrideCheckIn(uniqueId, reason) {
    try {
      return await api.post(API_ENDPOINTS.CHECKIN.OVERRIDE(uniqueId), { reason })
    } catch (error) {
      throw wrapCheckinError(error)
    }
  },

  async getHistory(memberProfileId, limit = 50) {
    try {
      const response = await api.get(API_ENDPOINTS.CHECKIN.HISTORY(memberProfileId), { limit })
      return normalizeListResponse(response)
    } catch (error) {
      throw wrapCheckinError(error)
    }
  },

  async getTodayCheckins() {
    try {
      const response = await api.get(API_ENDPOINTS.CHECKIN.TODAY)
      const payload = response?.data || response
      const data = Array.isArray(payload?.data)
        ? payload.data
        : normalizeListResponse(response)

      return {
        success: true,
        data,
        count: payload?.count ?? data.length,
        message: response?.message || 'Check-ins retrieved successfully',
      }
    } catch (error) {
      throw wrapCheckinError(error)
    }
  },
}

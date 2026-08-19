import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { normalizeListResponse } from '../utils/apiHelpers'

function wrapCheckinError(error) {
  if (error?.status === 401) {
    return {
      message: 'Your session expired. Please sign in again.',
      status: 401,
    }
  }

  if (error?.status === 403) {
    return {
      message: 'Access denied. Only admin and reception staff can view check-ins.',
      status: 403,
    }
  }

  return error
}

export const checkinService = {
  async getTodayCheckins() {
    try {
      const response = await api.get(API_ENDPOINTS.CHECKIN.TODAY)
      
      // Handle the response structure from the API
      // API returns: { success: true, data: { count: 0, data: [...] }, message: "..." }
      if (response?.data?.data?.data) {
        return {
          success: true,
          data: response.data.data.data,
          count: response.data.data.count || response.data.data.data.length,
          message: response.data.message || 'Check-ins retrieved successfully'
        }
      }
      
      // Fallback for different response structures
      const data = normalizeListResponse(response)
      return {
        success: true,
        data: data,
        count: data.length,
        message: 'Check-ins retrieved successfully'
      }
    } catch (error) {
      throw wrapCheckinError(error)
    }
  },
}

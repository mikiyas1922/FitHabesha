import apiClient from '../apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource, normalizeListResponse } from '../utils/apiHelpers'

export const reportService = {
  // Get dashboard report data
  getDashboardReport: async () => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.DASHBOARD)
    return unwrapResource(response)
  },

  // Get revenue report data
  getRevenueReport: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.REVENUE, { params })
    return unwrapResource(response)
  },

  // Get attendance report data
  getAttendanceReport: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.ATTENDANCE, { params })
    return unwrapResource(response)
  },
}

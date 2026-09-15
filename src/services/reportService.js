import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource, normalizeListResponse } from '../utils/apiHelpers'

export const reportService = {
  // Get dashboard report data
  getDashboardReport: async () => {
    try {
      const endpoint = API_ENDPOINTS.REPORTS?.DASHBOARD || '/reports/dashboard'
      console.log('Dashboard endpoint:', endpoint)
      const response = await api.get(endpoint)
      return unwrapResource(response)
    } catch (error) {
      console.log('Dashboard report endpoint not available, returning null')
      return { data: null }
    }
  },

  // Get revenue report data
  getRevenueReport: async (params = {}) => {
    try {
      const endpoint = API_ENDPOINTS.REPORTS?.REVENUE || '/reports/revenue'
      console.log('Revenue endpoint:', endpoint, 'params:', params)
      const response = await api.get(endpoint, params)
      return unwrapResource(response)
    } catch (error) {
      console.log('Revenue report endpoint not available, returning null')
      return { data: null }
    }
  },

  // Get attendance report data
  getAttendanceReport: async (params = {}) => {
    try {
      const endpoint = API_ENDPOINTS.REPORTS?.ATTENDANCE || '/reports/attendance'
      console.log('Attendance endpoint:', endpoint, 'params:', params)
      const response = await api.get(endpoint, params)
      return unwrapResource(response)
    } catch (error) {
      console.log('Attendance report endpoint not available, returning null')
      return { data: null }
    }
  },
}

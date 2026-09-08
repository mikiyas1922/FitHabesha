import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const healthMetricsService = {
  async saveHealthMetrics(metricsData) {
    const response = await api.post(API_ENDPOINTS.HEALTH_METRICS.CREATE, metricsData)
    // Backend returns { success: true, data: {...}, message }
    return response.data
  },

  async getLatestMetrics(memberId) {
    const response = await api.get(API_ENDPOINTS.HEALTH_METRICS.LATEST(memberId))
    // Backend returns { success: true, data: {...}, message }
    return response.data
  },

  async getMetricsHistory(memberId, params = {}) {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
    }
    const response = await api.get(API_ENDPOINTS.HEALTH_METRICS.HISTORY(memberId), queryParams)
    // Backend returns { success: true, data: { count, data: [...], pagination: {...} }, message }
    return response.data
  },

  async getMetricsByDateRange(memberId, startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('startDate and endDate are required')
    }
    const response = await api.get(API_ENDPOINTS.HEALTH_METRICS.RANGE(memberId), {
      startDate,
      endDate,
    })
    // Backend returns { success: true, data: { count, data: [...] }, message }
    return response.data
  },
}

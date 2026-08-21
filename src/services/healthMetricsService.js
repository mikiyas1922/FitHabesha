import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

export const healthMetricsService = {
  async saveHealthMetrics(metricsData) {
    try {
      return await api.post(API_ENDPOINTS.HEALTH_METRICS.CREATE, metricsData)
    } catch (error) {
      throw error
    }
  },

  async getLatestMetrics(memberId) {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH_METRICS.LATEST(memberId))
      return unwrapResource(response)
    } catch (error) {
      throw error
    }
  },

  async getMetricsHistory(memberId, params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
      }
      return await api.get(API_ENDPOINTS.HEALTH_METRICS.HISTORY(memberId), queryParams)
    } catch (error) {
      throw error
    }
  },

  async getMetricsByDateRange(memberId, startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new Error('startDate and endDate are required')
      }
      return await api.get(API_ENDPOINTS.HEALTH_METRICS.RANGE(memberId), {
        startDate,
        endDate,
      })
    } catch (error) {
      throw error
    }
  },

  async deleteHealthMetric(id) {
    try {
      return await api.delete(API_ENDPOINTS.HEALTH_METRICS.DELETE(id))
    } catch (error) {
      throw error
    }
  },
}

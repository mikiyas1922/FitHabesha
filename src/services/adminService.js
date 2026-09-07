import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { normalizeAdminRegisterResponse, normalizeListResponse, unwrapResource } from '../utils/apiHelpers'

function getRecordId(record) {
  return record?.id || record?.user_id || record?.email
}

function dedupeUsers(records) {
  const seen = new Set()

  return records.filter((record) => {
    const id = getRecordId(record)
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

function wrapAdminError(error) {
  if (error?.status === 401) {
    return {
      message: 'Your session expired. Please sign in again as admin.',
      status: 401,
    }
  }

  if (error?.status === 403) {
    return {
      message: 'Access denied. Sign in with an admin account to view registered users.',
      status: 403,
    }
  }

  return error
}

export const adminService = {
  async registerStaff(data) {
    const response = await api.post(API_ENDPOINTS.ADMIN.REGISTER, {
      ...data,
      phone: data.phone ?? '',
    })
    return normalizeAdminRegisterResponse(response)
  },

  /**
   * GET /members — Admin/Reception only.
   * Returns the raw API body so callers can read pagination.
   */
  async getMembers(params = {}) {
    try {
      return await api.get(API_ENDPOINTS.MEMBERS.LIST, params)
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  /**
   * GET /trainers — Admin/Reception only.
   */
  async getTrainers(params = {}) {
    try {
      return await api.get(API_ENDPOINTS.TRAINERS.LIST, params)
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async getMembersList(params = {}) {
    try {
      const response = await this.getMembers(params)
      return dedupeUsers(normalizeListResponse(response))
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async getTrainersList(params = {}) {
    try {
      const response = await this.getTrainers(params)
      return dedupeUsers(normalizeListResponse(response))
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  /**
   * Staff page: trainers from GET /trainers.
   * There is no reception list endpoint; reception accounts still appear from local register cache.
   */
  async getStaffList() {
    return this.getTrainersList()
  },

  async deactivateMember(memberProfileId) {
    try {
      const response = await api.delete(API_ENDPOINTS.ADMIN.MEMBERS_DEACTIVATE(memberProfileId))
      return unwrapResource(response) || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async reactivateMember(memberProfileId) {
    try {
      const response = await api.patch(API_ENDPOINTS.ADMIN.MEMBERS_REACTIVATE(memberProfileId), {})
      return unwrapResource(response) || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async deactivateTrainer(trainerProfileId) {
    try {
      const response = await api.delete(API_ENDPOINTS.ADMIN.TRAINERS_DEACTIVATE(trainerProfileId))
      return unwrapResource(response) || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async reactivateTrainer(trainerProfileId) {
    try {
      const response = await api.patch(API_ENDPOINTS.ADMIN.TRAINERS_REACTIVATE(trainerProfileId), {})
      return unwrapResource(response) || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async deleteHealthMetric(healthMetricId) {
    try {
      const response = await api.delete(API_ENDPOINTS.ADMIN.HEALTH_METRICS_DELETE(healthMetricId))
      // Backend returns { success: true, data: {...}, message }
      return response.data || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async cleanupNotifications() {
    try {
      const response = await api.delete(API_ENDPOINTS.ADMIN.NOTIFICATIONS_CLEANUP)
      // Backend returns { success: true, data: {...}, message }
      return response.data || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },

  async deleteProgressLog(progressLogId) {
    try {
      const response = await api.delete(API_ENDPOINTS.ADMIN.PROGRESS_LOGS_DELETE(progressLogId))
      // Backend returns { success: true, data: {...}, message }
      return response.data || response
    } catch (error) {
      throw wrapAdminError(error)
    }
  },
}

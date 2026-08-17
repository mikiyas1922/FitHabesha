import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { normalizeAdminRegisterResponse, normalizeListResponse } from '../utils/apiHelpers'

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

async function fetchAdminRecords(url, defaultRole) {
  const response = await api.get(url)
  const records = normalizeListResponse(response)

  if (defaultRole) {
    return records.map((record) => ({ ...record, role: record.role || defaultRole }))
  }

  return records
}

async function tryFetchAdminRecords(url, defaultRole) {
  try {
    return await fetchAdminRecords(url, defaultRole)
  } catch (error) {
    throw wrapAdminError(error)
  }
}

export const adminService = {
  async registerStaff(data) {
    const response = await api.post(API_ENDPOINTS.ADMIN.REGISTER, {
      ...data,
      phone: data.phone ?? '',
    })
    return normalizeAdminRegisterResponse(response)
  },

  getMembers: () => tryFetchAdminRecords(API_ENDPOINTS.ADMIN.MEMBERS, 'member'),

  getTrainers: () => tryFetchAdminRecords(API_ENDPOINTS.ADMIN.TRAINERS, 'trainer'),

  async getMembersList() {
    return dedupeUsers(await this.getMembers())
  },

  async getTrainersList() {
    return dedupeUsers(await this.getTrainers())
  },

  /**
   * Trainers and receptionists for the Staff page.
   */
  async getStaffList() {
    const errors = []
    let trainers = []
    let staffRecords = []

    try {
      trainers = await this.getTrainersList()
    } catch (error) {
      errors.push(error)
    }

    for (const url of [API_ENDPOINTS.ADMIN.STAFF, API_ENDPOINTS.ADMIN.USERS]) {
      try {
        const records = await fetchAdminRecords(url)
        if (records.length > 0) {
          staffRecords = records
          break
        }
      } catch (error) {
        // Ignore 404 errors for fallback endpoints - they may not exist on the backend
        if (error?.status !== 404) {
          errors.push(wrapAdminError(error))
        }
      }
    }

    const reception = staffRecords.filter(
      (record) => record.role === 'reception' || record.role === 'receptionist'
    )

    const combined = dedupeUsers([...trainers, ...reception])
    if (combined.length > 0) {
      return combined
    }

    // Only throw error if we have non-404 errors
    const non404Errors = errors.filter(err => err?.status !== 404)
    if (non404Errors.length > 0) {
      throw non404Errors[0]
    }

    return combined
  },
}

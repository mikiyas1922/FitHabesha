import { useCallback, useEffect, useState } from 'react'
import { memberService } from '../services/memberService'
import { staffStorage } from '../services/staffStorage'
import { getApiErrorMessage, normalizePaginatedListResponse, normalizeStaff } from '../utils/apiHelpers'

function normalizeMemberList(records) {
  return records.map((record) => {
    const normalized = normalizeStaff({ ...record, role: record.role || 'member' })
    // Map API response fields to frontend expected fields
    return {
      ...normalized,
      uniqueMemberId: record.unique_member_id || normalized.uniqueMemberId,
      status: record.is_active ? 'active' : 'inactive',
      subscriptionStatus: record.subscription_status || normalized.subscriptionStatus,
      tierName: record.tier_name || normalized.tierName,
      dateOfBirth: record.date_of_birth || normalized.dateOfBirth,
      fitnessGoal: record.fitness_goal || normalized.fitnessGoal,
      emergencyContactName: record.emergency_contact_name || normalized.emergencyContactName,
      emergencyContactPhone: record.emergency_contact_phone || normalized.emergencyContactPhone,
      dietaryRestrictions: record.dietary_restrictions || normalized.dietaryRestrictions,
      bloodType: record.blood_type || normalized.bloodType,
    }
  })
}

function getLocalMembers() {
  return normalizeMemberList(
    staffStorage.getAll().filter((record) => !record.role || record.role === 'member')
  )
}

/**
 * Loads registered members from GET /members.
 * Falls back to members saved locally via POST /admin/register.
 */
export function useAdminMembersList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('idle')
  const [pagination, setPagination] = useState({ page: 1, limit: 100, total: 0, totalPages: 1 })

  const reload = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await memberService.getAllMembers({ page: 1, limit: 100, ...params })
      console.log('Members API response:', response)
      
      // Handle different response structures
      let apiRecords = []
      let paginationData = { page: params.page || 1, limit: params.limit || 100, total: 0, totalPages: 1 }
      
      if (response?.data?.data) {
        // Paginated response structure: { success: true, data: { data: [...], pagination: {...} } }
        apiRecords = response.data.data
        paginationData = response.data.pagination || paginationData
      } else if (response?.data) {
        // Simple array response: { success: true, data: [...] }
        apiRecords = Array.isArray(response.data) ? response.data : [response.data]
      } else if (Array.isArray(response)) {
        // Direct array response
        apiRecords = response
      }
      
      const normalized = normalizeMemberList(apiRecords)
      const merged = normalizeMemberList(staffStorage.mergeWithRemote(normalized))

      setItems(merged)
      setSource('api')
      setPagination({
        ...paginationData,
        total: merged.length,
        totalPages: Math.ceil(merged.length / paginationData.limit)
      })
      return merged
    } catch (err) {
      const message = getApiErrorMessage(err)
      console.error(`useAdminMembersList error: message=${message}, status=${err?.status}, details=${JSON.stringify(err?.details)}`)
      const localItems = getLocalMembers()

      if (localItems.length > 0) {
        setItems(localItems)
        setSource('local')
        setError(message)
        setPagination({ page: 1, limit: 100, total: localItems.length, totalPages: 1 })
        return localItems
      }

      setItems([])
      setSource('idle')
      setError(message)
      setPagination({ page: 1, limit: 100, total: 0, totalPages: 1 })
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addLocalMember = useCallback(
    (user) => {
      staffStorage.add({ ...user, role: user.role || 'member' })
      reload()
    },
    [reload]
  )

  return { items, loading, error, source, reload, addLocalMember, pagination }
}

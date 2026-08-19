import { useCallback, useEffect, useState } from 'react'
import { memberService } from '../services/memberService'
import { getApiErrorMessage, normalizePaginatedListResponse, normalizeStaff } from '../utils/apiHelpers'

function normalizeMemberList(records) {
  return records.map((record) => normalizeStaff({ ...record, role: record.role || 'member' }))
}

function wrapMembersError(error) {
  if (error?.status === 401) {
    return {
      message: 'Your session expired. Please sign in again.',
      status: 401,
    }
  }

  if (error?.status === 403) {
    return {
      message: 'Access denied. Admin or reception access is required to view members.',
      status: 403,
    }
  }

  return error
}

/**
 * Loads members from GET /members with optional pagination and filters.
 */
export function useMembersList(initialFilters = {}) {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 20,
    total: 0,
    totalPages: 0,
  })
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async (overrideFilters = {}) => {
    setLoading(true)
    setError(null)

    const nextFilters = { ...filters, ...overrideFilters }

    try {
      const response = await memberService.getAllMembers(nextFilters)
      const { items: records, pagination: pageInfo } = normalizePaginatedListResponse(response)
      const normalized = normalizeMemberList(records)

      setItems(normalized)
      setPagination(pageInfo)
      setFilters(nextFilters)
      return normalized
    } catch (err) {
      const wrapped = wrapMembersError(err)
      const message = getApiErrorMessage(wrapped)
      setItems([])
      setError(message)
      throw wrapped
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    reload(initialFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setPage = useCallback(
    (page) => reload({ page }),
    [reload]
  )

  return {
    items,
    pagination,
    filters,
    loading,
    error,
    reload,
    setFilters,
    setPage,
  }
}

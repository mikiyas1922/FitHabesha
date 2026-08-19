import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/adminService'
import { getApiErrorMessage, normalizePaginatedListResponse, normalizeTrainer } from '../utils/apiHelpers'

export function useAdminTrainersList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('idle')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })

  const fetchTrainers = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    const query = {
      page: params.page || 1,
      limit: params.limit || 20,
      ...(params.search && { search: params.search }),
      ...(typeof params.is_available === 'boolean' && { is_available: params.is_available }),
    }

    try {
      const res = await adminService.getTrainers(query)
      const { items: rawList, pagination: pag } = normalizePaginatedListResponse(res)

      const formattedList = rawList.map((item) => {
        const normalized = normalizeTrainer(item)
        return {
          ...normalized,
          id: item.id,
          userId: item.user_id,
          phone: item.phone || 'N/A',
          status: item.is_active === false ? 'inactive' : 'active',
          is_available: item.is_available,
          is_active: item.is_active,
        }
      })

      setItems(formattedList)
      setPagination({
        page: pag.page,
        limit: pag.limit,
        total: pag.total,
        totalPages: pag.totalPages || 1,
      })
      setSource('api')
    } catch (err) {
      setError(getApiErrorMessage(err) || 'Failed to fetch trainers list')
      setSource('local')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrainers()
  }, [fetchTrainers])

  const addLocalTrainer = (newTrainer) => {
    setItems((prev) => [newTrainer, ...prev])
  }

  return {
    items,
    loading,
    error,
    source,
    reload: fetchTrainers,
    addLocalTrainer,
    pagination,
  }
}

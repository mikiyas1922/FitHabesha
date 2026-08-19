// hooks/useAdminTrainersList.js
import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/adminService'

export function useAdminTrainersList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('local')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })

  const fetchTrainers = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      const res = await adminService.getTrainers(params)

      // Swagger response: { success: true, data: { data: [...], pagination: {...} } }
      const rawList = res?.data?.data || []
      const pag = res?.data?.pagination || { page: 1, limit: 20, total: rawList.length, totalPages: 1 }

      // Map backend fields to frontend component expectations
      const formattedList = rawList.map((item) => ({
        id: item.id || item.user_id,
        name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.email,
        email: item.email,
        phone: item.phone || 'N/A',
        specialty: item.specialty || 'General',
        certification: item.certification || 'N/A',
        status: item.is_active ? 'active' : 'inactive',
        is_available: item.is_available,
        ...item,
      }))

      setItems(formattedList)
      setPagination(pag)
      setSource('api') // Successfully retrieved live data
    } catch (err) {
      console.error('useAdminTrainersList error:', err)
      setError(err?.message || 'Failed to fetch trainers list')
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
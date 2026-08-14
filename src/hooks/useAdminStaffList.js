import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import { staffStorage } from '../services/staffStorage'
import { getApiErrorMessage, normalizeStaff } from '../utils/apiHelpers'

function normalizeStaffList(records) {
  return records.map((record) => normalizeStaff(record))
}

/**
 * Loads admin staff from API when available.
 * Falls back to locally saved staff created via POST /admin/register.
 */
export function useAdminStaffList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('idle')

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const apiRecords = await adminService.getStaffList()
      const normalized = normalizeStaffList(apiRecords)
      const merged = normalizeStaffList(staffStorage.mergeWithRemote(normalized))

      setItems(merged)
      setSource('api')
      return merged
    } catch (err) {
      const message = getApiErrorMessage(err)
      const localItems = normalizeStaffList(
        staffStorage.getAll().filter(
          (record) =>
            record.role === 'trainer' ||
            record.role === 'reception' ||
            record.role === 'receptionist'
        )
      )

      if (localItems.length > 0) {
        setItems(localItems)
        setSource('local')
        setError(message)
        return localItems
      }

      setItems([])
      setSource('idle')
      setError(message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addLocalStaff = useCallback(
    (user) => {
      staffStorage.add(user)
      reload()
    },
    [reload]
  )

  return { items, loading, error, source, reload, addLocalStaff }
}

import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import { staffStorage } from '../services/staffStorage'
import { getApiErrorMessage, normalizeTrainer } from '../utils/apiHelpers'

function normalizeTrainerList(records) {
  return records.map((record) => normalizeTrainer(record))
}

function getLocalTrainers() {
  return normalizeTrainerList(
    staffStorage.getAll().filter((record) => record.role === 'trainer')
  )
}

/**
 * Loads registered trainers from GET /admin/trainers.
 * Falls back to trainers saved locally via POST /admin/register.
 */
export function useAdminTrainersList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('idle')

  const reload = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      const apiRecords = await adminService.getTrainersList(params)
      const normalized = normalizeTrainerList(apiRecords)
      const merged = normalizeTrainerList(staffStorage.mergeWithRemote(normalized))

      setItems(merged)
      setSource('api')
      return merged
    } catch (err) {
      const message = getApiErrorMessage(err)
      console.error('useAdminTrainersList error: message=' + message + ', status=' + err?.status + ', details=' + JSON.stringify(err?.details))
      const localItems = getLocalTrainers()

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

  const addLocalTrainer = useCallback(
    (user) => {
      staffStorage.add({ ...user, role: user.role || 'trainer' })
      reload()
    },
    [reload]
  )

  return { items, loading, error, source, reload, addLocalTrainer }
}

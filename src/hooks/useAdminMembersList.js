import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import { staffStorage } from '../services/staffStorage'
import { getApiErrorMessage, normalizeStaff } from '../utils/apiHelpers'

function normalizeMemberList(records) {
  return records.map((record) => normalizeStaff({ ...record, role: record.role || 'member' }))
}

function getLocalMembers() {
  return normalizeMemberList(
    staffStorage.getAll().filter((record) => !record.role || record.role === 'member')
  )
}

/**
 * Loads registered members from GET /admin/members.
 * Falls back to members saved locally via POST /admin/register.
 */
export function useAdminMembersList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('idle')

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const apiRecords = await adminService.getMembersList()
      const normalized = normalizeMemberList(apiRecords)
      const merged = normalizeMemberList(staffStorage.mergeWithRemote(normalized))

      setItems(merged)
      setSource('api')
      return merged
    } catch (err) {
      const message = getApiErrorMessage(err)
      const localItems = getLocalMembers()

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

  const addLocalMember = useCallback(
    (user) => {
      staffStorage.add({ ...user, role: user.role || 'member' })
      reload()
    },
    [reload]
  )

  return { items, loading, error, source, reload, addLocalMember }
}

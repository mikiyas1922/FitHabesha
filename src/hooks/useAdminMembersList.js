import { useCallback, useEffect, useState } from 'react'
import { memberService } from '../services/memberService'
import { staffStorage } from '../services/staffStorage'
import { getApiErrorMessage, normalizePaginatedListResponse, normalizeStaff } from '../utils/apiHelpers'

function normalizeMemberList(records) {
  return records.map((record) => normalizeStaff({ ...record, role: record.role || 'member' }))
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

  const reload = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await memberService.getAllMembers({ page: 1, limit: 100, ...params })
      const { items: apiRecords } = normalizePaginatedListResponse(response)
      const normalized = normalizeMemberList(apiRecords)
      const merged = normalizeMemberList(staffStorage.mergeWithRemote(normalized))

      setItems(merged)
      setSource('api')
      return merged
    } catch (err) {
      const message = getApiErrorMessage(err)
      console.error(`useAdminMembersList error: message=${message}, status=${err?.status}, details=${JSON.stringify(err?.details)}`)
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

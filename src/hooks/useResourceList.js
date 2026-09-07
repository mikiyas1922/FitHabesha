import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiErrorMessage, normalizeListResponse } from '../utils/apiHelpers'

/**
 * Fetches a list from the API with optional mock fallback for development.
 * Shows whether data came from `api` or `fallback`.
 */
export function useResourceList(fetchFn, options = {}) {
  const {
    immediate = true,
    fallbackData = [],
    normalize = (item) => item,
  } = options

  const fetchFnRef = useRef(fetchFn)
  const fallbackRef = useRef(fallbackData)
  const normalizeRef = useRef(normalize)

  fetchFnRef.current = fetchFn
  fallbackRef.current = fallbackData
  normalizeRef.current = normalize

  const [items, setItems] = useState(fallbackData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('idle')

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchFnRef.current()
      const list = normalizeListResponse(response).map((item) => normalizeRef.current(item))
      setItems(list)
      setSource('api')
      return list
    } catch (err) {
      const message = getApiErrorMessage(err)
      setError(message)

      if (fallbackRef.current.length > 0) {
        setItems(fallbackRef.current)
        setSource('fallback')
      } else {
        setItems([])
        setSource('idle')
      }

      return fallbackRef.current
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      reload()
    }
  }, [reload, immediate])

  return { items, loading, error, source, reload }
}

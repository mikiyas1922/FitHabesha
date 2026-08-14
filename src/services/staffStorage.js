import { STORAGE_KEYS } from '../constants/storage'

const STAFF_REGISTRY_KEY = STORAGE_KEYS.ADMIN_STAFF_REGISTRY || 'admin_staff_registry'

function readRegistry() {
  try {
    const raw = localStorage.getItem(STAFF_REGISTRY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeRegistry(items) {
  localStorage.setItem(STAFF_REGISTRY_KEY, JSON.stringify(items))
}

function getRecordId(user) {
  return user.id || user.user_id || user.email
}

export const staffStorage = {
  getAll() {
    return readRegistry()
  },

  add(user) {
    if (!user) return null

    const id = getRecordId(user)
    const registry = readRegistry().filter((item) => getRecordId(item) !== id)

    const record = {
      ...user,
      id,
      saved_at: new Date().toISOString(),
    }

    writeRegistry([record, ...registry])
    return record
  },

  mergeWithRemote(remoteItems = []) {
    const localItems = readRegistry()
    const seen = new Set()

    const merged = []

    for (const item of [...remoteItems, ...localItems]) {
      const id = getRecordId(item)
      if (!id || seen.has(id)) continue
      seen.add(id)
      merged.push(item)
    }

    return merged
  },
}

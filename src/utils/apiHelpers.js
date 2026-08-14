const LIST_KEYS = [
  'data',
  'items',
  'members',
  'trainers',
  'staff',
  'users',
  'results',
  'records',
  'rows',
  'list',
]

function extractArray(value) {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return null

  for (const key of LIST_KEYS) {
    if (Array.isArray(value[key])) return value[key]
  }

  if (value.data && typeof value.data === 'object') {
    for (const key of LIST_KEYS) {
      if (Array.isArray(value.data[key])) return value.data[key]
    }
  }

  return null
}

export function normalizeListResponse(response) {
  return extractArray(response) || []
}

export function formatPersonName(record) {
  if (record?.name) return record.name
  return `${record?.first_name || record?.firstName || ''} ${record?.last_name || record?.lastName || ''}`.trim()
}

export function normalizeMember(record) {
  return {
    id: record.unique_member_id || record.id || record.user_id,
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    phone: record.phone || '—',
    membershipType: record.membership_type || record.membershipType || record.plan || '—',
    trainer: record.trainer || record.assigned_trainer || '—',
    status: record.status || 'active',
    joinDate: record.join_date || record.joinDate || record.created_at?.slice?.(0, 10) || '—',
    lastCheckIn: record.last_check_in || record.lastCheckIn,
    visitsPerMonth: record.visits_per_month ?? record.visitsPerMonth,
    raw: record,
  }
}

export function normalizeStaff(record) {
  const role = record.role || 'member'

  return {
    id: record.unique_member_id || record.id || record.user_id || record.email,
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    phone: record.phone || '—',
    role,
    roleLabel: role,
    specialty: record.specialty || '—',
    certification: record.certification || '—',
    uniqueMemberId: record.unique_member_id || '—',
    joinDate: record.join_date || record.joinDate || record.created_at?.slice?.(0, 10) || '—',
    status: record.status || 'active',
    raw: record,
  }
}

export function normalizeTrainer(record) {
  const specialties = record.specialties || (record.specialty ? [record.specialty] : [])

  return {
    id: record.id || record.user_id,
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    specialty: record.specialty || specialties[0] || '—',
    specialties,
    certification: record.certification || '—',
    rating: record.rating ?? record.average_rating ?? '—',
    clients: record.clients ?? record.active_clients ?? '—',
    sessions: record.sessions ?? record.total_sessions ?? '—',
    status: record.status || 'active',
    raw: record,
  }
}

export function normalizeEquipment(record) {
  return {
    id: record.id || record.equipment_id,
    name: record.name || record.equipment_name || '—',
    category: record.category || '—',
    status: record.status || 'available',
    location: record.location || '—',
    lastMaintenance: record.last_maintenance || record.lastMaintenance || '—',
    raw: record,
  }
}

export function normalizeLocker(record) {
  return {
    id: record.id || record.locker_number || record.number,
    number: record.number || record.locker_number || record.id,
    status: record.status || 'available',
    member: formatPersonName(record.member) || record.member_name || '—',
    raw: record,
  }
}

export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return error?.message || error?.error || fallback
}

/** Fields returned by POST /admin/register (INSERT … RETURNING). */
export function normalizeRegisteredUser(record) {
  if (!record || typeof record !== 'object') return null

  const id = record.id || record.user_id

  return {
    ...record,
    id,
    user_id: record.user_id || id,
    email: record.email,
    first_name: record.first_name,
    last_name: record.last_name,
    role: record.role,
    phone: record.phone ?? '',
  }
}

/**
 * Normalizes admin register responses whether the API wraps `{ user, message }`
 * or returns the INSERT RETURNING row directly.
 */
export function normalizeAdminRegisterResponse(response) {
  if (!response || typeof response !== 'object') {
    return { user: null, message: '' }
  }

  if (response.user && typeof response.user === 'object') {
    return {
      message: response.message || 'User registered successfully.',
      user: normalizeRegisteredUser(response.user),
    }
  }

  if (response.id || response.email || response.user_id) {
    return {
      message: response.message || 'User registered successfully.',
      user: normalizeRegisteredUser(response),
    }
  }

  return {
    message: response.message || 'User registered successfully.',
    user: null,
  }
}

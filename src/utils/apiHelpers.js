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
  'content',
  'entities',
  'entries',
]

function extractArray(value) {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return null

  for (const key of LIST_KEYS) {
    const candidate = value[key]
    if (Array.isArray(candidate)) return candidate
  }

  if (value.data && typeof value.data === 'object') {
    const nested = extractArray(value.data)
    if (nested) return nested
  }

  if (value.items && typeof value.items === 'object') {
    const nested = extractArray(value.items)
    if (nested) return nested
  }

  return null
}

export function normalizeListResponse(response) {
  return extractArray(response) || []
}

export function normalizePaginatedListResponse(response) {
  const items = normalizeListResponse(response)
  const rawPagination =
    response?.data?.pagination ||
    response?.pagination ||
    response?.data?.meta ||
    response?.meta ||
    {}

  const page = rawPagination.page ?? rawPagination.currentPage ?? response?.page ?? 1
  const limit = rawPagination.limit ?? rawPagination.perPage ?? response?.limit ?? (items.length || 10)
  const total = rawPagination.total ?? rawPagination.totalItems ?? response?.total ?? items.length
  const totalPages =
    rawPagination.totalPages ??
    rawPagination.pageCount ??
    response?.totalPages ??
    (limit > 0 ? Math.ceil(total / limit) : 1)

  const paginationObj = {
    page,
    currentPage: page,
    limit,
    total,
    totalItems: total,
    totalPages,
  }

  return {
    items,
    // Nested object for code using res.pagination.totalPages
    pagination: paginationObj,
    // Direct top-level properties for code using res.totalPages
    page,
    currentPage: page,
    limit,
    total,
    totalItems: total,
    totalPages,
  }
}

function resolveMemberStatus(record) {
  if (!record || typeof record !== 'object') return 'active'
  if (record?.status) return record.status
  if (record?.is_active === false) return 'inactive'
  if (record?.is_active === true) return 'active'
  if (record?.subscription_status) return record.subscription_status
  return 'active'
}

export function formatPersonName(record) {
  if (!record || typeof record !== 'object') return ''
  if (record?.name) return record.name
  return `${record?.first_name || record?.firstName || ''} ${record?.last_name || record?.lastName || ''}`.trim()
}

export function normalizeMember(record) {
  if (!record || typeof record !== 'object') return { id: null, name: 'Unknown', status: 'active', raw: {} }
  return {
    id: record.user_id || record.id,
    memberProfileId: record.id,
    uniqueMemberId: record.unique_member_id || '—',
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    phone: record.phone || '—',
    membershipType:
      record.tier_name || record.membership_type || record.membershipType || record.plan || '—',
    trainer: record.trainer || record.assigned_trainer || '—',
    status: resolveMemberStatus(record),
    joinDate: record.join_date || record.joinDate || record.created_at?.slice?.(0, 10) || '—',
    lastCheckIn: record.last_check_in || record.lastCheckIn,
    visitsPerMonth: record.visits_per_month ?? record.visitsPerMonth,
    raw: record,
  }
}

export function normalizeStaff(record) {
  if (!record || typeof record !== 'object') return { id: null, name: 'Unknown', role: 'member', raw: {} }
  const role = record.role || 'member'

  return {
    id: record.user_id || record.id || record.email,
    memberProfileId: record.id,
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    phone: record.phone || '—',
    role,
    roleLabel: role,
    specialty: record.specialty || '—',
    certification: record.certification || '—',
    uniqueMemberId: record.unique_member_id || '—',
    membershipType:
      record.tier_name || record.membership_type || record.membershipType || record.plan || '—',
    joinDate: record.join_date || record.joinDate || record.created_at?.slice?.(0, 10) || '—',
    status: resolveMemberStatus(record),
    raw: record,
  }
}

export function normalizeTrainer(record) {
  if (!record || typeof record !== 'object') return { id: null, name: 'Unknown', status: 'active', raw: {} }
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
  if (!record || typeof record !== 'object') return { id: null, name: '—', status: 'available', raw: {} }
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
  if (!record || typeof record !== 'object') return { id: null, number: '—', status: 'available', raw: {} }
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
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
  'bookings',
  'classes',
  'feedback',
  'ratings',
  'reviews',
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

/** Unwrap `{ success, data: entity }` bodies returned by most GET/PATCH endpoints. */
export function unwrapResource(response) {
  if (!response || typeof response !== 'object') return null
  if (Array.isArray(response)) return response
  if (Array.isArray(response.data)) return response.data
  if (response.data && typeof response.data === 'object') {
    if (Array.isArray(response.data.data) || response.data.pagination) {
      return response.data
    }
    return response.data
  }
  return response
}

export function extractFeedbackList(response) {
  const payload = unwrapResource(response)
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return normalizeListResponse(response)

  if (Array.isArray(payload.feedback)) return payload.feedback
  if (Array.isArray(payload.ratings)) return payload.ratings
  if (Array.isArray(payload.reviews)) return payload.reviews
  if (Array.isArray(payload.items)) return payload.items

  return normalizeListResponse(payload)
}

export function unwrapTrainerProfile(response) {
  const profile = unwrapResource(response)
  if (!profile || typeof profile !== 'object') return null
  if (profile.id) return profile
  const nested = profile.trainer
  if (nested && typeof nested === 'object') return nested
  return profile
}

export function normalizeRating(record) {
  if (!record || typeof record !== 'object') return null
  const nestedMember = record.member && typeof record.member === 'object' ? record.member : null
  const nestedTrainer = record.trainer && typeof record.trainer === 'object' ? record.trainer : null
  const stars = Math.round(Number(record.rating_stars ?? record.stars ?? record.rating) || 0)

  return {
    id: record.id || record.rating_id || `${record.trainer_id || 'rating'}-${record.created_at || Date.now()}`,
    rating_type: record.rating_type || record.type || 'trainer',
    rating_stars: Math.min(5, Math.max(0, stars)),
    rating_dimension: record.rating_dimension || record.dimension || '',
    comment: record.comment || record.feedback || record.message || '',
    is_anonymous: Boolean(record.is_anonymous ?? record.anonymous),
    created_at: record.created_at || record.createdAt || '',
    member_name: record.member_name || formatPersonName(nestedMember) || '',
    first_name: record.first_name || nestedMember?.first_name || '',
    last_name: record.last_name || nestedMember?.last_name || '',
    trainer_id: record.trainer_id || record.trainerId || nestedTrainer?.id || null,
    trainer_name: record.trainer_name || formatPersonName(nestedTrainer) || '',
    class_id: record.class_id || record.classId || null,
    class_name: record.class_name || record.className || '',
    raw: record,
  }
}

export function ratingAuthorName(review) {
  if (!review) return 'Member'
  if (review.is_anonymous) return 'Anonymous member'
  const fromFields = `${review.first_name || ''} ${review.last_name || ''}`.trim()
  return review.member_name || fromFields || 'Member'
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
  if (record?.full_name) return record.full_name
  return `${record?.first_name || record?.firstName || ''} ${record?.last_name || record?.lastName || ''}`.trim()
}

export function resolveMemberProfileId(record) {
  if (!record || typeof record !== 'object') return null
  return record.memberProfileId || record.member_profile_id || record.id || record._id || null
}

function trainerLabelFromRecord(record) {
  if (!record || typeof record !== 'object') return ''
  const nested = record.trainer
  if (nested && typeof nested === 'object') {
    return formatPersonName(nested) || nested.email || ''
  }
  if (typeof nested === 'string' && nested.trim() && nested !== '—') return nested.trim()
  const instructor = record.instructor
  if (instructor && typeof instructor === 'object') {
    return formatPersonName(instructor) || instructor.email || ''
  }
  const label = record.assigned_trainer || record.trainer_name || record.assignedTrainer || record.instructor_name
  if (typeof label === 'string' && label.trim() && label !== '—') return label.trim()
  return ''
}

function trainerIdFromRecord(record) {
  if (!record || typeof record !== 'object') return null
  const nested = record.trainer && typeof record.trainer === 'object' ? record.trainer : null
  return (
    record.trainerId ||
    record.trainer_id ||
    record.assigned_trainer_id ||
    record.trainer_profile_id ||
    record.instructor_id ||
    record.instructorId ||
    nested?.id ||
    nested?.trainer_id ||
    nested?.trainerId ||
    (record.instructor && typeof record.instructor === 'object' ? record.instructor.id : null) ||
    null
  )
}

function relatedTrainerSources(record) {
  if (!record || typeof record !== 'object') return []
  return [
    record.current_assignment,
    record.assignment,
    record.active_assignment,
    record.member,
    record.class,
    record.gym_class,
  ].filter((value) => value && typeof value === 'object')
}

export function assignedTrainerName(record) {
  const direct = trainerLabelFromRecord(record)
  if (direct) return direct
  for (const related of relatedTrainerSources(record)) {
    const nested = trainerLabelFromRecord(related)
    if (nested) return nested
  }
  return ''
}

export function assignedTrainerId(record) {
  const direct = trainerIdFromRecord(record)
  if (direct) return direct
  for (const related of relatedTrainerSources(record)) {
    const nested = trainerIdFromRecord(related)
    if (nested) return nested
  }
  return null
}

export function normalizeMember(record) {
  if (!record || typeof record !== 'object') return { id: null, name: 'Unknown', status: 'active', raw: {} }
  return {
    id: record.id || record.user_id,
    userId: record.user_id,
    memberProfileId: record.id,
    uniqueMemberId: record.unique_member_id || '—',
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    phone: record.phone || '—',
    membershipType:
      record.tier_name || record.membership_type || record.membershipType || record.plan || '—',
    trainer: assignedTrainerName(record) || '—',
    trainerId: assignedTrainerId(record),
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
    id: record.id || record.user_id || record.email,
    userId: record.user_id,
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
    trainer: assignedTrainerName(record) || '—',
    trainerId: assignedTrainerId(record),
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
    userId: record.user_id,
    name: formatPersonName(record) || record.email || 'Unknown',
    email: record.email || '—',
    specialty: record.specialty || specialties[0] || '—',
    specialties,
    certification: record.certification || '—',
    rating: record.rating ?? record.average_rating ?? '—',
    clients: record.clients ?? record.active_clients ?? '—',
    sessions: record.sessions ?? record.total_sessions ?? '—',
    status: record.status || (record.is_active === false ? 'inactive' : 'active'),
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

  const body = response.user ? response : response.data || response

  if (body?.user && typeof body.user === 'object') {
    return {
      message: body.message || response.message || 'User registered successfully.',
      user: normalizeRegisteredUser(body.user),
    }
  }

  if (body?.id || body?.email || body?.user_id) {
    return {
      message: body.message || response.message || 'User registered successfully.',
      user: normalizeRegisteredUser(body),
    }
  }

  return {
    message: response.message || 'User registered successfully.',
    user: null,
  }
}
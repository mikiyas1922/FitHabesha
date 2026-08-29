import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

/**
 * Normalise a single progress record from the API into a predictable shape.
 */
function normalizeEntry(raw = {}) {
  return {
    id: raw.id || null,
    member_assignment_id: raw.member_assignment_id || null,
    weight_kg: raw.weight_kg != null ? Number(raw.weight_kg) : null,
    body_fat_percentage: raw.body_fat_percentage != null ? Number(raw.body_fat_percentage) : null,
    muscle_mass_kg: raw.muscle_mass_kg != null ? Number(raw.muscle_mass_kg) : null,
    notes: raw.notes || '',
    trainer_name: raw.trainer_name || '',
    logged_at: raw.logged_at || raw.created_at || null,
    created_at: raw.created_at || raw.logged_at || null,
  }
}

export const progressService = {
  /**
   * POST /progress
   * Log a new body-composition entry.
   * Body: { member_assignment_id, weight_kg?, body_fat_percentage?, muscle_mass_kg?, notes? }
   */
  async logProgress(data = {}) {
    const body = {
      member_assignment_id: data.member_assignment_id,
    }
    if (data.weight_kg !== '' && data.weight_kg != null) body.weight_kg = Number(data.weight_kg)
    if (data.body_fat_percentage !== '' && data.body_fat_percentage != null)
      body.body_fat_percentage = Number(data.body_fat_percentage)
    if (data.muscle_mass_kg !== '' && data.muscle_mass_kg != null)
      body.muscle_mass_kg = Number(data.muscle_mass_kg)
    const notes = typeof data.notes === 'string' ? data.notes.trim() : ''
    if (notes) body.notes = notes

    const response = await api.post(API_ENDPOINTS.PROGRESS.LOG, body)
    const entry = response?.data?.data ?? response?.data ?? response ?? {}
    return {
      success: response?.success !== false,
      data: normalizeEntry(entry),
      message: response?.message || 'Progress logged successfully.',
    }
  },

  /**
   * GET /progress/member/{memberProfileId}?page=&limit=
   * Returns paginated progress history.
   */
  async getProgressHistory(memberProfileId, { page = 1, limit = 20 } = {}) {
    const response = await api.get(API_ENDPOINTS.PROGRESS.HISTORY(memberProfileId), { page, limit })

    const payload = response?.data?.data ?? response?.data ?? response ?? {}
    const rawItems = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : []

    const pagination = payload?.pagination ?? response?.data?.pagination ?? {}

    return {
      items: rawItems.map(normalizeEntry),
      pagination: {
        page: Number(pagination.page ?? 1),
        limit: Number(pagination.limit ?? limit),
        total: Number(pagination.total ?? rawItems.length),
        totalPages: Number(pagination.totalPages ?? 1),
      },
    }
  },

  /**
   * GET /progress/member/{memberProfileId}/latest
   * Returns the single most-recent entry, or null.
   */
  async getLatestProgress(memberProfileId) {
    try {
      const response = await api.get(API_ENDPOINTS.PROGRESS.LATEST(memberProfileId))
      const entry = response?.data?.data ?? response?.data ?? response ?? null
      if (!entry || typeof entry !== 'object') return null
      return normalizeEntry(entry)
    } catch (err) {
      if (err?.status === 404) return null
      throw err
    }
  },
}

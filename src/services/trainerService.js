import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

function wrapAssignmentError(error, { notFound, forbidden }) {
  if (error?.status === 400) {
    throw { ...error, message: error.message || 'Validation error. Check the member and trainer IDs.' }
  }
  if (error?.status === 403) {
    throw { ...error, message: error.message || forbidden }
  }
  if (error?.status === 404) {
    throw { ...error, message: error.message || notFound }
  }
  throw error
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return []
}

export const trainerService = {
  getAllTrainers: (params = {}) => api.get(API_ENDPOINTS.TRAINERS.LIST, params),

  getCurrentTrainerProfile: () => api.get(API_ENDPOINTS.TRAINERS.ME),

  getTrainerById: (id) => api.get(API_ENDPOINTS.TRAINERS.DETAIL(id)),

  /** PATCH /trainers/{id} */
  updateTrainer: (id, data) => api.patch(API_ENDPOINTS.TRAINERS.UPDATE(id), data),

  /** GET /trainers/{id}/schedule — optional `date` (YYYY-MM-DD). */
  getTrainerSchedule: async (id, params = {}) => {
    const query = {}
    if (params.date) query.date = params.date
    const payload = unwrapResource(await api.get(API_ENDPOINTS.TRAINERS.SCHEDULE(id), query)) || {}
    return {
      trainer: payload.trainer || null,
      schedule: Array.isArray(payload.schedule) ? payload.schedule : [],
    }
  },

  /** GET /trainers/{id}/roster */
  getTrainerRoster: async (id) => {
    const payload = unwrapResource(await api.get(API_ENDPOINTS.TRAINERS.ROSTER(id))) || {}
    const roster = Array.isArray(payload.roster) ? payload.roster : []
    return {
      trainer: payload.trainer || null,
      count: payload.count ?? roster.length,
      roster,
    }
  },

  /** GET /trainers/{trainerId}/classes/{classId}/roster */
  getClassRoster: async (trainerId, classId) => {
    const payload = unwrapResource(await api.get(API_ENDPOINTS.TRAINERS.CLASS_ROSTER(trainerId, classId)))
    return asArray(payload)
  },

  /** GET /trainers/{id}/feedback */
  getTrainerFeedback: async (id) => {
    const payload = unwrapResource(await api.get(API_ENDPOINTS.TRAINERS.FEEDBACK(id))) || {}
    const feedback = Array.isArray(payload.feedback) ? payload.feedback : []
    return {
      count: payload.count ?? feedback.length,
      feedback,
    }
  },

  /**
   * POST /trainers/attendance/{memberProfileId}
   * Trainer-only. Creates an attendance_records row with check_in_type `personal_training`.
   */
  recordAttendance: async (memberProfileId, data = {}) => {
    if (!memberProfileId) {
      throw { message: 'Member profile is required.', status: 400 }
    }

    const body = {}
    const notes = typeof data.notes === 'string' ? data.notes.trim() : ''
    if (notes) body.notes = notes

    try {
      const response = await api.post(API_ENDPOINTS.TRAINERS.ATTENDANCE(memberProfileId), body)
      const record = unwrapResource(response)
      return {
        success: response?.success !== false,
        data: record,
        message: response?.message || 'Personal training attendance recorded successfully',
      }
    } catch (error) {
      if (error?.status === 403) {
        throw {
          ...error,
          message: error.message || 'Forbidden. Trainer role required to record personal training attendance.',
        }
      }
      if (error?.status === 404) {
        throw {
          ...error,
          message: error.message || 'Trainer or member not found.',
        }
      }
      throw error
    }
  },

  /** GET /trainers/{trainerId}/templates */
  getTrainerTemplates: async (trainerId) => {
    const payload = unwrapResource(await api.get(API_ENDPOINTS.TRAINERS.TEMPLATES(trainerId)))
    return asArray(payload)
  },

  /** GET /trainers/{trainerId}/meal-plans */
  getTrainerMealPlans: async (trainerId) => {
    const payload = unwrapResource(await api.get(API_ENDPOINTS.TRAINERS.MEAL_PLANS(trainerId)))
    return asArray(payload)
  },

  /** POST /trainers/{trainerId}/assign-plan */
  assignPlan: async (trainerId, data) => {
    const body = {
      member_profile_id: data.member_profile_id,
      workout_template_id: data.workout_template_id || null,
      meal_plan_id: data.meal_plan_id || null,
    }
    if (data.notes) body.notes = data.notes
    const response = await api.post(API_ENDPOINTS.TRAINERS.ASSIGN_PLAN(trainerId), body)
    return unwrapResource(response)
  },

  /**
   * POST /trainers/{trainerId}/assign-trainer — Admin/Reception.
   * Links a member to a trainer without assigning workout/meal plans.
   */
  assignTrainer: async (trainerId, data = {}) => {
    if (!trainerId) {
      throw { message: 'Trainer profile is required.', status: 400 }
    }
    if (!data.member_profile_id) {
      throw { message: 'Member profile is required.', status: 400 }
    }

    const body = { member_profile_id: data.member_profile_id }
    const notes = typeof data.notes === 'string' ? data.notes.trim() : ''
    if (notes) body.notes = notes

    try {
      const response = await api.post(API_ENDPOINTS.TRAINERS.ASSIGN_TRAINER(trainerId), body)
      return {
        success: response?.success !== false,
        data: unwrapResource(response),
        message: response?.message || 'Trainer assigned to member successfully',
      }
    } catch (error) {
      wrapAssignmentError(error, {
        forbidden: 'Forbidden. Admin or reception access is required to assign a trainer.',
        notFound: 'Trainer or member not found.',
      })
    }
  },

  /**
   * DELETE /trainers/assignments/member/{memberProfileId} — Admin/Reception.
   * Deactivates the active trainer assignment; does not delete profiles.
   */
  unassignTrainer: async (memberProfileId) => {
    if (!memberProfileId) {
      throw { message: 'Member profile is required.', status: 400 }
    }

    try {
      const response = await api.delete(API_ENDPOINTS.TRAINERS.UNASSIGN_MEMBER(memberProfileId))
      return {
        success: response?.success !== false,
        data: unwrapResource(response),
        message: response?.message || 'Trainer unassigned successfully',
      }
    } catch (error) {
      wrapAssignmentError(error, {
        forbidden: 'Forbidden. Admin or reception access is required to unassign a trainer.',
        notFound: 'Member or active assignment not found.',
      })
    }
  },

  unwrapProfile(response) {
    return unwrapResource(response)
  },
}

import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

const RATING_TYPES = new Set(['trainer', 'facility', 'class'])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value)
}

function wrapRatingError(error, fallbacks = {}) {
  const status = error?.status
  if (status && fallbacks[status]) {
    throw { ...error, message: fallbacks[status] }
  }
  throw error
}

function duplicateMessage(type) {
  if (type === 'trainer') return 'You have already rated this trainer. Each trainer can only be rated once.'
  if (type === 'class') return 'You have already rated this class. Each class can only be rated once.'
  if (type === 'facility') return 'You have already rated the facility. Facility ratings can only be submitted once.'
  return 'You have already submitted this rating.'
}

function emptyTrainerAverage() {
  return {
    average_rating: 0,
    total_reviews: 0,
    five_star_count: 0,
    four_star_count: 0,
    three_star_count: 0,
    two_star_count: 0,
    one_star_count: 0,
  }
}

function normalizeTrainerAverage(payload) {
  const data = payload && typeof payload === 'object' ? payload : {}
  return {
    average_rating: Number(data.average_rating) || 0,
    total_reviews: Number(data.total_reviews) || 0,
    five_star_count: Number(data.five_star_count) || 0,
    four_star_count: Number(data.four_star_count) || 0,
    three_star_count: Number(data.three_star_count) || 0,
    two_star_count: Number(data.two_star_count) || 0,
    one_star_count: Number(data.one_star_count) || 0,
  }
}

function buildSubmitBody(type, data = {}) {
  const stars = Number(data.rating_stars)
  const body = {
    rating_stars: stars,
    is_anonymous: Boolean(data.is_anonymous),
  }

  const comment = typeof data.comment === 'string' ? data.comment.trim() : ''
  if (comment) body.comment = comment

  const dimension = typeof data.rating_dimension === 'string' ? data.rating_dimension.trim() : ''
  if (dimension) body.rating_dimension = dimension

  if (type === 'trainer') {
    body.trainer_id = data.trainer_id
  } else if (type === 'class') {
    body.class_id = data.class_id
  }

  return body
}

export const ratingService = {
  /**
   * POST /ratings/{type} — members only.
   * type: trainer | facility | class
   */
  async submitRating(type, data = {}) {
    if (!RATING_TYPES.has(type)) {
      throw { message: 'Rating type must be trainer, class, or facility.', status: 400 }
    }

    const stars = Number(data.rating_stars)
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      throw { message: 'Rating must be a whole number between 1 and 5.', status: 400 }
    }

    if (type === 'trainer' && !isUuid(data.trainer_id)) {
      throw { message: 'A valid trainer is required.', status: 400 }
    }
    if (type === 'class' && !isUuid(data.class_id)) {
      throw { message: 'A valid class is required.', status: 400 }
    }

    try {
      const response = await api.post(API_ENDPOINTS.RATINGS.SUBMIT(type), buildSubmitBody(type, data))
      return {
        success: response?.success !== false,
        data: unwrapResource(response),
        message: response?.message || 'Rating submitted successfully',
      }
    } catch (error) {
      wrapRatingError(error, {
        400: 'Validation error. Check the rating details and try again.',
        401: 'Please sign in as a member to submit a rating.',
        403: error?.details?.error ||
          'You cannot submit this rating. Members need an active subscription, a session with the trainer, or a booking for the class.',
        404: type === 'class' ? 'Class not found.' : 'Trainer not found.',
        409: duplicateMessage(type),
      })
    }
  },

  /**
   * GET /ratings/trainer/{trainerId}/average
   * Trainer: own. Admin/Reception: any. Member: assigned trainer only.
   */
  async getTrainerAverage(trainerId) {
    if (!isUuid(trainerId)) {
      throw { message: 'A valid trainer profile ID is required.', status: 400 }
    }

    try {
      const response = await api.get(API_ENDPOINTS.RATINGS.TRAINER_AVERAGE(trainerId))
      return normalizeTrainerAverage(unwrapResource(response))
    } catch (error) {
      wrapRatingError(error, {
        401: 'Please sign in to view trainer ratings.',
        403: "You do not have access to this trainer's ratings.",
        404: 'Trainer not found.',
      })
    }
  },

  /** GET /ratings/facility — public, no auth required. */
  async getFacilityRating() {
    try {
      const response = await api.get(API_ENDPOINTS.RATINGS.FACILITY)
      const data = unwrapResource(response) || {}
      return {
        average_rating: Number(data.average_rating) || 0,
        total_reviews: Number(data.total_reviews) || 0,
      }
    } catch (error) {
      wrapRatingError(error, {
        500: 'Unable to load facility ratings right now.',
      })
    }
  },

  /**
   * GET /admin/ratings/flagged — Admin only.
   * Returns ratings below `threshold` (1–5, default 3) that are not yet moderated.
   */
  async getFlaggedRatings(threshold = 3) {
    const value = Number(threshold)
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw { message: 'Threshold must be a whole number between 1 and 5.', status: 400 }
    }

    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.RATINGS_FLAGGED, { threshold: value })
      const payload = unwrapResource(response) || {}
      const items = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : []
      return {
        count: payload.count ?? items.length,
        data: items,
      }
    } catch (error) {
      wrapRatingError(error, {
        400: 'Invalid threshold. Use a value between 1 and 5.',
        401: 'Please sign in as admin to view flagged ratings.',
        403: 'Admin access is required to view flagged ratings.',
        503: 'Ratings service is unavailable. Try again shortly.',
      })
    }
  },

  /** PATCH /admin/ratings/{id}/moderate — Admin only. */
  async moderateRating(id, moderationNotes) {
    if (!isUuid(id)) {
      throw { message: 'A valid rating ID is required.', status: 400 }
    }

    const notes = typeof moderationNotes === 'string' ? moderationNotes.trim() : ''
    if (!notes) {
      throw { message: 'Moderation notes are required.', status: 400 }
    }

    try {
      const response = await api.patch(API_ENDPOINTS.ADMIN.RATINGS_MODERATE(id), {
        moderation_notes: notes,
      })
      return {
        success: response?.success !== false,
        data: unwrapResource(response),
        message: response?.message || 'Rating moderated successfully',
      }
    } catch (error) {
      wrapRatingError(error, {
        400: 'Moderation notes are required.',
        401: 'Please sign in as admin to moderate ratings.',
        403: 'Admin access is required to moderate ratings.',
        404: 'Rating not found.',
      })
    }
  },

  emptyTrainerAverage,
}

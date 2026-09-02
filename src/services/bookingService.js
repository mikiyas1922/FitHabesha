import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export const bookingService = {
  bookClass: (memberProfileId, classId) =>
    api.post(API_ENDPOINTS.BOOKINGS.CREATE, {
      member_profile_id: memberProfileId,
      class_id: classId,
    }),

  getBookingById: (id) => api.get(API_ENDPOINTS.BOOKINGS.DETAIL(id)),

  cancelBooking: (id) => api.delete(API_ENDPOINTS.BOOKINGS.CANCEL(id)),

  rescheduleBooking: (id, newClassId) =>
    api.post(API_ENDPOINTS.BOOKINGS.RESCHEDULE(id), { new_class_id: newClassId }),

  getMemberBookings: (memberProfileId, params = {}) =>
    api.get(API_ENDPOINTS.BOOKINGS.MEMBER(memberProfileId), {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
      },
      skipSessionExpiry: params.skipSessionExpiry,
    }),
}

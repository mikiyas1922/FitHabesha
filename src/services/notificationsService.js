import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource, normalizePaginatedListResponse } from '../utils/apiHelpers'

function listParams(filters = {}) {
  return {
    page: filters.page || 1,
    limit: filters.limit || 20,
  }
}

export const notificationsService = {
  /** GET /notifications — paginated list for the authenticated user. */
  getNotifications: async (filters = {}) => {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, listParams(filters))
    return normalizePaginatedListResponse(response)
  },

  listNotifications: async (filters = {}) => {
    const result = await notificationsService.getNotifications(filters)
    return result.items
  },

  /** GET /notifications/unread */
  getUnreadCount: async () => {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT)
    const data = unwrapResource(response)
    return data?.unread_count ?? 0
  },

  /** PATCH /notifications/{id}/read */
  markAsRead: async (id) => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    return unwrapResource(response)
  },

  /** PATCH /notifications/read-all */
  markAllAsRead: async () => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    return unwrapResource(response)
  },

  /** DELETE /notifications/{id} */
  deleteNotification: async (id) => {
    const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
    return unwrapResource(response)
  },

  /** GET /notifications/user/{userId} — Admin/Reception only. */
  getUserNotifications: async (userId, filters = {}) => {
    const response = await api.get(
      API_ENDPOINTS.NOTIFICATIONS.USER_NOTIFICATIONS(userId),
      listParams(filters)
    )
    return normalizePaginatedListResponse(response)
  },
}

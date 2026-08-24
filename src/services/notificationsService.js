import { api } from './apiClient'
import { API_ENDPOINTS } from '../config/api'
import { unwrapResource } from '../utils/apiHelpers'

export const notificationsService = {
  getNotifications: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    }
    return api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, params)
  },

  listNotifications: async (filters = {}) => {
    const response = await notificationsService.getNotifications(filters)
    // Backend returns { success: true, data: { data: [...], pagination: {...} }, message: "..." }
    return response.data?.data || []
  },

  getUnreadCount: async () => {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT)
    // Backend returns { success: true, data: { unread_count: 0 }, message: "..." }
    return response.data || { unread_count: 0 }
  },

  markAsRead: async (id) => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    // Backend returns { success: true, data: {...}, message: "..." }
    return response.data
  },

  markAllAsRead: async () => {
    const response = await api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    // Backend returns { success: true, data: { message: "..." }, message: "..." }
    return response.data
  },

  deleteNotification: async (id) => {
    const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
    return response
  },

  getUserNotifications: async (userId, filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    }
    return api.get(API_ENDPOINTS.NOTIFICATIONS.USER_NOTIFICATIONS(userId), params)
  },
}

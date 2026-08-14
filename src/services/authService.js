import { api } from './apiClient'
import { tokenStorage } from './apiClient'
import { profileStorage } from './profileStorage'
import { API_ENDPOINTS } from '../config/api'
import { STORAGE_KEYS } from '../constants/storage'
import { buildResetPasswordPayload, buildForgotPasswordPayload } from '../utils/resetPasswordParams'

const USER_KEY = STORAGE_KEYS.AUTH_USER

function getUserId(user) {
  return user?.id || user?.user_id || user?.email
}

function normalizeSessionUser(user) {
  if (!user) return user

  const sessionUser = { ...user }

  // Backend has no trainer approval workflow — never block on local mock status
  if (sessionUser.role === 'trainer' && !sessionUser.approval_status) {
    delete sessionUser.approval_status
  }

  return sessionUser
}

async function requestLogout() {
  try {
    await api.get(API_ENDPOINTS.AUTH.LOGOUT)
    return
  } catch (getError) {
    if (getError.status !== 404) {
      throw getError
    }
  }

  await api.post(API_ENDPOINTS.AUTH.LOGOUT, {})
}

export const userStorage = {
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
}

export const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)

    const accessToken = response.accessToken || response.access_token
    const refreshToken = response.refreshToken || response.refresh_token

    if (!accessToken) {
      throw new Error('Login succeeded but no access token was returned.')
    }

    tokenStorage.setAccessToken(accessToken)
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken)
    }

    if (response.user?.role === 'trainer') {
      profileStorage.clearTrainerApprovalStatus(getUserId(response.user))
    }

    const mergedUser = normalizeSessionUser(profileStorage.mergeWithUser(response.user))
    userStorage.setUser(mergedUser)

    return { ...response, user: mergedUser }
  },

  register: async (data, profileExtra = {}) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data)

    if (response.user) {
      profileStorage.saveFromRegistration(response.user, profileExtra)
    }

    return response
  },

  logout: async () => {
    const accessToken = tokenStorage.getAccessToken()

    try {
      if (accessToken) {
        await requestLogout()
      }
    } catch (error) {
      console.warn('Logout API call failed:', error.message)
    } finally {
      tokenStorage.clearTokens()
      userStorage.clearUser()
    }
  },

  getCurrentUser: () => {
    if (!tokenStorage.getAccessToken()) {
      return null
    }

    const user = userStorage.getUser()
    if (!user) return null

    return normalizeSessionUser(profileStorage.mergeWithUser(user))
  },

  updateProfile: (updates) => {
    const user = userStorage.getUser()
    if (!user) return null

    const userId = getUserId(user)
    profileStorage.saveProfile(userId, updates)

    const mergedUser = normalizeSessionUser(profileStorage.mergeWithUser({ ...user, ...updates }))
    userStorage.setUser(mergedUser)
    return mergedUser
  },

  refreshToken: async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    })

    const accessToken = response.accessToken || response.access_token
    if (!accessToken) {
      throw new Error('Token refresh failed.')
    }

    tokenStorage.setAccessToken(accessToken)
    return response
  },

  isAuthenticated: () => {
    return !!tokenStorage.getAccessToken()
  },

  clearSession: () => {
    tokenStorage.clearTokens()
    userStorage.clearUser()
  },

  forgotPassword: async (email) => {
    const payload = buildForgotPasswordPayload(email)
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload)
    return response
  },

  resetPassword: async (data) => {
    const payload = buildResetPasswordPayload(data)
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload)
    return response
  },
}

import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

import { STORAGE_KEYS } from '../constants/storage'

// Token management
const TOKEN_KEY = STORAGE_KEYS.ACCESS_TOKEN
const REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// Log API base URL for debugging
console.log('API Base URL:', API_BASE_URL)

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()
    const refreshToken = tokenStorage.getRefreshToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (refreshToken && config.headers) {
      config.headers['x-refresh-token'] = refreshToken
    }
    // Reduce logging for admin endpoints that may not exist
    const isAdminEndpoint = config.url?.includes('/admin/')
    if (!isAdminEndpoint) {
      console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url)
    }
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Check if backend sent a new access token in headers
    const newAccessToken = response.headers['x-access-token']
    if (newAccessToken) {
      tokenStorage.setAccessToken(newAccessToken)
      console.log('Access token refreshed from response header')
    }

    // Check refresh token status from backend middleware
    const refreshStatus = response.headers['x-refresh-status']
    if (refreshStatus === 'expired' || refreshStatus === 'invalid' || refreshStatus === 'revoked') {
      console.warn(`Refresh token ${refreshStatus}, clearing session`)
      tokenStorage.clearTokens()
      window.location.href = '/login'
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Do not refresh tokens for auth lifecycle endpoints (especially logout).
    const authUrl = originalRequest?.url || ''
    const skipRefresh =
      authUrl.includes('/auth/logout') ||
      authUrl.includes('/auth/login') ||
      authUrl.includes('/auth/register') ||
      authUrl.includes('/auth/refresh') ||
      authUrl.includes('/auth/forgot-password') ||
      authUrl.includes('/auth/reset-password')

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401 && !skipRefresh) {
      // Don't redirect for trainer list calls in modal context
      const isTrainerListCall = originalRequest?.url?.includes('/trainers')
      if (!isTrainerListCall) {
        tokenStorage.clearTokens()
        window.location.href = '/login'
      }
    }

    // Handle other errors
    const apiError = {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'An error occurred',
      status: error.response?.status,
      details: error.response?.data,
    }

    return Promise.reject(apiError)
  }
)

// API methods
export const api = {
  get: (url, params) =>
    apiClient.get(url, { params }).then((res) => res.data),

  post: (url, data) =>
    apiClient.post(url, data).then((res) => res.data),

  put: (url, data) =>
    apiClient.put(url, data).then((res) => res.data),

  patch: (url, data) =>
    apiClient.patch(url, data).then((res) => res.data),

  delete: (url) =>
    apiClient.delete(url).then((res) => res.data),
}

export default apiClient

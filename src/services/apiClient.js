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

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
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

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true
      try {
        const refreshToken = tokenStorage.getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            refreshToken: refreshToken,
          })
          const { accessToken, access_token: accessTokenSnake } = response.data
          const nextAccessToken = accessToken || accessTokenSnake
          if (!nextAccessToken) {
            throw new Error('Token refresh failed.')
          }
          tokenStorage.setAccessToken(nextAccessToken)
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
          }
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        tokenStorage.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
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

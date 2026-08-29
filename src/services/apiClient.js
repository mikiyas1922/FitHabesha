import axios from 'axios'
import { API_BASE_URL } from '../config/api'
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

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers['x-access-token']
    if (newAccessToken) {
      tokenStorage.setAccessToken(newAccessToken)
      console.log('Access token refreshed from response header')
    }

    const refreshStatus = response.headers['x-refresh-status']
    if (refreshStatus === 'expired' || refreshStatus === 'invalid' || refreshStatus === 'revoked') {
      console.warn(`Refresh token ${refreshStatus}`)
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config
    const statusCode = error.response?.status

    if (statusCode >= 500) {
      console.error(
        `Server error ${statusCode} on ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}:`,
        error.response?.data
      )
    }

    const authUrl = originalRequest?.url || ''
    const skipRefresh =
      authUrl.includes('/auth/logout') ||
      authUrl.includes('/auth/login') ||
      authUrl.includes('/auth/register') ||
      authUrl.includes('/auth/refresh') ||
      authUrl.includes('/auth/forgot-password') ||
      authUrl.includes('/auth/reset-password')

    if (statusCode === 401 && !skipRefresh && originalRequest) {
      if (originalRequest._retry) {
        return Promise.reject(error)
      }

      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken, refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-refresh-token': refreshToken,
            },
          }
        )

        const refreshData = refreshResponse.data?.data || refreshResponse.data || {}
        const newAccessToken =
          refreshData.accessToken ||
          refreshData.access_token ||
          refreshResponse.headers?.['x-access-token']
        const newRefreshToken =
          refreshData.refreshToken ||
          refreshData.refresh_token ||
          refreshResponse.headers?.['x-refresh-token']

        if (newAccessToken) {
          tokenStorage.setAccessToken(newAccessToken)
          if (newRefreshToken) {
            tokenStorage.setRefreshToken(newRefreshToken)
          }

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }

          processQueue(null, newAccessToken)
          return apiClient(originalRequest)
        } else {
          throw new Error('No access token in refresh response')
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    const apiError = {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'An error occurred',
      status: statusCode,
      details: error.response?.data,
    }

    return Promise.reject(apiError)
  }
)

// Standardized API methods
export const api = {
  get: (url, config = {}) => {
    // Flexibly handles both api.get('/path', { page: 1 }) and api.get('/path', { params: { page: 1 } })
    const axiosConfig = config && config.params ? config : { params: config }
    return apiClient.get(url, axiosConfig).then((res) => res.data)
  },

  post: (url, data, config = {}) =>
    apiClient.post(url, data, config).then((res) => res.data),

  put: (url, data, config = {}) =>
    apiClient.put(url, data, config).then((res) => res.data),

  patch: (url, data, config = {}) =>
    apiClient.patch(url, data, config).then((res) => res.data),

  delete: (url, config = {}) =>
    apiClient.delete(url, config).then((res) => res.data),
}

export default apiClient
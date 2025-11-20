import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = useAuthStore.getState().refreshToken

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { token, refresh_token } = response.data
          useAuthStore.getState().setTokens(token, refresh_token)

          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        } catch {
          // Refresh failed, logout user
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      } else {
        // No refresh token, logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    // Handle other errors
    const message = error.response?.data
      ? (error.response.data as { message?: string }).message || 'An error occurred'
      : error.message || 'Network error'

    return Promise.reject(new Error(message))
  }
)

export default apiClient

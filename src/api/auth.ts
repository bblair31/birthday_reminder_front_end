import apiClient from './client'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
} from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', data)
    return response.data
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/change-password', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },
}

export default authApi

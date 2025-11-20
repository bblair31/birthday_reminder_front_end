import apiClient from './client'
import type { User, UserStats } from '@/types'

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile')
    return response.data
  },

  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>('/users/stats')
    return response.data
  },
}

export default usersApi

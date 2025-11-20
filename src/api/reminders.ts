import apiClient from './client'
import type {
  Reminder,
  CreateReminderRequest,
  UpdateReminderRequest,
} from '@/types'

export const remindersApi = {
  getAll: async (): Promise<Reminder[]> => {
    const response = await apiClient.get<Reminder[]>('/reminders')
    return response.data
  },

  getUpcoming: async (days?: number): Promise<Reminder[]> => {
    const params = days ? { days } : {}
    const response = await apiClient.get<Reminder[]>('/reminders/upcoming', { params })
    return response.data
  },

  getById: async (id: string): Promise<Reminder> => {
    const response = await apiClient.get<Reminder>(`/reminders/${id}`)
    return response.data
  },

  create: async (data: CreateReminderRequest): Promise<Reminder> => {
    const response = await apiClient.post<Reminder>('/reminders', data)
    return response.data
  },

  update: async (id: string, data: UpdateReminderRequest): Promise<Reminder> => {
    const response = await apiClient.put<Reminder>(`/reminders/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reminders/${id}`)
  },
}

export default remindersApi

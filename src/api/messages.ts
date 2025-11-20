import apiClient from './client'
import type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
} from '@/types'

export const messagesApi = {
  getAll: async (): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>('/messages')
    return response.data
  },

  create: async (data: CreateMessageRequest): Promise<Message> => {
    const response = await apiClient.post<Message>('/messages', data)
    return response.data
  },

  update: async (id: string, data: UpdateMessageRequest): Promise<Message> => {
    const response = await apiClient.put<Message>(`/messages/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/messages/${id}`)
  },

  send: async (id: string): Promise<Message> => {
    const response = await apiClient.post<Message>(`/messages/${id}/send`)
    return response.data
  },
}

export default messagesApi

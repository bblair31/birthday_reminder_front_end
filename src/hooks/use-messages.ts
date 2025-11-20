import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import messagesApi from '@/api/messages'
import type { CreateMessageRequest, UpdateMessageRequest } from '@/types'
import { toast } from 'sonner'

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => messagesApi.getAll(),
  })
}

export function useCreateMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMessageRequest) => messagesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success('Message created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create message')
    },
  })
}

export function useUpdateMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMessageRequest }) =>
      messagesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success('Message updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update message')
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => messagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success('Message deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete message')
    },
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => messagesApi.send(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success('Message sent successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send message')
    },
  })
}

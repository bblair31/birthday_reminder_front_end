import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import remindersApi from '@/api/reminders'
import type { CreateReminderRequest, UpdateReminderRequest } from '@/types'
import { toast } from 'sonner'

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => remindersApi.getAll(),
  })
}

export function useUpcomingReminders(days?: number) {
  return useQuery({
    queryKey: ['reminders', 'upcoming', days],
    queryFn: () => remindersApi.getUpcoming(days),
  })
}

export function useReminder(id: string) {
  return useQuery({
    queryKey: ['reminders', id],
    queryFn: () => remindersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReminderRequest) => remindersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Reminder created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create reminder')
    },
  })
}

export function useUpdateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReminderRequest }) =>
      remindersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Reminder updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update reminder')
    },
  })
}

export function useDeleteReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => remindersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Reminder deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete reminder')
    },
  })
}

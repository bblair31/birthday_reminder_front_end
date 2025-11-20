import { useParams } from '@tanstack/react-router'
import { ReminderForm } from './reminder-form'
import { useReminder } from '@/hooks/use-reminders'
import { Skeleton } from '@/components/ui/skeleton'

export function EditReminderPage() {
  const { id } = useParams({ from: '/reminders/$id/edit' })
  const { data: reminder, isLoading } = useReminder(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
      </div>
    )
  }

  if (!reminder) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Reminder not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Reminder</h1>
        <p className="text-muted-foreground">
          Update {reminder.person_name}'s birthday reminder
        </p>
      </div>
      <ReminderForm reminder={reminder} isEdit />
    </div>
  )
}

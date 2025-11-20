import { useNavigate } from '@tanstack/react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateReminder, useUpdateReminder } from '@/hooks/use-reminders'
import { cn } from '@/lib/utils'
import { RELATIONSHIP_OPTIONS } from '@/types'
import type { Reminder } from '@/types'

const reminderSchema = z.object({
  person_name: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(1, 'Please select a relationship'),
  birthday: z.date({ required_error: 'Please select a birthday' }),
  notes: z.string().optional(),
  phone: z.string().optional(),
  send_reminder: z.boolean().default(true),
})

type ReminderFormData = z.infer<typeof reminderSchema>

interface ReminderFormProps {
  reminder?: Reminder
  isEdit?: boolean
}

export function ReminderForm({ reminder, isEdit = false }: ReminderFormProps) {
  const navigate = useNavigate()
  const { mutate: createReminder, isPending: isCreating } = useCreateReminder()
  const { mutate: updateReminder, isPending: isUpdating } = useUpdateReminder()

  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder
      ? {
          person_name: reminder.person_name,
          relationship: reminder.relationship,
          birthday: new Date(reminder.birthday),
          notes: reminder.notes || '',
          phone: reminder.phone || '',
          send_reminder: reminder.send_reminder,
        }
      : {
          send_reminder: true,
        },
  })

  const onSubmit = (data: ReminderFormData) => {
    const formattedData = {
      person_name: data.person_name,
      relationship: data.relationship,
      birthday: format(data.birthday, 'yyyy-MM-dd'),
      notes: data.notes,
      phone: data.phone,
      send_reminder: data.send_reminder,
    }

    if (isEdit && reminder) {
      updateReminder(
        { id: reminder.id, data: formattedData },
        {
          onSuccess: () => {
            navigate({ to: '/' })
          },
        }
      )
    } else {
      createReminder(formattedData, {
        onSuccess: () => {
          navigate({ to: '/' })
        },
      })
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Reminder' : 'Add New Reminder'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="person_name">Name</Label>
              <Input
                id="person_name"
                placeholder="Enter person's name"
                {...register('person_name')}
                disabled={isPending}
              />
              {errors.person_name && (
                <p className="text-sm text-destructive">
                  {errors.person_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Controller
                name="relationship"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.relationship && (
                <p className="text-sm text-destructive">
                  {errors.relationship.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Birthday</Label>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.birthday && (
              <p className="text-sm text-destructive">
                {errors.birthday.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input
              id="phone"
              placeholder="Enter phone number for SMS"
              {...register('phone')}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Gift ideas, preferences, etc."
              {...register('notes')}
              disabled={isPending}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="send_reminder"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="send_reminder"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Label htmlFor="send_reminder" className="text-sm font-normal">
              Send me a reminder before their birthday
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Reminder' : 'Create Reminder'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

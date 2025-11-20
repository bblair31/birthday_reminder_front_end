import { useState } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Trash2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useMessages,
  useCreateMessage,
  useSendMessage,
  useDeleteMessage,
} from '@/hooks/use-messages'
import { useReminders } from '@/hooks/use-reminders'
import type { Message } from '@/types'

const messageSchema = z.object({
  reminder_id: z.string().min(1, 'Please select a person'),
  content: z.string().min(1, 'Message content is required'),
})

type MessageFormData = z.infer<typeof messageSchema>

export function MessagesPage() {
  const search = useSearch({ strict: false })
  const reminderId = (search as { reminderId?: string }).reminderId
  const { data: messages, isLoading } = useMessages()
  const { data: reminders } = useReminders()
  const { mutate: createMessage, isPending: isCreating } = useCreateMessage()
  const { mutate: sendMessage } = useSendMessage()
  const { mutate: deleteMessage } = useDeleteMessage()
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      reminder_id: reminderId || '',
    },
  })

  const onSubmit = (data: MessageFormData) => {
    createMessage(data, {
      onSuccess: () => {
        reset()
        setDialogOpen(false)
      },
    })
  }

  const messageTemplates = [
    "Happy Birthday! Wishing you a fantastic day filled with joy and celebration!",
    "Happy Birthday! May your special day be filled with love, laughter, and all your favorite things!",
    "Wishing you the happiest of birthdays! May this year bring you everything you've been hoping for!",
    "Happy Birthday! Here's to another year of adventures and amazing memories!",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Send birthday wishes to your loved ones
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create Message</DialogTitle>
                <DialogDescription>
                  Compose a birthday message to send via SMS
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reminder_id">Recipient</Label>
                  <Select
                    defaultValue={reminderId}
                    onValueChange={(value) => setValue('reminder_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a person" />
                    </SelectTrigger>
                    <SelectContent>
                      {reminders?.map((reminder) => (
                        <SelectItem key={reminder.id} value={reminder.id}>
                          {reminder.person_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.reminder_id && (
                    <p className="text-sm text-destructive">
                      {errors.reminder_id.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Type your birthday message..."
                    {...register('content')}
                    rows={4}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Quick Templates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {messageTemplates.map((template, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto py-2 px-3 text-xs text-left justify-start"
                        onClick={() => setValue('content', template)}
                      >
                        {template.slice(0, 30)}...
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Message
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : messages && messages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((message, index) => (
            <MessageCard
              key={message.id}
              message={message}
              reminders={reminders}
              onSend={sendMessage}
              onDelete={deleteMessage}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No messages yet</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface MessageCardProps {
  message: Message
  reminders?: Array<{ id: string; person_name: string }>
  onSend: (id: string) => void
  onDelete: (id: string) => void
  index: number
}

function MessageCard({
  message,
  reminders,
  onSend,
  onDelete,
  index,
}: MessageCardProps) {
  const reminder = reminders?.find((r) => r.id === message.reminder_id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {reminder?.person_name || 'Unknown'}
            </CardTitle>
            {message.sent_at ? (
              <Badge variant="secondary">Sent</Badge>
            ) : (
              <Badge>Draft</Badge>
            )}
          </div>
          <CardDescription>
            {message.sent_at
              ? `Sent ${format(new Date(message.sent_at), 'PPp')}`
              : `Created ${format(new Date(message.created_at), 'PPp')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {message.content}
          </p>
          <div className="flex gap-2">
            {!message.sent_at && (
              <Button
                size="sm"
                onClick={() => onSend(message.id)}
                className="flex-1"
              >
                <Send className="mr-2 h-3 w-3" />
                Send
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(message.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

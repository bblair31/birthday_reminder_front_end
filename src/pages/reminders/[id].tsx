import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Edit,
  Gift,
  MessageSquare,
  Phone,
  Trash2,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useReminder, useDeleteReminder } from '@/hooks/use-reminders'
import {
  calculateAge,
  formatDate,
  getDaysUntilBirthday,
  getInitials,
  getRelationshipEmoji,
} from '@/lib/utils'

export function ReminderDetailPage() {
  const { id } = useParams({ from: '/reminders/$id' })
  const navigate = useNavigate()
  const { data: reminder, isLoading } = useReminder(id)
  const { mutate: deleteReminder, isPending: isDeleting } = useDeleteReminder()

  const handleDelete = () => {
    deleteReminder(id, {
      onSuccess: () => {
        navigate({ to: '/' })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reminder) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Reminder not found</p>
        <Link to="/">
          <Button variant="link">Go back to dashboard</Button>
        </Link>
      </div>
    )
  }

  const daysUntil = getDaysUntilBirthday(reminder.birthday)
  const age = calculateAge(reminder.birthday)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Reminder Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(reminder.person_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{reminder.person_name}</h2>
                    <span className="text-2xl">
                      {getRelationshipEmoji(reminder.relationship)}
                    </span>
                  </div>
                  <p className="text-muted-foreground capitalize">
                    {reminder.relationship}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/reminders/${reminder.id}/edit`}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this reminder for{' '}
                        {reminder.person_name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Birthday</p>
                  <p className="font-medium">
                    {formatDate(reminder.birthday, 'long')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{age} years old</p>
                </div>
              </div>

              {reminder.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{reminder.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {reminder.notes && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Notes & Gift Ideas
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {reminder.notes}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Countdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {daysUntil === 0 ? (
                  <div>
                    <p className="text-4xl font-bold text-primary">Today!</p>
                    <p className="text-muted-foreground mt-2">
                      It's their birthday!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl font-bold">{daysUntil}</p>
                    <p className="text-muted-foreground">
                      days until their birthday
                    </p>
                  </div>
                )}
                {daysUntil === 0 && (
                  <Badge className="mt-4">
                    Turning {age + 1}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to={`/messages/new`}
                search={{ reminderId: reminder.id }}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Birthday Message
                </Button>
              </Link>
              <Link to={`/reminders/${reminder.id}/edit`} className="w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Reminder
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

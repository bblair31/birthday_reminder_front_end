import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Gift, MessageSquare, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatDate,
  getDaysUntilBirthday,
  getInitials,
  getRelationshipEmoji,
  calculateAge,
} from '@/lib/utils'
import type { Reminder } from '@/types'

interface UpcomingListProps {
  reminders?: Reminder[]
  isLoading?: boolean
}

export function UpcomingList({ reminders, isLoading }: UpcomingListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!reminders || reminders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No upcoming birthdays in the next 30 days</p>
        <Link to="/reminders/new">
          <Button variant="link">Add your first reminder</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder, index) => (
        <motion.div
          key={reminder.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(reminder.person_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{reminder.person_name}</p>
              <span>{getRelationshipEmoji(reminder.relationship)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDate(reminder.birthday, 'long')}</span>
              <span>·</span>
              <span>Turning {calculateAge(reminder.birthday) + 1}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CountdownBadge daysUntil={getDaysUntilBirthday(reminder.birthday)} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/reminders/${reminder.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/messages/new?reminderId=${reminder.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CountdownBadge({ daysUntil }: { daysUntil: number }) {
  if (daysUntil === 0) {
    return (
      <Badge className="bg-primary">
        <Gift className="h-3 w-3 mr-1" />
        Today!
      </Badge>
    )
  }

  if (daysUntil === 1) {
    return <Badge variant="secondary">Tomorrow</Badge>
  }

  if (daysUntil <= 7) {
    return <Badge variant="outline">{daysUntil} days</Badge>
  }

  return (
    <span className="text-sm text-muted-foreground">
      {daysUntil} days
    </span>
  )
}

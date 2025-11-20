import { motion } from 'framer-motion'
import { Gift, PartyPopper } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpcomingReminders } from '@/hooks/use-reminders'
import { formatDate, getDaysUntilBirthday, getInitials, getRelationshipEmoji } from '@/lib/utils'
import type { Reminder } from '@/types'

export function Sidebar() {
  const { data: upcomingReminders, isLoading } = useUpcomingReminders(15)

  return (
    <aside className="w-80 hidden lg:block">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PartyPopper className="h-5 w-5 text-primary" />
            Upcoming Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </>
          ) : upcomingReminders && upcomingReminders.length > 0 ? (
            <div className="space-y-3">
              {upcomingReminders.slice(0, 5).map((reminder, index) => (
                <UpcomingBirthdayItem
                  key={reminder.id}
                  reminder={reminder}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming birthdays in the next 15 days
            </p>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}

function UpcomingBirthdayItem({
  reminder,
  index,
}: {
  reminder: Reminder
  index: number
}) {
  const daysUntil = getDaysUntilBirthday(reminder.birthday)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {getInitials(reminder.person_name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{reminder.person_name}</p>
          <span className="text-sm">{getRelationshipEmoji(reminder.relationship)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(reminder.birthday)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        {daysUntil === 0 ? (
          <Badge variant="default" className="text-xs">
            <Gift className="h-3 w-3 mr-1" />
            Today!
          </Badge>
        ) : daysUntil === 1 ? (
          <Badge variant="secondary" className="text-xs">
            Tomorrow
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">
            {daysUntil} days
          </span>
        )}
      </div>
    </motion.div>
  )
}

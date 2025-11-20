import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  getDate,
  getMonth,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useReminders } from '@/hooks/use-reminders'
import { cn, getInitials } from '@/lib/utils'
import type { Reminder } from '@/types'

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { data: reminders, isLoading } = useReminders()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  const getReminderForDate = (date: Date): Reminder[] => {
    if (!reminders) return []

    return reminders.filter((reminder) => {
      const birthday = new Date(reminder.birthday)
      return (
        getDate(birthday) === getDate(date) &&
        getMonth(birthday) === getMonth(date)
      )
    })
  }

  const selectedReminders = useMemo(() => {
    if (!selectedDate) return []
    return getReminderForDate(selectedDate)
  }, [selectedDate, reminders])

  const today = new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View all birthdays at a glance
          </p>
        </div>
        <Link to="/reminders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="bg-background p-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const dayReminders = getReminderForDate(day)
                  const isCurrentMonth = isSameMonth(day, currentMonth)
                  const isToday = isSameDay(day, today)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <motion.button
                      key={day.toString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'relative bg-background p-2 h-24 text-left hover:bg-muted/50 transition-colors',
                        !isCurrentMonth && 'text-muted-foreground/50',
                        isSelected && 'ring-2 ring-primary ring-inset',
                        isToday && 'bg-primary/5'
                      )}
                    >
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isToday &&
                            'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center'
                        )}
                      >
                        {format(day, 'd')}
                      </span>

                      {dayReminders.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {dayReminders.slice(0, 2).map((reminder) => (
                            <div
                              key={reminder.id}
                              className="text-xs truncate px-1 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {reminder.person_name}
                            </div>
                          ))}
                          {dayReminders.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayReminders.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected date details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? format(selectedDate, 'MMMM d')
                : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedReminders.length > 0 ? (
                <div className="space-y-4">
                  {selectedReminders.map((reminder) => (
                    <Link
                      key={reminder.id}
                      to={`/reminders/${reminder.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(reminder.person_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{reminder.person_name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {reminder.relationship}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No birthdays on this date
                </p>
              )
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Click on a date to see birthdays
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

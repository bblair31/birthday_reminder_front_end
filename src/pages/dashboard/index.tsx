import { motion } from 'framer-motion'
import { Calendar, Gift, MessageSquare, Plus, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStats } from '@/hooks/use-users'
import { useUpcomingReminders } from '@/hooks/use-reminders'
import { StatsChart } from '@/components/dashboard/stats-chart'
import { RelationshipChart } from '@/components/dashboard/relationship-chart'
import { UpcomingList } from '@/components/dashboard/upcoming-list'

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useUserStats()
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingReminders(30)

  const statCards = [
    {
      title: 'Total Reminders',
      value: stats?.total_reminders || 0,
      icon: Users,
      description: 'People you remember',
    },
    {
      title: 'This Month',
      value: stats?.upcoming_this_month || 0,
      icon: Calendar,
      description: 'Birthdays this month',
    },
    {
      title: 'Messages Sent',
      value: stats?.messages_sent || 0,
      icon: MessageSquare,
      description: 'Birthday wishes delivered',
    },
    {
      title: 'Upcoming',
      value: upcoming?.length || 0,
      icon: Gift,
      description: 'In the next 30 days',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your birthdays.
          </p>
        </div>
        <Link to="/reminders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading || upcomingLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Birthdays by Month</CardTitle>
            <CardDescription>
              Distribution of birthdays throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <StatsChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>By Relationship</CardTitle>
            <CardDescription>
              Breakdown by relationship type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RelationshipChart data={stats?.relationships} />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Birthdays</CardTitle>
          <CardDescription>
            Birthdays in the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingList reminders={upcoming} isLoading={upcomingLoading} />
        </CardContent>
      </Card>
    </div>
  )
}

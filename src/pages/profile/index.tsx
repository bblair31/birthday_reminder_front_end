import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  Calendar,
  Mail,
  MessageSquare,
  User,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/stores/auth-store'
import { useUserStats } from '@/hooks/use-users'
import { getInitials } from '@/lib/utils'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const { data: stats, isLoading: statsLoading } = useUserStats()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View your account information and statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Separator className="my-4" />
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Joined {format(new Date(user.created_at), 'MMMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Statistics</CardTitle>
            <CardDescription>
              Overview of your birthday reminder activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats?.total_reminders || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Reminders
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats?.upcoming_this_month || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This Month
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats?.messages_sent || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Messages Sent
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats?.relationships
                          ? Object.keys(stats.relationships).length
                          : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Relationship Types
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

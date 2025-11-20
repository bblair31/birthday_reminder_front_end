import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Moon,
  Palette,
  Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeStore } from '@/stores/theme-store'
import { useChangePassword } from '@/hooks/use-auth'

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function SettingsPage() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const { mutate: changePassword, isPending } = useChangePassword()
  const [showPasswords, setShowPasswords] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        reset()
      },
    })
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setPushEnabled(true)
        new Notification('Birthday Reminder', {
          body: 'Push notifications are now enabled!',
          icon: '/favicon.svg',
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how the app looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select your preferred theme
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-5 w-5" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-5 w-5" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setTheme('system')}
                    >
                      <div className="flex">
                        <Sun className="h-4 w-4" />
                        <Moon className="h-4 w-4" />
                      </div>
                      <span>System</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser notifications for upcoming birthdays
                    </p>
                  </div>
                  <Switch
                    checked={pushEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestNotificationPermission()
                      } else {
                        setPushEnabled(false)
                      }
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email reminders before birthdays
                    </p>
                  </div>
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPasswords ? 'text' : 'password'}
                        {...register('current_password')}
                        disabled={isPending}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.current_password && (
                      <p className="text-sm text-destructive">
                        {errors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type={showPasswords ? 'text' : 'password'}
                      {...register('password')}
                      disabled={isPending}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                      Confirm New Password
                    </Label>
                    <Input
                      id="password_confirmation"
                      type={showPasswords ? 'text' : 'password'}
                      {...register('password_confirmation')}
                      disabled={isPending}
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm text-destructive">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

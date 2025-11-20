import { useEffect } from 'react'
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { initializeTheme } from '@/stores/theme-store'
import { AppLayout } from '@/components/layout/app-layout'
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { ForgotPasswordPage } from '@/pages/auth/forgot-password'
import { ResetPasswordPage } from '@/pages/auth/reset-password'
import { DashboardPage } from '@/pages/dashboard'
import { CalendarPage } from '@/pages/calendar'
import { MessagesPage } from '@/pages/messages'
import { ProfilePage } from '@/pages/profile'
import { SettingsPage } from '@/pages/settings'
import { NewReminderPage } from '@/pages/reminders/new'
import { ReminderDetailPage } from '@/pages/reminders/[id]'
import { EditReminderPage } from '@/pages/reminders/edit'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-right" richColors />
    </>
  ),
})

// Auth check helper
const requireAuth = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated
  if (!isAuthenticated) {
    throw redirect({ to: '/login' })
  }
}

const requireGuest = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated
  if (isAuthenticated) {
    throw redirect({ to: '/' })
  }
}

// Auth routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: requireGuest,
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: requireGuest,
  component: RegisterPage,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  beforeLoad: requireGuest,
  component: ForgotPasswordPage,
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  beforeLoad: requireGuest,
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
  }),
})

// App layout route (protected)
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  beforeLoad: requireAuth,
  component: AppLayout,
})

// Dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: DashboardPage,
})

// Calendar
const calendarRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/calendar',
  component: CalendarPage,
})

// Messages
const messagesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/messages',
  component: MessagesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    reminderId: search.reminderId as string | undefined,
  }),
})

// Profile
const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/profile',
  component: ProfilePage,
})

// Settings
const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

// Reminders
const newReminderRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/reminders/new',
  component: NewReminderPage,
})

const reminderDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/reminders/$id',
  component: ReminderDetailPage,
})

const editReminderRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/reminders/$id/edit',
  component: EditReminderPage,
})

// Not found
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-4">Page not found</p>
        <a href="/" className="text-primary hover:underline">
          Go home
        </a>
      </div>
    </div>
  ),
})

// Create route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    calendarRoute,
    messagesRoute,
    profileRoute,
    settingsRoute,
    newReminderRoute,
    reminderDetailRoute,
    editReminderRoute,
  ]),
  notFoundRoute,
])

// Create router
const router = createRouter({ routeTree })

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  useEffect(() => {
    initializeTheme()
    useAuthStore.getState().setLoading(false)
  }, [])

  return <RouterProvider router={router} />
}

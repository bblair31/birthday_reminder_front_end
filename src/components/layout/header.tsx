import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Cake,
  Calendar,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { useLogout } from '@/hooks/use-auth'
import { getInitials } from '@/lib/utils'
import { useState } from 'react'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Cake className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Birthday Reminder
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
            >
              <Home className="h-4 w-4 inline-block mr-1" />
              Dashboard
            </Link>
            <Link
              to="/calendar"
              className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
            >
              <Calendar className="h-4 w-4 inline-block mr-1" />
              Calendar
            </Link>
            <Link
              to="/messages"
              className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
            >
              <MessageSquare className="h-4 w-4 inline-block mr-1" />
              Messages
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t"
        >
          <nav className="container py-4 flex flex-col space-y-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/calendar"
              className="flex items-center space-x-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Link>
            <Link
              to="/messages"
              className="flex items-center space-x-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

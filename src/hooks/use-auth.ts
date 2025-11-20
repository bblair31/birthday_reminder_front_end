import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import authApi from '@/api/auth'
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types'
import { toast } from 'sonner'

export function useLogin() {
  const login = useAuthStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.token, data.refresh_token)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Welcome back!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to login')
    },
  })
}

export function useRegister() {
  const login = useAuthStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: (data) => {
      login(data.user, data.token, data.refresh_token)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Account created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged out successfully')
    },
    onError: () => {
      // Still logout on error
      logout()
      queryClient.clear()
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success('Password reset email sent!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email')
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password')
    },
  })
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const user = await authApi.getCurrentUser()
      setUser(user)
      return user
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

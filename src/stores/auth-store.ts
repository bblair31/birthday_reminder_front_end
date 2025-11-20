import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  setUser: (user: User) => void
  setTokens: (token: string, refreshToken: string) => void
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user }),

      setTokens: (token, refreshToken) => set({ token, refreshToken }),

      login: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

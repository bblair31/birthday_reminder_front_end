import { Outlet } from '@tanstack/react-router'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { Toaster } from 'sonner'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-6">
        <div className="flex gap-6">
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
          <Sidebar />
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}

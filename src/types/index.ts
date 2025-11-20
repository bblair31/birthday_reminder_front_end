// User types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface UserStats {
  total_reminders: number
  upcoming_this_month: number
  messages_sent: number
  relationships: Record<string, number>
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  password_confirmation: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
  refresh_token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordRequest {
  current_password: string
  password: string
  password_confirmation: string
}

// Reminder types
export interface Reminder {
  id: string
  user_id: string
  person_name: string
  relationship: string
  birthday: string
  notes: string | null
  phone: string | null
  send_reminder: boolean
  created_at: string
  updated_at: string
}

export interface CreateReminderRequest {
  person_name: string
  relationship: string
  birthday: string
  notes?: string
  phone?: string
  send_reminder?: boolean
}

export interface UpdateReminderRequest {
  person_name?: string
  relationship?: string
  birthday?: string
  notes?: string
  phone?: string
  send_reminder?: boolean
}

// Message types
export interface Message {
  id: string
  reminder_id: string
  content: string
  sent_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateMessageRequest {
  reminder_id: string
  content: string
}

export interface UpdateMessageRequest {
  content?: string
}

// API response types
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

// Health check types
export interface HealthCheck {
  status: 'ok' | 'error'
  timestamp: string
}

export interface DetailedHealthCheck extends HealthCheck {
  database: 'connected' | 'disconnected'
  redis?: 'connected' | 'disconnected'
  version: string
}

// Notification types
export interface NotificationPreferences {
  push_enabled: boolean
  email_enabled: boolean
  days_before: number
}

// Chart data types
export interface ChartDataPoint {
  name: string
  value: number
}

export interface MonthlyBirthdayData {
  month: string
  count: number
}

// Calendar types
export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  reminders: Reminder[]
}

// Form types
export type RelationshipType =
  | 'family'
  | 'friend'
  | 'colleague'
  | 'partner'
  | 'parent'
  | 'sibling'
  | 'child'
  | 'other'

export const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: 'family', label: 'Family' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'partner', label: 'Partner' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'child', label: 'Child' },
  { value: 'other', label: 'Other' },
]

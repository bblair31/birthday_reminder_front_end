import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const now = new Date()
    const diff = d.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days < 7) return `In ${days} days`
    if (days < 30) return `In ${Math.ceil(days / 7)} weeks`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function calculateAge(birthday: Date | string): number {
  const birthDate = typeof birthday === 'string' ? new Date(birthday) : birthday
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function getDaysUntilBirthday(birthday: Date | string): number {
  const birthDate = typeof birthday === 'string' ? new Date(birthday) : birthday
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const nextBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  )

  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }

  const diffTime = nextBirthday.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getRelationshipEmoji(relationship: string): string {
  const relationshipMap: Record<string, string> = {
    family: '👨‍👩‍👧‍👦',
    friend: '👋',
    colleague: '💼',
    partner: '❤️',
    parent: '👨‍👩‍👧',
    sibling: '👫',
    child: '👶',
    other: '🎂',
  }

  return relationshipMap[relationship.toLowerCase()] || '🎂'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

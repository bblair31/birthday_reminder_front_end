import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  calculateAge,
  getDaysUntilBirthday,
  getRelationshipEmoji,
  getInitials,
} from './utils'

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('formatDate', () => {
  it('formats date in short format', () => {
    const date = new Date('2024-03-15')
    expect(formatDate(date, 'short')).toBe('Mar 15')
  })

  it('handles string dates', () => {
    expect(formatDate('2024-03-15', 'short')).toBe('Mar 15')
  })

  it('formats relative dates', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(formatDate(tomorrow, 'relative')).toBe('Tomorrow')
  })
})

describe('calculateAge', () => {
  it('calculates age correctly', () => {
    const today = new Date()
    const birthYear = today.getFullYear() - 25
    const birthday = new Date(birthYear, 0, 1)
    expect(calculateAge(birthday)).toBe(25)
  })

  it('handles birthdays later in the year', () => {
    const today = new Date()
    const birthday = new Date(today.getFullYear() - 30, 11, 31)
    const age = calculateAge(birthday)
    expect(age).toBeGreaterThanOrEqual(29)
    expect(age).toBeLessThanOrEqual(30)
  })
})

describe('getDaysUntilBirthday', () => {
  it('returns 0 for today', () => {
    const today = new Date()
    expect(getDaysUntilBirthday(today)).toBe(0)
  })

  it('returns positive number for future dates', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(getDaysUntilBirthday(tomorrow)).toBe(1)
  })
})

describe('getRelationshipEmoji', () => {
  it('returns correct emoji for family', () => {
    expect(getRelationshipEmoji('family')).toBe('👨‍👩‍👧‍👦')
  })

  it('returns correct emoji for friend', () => {
    expect(getRelationshipEmoji('friend')).toBe('👋')
  })

  it('returns default emoji for unknown relationship', () => {
    expect(getRelationshipEmoji('unknown')).toBe('🎂')
  })
})

describe('getInitials', () => {
  it('returns initials for full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('handles single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('handles multiple names', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })
})

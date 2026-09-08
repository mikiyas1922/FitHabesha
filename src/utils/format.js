export const FITNESS_GOAL_OPTIONS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_building', label: 'Muscle Building' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'general_fitness', label: 'General Fitness' },
]

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

/** Local calendar date as YYYY-MM-DD (avoids UTC shift from toISOString). */
export function formatLocalDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return ''
  const birth = new Date(dateOfBirth)
  if (Number.isNaN(birth.getTime())) return ''

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }

  return String(age)
}

export function formatFitnessGoal(goal) {
  return FITNESS_GOAL_OPTIONS.find((option) => option.value === goal)?.label || goal || 'Not set'
}

export function getInitials(firstName, lastName, email) {
  const name = `${firstName || ''} ${lastName || ''}`.trim()
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return email?.slice(0, 2).toUpperCase() || 'U'
}

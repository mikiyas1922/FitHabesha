import { roleLabels, roleUsers } from '../config/navigation'

export const BACKEND_TO_FRONTEND_ROLE = {
  admin: 'admin',
  trainer: 'trainer',
  reception: 'receptionist',
  receptionist: 'receptionist',
  member: 'member',
}

export const FRONTEND_TO_BACKEND_ROLE = {
  admin: 'admin',
  trainer: 'trainer',
  receptionist: 'reception',
  reception: 'reception',
  member: 'member',
}

export function mapBackendRole(role) {
  if (!role || typeof role !== 'string') return ''
  const normalized = role.trim().toLowerCase()
  return BACKEND_TO_FRONTEND_ROLE[normalized] || normalized
}

export function getDashboardPath(role) {
  const frontendRole = mapBackendRole(role)
  const paths = {
    admin: '/admin',
    trainer: '/trainer',
    receptionist: '/receptionist',
    member: '/member',
  }
  return paths[frontendRole] || '/login'
}

export function getSettingsPath(role) {
  const frontendRole = mapBackendRole(role)
  return `/${frontendRole}/settings`
}

export function getUserDisplay(user, fallbackRole) {
  if (user) {
    const name =
      `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() ||
      user.email ||
      'User'
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const frontendRole = mapBackendRole(user.role)

    return {
      name,
      title: roleLabels[frontendRole] || user.role,
      initials: initials || 'U',
    }
  }

  return roleUsers[fallbackRole]
}

/** Roles allowed by POST /admin/register */
export const ADMIN_REGISTER_ROLES = ['member', 'trainer', 'reception']

/** Roles admin can create from Staff page */
export const ADMIN_STAFF_ROLES = [
  {
    value: 'trainer',
    label: 'Trainer',
    description: 'Coach who manages clients, schedules, and fitness plans.',
  },
  {
    value: 'reception',
    label: 'Receptionist',
    description: 'Front desk staff for check-ins, walk-ins, and locker management.',
  },
]

export const INITIAL_STAFF_FORM = {
  role: 'trainer',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

/** Roles admin can create from Members page */
export const ADMIN_MEMBER_ROLE = {
  value: 'member',
  label: 'Member',
  description: 'Gym member with access to classes, workouts, and subscriptions.',
}

export const INITIAL_MEMBER_FORM = {
  ...INITIAL_STAFF_FORM,
  role: 'member',
}

export function validateRegisterForm(formData, allowedRoles) {
  if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
    return 'First name, last name, and email are required.'
  }

  if (!allowedRoles.includes(formData.role)) {
    return 'Invalid role selected.'
  }

  if (!formData.password || formData.password.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.'
  }

  return ''
}

export function validateStaffForm(formData) {
  return validateRegisterForm(
    formData,
    ADMIN_STAFF_ROLES.map((role) => role.value)
  )
}

export function validateMemberForm(formData) {
  return validateRegisterForm(formData, ['member'])
}

/**
 * Builds request body for POST /admin/register
 * @see https://gym-management-system-backend-xb5m.onrender.com/api-docs/
 */
export function buildStaffRegisterPayload(formData) {
  return {
    email: formData.email.trim(),
    password: formData.password,
    first_name: formData.firstName.trim(),
    last_name: formData.lastName.trim(),
    // Backend INSERT always binds phone — omitting it causes Knex "Undefined binding [4]"
    phone: formData.phone?.trim() || '',
    role: formData.role,
  }
}

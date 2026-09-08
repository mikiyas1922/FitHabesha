import { Dumbbell, User } from 'lucide-react'

export const INITIAL_REGISTRATION_FORM = {
  role: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  password: '',
  confirmPassword: '',
  weight: '',
  height: '',
  targetWeight: '',
  dateOfBirth: '',
  bloodType: '',
  gender: 'male',
  fitnessGoal: 'general_fitness',
  dietaryRestrictions: '',
  specialty: '',
  yearsOfExperience: '',
  certification: '',
  hourlyRate: '',
  bio: '',
}

export const REGISTRATION_STEP_IDS = {
  ACCOUNT: 'account',
  ROLE: 'role',
  MEMBER_HEALTH: 'memberHealth',
  TRAINER_PROFILE: 'trainerProfile',
  CONFIRM: 'confirm',
}

function validatePasswords(formData) {
  if (formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.'
  }
  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  return ''
}

function validateAccountStep(formData) {
  const passwordError = validatePasswords(formData)
  if (passwordError) return passwordError

  if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
    return 'Please fill in all required account fields.'
  }

  return ''
}

function validateRoleStep(formData, roleConfig) {
  if (!formData.role) {
    return 'Please select how you want to join.'
  }

  if (roleConfig?.account?.emergencyContact) {
    if (!formData.emergencyContactName || !formData.emergencyContactPhone) {
      return 'Emergency contact is required for members.'
    }
  }

  return ''
}

function validateMemberHealthStep(formData) {
  if (!formData.weight || !formData.height || !formData.dateOfBirth) {
    return 'Please fill in all required health profile fields.'
  }
  return ''
}

function validateTrainerProfileStep(formData) {
  if (!formData.specialty || !formData.yearsOfExperience || !formData.certification || !formData.hourlyRate) {
    return 'Please fill in all required trainer profile fields.'
  }
  if (Number(formData.yearsOfExperience) < 0) {
    return 'Years of experience must be 0 or greater.'
  }
  if (Number(formData.hourlyRate) <= 0) {
    return 'Hourly rate must be greater than 0.'
  }
  return ''
}

export const REGISTRATION_STEP_VALIDATORS = {
  [REGISTRATION_STEP_IDS.ACCOUNT]: validateAccountStep,
  [REGISTRATION_STEP_IDS.ROLE]: validateRoleStep,
  [REGISTRATION_STEP_IDS.MEMBER_HEALTH]: validateMemberHealthStep,
  [REGISTRATION_STEP_IDS.TRAINER_PROFILE]: validateTrainerProfileStep,
  [REGISTRATION_STEP_IDS.CONFIRM]: validatePasswords,
}

function omitEmptyFields(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  )
}

function buildBaseAccountPayload(formData, role) {
  return omitEmptyFields({
    email: formData.email,
    password: formData.password,
    first_name: formData.firstName,
    last_name: formData.lastName,
    role,
    phone: formData.phone,
  })
}

export const REGISTRATION_ROLES = {
  member: {
    role: 'member',
    label: 'Member',
    icon: User,
    description: 'Train & track progress',
    profileStepIds: [REGISTRATION_STEP_IDS.MEMBER_HEALTH],
    account: {
      emergencyContact: true,
    },
    buildRegisterPayload(formData) {
      return {
        data: omitEmptyFields({
          ...buildBaseAccountPayload(formData, 'member'),
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          blood_type: formData.bloodType,
          dietary_restrictions: formData.dietaryRestrictions,
          fitness_goal: formData.fitnessGoal,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
        }),
        profileExtra: {
          weight: formData.weight,
          height: formData.height,
          target_weight: formData.targetWeight,
        },
      }
    },
    termsNote:
      ' I understand that my health information will be used to create personalized fitness plans.',
  },
  trainer: {
    role: 'trainer',
    label: 'Trainer',
    icon: Dumbbell,
    description: 'Coach & manage clients',
    profileStepIds: [REGISTRATION_STEP_IDS.TRAINER_PROFILE],
    account: {
      emergencyContact: false,
    },
    buildRegisterPayload(formData) {
      return {
        data: omitEmptyFields({
          ...buildBaseAccountPayload(formData, 'trainer'),
          specialty: formData.specialty,
          years_of_experience: Number(formData.yearsOfExperience),
          certification: formData.certification,
          hourly_rate: Number(formData.hourlyRate),
          bio: formData.bio,
        }),
        profileExtra: {
          specialty: formData.specialty,
          years_of_experience: Number(formData.yearsOfExperience),
          certification: formData.certification,
          hourly_rate: Number(formData.hourlyRate),
          bio: formData.bio,
        },
      }
    },
    termsNote: ' I confirm that my certification details are accurate.',
  },
}

export const JOIN_AS_OPTIONS = Object.values(REGISTRATION_ROLES).map(
  ({ role, label, icon, description }) => ({
    value: role,
    label,
    icon,
    desc: description,
  })
)

export function getRegistrationRoleConfig(role) {
  return REGISTRATION_ROLES[role] ?? null
}

export function getRegistrationStepIds(role) {
  const roleConfig = role ? REGISTRATION_ROLES[role] : null
  const profileSteps = roleConfig?.profileStepIds ?? []

  return [
    REGISTRATION_STEP_IDS.ACCOUNT,
    REGISTRATION_STEP_IDS.ROLE,
    ...profileSteps,
    REGISTRATION_STEP_IDS.CONFIRM,
  ]
}

const STEP_LABELS = {
  [REGISTRATION_STEP_IDS.ACCOUNT]: 'Account ID',
  [REGISTRATION_STEP_IDS.ROLE]: 'Join As',
  [REGISTRATION_STEP_IDS.MEMBER_HEALTH]: 'Health Profile',
  [REGISTRATION_STEP_IDS.TRAINER_PROFILE]: 'Trainer Profile',
  [REGISTRATION_STEP_IDS.CONFIRM]: 'Confirm',
}

export function getRegistrationStepLabels(role) {
  return getRegistrationStepIds(role).map((stepId) => STEP_LABELS[stepId])
}

export function validateRegistrationStep(stepId, formData, roleConfig) {
  const validator = REGISTRATION_STEP_VALIDATORS[stepId]
  if (!validator) return ''
  return validator(formData, roleConfig)
}

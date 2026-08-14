import { STORAGE_KEYS } from '../constants/storage'

const PROFILES_KEY = STORAGE_KEYS.MEMBER_PROFILES

function readProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

function getUserId(user) {
  return user?.id || user?.user_id || user?.email
}

export const profileStorage = {
  getProfile(userId) {
    if (!userId) return null
    return readProfiles()[userId] || null
  },

  saveProfile(userId, profile) {
    if (!userId) return

    const profiles = readProfiles()
    profiles[userId] = {
      ...profiles[userId],
      ...profile,
      updated_at: new Date().toISOString(),
    }
    writeProfiles(profiles)
    return profiles[userId]
  },

  mergeWithUser(user) {
    if (!user) return user

    const userId = getUserId(user)
    const storedProfile = this.getProfile(userId)

    if (!storedProfile) return user

    return {
      ...storedProfile,
      ...user,
      phone: user.phone ?? storedProfile.phone,
      unique_member_id: user.unique_member_id ?? storedProfile.unique_member_id,
      date_of_birth: user.date_of_birth ?? storedProfile.date_of_birth,
      gender: user.gender ?? storedProfile.gender,
      blood_type: user.blood_type ?? storedProfile.blood_type,
      dietary_restrictions: user.dietary_restrictions ?? storedProfile.dietary_restrictions,
      fitness_goal: user.fitness_goal ?? storedProfile.fitness_goal,
      emergency_contact_name:
        user.emergency_contact_name ?? storedProfile.emergency_contact_name,
      emergency_contact_phone:
        user.emergency_contact_phone ?? storedProfile.emergency_contact_phone,
      weight: storedProfile.weight,
      height: storedProfile.height,
      target_weight: storedProfile.target_weight,
      specialty: user.specialty ?? storedProfile.specialty,
      years_of_experience: user.years_of_experience ?? storedProfile.years_of_experience,
      certification: user.certification ?? storedProfile.certification,
      hourly_rate: user.hourly_rate ?? storedProfile.hourly_rate,
      bio: user.bio ?? storedProfile.bio,
    }
  },

  clearTrainerApprovalStatus(userId) {
    if (!userId) return

    const profiles = readProfiles()
    if (!profiles[userId]) return

    delete profiles[userId].approval_status
    writeProfiles(profiles)
  },

  listTrainersByStatus(status) {
    const profiles = readProfiles()

    return Object.entries(profiles)
      .filter(([, profile]) => {
        if (profile.role !== 'trainer') return false
        const profileStatus = profile.approval_status || 'approved'
        if (status === null) return true
        return profileStatus === status
      })
      .map(([id, profile]) => ({
        id,
        user_id: profile.user_id || profile.id || id,
        name: `${profile.first_name || profile.firstName || ''} ${profile.last_name || profile.lastName || ''}`.trim(),
        email: profile.email,
        specialty: profile.specialty,
        certification: profile.certification,
        years_of_experience: profile.years_of_experience,
        hourly_rate: profile.hourly_rate,
        approval_status: profile.approval_status || 'approved',
        ...profile,
      }))
  },

  saveFromRegistration(user, extra = {}) {
    const userId = getUserId(user)
    if (!userId) return user

    const profile = this.saveProfile(userId, { ...user, ...extra })
    return { ...user, ...profile }
  },
}

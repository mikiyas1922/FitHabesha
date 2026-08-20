import { useState, useEffect } from 'react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Camera,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { tokenStorage } from '../../services/apiClient'
import { memberService } from '../../services/memberService'
import { trainerService } from '../../services/trainerService'
import { unwrapResource } from '../../utils/apiHelpers'
import { mapBackendRole } from '../../utils/auth'

const ACCESS_DENIED_MESSAGE =
  'Access denied. You can only access your own resources.'

export function ProfileSettings() {
  const { user } = useAuth()
  const [memberId, setMemberId] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    fitnessGoal: '',
    dietaryRestrictions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    uniqueMemberId: '',
    subscriptionStatus: '',
    tierName: '',
    specialty: '',
    yearsOfExperience: '',
    certification: '',
    hourlyRate: '',
    bio: '',
    isAvailable: true,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const role = mapBackendRole(user?.role)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = tokenStorage.getAccessToken()
        if (!token) {
          throw new Error('Unauthorized. Please log in again.')
        }

        if (role === 'member') {
          const result = await memberService.getCurrentMemberProfile()
          console.log('Member profile result:', result)
          const m = unwrapResource(result)
          console.log('Unwrapped member profile:', m)
          if (!m) throw new Error('Unable to load member profile.')
          console.log('Setting member ID:', m.id)
          console.log('Setting user ID:', m.user_id)
          setMemberId(m.id)
          setFormData((prev) => ({
            ...prev,
            firstName: m.first_name || '',
            lastName: m.last_name || '',
            email: m.email || '',
            phone: m.phone || '',
            dateOfBirth: m.date_of_birth
              ? String(m.date_of_birth).split('T')[0]
              : '',
            gender: m.gender || '',
            bloodType: m.blood_type || '',
            fitnessGoal: m.fitness_goal || 'weight_loss',
            dietaryRestrictions: m.dietary_restrictions || '',
            emergencyContactName: m.emergency_contact_name || '',
            emergencyContactPhone: m.emergency_contact_phone || '',
            uniqueMemberId: m.unique_member_id || '',
            subscriptionStatus: m.subscription_status || '',
            tierName: m.tier_name || '',
            userId: m.user_id, // Store user_id for permission checks
          }))
          return
        }

        if (role === 'trainer') {
          const result = await trainerService.getCurrentTrainerProfile()
          const t = unwrapResource(result)
          if (!t) throw new Error('Unable to load trainer profile.')
          setMemberId(t.id)
          setFormData((prev) => ({
            ...prev,
            firstName: t.first_name || '',
            lastName: t.last_name || '',
            email: t.email || '',
            phone: t.phone || '',
            specialty: t.specialty || '',
            yearsOfExperience: t.years_of_experience ?? '',
            certification: t.certification || '',
            hourlyRate: t.hourly_rate ?? '',
            bio: t.bio || '',
            isAvailable: t.is_available !== false,
          }))
          return
        }

        setFormData((prev) => ({
          ...prev,
          firstName: user?.first_name || user?.firstName || '',
          lastName: user?.last_name || user?.lastName || '',
          email: user?.email || '',
          phone: user?.phone || '',
        }))
      } catch (err) {
        const message =
          err?.status === 403 || /Access denied/i.test(err?.message || '')
            ? ACCESS_DENIED_MESSAGE
            : err?.message || 'Unable to load profile.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, role])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()

    console.log('=== PROFILE UPDATE DEBUG INFO ===')
    console.log('User role:', role)
    console.log('User object:', user)
    console.log('Member ID:', memberId)
    console.log('Form data:', formData)

    if (role !== 'member' && role !== 'trainer') {
      setError(`Profile updates for role "${role}" are not available on the API. Only members and trainers can update their profiles.`)
      return
    }

    if (!memberId) {
      setError('Member profile ID not found. Please refresh the page.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg('')

    try {
      const token = tokenStorage.getAccessToken()
      if (!token) {
        throw new Error('Unauthorized. Please log in again.')
      }

      if (role === 'member') {
        console.log('=== MEMBER PROFILE UPDATE ===')
        console.log('Updating member profile with ID:', memberId)
        console.log('Current user ID:', user?.id, user?.user_id)
        
        // Verify we're updating the correct member profile
        const currentProfile = await memberService.getCurrentMemberProfile()
        const profileData = unwrapResource(currentProfile)
        console.log('Current profile data for verification:', profileData)
        console.log('Profile user_id:', profileData?.user_id)
        console.log('Profile id:', profileData?.id)
        console.log('Profile role:', profileData?.role)
        
        // The backend checks that the authenticated user's id matches the user_id in the member profile
        const authenticatedUserId = user?.id || user?.user_id
        console.log('Authenticated user ID for comparison:', authenticatedUserId)
        
        // Check if there's a mismatch
        if (profileData?.user_id && authenticatedUserId && profileData.user_id !== authenticatedUserId) {
          console.error('User ID mismatch! Cannot update another user\'s profile.')
          console.error('Profile user_id:', profileData.user_id, 'vs Authenticated user ID:', authenticatedUserId)
          throw new Error('Access denied. You can only update your own profile. Please ensure you are logged in with the correct account.')
        }
        
        const payload = Object.fromEntries(
          Object.entries({
            fitness_goal: formData.fitnessGoal || undefined,
            emergency_contact_name: formData.emergencyContactName || undefined,
            emergency_contact_phone: formData.emergencyContactPhone || undefined,
            dietary_restrictions: formData.dietaryRestrictions || undefined,
            date_of_birth: formData.dateOfBirth || undefined,
            gender: formData.gender || undefined,
            blood_type: formData.bloodType || undefined,
          }).filter(
            ([, value]) => value !== undefined && value !== null && value !== ''
          )
        )
        
        console.log('Update payload:', payload)
        
        let result
        let lastError = null
        
        // Try all possible approaches
        const approaches = [
          { name: 'PATCH /members/me', fn: () => memberService.updateCurrentMember(payload) },
          { name: 'PATCH /members/{user_id}', fn: () => memberService.updateMember(profileData?.user_id, payload) },
          { name: 'PATCH /members/{profile_id}', fn: () => memberService.updateMember(profileData?.id, payload) },
        ]
        
        for (const approach of approaches) {
          try {
            console.log(`Trying: ${approach.name}`)
            result = await approach.fn()
            console.log(`Success with: ${approach.name}`, result)
            break
          } catch (error) {
            console.warn(`Failed: ${approach.name}`, error)
            lastError = error
          }
        }
        
        if (!result) {
          throw lastError || new Error('All update approaches failed. The backend API may not support member profile updates or has permission restrictions.')
        }
        
        if (result?.success === false) {
          throw new Error(result?.message || 'Failed to update member profile.')
        }
        setSuccessMsg(result.message || 'Profile updated successfully!')
        return
      }

      const payload = Object.fromEntries(
        Object.entries({
          specialty: formData.specialty || undefined,
          years_of_experience:
            formData.yearsOfExperience === ''
              ? undefined
              : Number(formData.yearsOfExperience),
          certification: formData.certification || undefined,
          hourly_rate:
            formData.hourlyRate === ''
              ? undefined
              : Number(formData.hourlyRate),
          bio: formData.bio || undefined,
          is_available: formData.isAvailable,
        }).filter(
          ([, value]) => value !== undefined && value !== null && value !== ''
        )
      )
      const result = await trainerService.updateTrainer(memberId, payload)
      if (result?.success === false) {
        throw new Error(result?.message || 'Failed to update trainer profile.')
      }
      setSuccessMsg(result.message || 'Profile updated successfully!')
    } catch (err) {
      const message =
        err?.status === 403 || /Access denied/i.test(err?.message || '')
          ? ACCESS_DENIED_MESSAGE
          : err?.message || 'Failed to update profile.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const initials =
    `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase() ||
    'M'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted">Loading profile details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-sm text-muted">
            Member ID:{' '}
            <span className="font-mono text-foreground font-medium">
              {formData.uniqueMemberId || 'N/A'}
            </span>
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-200">
          {successMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Picture & Subscription Tier */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Profile Picture
            </h3>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-semibold mb-4">
                  {initials}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full gap-1"
                >
                  <Camera className="size-3" />
                  Change
                </Button>
              </div>
              <p className="text-xs text-muted mt-2">
                JPG, PNG or GIF. Max 2MB
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-3">
              Membership Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Status:</span>
                <span className="font-medium text-capitalize text-green-600">
                  {formData.subscriptionStatus || 'Active'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tier:</span>
                <span className="font-medium text-foreground">
                  {formData.tierName || 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Personal & Health Details
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="text"
                    name="firstName"
                    disabled
                    value={formData.firstName}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface/50 text-muted cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="text"
                    name="lastName"
                    disabled
                    value={formData.lastName}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface/50 text-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface/50 text-muted cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="tel"
                    name="phone"
                    disabled
                    value={formData.phone}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface/50 text-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">
                  Blood Type
                </label>
                <input
                  type="text"
                  name="bloodType"
                  placeholder="e.g. A+"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {role === 'member' && (
              <>
                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground my-3">
                    Emergency Contact
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        placeholder="+251 9 88 77-66-55"
                        className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground my-3">
                    Fitness & Health Goals
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">
                        Fitness Goal
                      </label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="general_fitness">General Fitness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">
                        Dietary Restrictions
                      </label>
                      <input
                        type="text"
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleInputChange}
                        placeholder="e.g. Vegan, Lactose Intolerant"
                        className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {role === 'trainer' && (
              <div className="pt-2 border-t border-border space-y-4">
                <h4 className="text-sm font-semibold text-foreground my-3">
                  Trainer Profile
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-2">
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">
                      Certification
                    </label>
                    <input
                      type="text"
                      name="certification"
                      value={formData.certification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                  />
                  Available for sessions
                </label>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Security</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Lock className="size-4" />
            Change Password
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Shield className="size-4" />
            Two-Factor Authentication
          </Button>
        </div>
      </div>
    </div>
  )
}
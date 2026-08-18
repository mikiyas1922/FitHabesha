import { User, Mail, Phone, MapPin, Lock, Bell, Shield, CreditCard, Camera, Save, Plus, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState, useEffect } from 'react'

export function ProfileSettings() {
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
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  // Base API configuration - ensure Vite proxy or full URL is set
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

  // 1. Fetch Current Member Profile (GET /members/me)
  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('token')

        const response = await fetch(`${API_BASE_URL}/members/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized. Please log in again.')
          if (response.status === 404) throw new Error('Member profile not found.')
          throw new Error(`Failed to load profile (Status: ${response.status})`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          const m = result.data
          setMemberId(m.id)
          setFormData({
            firstName: m.first_name || '',
            lastName: m.last_name || '',
            email: m.email || '',
            phone: m.phone || '',
            dateOfBirth: m.date_of_birth ? m.date_of_birth.split('T')[0] : '',
            gender: m.gender || '',
            bloodType: m.blood_type || '',
            fitnessGoal: m.fitness_goal || 'weight_loss',
            dietaryRestrictions: m.dietary_restrictions || '',
            emergencyContactName: m.emergency_contact_name || '',
            emergencyContactPhone: m.emergency_contact_phone || '',
            uniqueMemberId: m.unique_member_id || '',
            subscriptionStatus: m.subscription_status || '',
            tierName: m.tier_name || '',
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 2. Update Member Profile (PATCH /members/{id})
  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!memberId) return

    setSaving(true)
    setError(null)
    setSuccessMsg('')

    try {
      const token = localStorage.getItem('token')

      // Prepare payload adhering to API schema
      const payload = {
        fitness_goal: formData.fitnessGoal,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        dietary_restrictions: formData.dietaryRestrictions,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        blood_type: formData.bloodType || undefined,
      }

      const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update member profile.')
      }

      setSuccessMsg(result.message || 'Profile updated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const initials = `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase() || 'M'

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
          <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-sm text-muted">
            Member ID: <span className="font-mono text-foreground font-medium">{formData.uniqueMemberId || 'N/A'}</span>
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
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
            <h3 className="font-semibold text-foreground mb-4">Profile Picture</h3>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-semibold mb-4">
                  {initials}
                </div>
                <Button variant="secondary" size="sm" className="absolute bottom-0 right-0 rounded-full gap-1">
                  <Camera className="size-3" />
                  Change
                </Button>
              </div>
              <p className="text-xs text-muted mt-2">JPG, PNG or GIF. Max 2MB</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-3">Membership Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Status:</span>
                <span className="font-medium text-capitalize text-green-600">{formData.subscriptionStatus || 'Active'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tier:</span>
                <span className="font-medium text-foreground">{formData.tierName || 'Standard'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Personal & Health Details</h3>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Name Fields (Read-Only or Editable) */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">First Name</label>
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
                <label className="block text-sm text-muted mb-2">Last Name</label>
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
                <label className="block text-sm text-muted mb-2">Email Address</label>
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
                <label className="block text-sm text-muted mb-2">Phone Number</label>
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
                <label className="block text-sm text-muted mb-2">Date of Birth</label>
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
                <label className="block text-sm text-muted mb-2">Blood Type</label>
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

            {/* Emergency Contacts */}
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground my-3">Emergency Contact</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Contact Name</label>
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
                  <label className="block text-sm text-muted mb-2">Contact Phone</label>
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

            {/* Fitness Goals & Diet */}
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground my-3">Fitness & Health Goals</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Fitness Goal</label>
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
                  <label className="block text-sm text-muted mb-2">Dietary Restrictions</label>
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
import { User, Mail, Phone, MapPin, Lock, Bell, Shield, CreditCard, Camera, Save, Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState } from 'react'

export function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@email.com',
    phone: '+251 911 123 456',
    address: '123 Fitness Street, Addis Ababa',
    dateOfBirth: '1990-05-15',
    bio: 'Fitness enthusiast focused on strength training and healthy living.',
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = (e) => {
    e.preventDefault()
    console.log('Profile saved:', formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-sm text-muted">Manage your account settings and preferences</p>
        </div>
        <Button className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Profile Picture</h3>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-semibold mb-4">
                SC
              </div>
              <Button variant="secondary" size="sm" className="absolute bottom-0 right-0 rounded-full gap-1">
                <Camera className="size-3" />
                Change
              </Button>
            </div>
            <p className="text-xs text-muted mt-2">JPG, PNG or GIF. Max 2MB</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

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
              <label className="block text-sm text-muted mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
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

      {/* Notification Settings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted" />
              <span className="text-sm text-foreground">Email Notifications</span>
            </div>
            <input type="checkbox" defaultChecked className="size-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted" />
              <span className="text-sm text-foreground">Session Reminders</span>
            </div>
            <input type="checkbox" defaultChecked className="size-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted" />
              <span className="text-sm text-foreground">Class Booking Confirmations</span>
            </div>
            <input type="checkbox" defaultChecked className="size-4" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted" />
              <span className="text-sm text-foreground">Promotional Emails</span>
            </div>
            <input type="checkbox" className="size-4" />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Payment Methods</h3>
          <Button variant="ghost" size="sm" className="gap-1">
            <Plus className="size-3" />
            Add New
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface">
            <CreditCard className="size-5 text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Visa ending 4242</p>
              <p className="text-xs text-muted">Expires 12/2026</p>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Default</span>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-surface">
            <CreditCard className="size-5 text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Mastercard ending 8888</p>
              <p className="text-xs text-muted">Expires 06/2027</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-foreground mb-4">Danger Zone</h3>
        <div className="flex gap-4">
          <Button variant="secondary" className="gap-2">
            <Lock className="size-4" />
            Deactivate Account
          </Button>
          <Button variant="secondary" className="gap-2 text-red-600 hover:text-red-700">
            <User className="size-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}

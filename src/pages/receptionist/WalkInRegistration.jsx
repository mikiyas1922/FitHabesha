import { User, Mail, Phone, Calendar, CreditCard, CheckCircle, Clock, Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useState } from 'react'

const pricingOptions = [
  { id: 1, name: 'Day Pass', price: 15, duration: '1 Day', features: ['Full gym access', 'Locker included', 'Shower access'] },
  { id: 2, name: 'Week Pass', price: 75, duration: '7 Days', features: ['Full gym access', 'Locker included', 'Shower access', 'Group classes'] },
  { id: 3, name: 'Month Pass', price: 150, duration: '30 Days', features: ['Full gym access', 'Locker included', 'Shower access', 'Group classes', 'Personal trainer discount'] },
]

export function WalkInRegistration() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registration submitted:', { ...formData, plan: selectedPlan })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Walk-In Registration</h1>
          <p className="text-sm text-muted">Register new walk-in visitors and issue day/week passes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Clock className="size-4" />
            View Today's Walk-ins
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-6">Visitor Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">First Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Last Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h4 className="text-sm font-medium text-foreground mb-4">Emergency Contact</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name"
                    className="w-full px-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Emergency contact phone"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={!selectedPlan}>
                <CheckCircle className="size-4 mr-2" />
                Complete Registration
              </Button>
              <Button type="button" variant="secondary" onClick={() => setFormData({
                firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', emergencyContact: '', emergencyPhone: ''
              })}>
                Clear Form
              </Button>
            </div>
          </form>
        </div>

        {/* Pricing Options */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Select Pass Type</h3>
          <div className="space-y-3">
            {pricingOptions.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30 bg-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{plan.name}</p>
                  <p className="text-lg font-bold text-foreground">${plan.price}</p>
                </div>
                <p className="text-xs text-muted mb-3">{plan.duration}</p>
                <ul className="space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-xs text-muted flex items-center gap-2">
                      <CheckCircle className="size-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {selectedPlan && (
            <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted">Selected Plan</span>
                <span className="font-medium text-foreground">{selectedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Total Amount</span>
                <span className="text-xl font-bold text-foreground">${selectedPlan.price}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Walk-ins */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Today's Walk-in Registrations</h3>
        <div className="space-y-3">
          {[
            { name: 'John Smith', time: '10:45 AM', plan: 'Day Pass', amount: '$15' },
            { name: 'Jane Doe', time: '09:30 AM', plan: 'Week Pass', amount: '$75' },
            { name: 'Mike Johnson', time: '08:15 AM', plan: 'Day Pass', amount: '$15' },
          ].map((walkIn, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {walkIn.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{walkIn.name}</p>
                <p className="text-xs text-muted">{walkIn.plan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{walkIn.time}</p>
                <p className="text-xs text-muted">{walkIn.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

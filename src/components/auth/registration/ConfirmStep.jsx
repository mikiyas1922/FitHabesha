import { calculateBMI, getBMICategory } from '../../../utils/health'
import { REGISTRATION_STEP_IDS } from '../../../config/registrationRoles'

function SummarySection({ title, rows }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">{title}</h3>
      <div className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b border-border gap-4">
            <span className="text-muted shrink-0">{label}</span>
            <span className="font-medium text-foreground text-right capitalize">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getAccountRows(formData, roleConfig) {
  const rows = [
    ['Role', roleConfig.label],
    ['Full Name', `${formData.firstName} ${formData.lastName}`],
    ['Email Address', formData.email],
    ['Phone Number', formData.phone || '—'],
  ]

  if (roleConfig.account.emergencyContact) {
    rows.push(
      ['Emergency Contact', formData.emergencyContactName],
      ['Emergency Phone', formData.emergencyContactPhone]
    )
  }

  return rows
}

function getMemberHealthRows(formData) {
  const rows = [
    ['Date of Birth', formData.dateOfBirth || '—'],
    ['Gender', formData.gender],
    ['Weight', formData.weight ? `${formData.weight} kg` : '—'],
    ['Height', formData.height ? `${formData.height} cm` : '—'],
    ['Primary Goal', formData.fitnessGoal.replace('_', ' ')],
    ['Blood Type', formData.bloodType || '—'],
    ['Dietary Restrictions', formData.dietaryRestrictions || 'None'],
  ]

  const bmi = calculateBMI(formData.weight, formData.height)
  if (bmi) {
    rows.push(['Calculated BMI', `${bmi} (${getBMICategory(parseFloat(bmi)).toLowerCase()})`])
  }

  return rows
}

function getTrainerProfileRows(formData) {
  return [
    ['Specialty', formData.specialty],
    ['Years of Experience', `${formData.yearsOfExperience} years`],
    ['Certification', formData.certification],
    ['Hourly Rate', `Br ${formData.hourlyRate}`],
    ['Bio', formData.bio || '—'],
  ]
}

export function ConfirmStep({ formData, roleConfig }) {
  const profileStepIds = roleConfig.profileStepIds

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm font-medium text-primary">
          All details look solid! Please confirm your {roleConfig.label.toLowerCase()} registration.
        </p>
      </div>

      <SummarySection title="Account Details" rows={getAccountRows(formData, roleConfig)} />

      {profileStepIds.includes(REGISTRATION_STEP_IDS.TRAINER_PROFILE) && (
        <SummarySection title="Trainer Profile" rows={getTrainerProfileRows(formData)} />
      )}

      {profileStepIds.includes(REGISTRATION_STEP_IDS.MEMBER_HEALTH) && (
        <SummarySection title="Health & Fitness Profile" rows={getMemberHealthRows(formData)} />
      )}

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 rounded border-border text-primary focus:ring-primary"
          required
        />
        <label htmlFor="terms" className="text-xs text-muted">
          I agree to the Terms of Service and Privacy Policy.
          {roleConfig.termsNote}
        </label>
      </div>
    </div>
  )
}

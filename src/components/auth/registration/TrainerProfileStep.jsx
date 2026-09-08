import { Input } from '../../ui/Input'

const specialtyOptions = [
  'Strength & Conditioning',
  'HIIT & Cardio',
  'Yoga & Flexibility',
  'CrossFit',
  'Bodybuilding',
  'Nutrition Coaching',
  'Sports Performance',
  'Other',
]

export function TrainerProfileStep({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">SPECIALTY *</label>
        <select
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        >
          <option value="">Select your specialty</option>
          {specialtyOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="YEARS OF EXPERIENCE *"
          type="number"
          min="0"
          placeholder="5"
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
          required
        />
        <Input
          label="HOURLY RATE (ETB) *"
          type="number"
          min="1"
          placeholder="500"
          value={formData.hourlyRate}
          onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
          required
        />
      </div>

      <Input
        label="CERTIFICATION *"
        placeholder="e.g. ACE Certified Personal Trainer, ISSA CPT"
        value={formData.certification}
        onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">BIO (OPTIONAL)</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell members about your training philosophy and experience..."
          rows={4}
          className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>
    </div>
  )
}

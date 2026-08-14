import { Input } from '../../ui/Input'
import { calculateBMI, getBMICategory } from '../../../utils/health'

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const fitnessGoals = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_building', label: 'Muscle Building' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'general_fitness', label: 'General Fitness' },
]

export function MemberHealthStep({ formData, setFormData }) {
  const bmi = calculateBMI(formData.weight, formData.height)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="WEIGHT (KG)"
          type="number"
          placeholder="75"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          required
        />
        <Input
          label="HEIGHT (CM)"
          type="number"
          placeholder="175"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
          required
        />
      </div>

      {bmi && (
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">BMI</span>
            <span className="text-lg font-bold text-primary">{bmi}</span>
          </div>
          <div className="text-xs text-muted mt-1">
            Category: {getBMICategory(parseFloat(bmi))}
          </div>
        </div>
      )}

      <Input
        label="TARGET WEIGHT (KG)"
        type="number"
        placeholder="70"
        value={formData.targetWeight}
        onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
      />

      <Input
        label="DATE OF BIRTH"
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">BLOOD TYPE</label>
        <select
          value={formData.bloodType}
          onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
          className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Select</option>
          {bloodTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">GENDER</label>
        <div className="grid grid-cols-2 gap-3">
          {['male', 'female'].map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => setFormData({ ...formData, gender })}
              className={`p-3 rounded-lg border-2 text-center transition-all capitalize ${
                formData.gender === gender ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <span className="font-medium text-foreground">{gender}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">PRIMARY FITNESS GOAL</label>
        <div className="grid grid-cols-2 gap-3">
          {fitnessGoals.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => setFormData({ ...formData, fitnessGoal: goal.value })}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                formData.fitnessGoal === goal.value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <span className="font-medium text-foreground text-sm">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="DIETARY RESTRICTIONS"
        placeholder="e.g. Gluten-Free, Vegan..."
        value={formData.dietaryRestrictions}
        onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
      />
    </div>
  )
}

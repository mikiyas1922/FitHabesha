import { Input } from '../../ui/Input'
import { JOIN_AS_OPTIONS } from '../../../config/registrationRoles'

export function RoleStep({ formData, setFormData, roleConfig, onRoleChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">JOIN AS</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {JOIN_AS_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => onRoleChange(value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                formData.role === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <Icon className={`size-5 mb-2 ${formData.role === value ? 'text-primary' : 'text-muted'}`} />
              <p className="font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {roleConfig?.account?.emergencyContact && (
        <div className="pt-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            CONTACT PERSON in case of emergency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CONTACT NAME"
              placeholder="Yared Alemu"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              required
            />
            <Input
              label="CONTACT PHONE"
              type="tel"
              placeholder="0912234543"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
              required
            />
          </div>
        </div>
      )}
    </div>
  )
}

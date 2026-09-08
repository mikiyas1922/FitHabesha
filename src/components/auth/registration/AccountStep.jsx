import { Input } from '../../ui/Input'

export function AccountStep({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="FIRST NAME"
          placeholder="Alex"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="LAST NAME"
          placeholder="Asfaw"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      <Input
        label="EMAIL ADDRESS"
        type="email"
        placeholder="alex@gmail.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        label="PHONE NUMBER"
        type="tel"
        placeholder="+251 9 12 10-28-34"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="PASSWORD"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <Input
          label="CONFIRM"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
      </div>
    </div>
  )
}

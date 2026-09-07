import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Input'
import {
  ADMIN_STAFF_ROLES,
  INITIAL_STAFF_FORM,
  buildStaffRegisterPayload,
  validateStaffForm,
  validateMemberForm,
  INITIAL_MEMBER_FORM,
  ADMIN_MEMBER_ROLE,
} from '../../config/adminStaffRoles'
import { adminService } from '../../services/adminService'
import { mapBackendRole } from '../../utils/auth'
import { roleLabels } from '../../config/navigation'

export function StaffRegistrationModal({
  open,
  onClose,
  defaultRole = 'trainer',
  fixedRole,
  title = 'Register Staff',
  description = 'Creates a user via POST /admin/register. Admin login required.',
  onSuccess,
}) {
  const lockedRole = fixedRole || defaultRole
  const initialForm = fixedRole === 'member' ? INITIAL_MEMBER_FORM : INITIAL_STAFF_FORM
  const validateForm = fixedRole === 'member' ? validateMemberForm : validateStaffForm
  const roleOptions = fixedRole
    ? [ADMIN_MEMBER_ROLE].filter((role) => role.value === fixedRole)
    : ADMIN_STAFF_ROLES

  const [formData, setFormData] = useState({ ...initialForm, role: lockedRole })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [createdUser, setCreatedUser] = useState(null)

  useEffect(() => {
    if (open) {
      const form = fixedRole === 'member' ? INITIAL_MEMBER_FORM : INITIAL_STAFF_FORM
      setFormData({ ...form, role: lockedRole })
      setError('')
      setSuccessMessage('')
      setCreatedUser(null)
    }
  }, [open, fixedRole, lockedRole])

  if (!open) return null

  const selectedRole = roleOptions.find((role) => role.value === formData.role)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const response = await adminService.registerStaff(buildStaffRegisterPayload(formData))
      const createdUser = response.user
      const roleLabel = roleLabels[mapBackendRole(createdUser?.role || formData.role)] || formData.role

      setSuccessMessage(
        response.message ||
          `${roleLabel} account created for ${createdUser?.email || formData.email}.`
      )
      setCreatedUser(createdUser || null)

      onSuccess?.(response)
    } catch (err) {
      if (err.status === 401) {
        setError('Your session expired. Please sign in again as an admin.')
      } else if (err.status === 403) {
        setError('Only admin accounts can register users.')
      } else {
        setError(err.message || `Unable to create ${fixedRole === 'member' ? 'member' : 'staff'} account. Please try again.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close dialog"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-muted hover:bg-hover hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {successMessage ? (
          <div className="p-6 space-y-4">
            <div className="rounded-lg border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-300">
              {successMessage}
            </div>
            {createdUser && (
              <div className="rounded-lg border border-border bg-subtle p-4 text-sm space-y-1">
                {(createdUser.id || createdUser.user_id) && (
                  <p>
                    <span className="text-muted">User ID:</span>{' '}
                    <span className="font-mono">{createdUser.id || createdUser.user_id}</span>
                  </p>
                )}
                <p>
                  <span className="text-muted">Name:</span>{' '}
                  {createdUser.first_name} {createdUser.last_name}
                </p>
                <p>
                  <span className="text-muted">Email:</span> {createdUser.email}
                </p>
                <p>
                  <span className="text-muted">Role:</span>{' '}
                  {roleLabels[mapBackendRole(createdUser.role)] || createdUser.role}
                </p>
                {createdUser.unique_member_id && (
                  <p>
                    <span className="text-muted">Member ID:</span> {createdUser.unique_member_id}
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  setSuccessMessage('')
                  setCreatedUser(null)
                  const form = fixedRole === 'member' ? INITIAL_MEMBER_FORM : INITIAL_STAFF_FORM
                  setFormData({ ...form, role: lockedRole })
                }}
              >
                Add Another
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form className="p-6 space-y-4 max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            {!fixedRole && (
              <Select
                label="ASSIGN ROLE"
                value={formData.role}
                onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                options={ADMIN_STAFF_ROLES.map((role) => ({
                  value: role.value,
                  label: role.label,
                }))}
              />
            )}

            {selectedRole && (
              <p className={`text-xs text-muted ${fixedRole ? '' : '-mt-2'}`}>{selectedRole.description}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="FIRST NAME"
                value={formData.firstName}
                onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
                placeholder="Sarah"
                required
              />
              <Input
                label="LAST NAME"
                value={formData.lastName}
                onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                placeholder="Johnson"
                required
              />
            </div>

            <Input
              label="EMAIL ADDRESS"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              placeholder={fixedRole === 'member' ? 'member@fitaddis.com' : 'staff@fitaddis.com'}
              required
            />

            <Input
              label="PHONE (OPTIONAL)"
              type="tel"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              placeholder="+251 9 11 22 33 44"
            />

            <Input
              label="TEMPORARY PASSWORD"
              type="password"
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              placeholder="Minimum 8 characters"
              required
            />

            <Input
              label="CONFIRM PASSWORD"
              type="password"
              value={formData.confirmPassword}
              onChange={(event) =>
                setFormData({ ...formData, confirmPassword: event.target.value })
              }
              placeholder="Re-enter password"
              required
            />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

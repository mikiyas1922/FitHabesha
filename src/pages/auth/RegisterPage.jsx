import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { BrandMark } from '../../components/brand/BrandMark'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { RegistrationStepRenderer } from '../../components/auth/registration/RegistrationStepRenderer'
import { useAuth } from '../../contexts/AuthContext'
import {
  getRegistrationRoleConfig,
  getRegistrationStepIds,
  getRegistrationStepLabels,
  INITIAL_REGISTRATION_FORM,
  REGISTRATION_STEP_IDS,
  validateRegistrationStep,
} from '../../config/registrationRoles'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(INITIAL_REGISTRATION_FORM)

  const stepIds = getRegistrationStepIds(formData.role)
  const stepLabels = getRegistrationStepLabels(formData.role)
  const currentStepId = stepIds[step]
  const roleConfig = getRegistrationRoleConfig(formData.role)
  const isConfirmStep = currentStepId === REGISTRATION_STEP_IDS.CONFIRM

  const validateCurrentStep = () =>
    validateRegistrationStep(currentStepId, formData, roleConfig)

  const handleNext = () => {
    const validationError = validateCurrentStep()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    if (step < stepIds.length - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setError('')
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleRoleChange = (role) => {
    const nextStepIds = getRegistrationStepIds(role)
    setFormData({ ...formData, role })
    setError('')
    setStep((currentStep) => Math.min(currentStep, nextStepIds.length - 1))
  }

  const handleComplete = async () => {
    if (!roleConfig) {
      setError('Please select how you want to join.')
      return
    }

    const validationError = validateCurrentStep()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, profileExtra } = roleConfig.buildRegisterPayload(formData)
      await register(data, profileExtra)

      navigate('/login', {
        state: {
          message:
            formData.role === 'trainer'
              ? 'Trainer account created! Sign in to access your dashboard.'
              : 'Account created successfully! Sign in to continue.',
        },
      })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')] bg-cover bg-center" />
      </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-surface rounded-2xl shadow-2xl overflow-hidden border border-border">
          <div className="p-6 border-b border-border">
            <div className="mb-4">
              <BrandMark size="sm" />
            </div>
            <div className="flex items-center justify-between">
              {stepLabels.map((label, index) => (
                <div key={`${label}-${index}`} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors ${
                      index <= step ? 'bg-primary text-dark' : 'bg-border text-muted'
                    }`}
                  >
                    {index < step ? '✓' : index + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      index <= step ? 'text-foreground' : 'text-muted'
                    }`}
                  >
                    {label}
                  </span>
                  {index < stepLabels.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <RegistrationStepRenderer
              stepId={currentStepId}
              formData={formData}
              setFormData={setFormData}
              roleConfig={roleConfig}
              onRoleChange={handleRoleChange}
            />

            <div className="mt-6 space-y-3">
              {!isConfirmStep ? (
                <Button onClick={handleNext} className="w-full" size="lg">
                  Next Step
                </Button>
              ) : (
                <Button onClick={handleComplete} className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              )}

              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full text-sm text-muted hover:text-foreground font-medium"
                >
                  Need to fix something? Go Back
                </button>
              )}

              {step === 0 && (
                <p className="text-center text-sm text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

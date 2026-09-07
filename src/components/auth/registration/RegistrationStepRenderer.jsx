import { REGISTRATION_STEP_IDS } from '../../../config/registrationRoles'
import { AccountStep } from './AccountStep'
import { RoleStep } from './RoleStep'
import { MemberHealthStep } from './MemberHealthStep'
import { TrainerProfileStep } from './TrainerProfileStep'
import { ConfirmStep } from './ConfirmStep'

const STEP_COMPONENTS = {
  [REGISTRATION_STEP_IDS.ACCOUNT]: AccountStep,
  [REGISTRATION_STEP_IDS.ROLE]: RoleStep,
  [REGISTRATION_STEP_IDS.MEMBER_HEALTH]: MemberHealthStep,
  [REGISTRATION_STEP_IDS.TRAINER_PROFILE]: TrainerProfileStep,
  [REGISTRATION_STEP_IDS.CONFIRM]: ConfirmStep,
}

export function RegistrationStepRenderer({
  stepId,
  formData,
  setFormData,
  roleConfig,
  onRoleChange,
}) {
  const StepComponent = STEP_COMPONENTS[stepId]

  if (!StepComponent) {
    return null
  }

  const sharedProps = { formData, setFormData, roleConfig }

  if (stepId === REGISTRATION_STEP_IDS.ROLE) {
    return <RoleStep {...sharedProps} onRoleChange={onRoleChange} />
  }

  return <StepComponent {...sharedProps} />
}

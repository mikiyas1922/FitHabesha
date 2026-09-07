import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { adminService } from '../../services/adminService'
import { trainerService } from '../../services/trainerService'
import {
  assignedTrainerName,
  formatPersonName,
  getApiErrorMessage,
  resolveMemberProfileId,
} from '../../utils/apiHelpers'

function memberLabel(member) {
  return member?.name || `${member?.first_name || ''} ${member?.last_name || ''}`.trim() || 'this member'
}

export function AssignTrainerModal({ member, onClose, onAssigned }) {
  const [trainers, setTrainers] = useState([])
  const [loadingTrainers, setLoadingTrainers] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoadingTrainers(true)
      setError(null)
      try {
        const list = await adminService.getTrainersList({ page: 1, limit: 100 })
        if (!cancelled) setTrainers(Array.isArray(list) ? list : [])
      } catch (err) {
        if (!cancelled) {
          setTrainers([])
          setError(getApiErrorMessage(err, 'Unable to load trainers.'))
        }
      } finally {
        if (!cancelled) setLoadingTrainers(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async () => {
    const memberProfileId = resolveMemberProfileId(member)
    if (!memberProfileId || !selectedTrainer) return

    setSaving(true)
    setError(null)
    try {
      const result = await trainerService.assignTrainer(selectedTrainer, {
        member_profile_id: memberProfileId,
        notes,
      })
      onAssigned?.(result)
      onClose?.()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to assign trainer.'))
    } finally {
      setSaving(false)
    }
  }

  if (!member) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Assign trainer</h3>
          <p className="text-sm text-muted mt-1">
            Assign a trainer to <strong>{memberLabel(member)}</strong> without a workout or meal plan.
            A previous active assignment for this member is replaced automatically.
          </p>
        </div>

        {loadingTrainers ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Trainer</label>
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2 text-sm"
              >
                <option value="">Select a trainer...</option>
                {trainers.map((trainer) => {
                  const id = trainer.id || trainer._id
                  const name =
                    formatPersonName(trainer) ||
                    trainer.name ||
                    `${trainer.first_name || ''} ${trainer.last_name || ''}`.trim() ||
                    'Trainer'
                  return (
                    <option key={id} value={id}>
                      {name}
                      {trainer.specialty ? ` (${trainer.specialty})` : ''}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes, e.g. New client intake"
                className="w-full rounded-lg border border-border bg-surface p-3 text-sm"
                rows={2}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded border border-border text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loadingTrainers || !selectedTrainer}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign trainer'
            )}
          </button>
        </div>
      </Card>
    </div>
  )
}

export function UnassignTrainerModal({ member, onClose, onUnassigned }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const trainerName = assignedTrainerName(member) || member?.trainer

  const handleSubmit = async () => {
    const memberProfileId = resolveMemberProfileId(member)
    if (!memberProfileId) return

    setSaving(true)
    setError(null)
    try {
      const result = await trainerService.unassignTrainer(memberProfileId)
      onUnassigned?.(result)
      onClose?.()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to unassign trainer.'))
    } finally {
      setSaving(false)
    }
  }

  if (!member) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Unassign trainer</h3>
          <p className="text-sm text-muted mt-1">
            Remove the trainer assignment for <strong>{memberLabel(member)}</strong>
            {trainerName && trainerName !== '—' ? (
              <>
                {' '}
                (<strong>{trainerName}</strong>)
              </>
            ) : null}
            . Profiles are not deleted. The member and trainer will be notified.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded border border-border text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Unassigning...
              </>
            ) : (
              'Unassign trainer'
            )}
          </button>
        </div>
      </Card>
    </div>
  )
}

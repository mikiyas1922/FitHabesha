import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Dumbbell, Target, Calendar, TrendingUp, Users, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { trainerService } from '../../services/trainerService'
import { getApiErrorMessage, unwrapResource } from '../../utils/apiHelpers'

function memberProfileId(client) {
  return client?.member_profile_id || client?.id || null
}

export function MyClients() {
  const [roster, setRoster] = useState([])
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [attendanceTarget, setAttendanceTarget] = useState(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  const [actionTone, setActionTone] = useState('info')
  const [assignPlanTarget, setAssignPlanTarget] = useState(null)
  const [workoutTemplates, setWorkoutTemplates] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [selectedWorkoutTemplate, setSelectedWorkoutTemplate] = useState('')
  const [selectedMealPlan, setSelectedMealPlan] = useState('')
  const [assignNotes, setAssignNotes] = useState('')
  const [loadingPlans, setLoadingPlans] = useState(false)

  const loadRoster = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const profileResponse = await trainerService.getCurrentTrainerProfile()
      const profile = unwrapResource(profileResponse)
      if (!profile?.id) throw new Error('Trainer profile not found.')

      const { trainer, roster } = await trainerService.getTrainerRoster(profile.id)
      setTrainer(trainer || { id: profile.id, full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() })
      setRoster(roster)
    } catch (err) {
      setError(err.message || 'Failed to load roster')
      setRoster([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoster()
  }, [loadRoster])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return roster
    return roster.filter((client) =>
      [client.first_name, client.last_name, client.email, client.unique_member_id, client.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [roster, search])

  const handleRecordAttendance = async () => {
    const profileId = memberProfileId(attendanceTarget)
    if (!profileId) return
    setSaving(true)
    setActionMessage('')
    try {
      const result = await trainerService.recordAttendance(profileId, { notes })
      const checkedInAt = result?.data?.checked_in_at
      setActionTone('success')
      setActionMessage(
        checkedInAt
          ? `${result.message} (${new Date(checkedInAt).toLocaleString()})`
          : result.message
      )
      setRoster((current) =>
        current.map((client) =>
          memberProfileId(client) === profileId
            ? { ...client, last_pt_check_in: checkedInAt || client.last_pt_check_in }
            : client
        )
      )
      setAttendanceTarget(null)
      setNotes('')
    } catch (err) {
      setActionTone('error')
      setActionMessage(getApiErrorMessage(err, 'Unable to record attendance.'))
    } finally {
      setSaving(false)
    }
  }

  const loadPlansForAssignment = async (trainerId) => {
    try {
      setLoadingPlans(true)
      const [templates, meals] = await Promise.all([
        trainerService.getTrainerTemplates(trainerId),
        trainerService.getTrainerMealPlans(trainerId),
      ])
      setWorkoutTemplates(templates)
      setMealPlans(meals)
    } catch (err) {
      console.error('Failed to load plans:', err)
    } finally {
      setLoadingPlans(false)
    }
  }

  const handleAssignPlan = async () => {
    if (!memberProfileId(assignPlanTarget) || !trainer?.id) return
    if (!selectedWorkoutTemplate && !selectedMealPlan) {
      setActionTone('error')
      setActionMessage('Select a workout template, a meal plan, or both.')
      return
    }
    setSaving(true)
    setActionMessage('')
    try {
      await trainerService.assignPlan(trainer.id, {
        member_profile_id: memberProfileId(assignPlanTarget),
        workout_template_id: selectedWorkoutTemplate || null,
        meal_plan_id: selectedMealPlan || null,
        notes: assignNotes || undefined,
      })
      setActionTone('success')
      setActionMessage('Plan assigned successfully.')
      setAssignPlanTarget(null)
      setSelectedWorkoutTemplate('')
      setSelectedMealPlan('')
      setAssignNotes('')
      loadRoster()
    } catch (err) {
      setActionTone('error')
      setActionMessage(getApiErrorMessage(err, 'Unable to assign plan.'))
    } finally {
      setSaving(false)
    }
  }

  const openAssignPlanModal = async (client) => {
    setAssignPlanTarget(client)
    setSelectedWorkoutTemplate('')
    setSelectedMealPlan('')
    setAssignNotes('')
    if (trainer?.id) {
      await loadPlansForAssignment(trainer.id)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600 font-medium">Error loading clients</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <Button onClick={loadRoster} className="mt-3">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Clients</h1>
        <p className="text-sm text-muted">
          Assigned members for {trainer?.full_name || 'your roster'}
          {trainer?.specialty ? ` · ${trainer.specialty}` : ''}
        </p>
      </div>

      {actionMessage && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            actionTone === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : actionTone === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-border bg-card text-foreground'
          }`}
        >
          {actionMessage}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Assigned Members', value: String(roster.length), icon: Users },
          { label: 'Active', value: String(roster.filter((c) => c.is_active !== false).length), icon: TrendingUp },
          { label: 'With Workout Plan', value: String(roster.filter((c) => c.active_workout_plan).length), icon: Calendar },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Active Clients</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted">No assigned members yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => {
              const profileId = memberProfileId(client)
              const name = `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email
              const initials = name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div key={profileId} className="p-4 rounded-xl border border-border bg-surface">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{name}</p>
                      <p className="text-xs text-muted">{client.unique_member_id}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <Target className="size-3" />
                      <span>{client.fitness_goal || 'No goal set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="size-3" />
                      <span className="truncate">{client.active_workout_plan || 'No workout plan'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3" />
                      <span>Assigned {client.assigned_at ? new Date(client.assigned_at).toLocaleDateString() : '—'}</span>
                    </div>
                    <p>Subscription: {client.subscription_status || '—'}</p>
                    {client.last_pt_check_in && (
                      <p>Last PT session: {new Date(client.last_pt_check_in).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => setAttendanceTarget(client)}>
                      Record PT attendance
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => openAssignPlanModal(client)}>
                      Assign Plan
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {attendanceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold">Record PT attendance</h3>
            <p className="text-sm text-muted">
              {attendanceTarget.first_name} {attendanceTarget.last_name} · {attendanceTarget.unique_member_id}
            </p>
            <p className="text-xs text-muted">
              Saves a personal training check-in for this member. Notes are optional.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="PT session notes"
              className="w-full rounded-lg border border-border bg-surface p-3 text-sm"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setAttendanceTarget(null)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleRecordAttendance} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {assignPlanTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold">Assign Plan</h3>
            <p className="text-sm text-muted">
              {assignPlanTarget.first_name} {assignPlanTarget.last_name} · {assignPlanTarget.unique_member_id}
            </p>
            
            {loadingPlans ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Workout Template</label>
                    <select
                      value={selectedWorkoutTemplate}
                      onChange={(e) => setSelectedWorkoutTemplate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface p-2 text-sm"
                    >
                      <option value="">Select workout template...</option>
                      {workoutTemplates.map((template) => (
                        <option key={template._id || template.id} value={template._id || template.id}>
                          {template.name} ({template.difficulty})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Meal Plan</label>
                    <select
                      value={selectedMealPlan}
                      onChange={(e) => setSelectedMealPlan(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface p-2 text-sm"
                    >
                      <option value="">Select meal plan...</option>
                      {mealPlans.map((plan) => (
                        <option key={plan._id || plan.id} value={plan._id || plan.id}>
                          {plan.name} ({plan.calories_target} kcal)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                    <textarea
                      value={assignNotes}
                      onChange={(e) => setAssignNotes(e.target.value)}
                      placeholder="Optional notes for this assignment..."
                      className="w-full rounded-lg border border-border bg-surface p-3 text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setAssignPlanTarget(null)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleAssignPlan} disabled={saving || loadingPlans}>
                {saving ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

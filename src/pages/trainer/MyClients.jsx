import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Dumbbell, Target, Calendar, TrendingUp, Users, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { trainerService } from '../../services/trainerService'
import { unwrapResource } from '../../utils/apiHelpers'

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

  const loadRoster = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const profileResponse = await trainerService.getCurrentTrainerProfile()
      const profile = unwrapResource(profileResponse)
      if (!profile?.id) throw new Error('Trainer profile not found.')

      const rosterResponse = await trainerService.getTrainerRoster(profile.id)
      const payload = unwrapResource(rosterResponse)
      setTrainer(payload?.trainer || { id: profile.id, full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() })
      setRoster(Array.isArray(payload?.roster) ? payload.roster : [])
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
    if (!attendanceTarget?.member_profile_id) return
    setSaving(true)
    setActionMessage('')
    try {
      await trainerService.recordAttendance(attendanceTarget.member_profile_id, {
        notes: notes || undefined,
      })
      setActionMessage('Personal training attendance recorded.')
      setAttendanceTarget(null)
      setNotes('')
    } catch (err) {
      setActionMessage(err.message || 'Unable to record attendance.')
    } finally {
      setSaving(false)
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
        </p>
      </div>

      {actionMessage && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-foreground">{actionMessage}</div>
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
              const name = `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email
              const initials = name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div key={client.member_profile_id} className="p-4 rounded-xl border border-border bg-surface">
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
                  </div>
                  <Button size="sm" className="w-full" onClick={() => setAttendanceTarget(client)}>
                    Record PT attendance
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {attendanceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold">Record attendance</h3>
            <p className="text-sm text-muted">
              {attendanceTarget.first_name} {attendanceTarget.last_name} · {attendanceTarget.unique_member_id}
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
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  Activity,
  Dumbbell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { memberService } from '../../services/memberService'
import { progressService } from '../../services/progressService'
import { unwrapResource, assignedTrainerId } from '../../utils/apiHelpers'

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtNum(v, unit = '') {
  if (v == null) return '—'
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  return `${n % 1 === 0 ? n : n.toFixed(1)}${unit}`
}

function Trend({ curr, prev, unit = '' }) {
  if (curr == null || prev == null) return null
  const diff = Number(curr) - Number(prev)
  if (Math.abs(diff) < 0.01)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted">
        <Minus size={12} /> No change
      </span>
    )
  const up = diff > 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-green-600' : 'text-red-500'}`}
    >
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? '+' : ''}
      {diff.toFixed(1)}
      {unit}
    </span>
  )
}

function MetricCard({ icon: Icon, label, value, unit, prev, color = 'text-primary' }) {
  return (
    <Card>
      <div className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-muted/30 ${color}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted mb-0.5">{label}</p>
          <p className="text-xl font-bold text-foreground leading-tight">{fmtNum(value, unit)}</p>
          <Trend curr={value} prev={prev} unit={unit} />
        </div>
      </div>
    </Card>
  )
}

/* ─── Mini bar chart (no external library) ───────────────────────────────── */
function SparkBar({ items, field, color, unit }) {
  const vals = items.map((e) => Number(e[field] ?? 0)).filter((v) => !Number.isNaN(v) && v > 0)
  if (vals.length < 2) return <p className="text-xs text-muted">Not enough data to chart.</p>
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  return (
    <div className="flex items-end gap-1 h-16">
      {items
        .slice()
        .reverse()
        .map((entry, i) => {
          const v = Number(entry[field] ?? 0)
          const pct = ((v - min) / range) * 100
          return (
            <div
              key={entry.id || i}
              title={`${fmtDate(entry.logged_at)}: ${fmtNum(v, unit)}`}
              className={`flex-1 rounded-sm ${color} opacity-80 hover:opacity-100 transition-opacity cursor-default`}
              style={{ height: `${Math.max(10, pct)}%` }}
            />
          )
        })}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  weight_kg: '',
  body_fat_percentage: '',
  muscle_mass_kg: '',
  notes: '',
}

export function MemberProgress() {
  const [profile, setProfile] = useState(null)
  const [assignmentId, setAssignmentId] = useState(null)
  const [latest, setLatest] = useState(null)
  const [prev, setPrev] = useState(null)
  const [history, setHistory] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [histLoading, setHistLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  /* ── load member profile + assignment id ─────────────────────────────── */
  const loadProfile = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await memberService.getCurrentMemberProfile()
      const p = unwrapResource(res)
      setProfile(p)

      // member_assignment_id lives at profile level or nested in assignment
      const aid =
        p?.member_assignment_id ||
        p?.assignment_id ||
        p?.current_assignment?.id ||
        p?.assignment?.id ||
        null
      setAssignmentId(aid)

      if (p?.id) {
        const [latestEntry, histRes] = await Promise.all([
          progressService.getLatestProgress(p.id).catch(() => null),
          progressService.getProgressHistory(p.id, { page: 1, limit: 20 }).catch(() => ({ items: [], pagination: {} })),
        ])
        setLatest(latestEntry)
        const items = histRes.items || []
        setHistory(items)
        setPagination(histRes.pagination || { page: 1, totalPages: 1, total: items.length })
        // second most-recent for trend arrows
        if (items.length >= 2) setPrev(items[1])
      }
    } catch (err) {
      setLoadError(err?.message || 'Unable to load your progress data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  /* ── paginate history ────────────────────────────────────────────────── */
  const loadHistory = useCallback(
    async (page) => {
      if (!profile?.id) return
      setHistLoading(true)
      try {
        const res = await progressService.getProgressHistory(profile.id, { page, limit: 10 })
        setHistory(res.items || [])
        setPagination(res.pagination || { page, totalPages: 1, total: 0 })
      } catch {
        // ignore; keep old data
      } finally {
        setHistLoading(false)
      }
    },
    [profile]
  )

  /* ── submit log ──────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setSuccessMsg('')

    if (!assignmentId) {
      setFormError('No active trainer assignment found. Ask your trainer to assign you first.')
      return
    }
    if (!form.weight_kg && !form.body_fat_percentage && !form.muscle_mass_kg) {
      setFormError('Enter at least one measurement (weight, body fat, or muscle mass).')
      return
    }

    setSubmitting(true)
    try {
      const result = await progressService.logProgress({ ...form, member_assignment_id: assignmentId })
      const saved = result.data

      // prepend to history list
      setHistory((prev) => [saved, ...prev])

      // update latest / prev trend
      setPrev(latest)
      setLatest(saved)
      setPagination((p) => ({ ...p, total: p.total + 1 }))

      setSuccessMsg(result.message || 'Progress logged successfully!')
      setForm(EMPTY_FORM)
      setShowForm(false)
    } catch (err) {
      setFormError(err?.message || 'Unable to log progress. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  /* ── render ──────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48 gap-2 text-muted">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading progress data…</span>
      </div>
    )
  }

  const recentForChart = [...history].slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Progress</h2>
          <p className="text-sm text-muted mt-1">
            Track your body composition over time — weight, body fat, and muscle mass.
          </p>
        </div>
        <Button onClick={() => { setShowForm((v) => !v); setFormError(null); setSuccessMsg('') }}>
          <Plus size={16} className="mr-1" />
          {showForm ? 'Cancel' : 'Log Entry'}
        </Button>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {successMsg && !showForm && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {/* Log Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Log New Entry</CardTitle>
          </CardHeader>
          <form className="p-4 space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 82.5"
                value={form.weight_kg}
                onChange={field('weight_kg')}
              />
              <Input
                label="Body Fat (%)"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 15.2"
                value={form.body_fat_percentage}
                onChange={field('body_fat_percentage')}
              />
              <Input
                label="Muscle Mass (kg)"
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 35"
                value={form.muscle_mass_kg}
                onChange={field('muscle_mass_kg')}
              />
            </div>
            <Input
              label="Notes"
              placeholder="e.g. Post-workout measurement"
              value={form.notes}
              onChange={field('notes')}
            />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
            {!assignmentId && (
              <p className="text-xs text-amber-600">
                ⚠ No active trainer assignment detected. You need an assigned trainer to log progress.
              </p>
            )}
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting || !assignmentId}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </span>
                ) : (
                  'Save Entry'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => { setShowForm(false); setFormError(null) }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Latest snapshot + trends */}
      {latest ? (
        <div className="grid sm:grid-cols-3 gap-4">
          <MetricCard
            icon={Scale}
            label="Weight"
            value={latest.weight_kg}
            prev={prev?.weight_kg}
            unit=" kg"
            color="text-blue-600"
          />
          <MetricCard
            icon={Activity}
            label="Body Fat"
            value={latest.body_fat_percentage}
            prev={prev?.body_fat_percentage}
            unit="%"
            color="text-orange-500"
          />
          <MetricCard
            icon={Dumbbell}
            label="Muscle Mass"
            value={latest.muscle_mass_kg}
            prev={prev?.muscle_mass_kg}
            unit=" kg"
            color="text-green-600"
          />
        </div>
      ) : (
        <Card>
          <div className="p-6 text-center text-sm text-muted">
            No progress data yet. Log your first entry above to start tracking.
          </div>
        </Card>
      )}

      {/* Spark charts */}
      {recentForChart.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Trend (last {recentForChart.length} entries)</CardTitle>
          </CardHeader>
          <div className="p-4 grid sm:grid-cols-3 gap-6">
            {[
              { field: 'weight_kg', label: 'Weight (kg)', color: 'bg-blue-500', unit: ' kg' },
              { field: 'body_fat_percentage', label: 'Body Fat (%)', color: 'bg-orange-400', unit: '%' },
              { field: 'muscle_mass_kg', label: 'Muscle Mass (kg)', color: 'bg-green-500', unit: ' kg' },
            ].map(({ field, label, color, unit }) => (
              <div key={field}>
                <p className="text-xs font-medium text-muted mb-2">{label}</p>
                <SparkBar items={recentForChart} field={field} color={color} unit={unit} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* History table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>History</CardTitle>
            {pagination.total > 0 && (
              <span className="text-xs text-muted">{pagination.total} total entries</span>
            )}
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-muted">No progress entries recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-2 text-xs font-medium text-muted">Date</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted">Weight</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted">Body Fat</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted">Muscle Mass</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted hidden sm:table-cell">Logged by</th>
                  <th className="px-4 py-2 text-xs font-medium text-muted hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((entry, i) => (
                  <tr key={entry.id || i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{fmtDate(entry.logged_at)}</td>
                    <td className="px-4 py-3">
                      {entry.weight_kg != null ? (
                        <Badge variant="default">{fmtNum(entry.weight_kg, ' kg')}</Badge>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.body_fat_percentage != null ? (
                        <span className="text-orange-600 font-medium">
                          {fmtNum(entry.body_fat_percentage, '%')}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.muscle_mass_kg != null ? (
                        <span className="text-green-600 font-medium">
                          {fmtNum(entry.muscle_mass_kg, ' kg')}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted hidden sm:table-cell">
                      {entry.trainer_name || 'Self'}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs hidden sm:table-cell max-w-xs truncate">
                      {entry.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                disabled={pagination.page <= 1 || histLoading}
                onClick={() => loadHistory(pagination.page - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                disabled={pagination.page >= pagination.totalPages || histLoading}
                onClick={() => loadHistory(pagination.page + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

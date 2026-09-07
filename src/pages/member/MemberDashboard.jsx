import { useState, useEffect, useCallback } from 'react'
import {
  Dumbbell,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Clock,
  Award,
  Play,
  Scale,
  Activity,
  Plus,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { memberService } from '../../services/memberService'
import { bookingService } from '../../services/bookingService'
import { classesService } from '../../services/classesService'
import { notificationsService } from '../../services/notificationsService'
import { progressService } from '../../services/progressService'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'

/* ─── Tiny helpers ────────────────────────────────────────────────────────── */
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
    return <span className="inline-flex items-center gap-0.5 text-xs text-muted"><Minus size={11} /> No change</span>
  const up = diff > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? 'text-green-500' : 'text-red-500'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? '+' : ''}{diff.toFixed(1)}{unit}
    </span>
  )
}

const EMPTY_FORM = { weight_kg: '', body_fat_percentage: '', muscle_mass_kg: '', notes: '' }

export function MemberDashboard() {
  const { user } = useAuth()
  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'Member'

  // ── core state ──────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [memberData, setMemberData] = useState(null)
  const [bookings, setBookings] = useState([])
  const [classes, setClasses] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // ── progress state ───────────────────────────────────────────────────────
  const [latestProgress, setLatestProgress] = useState(null)
  const [prevProgress, setPrevProgress] = useState(null)
  const [assignmentId, setAssignmentId] = useState(null)
  const [showLogForm, setShowLogForm] = useState(false)
  const [progressForm, setProgressForm] = useState(EMPTY_FORM)
  const [progressSubmitting, setProgressSubmitting] = useState(false)
  const [progressError, setProgressError] = useState(null)
  const [progressSuccess, setProgressSuccess] = useState('')

  // ── load dashboard ───────────────────────────────────────────────────────
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)
      setMemberData(profile)

      // member_assignment_id for progress logging
      const aid =
        profile?.member_assignment_id ||
        profile?.assignment_id ||
        profile?.current_assignment?.id ||
        profile?.assignment?.id ||
        null
      setAssignmentId(aid)

      const profileId = profile?.id

      if (profileId) {
        const [bookingResponse, classResponse, notificationResponse, unreadResponse, latestProg, histProg] =
          await Promise.all([
            bookingService.getMemberBookings(profileId, { page: 1, limit: 10 }),
            classesService.getClasses({ limit: 10 }),
            notificationsService.listNotifications({ page: 1, limit: 5 }),
            notificationsService.getUnreadCount(),
            progressService.getLatestProgress(profileId).catch(() => null),
            progressService.getProgressHistory(profileId, { page: 1, limit: 5 }).catch(() => ({ items: [] })),
          ])

        const bookingData = bookingResponse?.data?.data?.bookings || []
        setBookings(bookingData)
        setClasses(normalizeListResponse(classResponse))
        setNotifications(Array.isArray(notificationResponse) ? notificationResponse : [])
        setUnreadCount(Number(unreadResponse) || 0)

        setLatestProgress(latestProg)
        const items = histProg.items || []
        if (items.length >= 2) setPrevProgress(items[1])
        else if (items.length === 1 && !latestProg) setLatestProgress(items[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadDashboardData() }, [loadDashboardData])

  // ── progress submit ──────────────────────────────────────────────────────
  const handleProgressSubmit = async (e) => {
    e.preventDefault()
    setProgressError(null)
    setProgressSuccess('')
    if (!assignmentId) {
      setProgressError('No active trainer assignment. Ask your trainer to assign you first.')
      return
    }
    if (!progressForm.weight_kg && !progressForm.body_fat_percentage && !progressForm.muscle_mass_kg) {
      setProgressError('Enter at least one measurement.')
      return
    }
    setProgressSubmitting(true)
    try {
      const result = await progressService.logProgress({ ...progressForm, member_assignment_id: assignmentId })
      setPrevProgress(latestProgress)
      setLatestProgress(result.data)
      setProgressSuccess('Progress saved!')
      setProgressForm(EMPTY_FORM)
      setTimeout(() => { setShowLogForm(false); setProgressSuccess('') }, 1200)
    } catch (err) {
      setProgressError(err?.message || 'Unable to save. Try again.')
    } finally {
      setProgressSubmitting(false)
    }
  }

  // ── derived ──────────────────────────────────────────────────────────────
  const memberStats = [
    {
      label: 'Workouts This Week',
      value: bookings.filter(b => {
        const d = new Date(b.start_time), now = new Date(), wk = new Date(now.setDate(now.getDate() - 7))
        return d >= wk && b.status !== 'cancelled'
      }).length.toString(),
      change: 'This week', icon: Dumbbell,
    },
    {
      label: 'Booked Classes',
      value: bookings.filter(b => b.status !== 'cancelled').length.toString(),
      change: 'Upcoming', icon: Calendar,
    },
    {
      label: 'Available Classes',
      value: classes.filter(c => c.available_spots > 0).length.toString(),
      change: 'Open spots', icon: Target,
    },
    {
      label: 'Notifications',
      value: unreadCount.toString(),
      change: 'Unread', icon: Award,
    },
  ]

  const todayWorkout = bookings.find(b => {
    const d = new Date(b.start_time)
    return d.toDateString() === new Date().toDateString() && b.status !== 'cancelled'
  }) || { name: 'No workout scheduled today', trainer: 'N/A', time: '—', exercises: 0, duration: '—', status: 'No Session' }

  const weeklyProgress = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({ day, completed: false, duration: 0 }))
  bookings.filter(b => b.status !== 'cancelled').forEach(booking => {
    const idx = new Date(booking.start_time).getDay()
    const name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][idx]
    const dp = weeklyProgress.find(d => d.day === name)
    if (dp) { dp.completed = true; dp.duration += booking.duration || 60 }
  })

  const upcomingClasses = classes.filter(c => new Date(c.start_time) > new Date()).slice(0, 2).map(c => ({
    name: c.name,
    time: new Date(c.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' ' +
          new Date(c.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    instructor: c.trainer_name || 'TBD',
    spots: c.available_spots > 0 ? `${c.available_spots} spots left` : 'Fully Booked',
  }))

  const recentActivity = notifications.slice(0, 4).map(n => ({
    activity: n.title || n.message,
    time: new Date(n.created_at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    type: 'notification',
  }))

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-8 animate-spin text-[var(--app-primary)]" />
        </div>
      ) : error ? (
        <Alert variant="danger" title="Error loading dashboard" message={error} action={<Button onClick={loadDashboardData}>Retry</Button>} />
      ) : (
        <>
          {/* Header */}
          <PageHeader 
            title={`Welcome back, ${firstName}!`} 
            subtitle="Track your fitness journey and stay motivated"
            action={
              <Link to="/member/workouts">
                <Button className="gap-2"><Play className="size-4" />Start Workout</Button>
              </Link>
            }
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberStats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} padding="md" hover className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/20">
                      <Icon className="size-5 text-[var(--app-primary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-[var(--app-foreground)]">{stat.value}</p>
                      <p className="text-xs text-[var(--app-muted)] mt-1">{stat.label}</p>
                      <p className="text-xs text-[var(--app-muted)] mt-2">{stat.change}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Today's Workout + Weekly Progress */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card padding="lg" className="lg:col-span-2">
              <CardHeader action={<Link to="/member/workouts"><Button variant="ghost" size="sm">View All</Button></Link>}>
                <CardTitle>Today's Scheduled Workout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-[12px] bg-[#00DF82]/5 border border-[#00DF82]/20">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                    <div>
                      <p className="font-medium text-[var(--app-foreground)] text-lg">{todayWorkout.name}</p>
                      <p className="text-sm text-[var(--app-muted)]">with {todayWorkout.trainer}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30 w-fit">
                      {todayWorkout.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-[var(--app-muted)] mb-4">
                    <div className="flex items-center gap-2"><Clock className="size-4" /><span>{todayWorkout.time}</span></div>
                    <div className="flex items-center gap-2"><Dumbbell className="size-4" /><span>{todayWorkout.exercises} exercises</span></div>
                    <div className="flex items-center gap-2"><Target className="size-4" /><span>{todayWorkout.duration}</span></div>
                  </div>
                  <Button className="w-full sm:w-auto gap-2"><Play className="size-4" />Start Workout</Button>
                </div>
              </CardContent>
            </Card>

            <Card padding="lg">
              <CardTitle className="mb-4">Weekly Progress</CardTitle>
              <CardContent>
                <div className="space-y-3">
                  {weeklyProgress.map((day) => (
                    <div key={day.day} className="flex items-center gap-3">
                      <span className="text-sm text-[var(--app-foreground)] w-8">{day.day}</span>
                      <div className="flex-1 h-2 bg-[var(--app-border)] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${day.completed ? 'bg-[var(--app-primary)]' : 'bg-[var(--app-muted)]'}`}
                          style={{ width: day.completed ? '100%' : '0%' }} />
                      </div>
                      <span className="text-xs text-[var(--app-muted)] w-12 text-right">{day.completed ? `${day.duration}m` : '-'}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--app-border)]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--app-muted)]">Weekly Goal</span>
                    <span className="font-medium text-[var(--app-foreground)]">3/5 workouts</span>
                  </div>
                  <div className="h-2 bg-[var(--app-border)] rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[var(--app-primary)] rounded-full transition-all" style={{ width: '60%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Body Composition Progress ─────────────────────────────────────── */}
          <Card padding="lg">
            <CardHeader 
              action={
                <Button
                  size="sm"
                  variant={showLogForm ? 'ghost' : 'default'}
                  onClick={() => { setShowLogForm(v => !v); setProgressError(null); setProgressSuccess('') }}
                >
                  {showLogForm ? 'Cancel' : <><Plus size={14} className="mr-1" />Log Entry</>}
                </Button>
              }
            >
              <CardTitle>Body Composition</CardTitle>
              <p className="text-xs text-[var(--app-muted)] mt-0.5">Track weight, body fat, and muscle mass over time</p>
            </CardHeader>

            <CardContent>
              {/* Metric cards */}
              {latestProgress ? (
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  {[
                    { icon: Scale, label: 'Weight', field: 'weight_kg', unit: ' kg', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
                    { icon: Activity, label: 'Body Fat', field: 'body_fat_percentage', unit: '%', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
                    { icon: Dumbbell, label: 'Muscle Mass', field: 'muscle_mass_kg', unit: ' kg', color: 'text-[var(--app-primary)]', bg: 'bg-[var(--app-primary)]/10', border: 'border-[var(--app-primary)]/30' },
                  ].map(({ icon: Icon, label, field, unit, color, bg, border }) => (
                    <div key={field} className="rounded-[12px] border border-[var(--app-border)] p-4 flex items-start gap-3 hover:border-[var(--app-primary)]/40 transition-all duration-200">
                      <div className={`p-2 rounded-lg ${bg} ${color} border ${border}`}><Icon size={16} /></div>
                      <div>
                        <p className="text-xs text-[var(--app-muted)]">{label}</p>
                        <p className="text-lg font-bold text-[var(--app-foreground)] leading-tight">{fmtNum(latestProgress[field], unit)}</p>
                        <Trend curr={latestProgress[field]} prev={prevProgress?.[field]} unit={unit} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !showLogForm && (
                <p className="text-sm text-[var(--app-muted)] mb-4">No body composition data yet. Log your first entry to start tracking.</p>
              )}

              {/* Inline log form */}
              {showLogForm && (
                <form onSubmit={handleProgressSubmit} className="border border-[var(--app-border)] rounded-[12px] p-4 space-y-4 bg-[var(--app-surface)]">
                  <p className="text-sm font-medium text-[var(--app-foreground)]">New measurement</p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Input label="Weight (kg)" type="number" step="0.1" min="0" placeholder="e.g. 82.5"
                      value={progressForm.weight_kg}
                      onChange={e => setProgressForm(f => ({ ...f, weight_kg: e.target.value }))} />
                    <Input label="Body Fat (%)" type="number" step="0.1" min="0" max="100" placeholder="e.g. 15.2"
                      value={progressForm.body_fat_percentage}
                      onChange={e => setProgressForm(f => ({ ...f, body_fat_percentage: e.target.value }))} />
                    <Input label="Muscle Mass (kg)" type="number" step="0.1" min="0" placeholder="e.g. 35"
                      value={progressForm.muscle_mass_kg}
                      onChange={e => setProgressForm(f => ({ ...f, muscle_mass_kg: e.target.value }))} />
                  </div>
                  <Input label="Notes" placeholder="e.g. Post-workout measurement"
                    value={progressForm.notes}
                    onChange={e => setProgressForm(f => ({ ...f, notes: e.target.value }))} />
                  {!assignmentId && (
                    <p className="text-xs text-amber-400">⚠ No active trainer assignment detected. You need an assigned trainer to log progress.</p>
                  )}
                  {progressError && <p className="text-sm text-red-400">{progressError}</p>}
                  {progressSuccess && <p className="text-sm text-[var(--app-primary)]">{progressSuccess}</p>}
                  <Button type="submit" disabled={progressSubmitting || !assignmentId}>
                    {progressSubmitting ? <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin" />Saving…</span> : 'Save Entry'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity + Upcoming Classes */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <CardTitle className="mb-4">Recent Activity</CardTitle>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-[var(--app-muted)]">No recent activity</p>
                  ) : (
                    recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)]">
                        <div className="flex size-8 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/30">
                          <Award className="size-4 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[var(--app-foreground)]">{activity.activity}</p>
                          <p className="text-xs text-[var(--app-muted)]">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card padding="lg">
              <CardHeader action={<Link to="/member/classes"><Button variant="ghost" size="sm">View All</Button></Link>}>
                <CardTitle>Upcoming Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.length === 0 ? (
                    <p className="text-sm text-[var(--app-muted)]">No upcoming classes</p>
                  ) : (
                    upcomingClasses.map((classItem, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)]">
                        <div className="flex size-8 items-center justify-center rounded-full bg-[var(--app-primary)]/10 border border-[var(--app-primary)]/30">
                          <Calendar className="size-4 text-[var(--app-primary)]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[var(--app-foreground)] text-sm">{classItem.name}</p>
                          <p className="text-xs text-[var(--app-muted)]">{classItem.instructor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--app-foreground)]">{classItem.time}</p>
                          <span className={`text-xs ${classItem.spots.includes('Fully') ? 'text-red-400' : 'text-[var(--app-primary)]'}`}>{classItem.spots}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card padding="lg">
            <CardTitle className="mb-4">Quick Actions</CardTitle>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Link to="/member/workouts">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-slate-700/50 bg-[#0A1128] hover:border-[#00DF82]/40 hover:bg-[#00DF82]/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#00DF82]/10 group-hover:bg-[#00DF82]/20 transition-all duration-200">
                      <Dumbbell className="size-5 text-[#00DF82]" />
                    </div>
                    <span className="text-sm text-[#F8FAFC]">View Workouts</span>
                  </div>
                </Link>
                <Link to="/member/meals">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-slate-700/50 bg-[#0A1128] hover:border-[#00DF82]/40 hover:bg-[#00DF82]/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#00DF82]/10 group-hover:bg-[#00DF82]/20 transition-all duration-200">
                      <Target className="size-5 text-[#00DF82]" />
                    </div>
                    <span className="text-sm text-[#F8FAFC]">Meal Plans</span>
                  </div>
                </Link>
                <Link to="/member/classes">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-slate-700/50 bg-[#0A1128] hover:border-[#00DF82]/40 hover:bg-[#00DF82]/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#00DF82]/10 group-hover:bg-[#00DF82]/20 transition-all duration-200">
                      <Calendar className="size-5 text-[#00DF82]" />
                    </div>
                    <span className="text-sm text-[#F8FAFC]">Book Classes</span>
                  </div>
                </Link>
                <Link to="/member/trainers">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-slate-700/50 bg-[#0A1128] hover:border-[#00DF82]/40 hover:bg-[#00DF82]/5 transition-all duration-200 cursor-pointer group">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#00DF82]/10 group-hover:bg-[#00DF82]/20 transition-all duration-200">
                      <Award className="size-5 text-[#00DF82]" />
                    </div>
                    <span className="text-sm text-[#F8FAFC]">My Trainers</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

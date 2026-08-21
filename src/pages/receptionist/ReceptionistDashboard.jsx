import { useEffect, useState } from 'react'
import { Users, Calendar, LogIn, AlertTriangle, Plus, Search, DoorOpen } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { checkinService } from '../../services/checkinService'
import { classesService } from '../../services/classesService'
import { normalizeListResponse } from '../../utils/apiHelpers'

const lockerStatus = {
  total: 200,
  occupied: 167,
  available: 33,
}

export function ReceptionistDashboard() {
  const [uniqueId, setUniqueId] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [lookup, setLookup] = useState(null)
  const [checkinMessage, setCheckinMessage] = useState('')
  const [checkinError, setCheckinError] = useState('')
  const [busy, setBusy] = useState(false)
  const [todayCheckins, setTodayCheckins] = useState([])
  const [classes, setClasses] = useState([])

  const today = new Date().toISOString().slice(0, 10)

  const loadDashboard = async () => {
    try {
      const [checkinsResponse, classesResponse] = await Promise.all([
        checkinService.getTodayCheckins(),
        classesService.getClasses({ date: today, limit: 20 }),
      ])
      setTodayCheckins(checkinsResponse.data || [])
      setClasses(normalizeListResponse(classesResponse))
    } catch (err) {
      setCheckinError(err.message || 'Unable to load dashboard data.')
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleLookup = async () => {
    if (!uniqueId.trim()) return
    setBusy(true)
    setCheckinError('')
    setCheckinMessage('')
    try {
      const member = await checkinService.lookupMember(uniqueId.trim())
      setLookup(member)
    } catch (err) {
      setLookup(null)
      setCheckinError(err.message || 'Member not found.')
    } finally {
      setBusy(false)
    }
  }

  const handleCheckIn = async (override = false) => {
    if (!uniqueId.trim()) return
    setBusy(true)
    setCheckinError('')
    setCheckinMessage('')
    try {
      const response = override
        ? await checkinService.overrideCheckIn(uniqueId.trim(), overrideReason || 'Front desk override')
        : await checkinService.checkIn(uniqueId.trim())
      setCheckinMessage(response?.message || 'Check-in successful')
      setOverrideReason('')
      await loadDashboard()
    } catch (err) {
      setCheckinError(err.message || 'Check-in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Receptionist!</h1>
          <p className="text-sm text-muted">Look up members by gym ID and record check-ins</p>
        </div>
        <Link to="/receptionist/walk-in">
          <Button className="gap-2">
            <Plus className="size-4" />
            Walk-in Registration
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Member check-in</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            placeholder="GYM-A3F9-7"
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
          <Button onClick={handleLookup} disabled={busy} className="gap-2">
            <Search className="size-4" />
            Look up
          </Button>
          <Button onClick={() => handleCheckIn(false)} disabled={busy} className="gap-2">
            <LogIn className="size-4" />
            Check In
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            placeholder="Override reason (reception/admin only)"
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
          <Button variant="secondary" onClick={() => handleCheckIn(true)} disabled={busy}>
            Override check-in
          </Button>
        </div>
        {lookup && (
          <p className="text-sm text-muted">
            {lookup.first_name} {lookup.last_name} · {lookup.unique_member_id} · subscription {lookup.subscription_status || '—'} · {lookup.is_active === false ? 'inactive' : 'active'}
          </p>
        )}
        {checkinMessage && <p className="text-sm text-green-700">{checkinMessage}</p>}
        {checkinError && <p className="text-sm text-red-600">{checkinError}</p>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Check-ins", value: String(todayCheckins.length), icon: LogIn },
          { label: 'Classes Today', value: String(classes.length), icon: Calendar },
          { label: 'Currently In Gym', value: String(todayCheckins.filter((item) => !item.checked_out_at).length), icon: Users },
          { label: 'Equipment Issues', value: '—', icon: AlertTriangle },
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Check-ins</h3>
            <Link to="/receptionist/checkins">
              <Button variant="ghost" size="sm" className="gap-2">
                <Search className="size-4" />
                View all
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {todayCheckins.length === 0 && <p className="text-sm text-muted">No check-ins recorded today.</p>}
            {todayCheckins.slice(0, 8).map((checkIn) => (
              <div key={checkIn.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {(checkIn.first_name?.[0] || '') + (checkIn.last_name?.[0] || '')}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">
                    {`${checkIn.first_name || ''} ${checkIn.last_name || ''}`.trim() || checkIn.unique_member_id}
                  </p>
                  <p className="text-xs text-muted">{checkIn.unique_member_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">
                    {checkIn.checked_in_at ? new Date(checkIn.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Locker Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Total Lockers</span>
              <span className="font-medium text-foreground">{lockerStatus.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Occupied</span>
              <span className="font-medium text-foreground">{lockerStatus.occupied}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Available</span>
              <span className="font-medium text-foreground">{lockerStatus.available}</span>
            </div>
          </div>
          <Link to="/receptionist/lockers" className="block mt-4">
            <Button variant="secondary" size="sm" className="w-full gap-2">
              <DoorOpen className="size-4" />
              Manage Lockers
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Upcoming Classes Today</h3>
        </div>
        <div className="space-y-3">
          {classes.length === 0 && <p className="text-sm text-muted">No classes scheduled for today.</p>}
          {classes.map((classItem) => (
            <div key={classItem.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{classItem.name}</p>
                <p className="text-xs text-muted">{classItem.trainer_name || 'TBD'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">
                  {classItem.start_time ? new Date(classItem.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                </p>
                <span className="text-xs text-muted">
                  {classItem.current_bookings || 0}/{classItem.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

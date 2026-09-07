import { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, Users, Filter, Search, CheckCircle, Star, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Input } from '../../components/ui/Input'
import { classesService } from '../../services/classesService'
import { bookingService } from '../../services/bookingService'
import { memberService } from '../../services/memberService'
import { normalizeListResponse, unwrapResource } from '../../utils/apiHelpers'

export function MemberClasses() {
  const [classes, setClasses] = useState([])
  const [bookings, setBookings] = useState([])
  const [memberProfileId, setMemberProfileId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [bookingClassId, setBookingClassId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('')

  const loadData = useCallback(async (discipline) => {
    setLoading(true)
    setError(null)

    try {
      const profileResponse = await memberService.getCurrentMemberProfile()
      const profile = unwrapResource(profileResponse)
      const profileId = profile?.id
      setMemberProfileId(profileId)

      const [classResponse, bookingResponse] = await Promise.all([
        classesService.getClasses({ discipline: discipline || undefined, limit: 50 }),
        profileId
          ? bookingService.getMemberBookings(profileId, { page: 1, limit: 50 })
          : Promise.resolve({ data: { data: { bookings: [] } } }),
      ])

      setClasses(normalizeListResponse(classResponse))
      // Backend returns { success: true, data: { count, bookings: [...] }, message }
      setBookings(bookingResponse?.data?.data?.bookings || [])
    } catch (err) {
      setError(err.message || 'Failed to load classes')
      setClasses([])
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(selectedDiscipline)
  }, [loadData, selectedDiscipline])

  const bookedClassIds = new Set(
    bookings
      .filter((booking) => booking.status && booking.status !== 'cancelled')
      .map((booking) => booking.class_id)
  )

  const handleBook = async (classId) => {
    if (!memberProfileId) {
      setActionError('Member profile is not available. Please complete your profile first.')
      return
    }

    setBookingClassId(classId)
    setActionError(null)

    try {
      await bookingService.bookClass(memberProfileId, classId)
      await loadData(selectedDiscipline)
    } catch (err) {
      setActionError(err.message || 'Unable to book this class.')
    } finally {
      setBookingClassId(null)
    }
  }

  const handleCancel = async (bookingId) => {
    setActionError(null)
    try {
      await bookingService.cancelBooking(bookingId)
      await loadData(selectedDiscipline)
    } catch (err) {
      setActionError(err.message || 'Unable to cancel this booking.')
    }
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'TBD'
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return ''
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMins = Math.round((end - start) / 60000)
    return `${diffMins} min`
  }

  const filteredClasses = classes.filter((cls) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return (
      cls.name?.toLowerCase().includes(query) ||
      cls.trainer_name?.toLowerCase().includes(query)
    )
  })

  const handleSearch = () => {
    // Search is already applied via filteredClasses
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedDiscipline('')
  }

  const classStats = [
    { label: 'Total Classes', value: classes.length.toString(), icon: Calendar },
    { label: 'Available Spots', value: classes.reduce((acc, cls) => acc + (cls.available_spots || 0), 0).toString(), icon: Users },
    { label: 'My Bookings', value: bookings.filter((b) => b.status !== 'cancelled').length.toString(), icon: Star },
  ]

  const upcomingClasses = filteredClasses
    .filter((cls) => new Date(cls.start_time) > new Date())
    .slice(0, 4)

  const availableClasses = filteredClasses.filter(
    (cls) => cls.available_spots > 0 && new Date(cls.start_time) > new Date()
  )

  const myBookings = bookings.filter((booking) => booking.status !== 'cancelled')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-[var(--app-primary)]" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" title="Error loading classes" message={error} action={<Button onClick={() => loadData(selectedDiscipline)}>Retry</Button>} />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Group Classes" 
        subtitle="Browse and book group fitness classes"
        action={
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter Classes
          </Button>
        }
      />

      {actionError && (
        <Alert variant="danger" message={actionError} />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {classStats.map((stat) => {
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
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardTitle className="mb-4">My Bookings</CardTitle>
          <CardContent>
            <div className="space-y-3">
              {myBookings.length === 0 && (
                <p className="text-sm text-[var(--app-muted)]">You have no upcoming bookings.</p>
              )}
              {myBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)]">
                  <div className={`flex size-10 items-center justify-center rounded-full border ${
                    booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {booking.status === 'confirmed' ? (
                      <CheckCircle className="size-5" />
                    ) : (
                      <Calendar className="size-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--app-foreground)] text-sm">{booking.class_name || booking.name}</p>
                    <p className="text-xs text-[var(--app-muted)]">{booking.trainer_name || booking.instructor || 'Trainer TBD'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--app-foreground)]">{formatDateTime(booking.start_time)}</p>
                    <p className="text-xs text-[var(--app-muted)]">{booking.location || booking.status}</p>
                    <button
                      type="button"
                      onClick={() => handleCancel(booking.id)}
                      className="text-xs text-red-400 mt-1 hover:underline transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardTitle className="mb-4">Upcoming Classes</CardTitle>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.length === 0 && (
                <p className="text-sm text-[var(--app-muted)]">No upcoming classes.</p>
              )}
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="p-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-[var(--app-foreground)] text-sm">{classItem.name}</p>
                      <p className="text-xs text-[var(--app-muted)]">{classItem.trainer_name || 'TBD'}</p>
                    </div>
                    {bookedClassIds.has(classItem.id) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                        Booked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--app-muted)]">
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{formatDateTime(classItem.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="size-3" />
                      <span>{classItem.current_bookings || 0}/{classItem.capacity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card padding="lg">
        <CardHeader action={
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--app-muted)]" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-[var(--app-border)] rounded-[12px] bg-[var(--app-input)] text-[var(--app-foreground)] placeholder:text-[var(--app-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200 w-64"
              />
            </div>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="px-3 py-2 text-sm border border-[var(--app-border)] rounded-[12px] bg-[var(--app-input)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200"
            >
              <option value="">All Disciplines</option>
              <option value="yoga">Yoga</option>
              <option value="pilates">Pilates</option>
              <option value="hiit">HIIT</option>
              <option value="spin">Spin</option>
              <option value="strength">Strength</option>
              <option value="dance">Dance</option>
              <option value="other">Other</option>
            </select>
            <Button onClick={handleSearch} size="sm">Search</Button>
            <Button variant="secondary" onClick={handleReset} size="sm">Reset</Button>
          </div>
        }>
          <CardTitle>Available Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {availableClasses.length === 0 ? (
            <p className="text-sm text-[var(--app-muted)]">No classes with open spots right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 rounded-[12px] border border-[var(--app-border)] bg-[var(--app-surface)] hover:border-[var(--app-primary)]/40 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-[var(--app-foreground)]">{classItem.name}</p>
                      <p className="text-xs text-[var(--app-muted)]">{classItem.trainer_name || 'TBD'}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                      {classItem.difficulty || 'Intermediate'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4 text-xs text-[var(--app-muted)]">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3" />
                      <span>{formatDateTime(classItem.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-3" />
                      <span>{classItem.current_bookings || 0}/{classItem.capacity} · {formatDuration(classItem.start_time, classItem.end_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍 {classItem.location || 'TBD'}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={bookedClassIds.has(classItem.id) || bookingClassId === classItem.id}
                    onClick={() => handleBook(classItem.id)}
                  >
                    {bookedClassIds.has(classItem.id)
                      ? 'Booked'
                      : bookingClassId === classItem.id
                        ? 'Booking...'
                        : 'Book Now'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

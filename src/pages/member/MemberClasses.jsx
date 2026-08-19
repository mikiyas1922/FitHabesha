import { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, Users, Filter, Search, CheckCircle, Star, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
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
          : Promise.resolve({ data: [] }),
      ])

      setClasses(normalizeListResponse(classResponse))
      setBookings(normalizeListResponse(bookingResponse))
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
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600 font-medium">Error loading classes</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <Button onClick={() => loadData(selectedDiscipline)} className="mt-3">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Group Classes</h1>
          <p className="text-sm text-muted">Browse and book group fitness classes</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Filter className="size-4" />
          Filter Classes
        </Button>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {classStats.map((stat) => {
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">My Bookings</h3>
          </div>
          <div className="space-y-3">
            {myBookings.length === 0 && (
              <p className="text-sm text-muted">You have no upcoming bookings.</p>
            )}
            {myBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                <div className={`flex size-10 items-center justify-center rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {booking.status === 'confirmed' ? (
                    <CheckCircle className="size-5 text-green-600" />
                  ) : (
                    <Calendar className="size-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{booking.class_name || booking.name}</p>
                  <p className="text-xs text-muted">{booking.trainer_name || booking.instructor || 'Trainer TBD'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{formatDateTime(booking.start_time)}</p>
                  <p className="text-xs text-muted">{booking.location || booking.status}</p>
                  <button
                    type="button"
                    onClick={() => handleCancel(booking.id)}
                    className="text-xs text-red-600 mt-1 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Classes</h3>
          </div>
          <div className="space-y-3">
            {upcomingClasses.length === 0 && (
              <p className="text-sm text-muted">No upcoming classes.</p>
            )}
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-3 rounded-lg border border-border bg-surface">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">{classItem.name}</p>
                    <p className="text-xs text-muted">{classItem.trainer_name || 'TBD'}</p>
                  </div>
                  {bookedClassIds.has(classItem.id) && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Booked
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
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
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Available Classes</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
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
          </div>
        </div>

        {availableClasses.length === 0 ? (
          <p className="text-sm text-muted">No classes with open spots right now.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{classItem.name}</p>
                    <p className="text-xs text-muted">{classItem.trainer_name || 'TBD'}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {classItem.difficulty || 'Intermediate'}
                  </span>
                </div>
                <div className="space-y-2 mb-4 text-xs text-muted">
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
      </div>
    </div>
  )
}

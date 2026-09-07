import { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, Users, Filter, Search, CheckCircle, Star, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
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
  const [activeTab, setActiveTab] = useState('available')

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

  const disciplineOptions = ['yoga', 'pilates', 'hiit', 'spin', 'strength', 'dance', 'other']

  return (
    <div className="space-y-6">
      <PageHeader
        title="Group Classes"
        subtitle="Browse and book group fitness classes"
        actions={
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter Classes
          </Button>
        }
      />

      {actionError && (
        <Alert variant="error" title="Action Error">
          {actionError}
        </Alert>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {classStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} padding="md" className="hover:-translate-y-1 transition-transform">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      <Card padding="md">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-primary text-foreground'
                : 'bg-surface text-muted hover:bg-hover'
            }`}
          >
            Available Classes
          </button>
          <button
            onClick={() => setActiveTab('booked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'booked'
                ? 'bg-primary text-foreground'
                : 'bg-surface text-muted hover:bg-hover'
            }`}
          >
            My Bookings
          </button>
        </div>

        {activeTab === 'available' ? (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {disciplineOptions.map((discipline) => (
                  <button
                    key={discipline}
                    onClick={() => setSelectedDiscipline(selectedDiscipline === discipline ? '' : discipline)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedDiscipline === discipline
                        ? 'bg-primary text-foreground'
                        : 'bg-surface text-muted hover:bg-hover'
                    }`}
                  >
                    {discipline.charAt(0).toUpperCase() + discipline.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {availableClasses.length === 0 ? (
              <EmptyState
                icon={<Calendar className="size-12" />}
                title="No classes available"
                description={searchTerm || selectedDiscipline ? "Try adjusting your search or filters" : "Check back later for new classes"}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableClasses.map((classItem) => (
                  <Card key={classItem.id} padding="md" className="hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{classItem.name}</p>
                        <p className="text-xs text-muted">{classItem.trainer_name || 'TBD'}</p>
                      </div>
                      <Badge variant="warning">{classItem.difficulty || 'Intermediate'}</Badge>
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
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={classItem.available_spots <= 3 ? 'danger' : 'success'}>
                        {classItem.available_spots} spots left
                      </Badge>
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
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {myBookings.length === 0 ? (
              <EmptyState
                icon={<Calendar className="size-12" />}
                title="No bookings yet"
                description="Book your first class to get started"
              />
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking) => (
                  <Card key={booking.id} padding="md">
                    <div className="flex items-center gap-4">
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
                        <Badge variant={booking.status === 'confirmed' ? 'success' : 'info'} className="text-xs">
                          {booking.status}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleCancel(booking.id)}
                          className="text-xs text-red-600 mt-1 hover:underline block"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Plus, Filter, Search, CheckCircle, XCircle, Star, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { classesService } from '../../services/classesService'

export function MemberClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await classesService.getClasses({
        discipline: selectedDiscipline || undefined,
      })
      setClasses(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load classes')
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const response = await classesService.getClasses({
        discipline: selectedDiscipline || undefined,
      })
      const filtered = response.data?.filter(cls =>
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
      setClasses(filtered)
    } catch (err) {
      setError(err.message || 'Failed to search classes')
    } finally {
      setLoading(false)
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
    const diffMs = end - start
    const diffMins = Math.round(diffMs / 60000)
    return `${diffMins} min`
  }

  const classStats = [
    { label: 'Total Classes', value: classes.length.toString(), icon: Calendar },
    { label: 'Available Spots', value: classes.reduce((acc, cls) => acc + (cls.available_spots || 0), 0).toString(), icon: Users },
    { label: 'Categories', value: [...new Set(classes.map(cls => cls.category))].length.toString(), icon: Star },
  ]

  const upcomingClasses = classes
    .filter(cls => new Date(cls.start_time) > new Date())
    .slice(0, 4)
    .map(cls => ({
      id: cls.id,
      name: cls.name,
      instructor: cls.trainer_name || 'TBD',
      time: formatDateTime(cls.start_time),
      duration: formatDuration(cls.start_time, cls.end_time),
      capacity: `${cls.current_bookings || 0}/${cls.capacity}`,
      location: cls.location || 'TBD',
      booked: false,
    }))

  const availableClasses = classes
    .filter(cls => cls.available_spots > 0 && new Date(cls.start_time) > new Date())
    .map(cls => ({
      id: cls.id,
      name: cls.name,
      instructor: cls.trainer_name || 'TBD',
      time: formatDateTime(cls.start_time),
      duration: formatDuration(cls.start_time, cls.end_time),
      capacity: `${cls.current_bookings || 0}/${cls.capacity}`,
      location: cls.location || 'TBD',
      difficulty: cls.difficulty || 'Intermediate',
    }))

  const myBookings = [] // TODO: Implement booking functionality

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
        <Button onClick={fetchClasses} className="mt-3">Retry</Button>
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Group Classes</h1>
            <p className="text-sm text-muted">Browse and book group fitness classes</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Calendar className="size-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Classes Available</h3>
          <p className="text-muted mb-4">There are currently no classes scheduled. Check back later!</p>
          <Button onClick={fetchClasses}>Refresh</Button>
        </div>
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
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Filter Classes
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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
        {/* My Bookings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">My Bookings</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="space-y-3">
            {myBookings.map((booking, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
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
                  <p className="font-medium text-foreground text-sm">{booking.name}</p>
                  <p className="text-xs text-muted">{booking.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{booking.date}</p>
                  <p className="text-xs text-muted">{booking.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Upcoming Classes</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-3 rounded-lg border border-border bg-surface">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">{classItem.name}</p>
                    <p className="text-xs text-muted">{classItem.instructor}</p>
                  </div>
                  {classItem.booked && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Booked
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-3" />
                    <span>{classItem.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📍 {classItem.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Classes */}
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
            <Button onClick={handleSearch} size="sm">Search</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableClasses.map((classItem) => (
            <div key={classItem.id} className="p-4 rounded-lg border border-border bg-surface hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{classItem.name}</p>
                  <p className="text-xs text-muted">{classItem.instructor}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  classItem.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  classItem.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {classItem.difficulty}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>{classItem.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-3" />
                  <span>{classItem.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍 {classItem.location}</span>
                </div>
              </div>

              <Button size="sm" className="w-full">
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Calendar className="size-4" />
            View Schedule
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Filter by Instructor
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Star className="size-4" />
            Favorite Classes
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Users className="size-4" />
            Invite Friends
          </Button>
        </div>
      </div>
    </div>
  )
}

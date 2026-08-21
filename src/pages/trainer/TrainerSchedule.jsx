import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus, MoreVertical, Loader2, Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ClassFormModal } from '../../components/ClassFormModal'
import { ClassRosterModal } from '../../components/trainer/ClassRosterModal'
import { trainerService } from '../../services/trainerService'
import { normalizeListResponse, unwrapResource } from '../../utils/apiHelpers'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function TrainerSchedule() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [showRosterModal, setShowRosterModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [trainerId, setTrainerId] = useState(null)

  useEffect(() => {
    fetchTrainerClasses()
  }, [currentWeekStart])

  const fetchTrainerClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const profileResponse = await trainerService.getCurrentTrainerProfile()
      const profile = unwrapResource(profileResponse)
      if (!profile?.id) {
        throw new Error('Trainer profile not found.')
      }
      setTrainerId(profile.id)

      const response = await trainerService.getTrainerSchedule(profile.id)
      const payload = unwrapResource(response)
      const schedule = Array.isArray(payload?.schedule) ? payload.schedule : normalizeListResponse(response)
      setClasses(schedule)
    } catch (err) {
      setError(err.message || 'Failed to load schedule')
      console.error('Error fetching trainer classes:', err)
    } finally {
      setLoading(false)
    }
  }

  const getWeekDates = (startDate) => {
    const dates = []
    const date = new Date(startDate)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(date.setDate(diff))
    
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday)
      nextDate.setDate(monday.getDate() + i)
      dates.push(nextDate)
    }
    return dates
  }

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getClassesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return classes.filter(cls => {
      const classDate = new Date(cls.start_time).toISOString().split('T')[0]
      return classDate === dateStr
    })
  }

  const getTodayClasses = () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    return classes.filter(cls => {
      const classDate = new Date(cls.start_time).toISOString().split('T')[0]
      return classDate === todayStr
    })
  }

  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return ''
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start
    const diffMins = Math.round(diffMs / 60000)
    return `${diffMins}m`
  }

  const getClassStatus = (startTime, endTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    if (now > end) return 'completed'
    if (now >= start) return 'in-progress'
    return 'upcoming'
  }

  const weekDates = getWeekDates(currentWeekStart)
  const todayClasses = getTodayClasses()
  const scheduleStats = {
    totalSessions: `${classes.length} Sessions`,
    completed: `${classes.filter(c => getClassStatus(c.start_time, c.end_time) === 'completed').length}/${classes.length} Done`,
    totalBookings: `${classes.reduce((acc, cls) => acc + (cls.current_bookings || 0), 0)} Bookings`,
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + (direction * 7))
    setCurrentWeekStart(newDate)
  }

  const handleCreateSuccess = (response) => {
    if (response.data) {
      setClasses([...classes, response.data])
    } else {
      fetchTrainerClasses()
    }
  }

  const handleUpdateSuccess = (response) => {
    if (response.data) {
      setClasses(classes.map(cls => cls.id === response.data.id ? response.data : cls))
    } else {
      fetchTrainerClasses()
    }
  }

  const handleViewRoster = (cls) => {
    setSelectedClass(cls)
    setShowRosterModal(true)
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
        <p className="text-red-600 font-medium">Error loading schedule</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <Button onClick={fetchTrainerClasses} className="mt-3">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trainer Schedule</h1>
          <p className="text-sm text-muted">Manage and organize your weekly client bookings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="size-4" />
            Previous Week
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => navigateWeek(1)}>
            Next Week
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Week Header */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            {formatDate(weekDates[0])} - {formatDate(weekDates[6])}, {weekDates[0].getFullYear()}
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Week</Button>
            <Button variant="ghost" size="sm">Day</Button>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const isToday = weekDates[i].toDateString() === new Date().toDateString()
            return (
              <div key={day} className="text-center">
                <p className="text-xs text-muted mb-1">{day}</p>
                <div className={`size-8 flex items-center justify-center rounded-full mx-auto ${
                  isToday ? 'bg-primary text-dark' : 'bg-surface'
                }`}>
                  <span className="text-sm font-medium">{weekDates[i].getDate()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Overview */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Today's Overview ({new Date().toLocaleDateString('en-US', { weekday: 'short' })})</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-muted">{scheduleStats.totalSessions}</span>
            <span className="text-muted">{scheduleStats.completed}</span>
          </div>
        </div>

        <div className="space-y-3">
          {todayClasses.length > 0 ? (
            todayClasses.map((cls) => {
              const status = getClassStatus(cls.start_time, cls.end_time)
              return (
                <div key={cls.id} className="flex items-center gap-4 p-4 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
                  <div className="text-center min-w-20">
                    <p className="text-sm font-medium text-foreground">{formatTime(cls.start_time)}</p>
                    <p className="text-xs text-muted">{formatDuration(cls.start_time, cls.end_time)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{cls.name}</p>
                    <p className="text-sm text-muted">{cls.category} • {cls.current_bookings || 0}/{cls.capacity} booked</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {status === 'in-progress' ? 'In Progress' : status}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleViewRoster(cls)}>
                      <Users className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-muted text-center py-8">No classes scheduled for today</p>
          )}
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-6">Weekly Schedule</h3>
        
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, dayIndex) => {
            const dayClasses = getClassesForDate(weekDates[dayIndex])
            return (
              <div key={day} className="space-y-2">
                <div className="text-center pb-2 border-b border-border">
                  <p className="text-xs text-muted">{day}</p>
                  <p className="text-sm font-medium text-foreground">{weekDates[dayIndex].getDate()}</p>
                </div>
                
                <div className="space-y-2 min-h-32">
                  {dayClasses.map((cls) => {
                    const status = getClassStatus(cls.start_time, cls.end_time)
                    return (
                      <div 
                        key={cls.id} 
                        className={`p-2 rounded-lg text-xs ${
                          status === 'completed' 
                            ? 'bg-green-50 border border-green-200' 
                            : status === 'in-progress'
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        <p className="font-medium text-foreground">{formatTime(cls.start_time)}</p>
                        <p className="text-muted truncate">{cls.name}</p>
                        <p className="text-muted truncate">{cls.category}</p>
                      </div>
                    )
                  })}
                  {dayClasses.length === 0 && (
                    <div className="p-2 rounded-lg bg-surface text-xs text-muted text-center">
                      No sessions
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="secondary" className="gap-2 justify-start" onClick={() => setShowCreateModal(true)}>
            <Plus className="size-4" />
            Add Session
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Calendar className="size-4" />
            Set Availability
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <User className="size-4" />
            Client Requests
          </Button>
        </div>
      </div>

      <ClassFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <ClassFormModal
        open={!!editingClass}
        onClose={() => setEditingClass(null)}
        classData={editingClass}
        onSuccess={handleUpdateSuccess}
      />

      <ClassRosterModal
        open={showRosterModal}
        onClose={() => setShowRosterModal(false)}
        classData={selectedClass}
        trainerId={trainerId}
      />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Loader2, Calendar } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { ClassFormModal } from '../../components/ClassFormModal'
import { classesService } from '../../services/classesService'
import { normalizeListResponse } from '../../utils/apiHelpers'

export function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)

  useEffect(() => {
    fetchClasses()
  }, [selectedDiscipline])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await classesService.getClasses({
        discipline: selectedDiscipline || undefined,
      })
      const allClasses = normalizeListResponse(response)
      
      // Apply search filter client-side
      if (searchTerm) {
        const filtered = allClasses.filter((cls) =>
          cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setClasses(filtered)
      } else {
        setClasses(allClasses)
      }
    } catch (err) {
      setError(err.message || 'Failed to load classes')
      console.error('Error fetching classes:', err)
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchClasses()
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedDiscipline('')
  }

  const handleDelete = async (classId) => {
    if (!confirm('Cancel this class? There is no delete endpoint; this sets status to cancelled.')) return

    try {
      const response = await classesService.cancelClass(classId)
      const updated = response?.data || { ...classes.find((cls) => cls.id === classId), status: 'cancelled' }
      setClasses(classes.map((cls) => (cls.id === classId ? { ...cls, ...updated } : cls)))
    } catch (err) {
      setError(err.message || 'Failed to cancel class')
    }
  }

  const handleCreateSuccess = (response) => {
    if (response.data) {
      setClasses([...classes, response.data])
    } else {
      fetchClasses()
    }
  }

  const handleUpdateSuccess = (response) => {
    if (response.data) {
      setClasses(classes.map(cls => cls.id === response.data.id ? response.data : cls))
    } else {
      fetchClasses()
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
    { label: 'Total Classes', value: classes.length.toString() },
    { label: 'Active Classes', value: classes.filter(c => c.status === 'scheduled').length.toString() },
    { label: 'Total Bookings', value: classes.reduce((acc, cls) => acc + (cls.current_bookings || 0), 0).toString() },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading classes">
        {error}
        <Button onClick={fetchClasses} className="mt-3">Retry</Button>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes Management"
        subtitle="Manage gym classes and schedules"
        actions={
          <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="size-4" />
            Create Class
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {classStats.map((stat, i) => (
          <Card key={i} padding="md" className="hover:-translate-y-1 transition-transform">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
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
            {['', 'yoga', 'pilates', 'hiit', 'spin', 'strength', 'dance', 'other'].map((discipline) => (
              <button
                key={discipline || 'all'}
                onClick={() => setSelectedDiscipline(discipline)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedDiscipline === discipline
                    ? 'bg-primary text-foreground'
                    : 'bg-surface text-muted hover:bg-hover'
                }`}
              >
                {discipline ? discipline.charAt(0).toUpperCase() + discipline.slice(1) : 'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Classes Table */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>Manage class schedules and occupancy</CardDescription>
        </CardHeader>
        
        {classes.length === 0 ? (
          <EmptyState
            icon={<Calendar className="size-12" />}
            title="No classes found"
            description="Create a new class to get started"
            actionLabel="Create Class"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Class Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Trainer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Schedule</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Occupancy</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => {
                  const occupancyPercent = cls.capacity > 0 ? (cls.current_bookings || 0) / cls.capacity * 100 : 0
                  return (
                    <tr key={cls.id} className="border-b border-border hover:bg-surface/50">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{cls.name}</td>
                      <td className="py-3 px-4 text-sm text-muted">{cls.trainer_name || 'TBD'}</td>
                      <td className="py-3 px-4 text-sm text-muted">{cls.category}</td>
                      <td className="py-3 px-4 text-sm text-muted">{formatDateTime(cls.start_time)}</td>
                      <td className="py-3 px-4 text-sm text-muted">{formatDuration(cls.start_time, cls.end_time)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                occupancyPercent >= 80 ? 'bg-red-500' :
                                occupancyPercent >= 60 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted">{cls.current_bookings || 0}/{cls.capacity}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={cls.status === 'scheduled' ? 'success' : cls.status === 'cancelled' ? 'danger' : 'info'}>
                          {cls.status || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingClass(cls)}>
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.id)} title="Cancel class">
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

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
    </div>
  )
}

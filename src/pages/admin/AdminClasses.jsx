import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ClassFormModal } from '../../components/ClassFormModal'
import { classesService } from '../../services/classesService'

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
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await classesService.getClasses({
        discipline: selectedDiscipline || undefined,
      })
      setClasses(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError(err.message || 'Failed to load classes')
      console.error('Error fetching classes:', err)
      setClasses([])
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

  const handleDelete = async (classId) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    
    try {
      await classesService.deleteClass(classId)
      setClasses(classes.filter(cls => cls.id !== classId))
    } catch (err) {
      setError(err.message || 'Failed to delete class')
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600 font-medium">Error loading classes</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <Button onClick={fetchClasses} className="mt-3">Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes Management</h1>
          <p className="text-sm text-muted">Manage gym classes and schedules</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="size-4" />
          Create Class
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {classStats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex gap-3">
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
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="secondary" onClick={fetchClasses}>Reset</Button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">All Classes</h3>
        
        {classes.length === 0 ? (
          <p className="text-muted text-center py-8">No classes found</p>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Capacity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-b border-border hover:bg-surface/50">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{cls.name}</td>
                    <td className="py-3 px-4 text-sm text-muted">{cls.trainer_name || 'TBD'}</td>
                    <td className="py-3 px-4 text-sm text-muted">{cls.category}</td>
                    <td className="py-3 px-4 text-sm text-muted">{formatDateTime(cls.start_time)}</td>
                    <td className="py-3 px-4 text-sm text-muted">{formatDuration(cls.start_time, cls.end_time)}</td>
                    <td className="py-3 px-4 text-sm text-muted">{cls.current_bookings || 0}/{cls.capacity}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cls.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                        cls.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {cls.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingClass(cls)}>
                          <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.id)}>
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
    </div>
  )
}

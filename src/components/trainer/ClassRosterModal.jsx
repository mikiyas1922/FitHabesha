import { useState, useEffect } from 'react'
import { Users, Calendar, Clock, X, Loader2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { trainerService } from '../../services/trainerService'
import { getInitials } from '../../utils/format'

export function ClassRosterModal({ open, onClose, classData, trainerId }) {
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadRoster = async () => {
    if (!classData?.id || !trainerId) return

    setLoading(true)
    setError(null)
    try {
      const bookedMembers = await trainerService.getClassRoster(trainerId, classData.id)
      setRoster(bookedMembers)
    } catch (err) {
      setError(err.message || 'Failed to load class roster')
      setRoster([])
    } finally {
      setLoading(false)
    }
  }

  // Load roster when modal opens
  useEffect(() => {
    if (open && classData?.id && trainerId) {
      loadRoster()
    }
  }, [open, classData?.id, trainerId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Class Roster</h3>
            <p className="text-sm text-muted">{classData?.name || 'Class'}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {classData && (
          <div className="flex items-center gap-4 text-sm text-muted p-3 bg-surface rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>{classData.start_time ? new Date(classData.start_time).toLocaleDateString() : '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>
                {classData.start_time ? new Date(classData.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                {' - '}
                {classData.end_time ? new Date(classData.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>{roster.length} booked</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && roster.length === 0 && (
          <p className="text-sm text-muted text-center py-8">No members booked for this class yet.</p>
        )}

        {!loading && !error && roster.length > 0 && (
          <div className="space-y-3">
            {roster.map((member) => {
              const initials = getInitials(member.first_name, member.last_name, member.email)
              return (
                <div key={member.booking_id || member.member_profile_id} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Member'}
                    </p>
                    <p className="text-xs text-muted">{member.unique_member_id}</p>
                    <p className="text-xs text-muted">{member.email}</p>
                    {member.phone && <p className="text-xs text-muted">{member.phone}</p>}
                  </div>
                  <div className="text-right">
                    {member.booking_reference && (
                      <p className="text-xs text-muted">{member.booking_reference}</p>
                    )}
                    <p className="text-xs text-muted">Booked: {member.booked_at ? new Date(member.booked_at).toLocaleDateString() : '—'}</p>
                    <span className={`text-xs font-medium ${member.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {member.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Search, UserMinus, UserPlus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { AssignTrainerModal, UnassignTrainerModal } from '../../components/staff/TrainerAssignmentModals'
import { useMembersList } from '../../hooks/useMembersList'
import { assignedTrainerId, assignedTrainerName } from '../../utils/apiHelpers'

export function MembersDirectory() {
  const { items, loading, error, reload, pagination, setPage } = useMembersList({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [assignTarget, setAssignTarget] = useState(null)
  const [unassignTarget, setUnassignTarget] = useState(null)
  const [assignmentMessage, setAssignmentMessage] = useState('')

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((member) =>
      [member.name, member.email, member.phone, member.uniqueMemberId]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [items, search])

  const handleSearch = () => {
    reload({ page: 1, search: search.trim() || undefined, status: status || undefined })
  }

  const handleAssignmentComplete = (result) => {
    setAssignmentMessage(result?.message || 'Trainer assignment updated.')
    reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members Directory"
        subtitle="Live members from GET /members. Reception can assign or unassign a trainer without attaching plans."
      />

      <Card padding="md">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or gym ID..."
              className="pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </Card>

      {assignmentMessage && (
        <Alert variant="success" title="Success">
          {assignmentMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading members...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((member) => {
            const trainerLabel = assignedTrainerName(member) || member.trainer
            const hasTrainer = Boolean(assignedTrainerId(member) || (trainerLabel && trainerLabel !== '—'))
            return (
              <Card key={member.id} padding="md" className="hover:-translate-y-1 transition-transform">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted font-mono">{member.uniqueMemberId}</p>
                    <p className="text-sm text-muted mt-2">{member.email}</p>
                    <p className="text-sm text-muted">{member.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={member.status === 'active' ? 'success' : 'warning'} className="text-xs capitalize">
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      Trainer: {hasTrainer ? trainerLabel : 'None assigned'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setAssignTarget(member)}>
                      <UserPlus className="size-3.5" />
                      {hasTrainer ? 'Reassign' : 'Assign'}
                    </Button>
                    {hasTrainer && (
                      <Button size="sm" variant="ghost" className="gap-1.5 text-red-700" onClick={() => setUnassignTarget(member)}>
                        <UserMinus className="size-3.5" />
                        Unassign
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={pagination.page <= 1} onClick={() => setPage(pagination.page - 1)}>
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {assignTarget && (
        <AssignTrainerModal
          member={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={handleAssignmentComplete}
        />
      )}

      {unassignTarget && (
        <UnassignTrainerModal
          member={unassignTarget}
          onClose={() => setUnassignTarget(null)}
          onUnassigned={handleAssignmentComplete}
        />
      )}
    </div>
  )
}

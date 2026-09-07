import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, RotateCcw, ChevronLeft, ChevronRight, UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Table } from '../../components/ui/Table'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { AsyncState, EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { StaffRegistrationModal } from '../../components/admin/StaffRegistrationModal'
import { useAdminMembersList } from '../../hooks/useAdminMembersList'
import { adminService } from '../../services/adminService'
import { AssignTrainerModal, UnassignTrainerModal } from '../../components/staff/TrainerAssignmentModals'
import { assignedTrainerId, assignedTrainerName } from '../../utils/apiHelpers'

function getAdminListError(error) {
  if (!error) return error
  if (
    error.includes('Required roles: admin') ||
    error.includes('Access denied') ||
    error.includes('Sign in with an admin account')
  ) {
    return error
  }
  return error
}

// Robust helper to determine active status across varying API responses
const isMemberActive = (member) => {
  if (!member) return false

  // 1. Check direct booleans / numbers
  if (typeof member.is_active === 'boolean') return member.is_active
  if (typeof member.isActive === 'boolean') return member.isActive
  if (typeof member.is_active === 'number') return member.is_active === 1
  if (typeof member.isActive === 'number') return member.isActive === 1

  // 2. Check string values
  if (String(member.is_active).toLowerCase() === 'false') return false
  if (String(member.is_active).toLowerCase() === 'true') return true

  // 3. Fallback to status strings
  const statusStr = String(
    member.status || member.subscription_status || member.account_status || ''
  ).toLowerCase()

  if (['inactive', 'deactivated', 'disabled', 'suspended'].includes(statusStr)) {
    return false
  }

  return true
}

export function MembersManagement() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [actionTarget, setActionTarget] = useState(null)
  const [actionType, setActionType] = useState(null) // 'deactivate' | 'reactivate'
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [assignTrainerTarget, setAssignTrainerTarget] = useState(null)
  const [unassignTrainerTarget, setUnassignTrainerTarget] = useState(null)
  const [assignmentMessage, setAssignmentMessage] = useState('')

  const {
    items = [],
    loading,
    error,
    source,
    reload,
    addLocalMember,
    pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  } = useAdminMembersList() || {}

  const safePagination = {
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? 10,
    total: pagination?.total ?? items.length,
    totalPages: pagination?.totalPages ?? 1,
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    reload({ page: newPage, limit: safePagination.limit, status: statusFilter || undefined })
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setCurrentPage(1)
    reload({ page: 1, limit: safePagination.limit, status: status || undefined })
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items

    return items.filter((member) =>
      [member.id, member.user_id, member.name, member.email, member.phone, member.uniqueMemberId, member.unique_member_id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [items, search])

  const displayError = getAdminListError(error)

  const handleSuccess = (response) => {
    if (response?.user) {
      addLocalMember(response.user)
    } else {
      reload()
    }
  }

  const handleDeactivate = (member) => {
    setActionTarget(member)
    setActionType('deactivate')
    setActionError(null)
  }

  const handleReactivate = (member) => {
    setActionTarget(member)
    setActionType('reactivate')
    setActionError(null)
  }

  const confirmAction = async () => {
    if (!actionTarget || !actionType) return

    // Ensure target ID resolution (support member ID or user account ID)
    const targetId =
      actionTarget.memberProfileId || actionTarget.id || actionTarget.user_id || actionTarget._id

    if (!targetId) {
      setActionError('Invalid member identifier. Cannot update account status.')
      return
    }

    setActionLoading(true)
    setActionError(null)

    try {
      if (actionType === 'deactivate') {
        await adminService.deactivateMember(targetId)
      } else if (actionType === 'reactivate') {
        await adminService.reactivateMember(targetId)
      }
      setActionTarget(null)
      setActionType(null)
      reload()
    } catch (err) {
      // Guard against automatic redirect on error response
      setActionError(err?.response?.data?.message || err?.message || `Failed to ${actionType} member.`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAssignmentComplete = (result) => {
    setAssignmentMessage(result?.message || 'Trainer assignment updated.')
    reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        subtitle={`${filteredItems.length} member${filteredItems.length === 1 ? '' : 's'} found. Assign or unassign trainers without attaching workout or meal plans.`}
        actions={
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Add Member
          </Button>
        }
      />

      {/* Source Badge */}
      <div className="flex flex-wrap items-center gap-2">
        {source === 'api' && (
          <Badge variant="success">Live from admin API</Badge>
        )}
        {source === 'local' && (
          <Badge variant="warning">Saved locally — API list unavailable</Badge>
        )}
      </div>

      {/* Search Toolbar */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="search"
              placeholder="Search by ID, name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusFilterChange('')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === ''
                  ? 'bg-primary text-foreground'
                  : 'bg-surface text-muted hover:bg-hover'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilterChange('active')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-primary text-foreground'
                  : 'bg-surface text-muted hover:bg-hover'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilterChange('inactive')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-primary text-foreground'
                  : 'bg-surface text-muted hover:bg-hover'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </Card>

      {assignmentMessage && (
        <Alert variant="success" title="Success">
          {assignmentMessage}
        </Alert>
      )}

      {displayError && source === 'local' && filteredItems.length > 0 && (
        <Alert variant="warning" title="API Unavailable">
          {displayError}
        </Alert>
      )}

      <Card padding="sm">
        <AsyncState
          loading={loading}
          error={source === 'local' && filteredItems.length > 0 ? null : displayError}
          empty={!loading && !displayError && filteredItems.length === 0}
          onRetry={reload}
          loadingComponent={<LoadingState label="Loading registered members..." />}
          errorComponent={<ErrorState message={displayError} onRetry={reload} />}
          emptyComponent={
            <EmptyState
              title="No registered members"
              description="Members registered publicly or via admin will appear here."
            />
          }
        >
          <Table
            data={filteredItems}
            columns={[
              {
                key: 'uniqueMemberId',
                header: 'Member ID',
                className: 'font-mono text-primary font-medium',
                render: (row) => row.uniqueMemberId || row.unique_member_id || 'N/A',
              },
              {
                key: 'name',
                header: 'Name',
                render: (row) => row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A',
              },
              { key: 'email', header: 'Email' },
              { key: 'phone', header: 'Phone' },
              {
                key: 'status',
                header: 'Status',
                render: (row) => {
                  const active = isMemberActive(row)
                  const displayStatus = active ? 'active' : 'inactive'
                  return <Badge variant={statusBadge(displayStatus)}>{displayStatus}</Badge>
                },
              },
              { key: 'joinDate', header: 'Joined' },
              {
                key: 'trainer',
                header: 'Trainer',
                render: (row) => {
                  const trainerLabel = assignedTrainerName(row) || row.trainer
                  return (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-foreground">{trainerLabel && trainerLabel !== '—' ? trainerLabel : '—'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setAssignTrainerTarget(row)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors"
                          title="Assign trainer to member"
                        >
                          <UserPlus className="size-3.5" />
                          Assign
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnassignTrainerTarget(row)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                          title="Unassign trainer from member"
                        >
                          <UserMinus className="size-3.5" />
                          Unassign
                        </button>
                      </div>
                    </div>
                  )
                },
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => {
                  const active = isMemberActive(row)
                  return (
                    <button
                      type="button"
                      onClick={() => (active ? handleDeactivate(row) : handleReactivate(row))}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                        active
                          ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10'
                          : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-500/30 dark:text-green-400 dark:hover:bg-green-500/10'
                      }`}
                      title={active ? 'Deactivate member account' : 'Reactivate member account'}
                    >
                      {active ? <Trash2 className="size-3.5" /> : <RotateCcw className="size-3.5" />}
                      {active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )
                },
              },
            ]}
          />
        </AsyncState>
      </Card>

      {/* Pagination Controls */}
      {safePagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing {(safePagination.page - 1) * safePagination.limit + 1} to{' '}
            {Math.min(safePagination.page * safePagination.limit, safePagination.total)} of {safePagination.total}{' '}
            members
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(safePagination.page - 1)}
              disabled={safePagination.page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>
            <span className="text-sm text-muted">
              Page {safePagination.page} of {safePagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(safePagination.page + 1)}
              disabled={safePagination.page === safePagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card padding="lg" className="max-w-md w-full">
            <CardHeader>
              <CardTitle>{actionType === 'deactivate' ? 'Deactivate' : 'Reactivate'} Member</CardTitle>
              <CardDescription>
                Are you sure you want to {actionType === 'deactivate' ? 'deactivate' : 'reactivate'}{' '}
                <strong>
                  {actionTarget.name || `${actionTarget.first_name || ''} ${actionTarget.last_name || ''}`}
                </strong>
                ?
              </CardDescription>
            </CardHeader>
            <p className="text-xs text-muted">
              {actionType === 'deactivate'
                ? 'This will soft-delete their user account. They will not be able to log in.'
                : 'They will be able to log in and access their account again.'}
            </p>

            {actionError && (
              <Alert variant="error" title="Error">
                {actionError}
              </Alert>
            )}

            <div className="flex gap-3 justify-end mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setActionTarget(null)
                  setActionType(null)
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'deactivate' ? 'danger' : 'success'}
                onClick={confirmAction}
                disabled={actionLoading}
                className="gap-2"
              >
                {actionLoading && <Loader2 className="size-4 animate-spin" />}
                {actionType === 'deactivate' ? 'Deactivate' : 'Reactivate'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {assignTrainerTarget && (
        <AssignTrainerModal
          member={assignTrainerTarget}
          onClose={() => setAssignTrainerTarget(null)}
          onAssigned={handleAssignmentComplete}
        />
      )}

      {unassignTrainerTarget && (
        <UnassignTrainerModal
          member={unassignTrainerTarget}
          onClose={() => setUnassignTrainerTarget(null)}
          onUnassigned={handleAssignmentComplete}
        />
      )}

      <StaffRegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fixedRole="member"
        title="Register Member"
        description="Creates a member account via POST /admin/register. Admin login required."
        onSuccess={handleSuccess}
      />
    </div>
  )
}
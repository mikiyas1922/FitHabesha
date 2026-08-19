import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { AsyncState, EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { StaffRegistrationModal } from '../../components/admin/StaffRegistrationModal'
import { useAdminMembersList } from '../../hooks/useAdminMembersList'
import { adminService } from '../../services/adminService'

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Members</h2>
          <p className="text-sm text-muted">
            {filteredItems.length} member{filteredItems.length === 1 ? '' : 's'} found.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {source === 'api' && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                Live from admin API
              </span>
            )}
            {source === 'local' && (
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-500/20">
                Saved locally — API list unavailable
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="search"
              placeholder="Search by ID, name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="rounded-lg border border-border bg-surface py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button className="gap-2 shrink-0" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Add Member
          </Button>
        </div>
      </div>

      {displayError && source === 'local' && filteredItems.length > 0 && (
        <Card className="p-4 border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
          <p className="text-sm text-muted">{displayError}</p>
        </Card>
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
              description="Members registered publicly or via admin will appear here from GET /members."
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
          <Card className="w-full max-w-md space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {actionType === 'deactivate' ? 'Deactivate' : 'Reactivate'} Member
              </h3>
              <p className="text-sm text-muted mt-1">
                Are you sure you want to {actionType === 'deactivate' ? 'deactivate' : 'reactivate'}{' '}
                <strong>
                  {actionTarget.name || `${actionTarget.first_name || ''} ${actionTarget.last_name || ''}`}
                </strong>
                ?
              </p>
              <p className="text-xs text-muted mt-2">
                {actionType === 'deactivate'
                  ? 'This will soft-delete their user account. They will not be able to log in.'
                  : 'They will be able to log in and access their account again.'}
              </p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded text-sm text-red-700 dark:text-red-400">
                {actionError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setActionTarget(null)
                  setActionType(null)
                }}
                disabled={actionLoading}
                className="px-4 py-2 rounded border border-border text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                disabled={actionLoading}
                className={`px-4 py-2 rounded text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2 ${
                  actionType === 'deactivate' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {actionType === 'deactivate' ? 'Deactivating...' : 'Reactivating...'}
                  </>
                ) : actionType === 'deactivate' ? (
                  'Deactivate'
                ) : (
                  'Reactivate'
                )}
              </button>
            </div>
          </Card>
        </div>
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
import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import { Badge, statusBadge } from '../../components/ui/Badge'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { AsyncState, EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { StaffRegistrationModal } from '../../components/admin/StaffRegistrationModal'
import { useAdminTrainersList } from '../../hooks/useAdminTrainersList'
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

export function TrainersManagement() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [actionTarget, setActionTarget] = useState(null)
  const [actionType, setActionType] = useState(null) // 'deactivate' or 'reactivate'
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)
  const { items, loading, error, source, reload, addLocalTrainer, pagination } = useAdminTrainersList()

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    const booleanValue = availabilityFilter === '' ? undefined : availabilityFilter === 'available'
    reload({ page: newPage, limit: pagination.limit, is_available: booleanValue })
  }

  const handleAvailabilityFilterChange = (availability) => {
    setAvailabilityFilter(availability)
    setCurrentPage(1)
    const booleanValue = availability === '' ? undefined : availability === 'available'
    reload({ page: 1, limit: pagination.limit, is_available: booleanValue })
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items

    return items.filter((trainer) =>
      [trainer.id, trainer.name, trainer.email, trainer.phone, trainer.specialty]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [items, search])

  const displayError = getAdminListError(error)

  const handleSuccess = (response) => {
    if (response?.user) {
      addLocalTrainer(response.user)
    } else {
      reload()
    }
  }

  const handleDeactivate = async (trainer) => {
    setActionTarget(trainer)
    setActionType('deactivate')
    setActionError(null)
  }

  const handleReactivate = async (trainer) => {
    setActionTarget(trainer)
    setActionType('reactivate')
    setActionError(null)
  }

  const confirmAction = async () => {
    if (!actionTarget || !actionType) return

    setActionLoading(true)
    setActionError(null)

    try {
      if (actionType === 'deactivate') {
        await adminService.deactivateTrainer(actionTarget.id)
      } else if (actionType === 'reactivate') {
        await adminService.reactivateTrainer(actionTarget.id)
      }
      setActionTarget(null)
      setActionType(null)
      reload()
    } catch (err) {
      setActionError(err?.message || `Failed to ${actionType} trainer`)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trainers" 
        subtitle={`${filteredItems.length} trainer${filteredItems.length === 1 ? '' : 's'} found.`}
        action={
          <Button className="gap-2 shrink-0" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Add Trainer
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {source === 'api' && (
            <span className="inline-flex items-center rounded-full bg-[#00DF82]/10 px-2.5 py-0.5 text-xs font-medium text-[#00DF82] border border-[#00DF82]/30">
              Live from admin API
            </span>
          )}
          {source === 'local' && (
            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-500/30">
              Saved locally — API list unavailable
            </span>
          )}
        </div>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--app-muted)]" />
          <input
            type="search"
            placeholder="Search by name, email, or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[12px] border border-[var(--app-border)] bg-[var(--app-input)] py-2 pl-9 pr-3 text-sm text-[var(--app-foreground)] placeholder:text-[var(--app-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200"
          />
        </div>
        <select
          value={availabilityFilter}
          onChange={(e) => handleAvailabilityFilterChange(e.target.value)}
          className="rounded-[12px] border border-[var(--app-border)] bg-[var(--app-input)] py-2 px-3 text-sm text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] focus:border-[var(--app-primary)]/40 transition-all duration-200"
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {displayError && source === 'local' && filteredItems.length > 0 && (
        <Alert variant="warning" message={displayError} />
      )}

      <Card padding="lg">
        <AsyncState
          loading={loading}
          error={source === 'local' && filteredItems.length > 0 ? null : displayError}
          empty={!loading && !displayError && filteredItems.length === 0}
          onRetry={reload}
          loadingComponent={<LoadingState label="Loading registered trainers..." />}
          errorComponent={<ErrorState message={displayError} onRetry={reload} />}
          emptyComponent={
            <EmptyState
              title="No registered trainers"
              description="Trainers registered publicly or via admin will appear here."
            />
          }
        >
          <Table
            data={filteredItems}
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'phone', header: 'Phone' },
              { key: 'specialty', header: 'Specialty' },
              { key: 'certification', header: 'Certification' },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <Badge variant={statusBadge(row.status)}>{row.status}</Badge>,
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => {
                  const isActive = row.status === 'active'
                  return (
                    <button
                      onClick={() => isActive ? handleDeactivate(row) : handleReactivate(row)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded border transition-all duration-200 ${
                        isActive
                          ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
                          : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                      }`}
                      title={isActive ? 'Deactivate trainer account' : 'Reactivate trainer account'}
                    >
                      {isActive ? <Trash2 className="size-3" /> : <RotateCcw className="size-3" />}
                      {isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  )
                },
              },
            ]}
          />
        </AsyncState>
      </Card>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--app-muted)]">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} trainers
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-[var(--app-border)] text-[var(--app-foreground)] hover:bg-[var(--app-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>
            <span className="text-sm text-[var(--app-muted)]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-[var(--app-border)] text-[var(--app-foreground)] hover:bg-[var(--app-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card padding="lg" className="w-full max-w-md space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--app-foreground)]">
                {actionType === 'deactivate' ? 'Deactivate' : 'Reactivate'} Trainer
              </h3>
              <p className="text-sm text-[var(--app-muted)] mt-1">
                Are you sure you want to {actionType === 'deactivate' ? 'deactivate' : 'reactivate'}{' '}
                <strong className="text-[var(--app-foreground)]">{actionTarget.name}</strong>?
              </p>
              <p className="text-xs text-[var(--app-muted)] mt-2">
                {actionType === 'deactivate'
                  ? 'This will soft-delete their user account. They will not be able to log in.'
                  : 'They will be able to log in and access their account again.'}
              </p>
            </div>

            {actionError && (
              <Alert variant="danger" message={actionError} />
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setActionTarget(null)
                  setActionType(null)
                }}
                disabled={actionLoading}
                className="px-4 py-2 rounded border border-[var(--app-border)] text-sm font-medium text-[var(--app-foreground)] hover:bg-[var(--app-hover)] disabled:opacity-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`px-4 py-2 rounded text-[var(--app-foreground)] text-sm font-medium disabled:opacity-50 transition-all duration-200 flex items-center gap-2 ${
                  actionType === 'deactivate'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading ? (
                  <>
                    <div className="size-4 border-2 border-[var(--app-foreground)]/30 border-t-[var(--app-foreground)] rounded-full animate-spin" />
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
        fixedRole="trainer"
        title="Register Trainer"
        description="Creates a trainer account via POST /admin/register. Admin login required."
        onSuccess={handleSuccess}
      />
    </div>
  )
}

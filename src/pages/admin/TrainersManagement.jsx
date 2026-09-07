import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, RotateCcw, ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { Alert } from '../../components/ui/Alert'
import { Table } from '../../components/ui/Table'
import { Badge, statusBadge } from '../../components/ui/Badge'
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
        actions={
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" />
            Add Trainer
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
              placeholder="Search by name, email, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAvailabilityFilterChange('')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                availabilityFilter === ''
                  ? 'bg-primary text-foreground'
                  : 'bg-surface text-muted hover:bg-hover'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleAvailabilityFilterChange('available')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                availabilityFilter === 'available'
                  ? 'bg-primary text-foreground'
                  : 'bg-surface text-muted hover:bg-hover'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => handleAvailabilityFilterChange('unavailable')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                availabilityFilter === 'unavailable'
                  ? 'bg-primary text-foreground'
                  : 'bg-surface text-muted hover:bg-hover'
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>
      </Card>

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
              {
                key: 'specialty',
                header: 'Specialty',
                render: (row) => (
                  <Badge variant="info">{row.specialty || 'General'}</Badge>
                ),
              },
              {
                key: 'rating',
                header: 'Rating',
                render: (row) => {
                  const rating = row.rating || 0
                  return (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-3 ${
                            star <= Math.round(rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted ml-1">{rating > 0 ? rating.toFixed(1) : '—'}</span>
                    </div>
                  )
                },
              },
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
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors ${
                        isActive
                          ? 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10'
                          : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-500/30 dark:text-green-400 dark:hover:bg-green-500/10'
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
          <p className="text-sm text-muted">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} trainers
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>
            <span className="text-sm text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {actionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card padding="lg" className="max-w-md w-full">
            <CardHeader>
              <CardTitle>{actionType === 'deactivate' ? 'Deactivate' : 'Reactivate'} Trainer</CardTitle>
              <CardDescription>
                Are you sure you want to {actionType === 'deactivate' ? 'deactivate' : 'reactivate'}{' '}
                <strong>{actionTarget.name}</strong>?
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

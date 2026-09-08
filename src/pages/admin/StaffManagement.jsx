import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, UserPlus, Dumbbell, Headphones, Search } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Table } from '../../components/ui/Table'
import {
  AsyncState,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../components/ui/AsyncState'
import { StaffRegistrationModal } from '../../components/admin/StaffRegistrationModal'
import { ADMIN_STAFF_ROLES } from '../../config/adminStaffRoles'
import { useAdminStaffList } from '../../hooks/useAdminStaffList'
import { mapBackendRole } from '../../utils/auth'
import { roleLabels } from '../../config/navigation'

const roleIcons = {
  trainer: Dumbbell,
  reception: Headphones,
}

const ROLE_FILTERS = [
  { value: 'all', label: 'All Staff' },
  ...ADMIN_STAFF_ROLES.map(({ value, label }) => ({ value, label: `${label}s` })),
]

function isStaffRole(role) {
  const mapped = mapBackendRole(role)
  return mapped === 'trainer' || mapped === 'reception' || role === 'reception'
}

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

export function StaffManagement() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultRole, setDefaultRole] = useState('trainer')
  const [search, setSearch] = useState('')

  const roleFilter = searchParams.get('role') || 'all'
  const { items, loading, error, source, reload, addLocalStaff } = useAdminStaffList()

  const staffItems = useMemo(() => items.filter((item) => isStaffRole(item.role)), [items])

  const openModal = (role = 'trainer') => {
    setDefaultRole(role)
    setModalOpen(true)
  }

  const handleSuccess = (response) => {
    if (response?.user) {
      addLocalStaff(response.user)
    } else {
      reload()
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return staffItems.filter((staff) => {
      const backendRole = mapBackendRole(staff.role)
      const matchesRole =
        roleFilter === 'all' ||
        staff.role === roleFilter ||
        backendRole === roleFilter ||
        (roleFilter === 'reception' && staff.role === 'reception')

      if (!matchesRole) return false
      if (!query) return true

      return [staff.name, staff.email, staff.phone, staff.id, staff.specialty]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [staffItems, roleFilter, search])

  const displayError = getAdminListError(error)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Staff Management</h2>
          <p className="text-sm text-muted">
            Register and manage trainers and receptionists via POST /admin/register.
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
        <Button className="gap-2" onClick={() => openModal('trainer')}>
          <Plus className="size-4" />
          Register Staff
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {ADMIN_STAFF_ROLES.map((role) => {
          const Icon = roleIcons[role.value] || UserPlus
          return (
            <Card key={role.value} className="flex flex-col">
              <div className="flex items-start gap-3">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{role.label}</h3>
                  <p className="text-sm text-muted mt-1">{role.description}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => openModal(role.value)}
              >
                Add {role.label}
              </Button>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                if (filter.value === 'all') {
                  setSearchParams({})
                } else {
                  setSearchParams({ role: filter.value })
                }
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                roleFilter === filter.value
                  ? 'bg-primary text-dark'
                  : 'bg-subtle text-muted hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="search"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
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
          loadingComponent={<LoadingState label="Loading registered staff..." />}
          errorComponent={<ErrorState message={displayError} onRetry={reload} />}
          emptyComponent={
            <EmptyState
              title="No registered staff yet"
              description="Trainers and receptionists appear here when the admin list API is available, or after you register staff below."
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
                key: 'role',
                header: 'Role',
                render: (row) => (
                  <Badge variant="info" className="capitalize">
                    {roleLabels[mapBackendRole(row.role)] || row.role}
                  </Badge>
                ),
              },
              {
                key: 'specialty',
                header: 'Specialty',
                render: (row) => (row.role === 'trainer' ? row.specialty : '—'),
              },
              { key: 'joinDate', header: 'Joined' },
            ]}
          />
        </AsyncState>
      </Card>

      {displayError && source !== 'local' && (
        <Card className="p-4 border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5">
          <p className="text-sm text-muted">
            Staff you register is saved locally until the admin list API responds.
          </p>
        </Card>
      )}

      <StaffRegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultRole={defaultRole}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

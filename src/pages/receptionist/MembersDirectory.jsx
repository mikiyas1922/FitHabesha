import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useMembersList } from '../../hooks/useMembersList'

export function MembersDirectory() {
  const { items, loading, error, reload, pagination, setPage } = useMembersList({ page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Members Directory</h1>
        <p className="text-sm text-muted">Live members from GET /members</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or gym ID..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
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
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading members...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((member) => (
            <div key={member.id} className="rounded-xl border border-border bg-card p-4">
              <p className="font-medium text-foreground">{member.name}</p>
              <p className="text-xs text-muted font-mono">{member.uniqueMemberId}</p>
              <p className="text-sm text-muted mt-2">{member.email}</p>
              <p className="text-sm text-muted">{member.phone}</p>
              <p className="text-xs mt-2 capitalize">{member.status}</p>
            </div>
          ))}
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
    </div>
  )
}

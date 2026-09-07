import { useState, useEffect } from 'react'
import { Search, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { adminService } from '../../services/adminService'
import { progressService } from '../../services/progressService'
import { unwrapResource, normalizeListResponse } from '../../utils/apiHelpers'

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtNum(v, unit = '') {
  if (v == null) return '—'
  const n = Number(v)
  if (Number.isNaN(n)) return '—'
  return `${n % 1 === 0 ? n : n.toFixed(1)}${unit}`
}

export function AdminProgress() {
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [progressLogs, setProgressLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    setLoadingMembers(true)
    setError(null)
    try {
      const response = await adminService.getMembers()
      const memberData = normalizeListResponse(response)
      setMembers(memberData)
    } catch (err) {
      setError(err?.message || 'Failed to load members')
    } finally {
      setLoadingMembers(false)
    }
  }

  const loadProgressLogs = async (memberId, page = 1) => {
    if (!memberId) return
    setLoading(true)
    setError(null)
    try {
      const response = await progressService.getProgressHistory(memberId, { page, limit: 20 })
      setProgressLogs(response.items || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (err) {
      setError(err?.message || 'Failed to load progress logs')
      setProgressLogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleMemberSelect = (memberId) => {
    const member = members.find(m => m.id === memberId)
    setSelectedMember(member)
    if (member) {
      loadProgressLogs(member.id)
    } else {
      setProgressLogs([])
      setSelectedMember(null)
    }
  }

  const handleDelete = async (logId) => {
    setDeleteTarget(logId)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await adminService.deleteProgressLog(deleteTarget)
      setDeleteTarget(null)
      // Reload progress logs
      if (selectedMember) {
        loadProgressLogs(selectedMember.id, pagination.page)
      }
    } catch (err) {
      setDeleteError(err?.message || 'Failed to delete progress log')
    } finally {
      setDeleteLoading(false)
    }
  }

  const filteredMembers = members.filter(member =>
    [member.name, member.email, member.unique_member_id]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress Logs</h1>
        <p className="text-sm text-muted mt-1">
          View and manage member progress logs. Admin can delete any progress entry.
        </p>
      </div>

      {error && (
        <Card className="p-4 border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Member Selection */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Select Member</h3>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              placeholder="Search members by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <select
              value={selectedMember?.id || ''}
              onChange={(e) => handleMemberSelect(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select a member to view progress logs</option>
              {filteredMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email}
                  {member.unique_member_id ? ` (${member.unique_member_id})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </Card>

      {/* Progress Logs Table */}
      {selectedMember && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">
                {selectedMember.name || `${selectedMember.first_name || ''} ${selectedMember.last_name || ''}`.trim()}'s Progress Logs
              </h3>
              <p className="text-sm text-muted">{selectedMember.email}</p>
            </div>
            <span className="text-xs text-muted">{pagination.total} total entries</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : progressLogs.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted">
              No progress logs found for this member.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Weight (kg)</th>
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Body Fat (%)</th>
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Muscle Mass (kg)</th>
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Logged By</th>
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Notes</th>
                      <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {progressLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {fmtDate(log.logged_at || log.created_at)}
                        </td>
                        <td className="px-4 py-3">{fmtNum(log.weight_kg, ' kg')}</td>
                        <td className="px-4 py-3">{fmtNum(log.body_fat_percentage, '%')}</td>
                        <td className="px-4 py-3">{fmtNum(log.muscle_mass_kg, ' kg')}</td>
                        <td className="px-4 py-3 text-muted">{log.trainer_name || '—'}</td>
                        <td className="px-4 py-3 text-muted text-xs max-w-xs truncate">
                          {log.notes || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
                            className="gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pagination.page <= 1 || loading}
                      onClick={() => loadProgressLogs(selectedMember.id, pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages || loading}
                      onClick={() => loadProgressLogs(selectedMember.id, pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Delete Progress Log</h3>
              <p className="text-sm text-muted mt-1">
                Are you sure you want to delete this progress log? This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded text-sm text-red-700 dark:text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteTarget(null)
                  setDeleteError(null)
                }}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

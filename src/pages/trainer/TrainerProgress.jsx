import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { progressService } from '../../services/progressService'
import { unwrapResource } from '../../utils/apiHelpers'

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

export function TrainerProgress({ memberProfileId, memberName, memberEmail, onBack }) {
  const [progressLogs, setProgressLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => {
    if (memberProfileId) {
      loadProgressLogs(memberProfileId, 1)
    }
  }, [memberProfileId])

  const loadProgressLogs = async (profileId, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await progressService.getProgressHistory(profileId, { page, limit: 20 })
      setProgressLogs(response.items || [])
      setPagination(response.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (err) {
      setError(err?.message || 'Failed to load progress logs')
      setProgressLogs([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (memberProfileId) {
      loadProgressLogs(memberProfileId, newPage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ChevronLeft className="size-4 mr-2" />
            Back to Clients
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{memberName}'s Progress</h1>
          <p className="text-sm text-muted">{memberEmail}</p>
        </div>
        <span className="text-xs text-muted">{pagination.total} total entries</span>
      </div>

      {error && (
        <Card className="p-4 border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </Card>
      )}

      <Card className="p-6">
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
                      <td className="px-4 py-3 text-muted">{log.trainer_name || 'Self'}</td>
                      <td className="px-4 py-3 text-muted text-xs max-w-xs truncate">
                        {log.notes || '—'}
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
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages || loading}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

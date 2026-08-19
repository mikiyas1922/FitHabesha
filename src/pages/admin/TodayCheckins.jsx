import { useState, useEffect } from 'react'
import { RefreshCw, Clock, User, Calendar } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { AsyncState, EmptyState, ErrorState, LoadingState } from '../../components/ui/AsyncState'
import { checkinService } from '../../services/checkinService'
import { getApiErrorMessage } from '../../utils/apiHelpers'

function formatTime(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function getCheckinError(error) {
  if (!error) return error
  if (
    error.includes('Access denied') ||
    error.includes('Only admin and reception')
  ) {
    return error
  }
  return error
}

export function TodayCheckins() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [count, setCount] = useState(0)

  const loadCheckins = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await checkinService.getTodayCheckins()
      setCheckins(response.data || [])
      setCount(response.count || 0)
    } catch (err) {
      const message = getApiErrorMessage(err)
      setError(getCheckinError(message))
      setCheckins([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCheckins()
  }, [])

  const displayError = getCheckinError(error)

  // Transform check-in data for table display
  const tableData = checkins.map(checkin => ({
    id: checkin.id,
    uniqueMemberId: checkin.unique_member_id || checkin.uniqueMemberId || '—',
    name: `${checkin.first_name || ''} ${checkin.last_name || ''}`.trim() || '—',
    email: checkin.email || '—',
    phone: checkin.phone || '—',
    checkInTime: formatTime(checkin.checked_in_at),
    checkOutTime: formatTime(checkin.checked_out_at),
    notes: checkin.notes || '—',
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Today's Check-ins</h2>
          <p className="text-sm text-muted">
            View all member check-ins recorded today from GET /checkin/today. {count} check-in
            {count === 1 ? '' : 's'} recorded.
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={loadCheckins}
          disabled={loading}
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Check-ins</p>
              <p className="text-2xl font-bold text-foreground">{count}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted">Currently Active</p>
              <p className="text-2xl font-bold text-foreground">
                {checkins.filter(c => !c.checked_out_at).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted">Date</p>
              <p className="text-lg font-bold text-foreground">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="sm">
        <AsyncState
          loading={loading}
          error={displayError}
          empty={!loading && !displayError && tableData.length === 0}
          onRetry={loadCheckins}
          loadingComponent={<LoadingState label="Loading today's check-ins..." />}
          errorComponent={<ErrorState message={displayError} onRetry={loadCheckins} />}
          emptyComponent={
            <EmptyState
              title="No check-ins today"
              description="Member check-ins will appear here as they are recorded."
            />
          }
        >
          <Table
            data={tableData}
            columns={[
              {
                key: 'uniqueMemberId',
                header: 'Member ID',
                className: 'font-mono text-primary font-medium',
              },
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'phone', header: 'Phone' },
              { key: 'checkInTime', header: 'Check-in Time' },
              { 
                key: 'checkOutTime', 
                header: 'Check-out Time',
                render: (row) => (
                  <span className={row.checkOutTime === '—' ? 'text-muted' : ''}>
                    {row.checkOutTime}
                  </span>
                )
              },
              { key: 'notes', header: 'Notes' },
            ]}
          />
        </AsyncState>
      </Card>
    </div>
  )
}

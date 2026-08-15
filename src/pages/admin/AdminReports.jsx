import { Download, Calendar, TrendingUp, Users, DollarSign, FileText, BarChart3 } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const reportCards = [
  { title: 'Revenue Report', description: 'Consolidated membership dues, personal training packages', value: '$54,250', icon: DollarSign, color: 'bg-green-500' },
  { title: 'Attendance Report', description: 'Daily check-in distribution and member density', value: '342', icon: Users, color: 'bg-blue-500' },
  { title: 'Trainer Performance', description: 'Coach ratings based on member feedback', value: '4.8 / 5.0', icon: TrendingUp, color: 'bg-purple-500' },
  { title: 'Member Retention', description: 'Proportion of membership signups vs cancellations', value: '86%', icon: BarChart3, color: 'bg-orange-500' },
]

const auditLogs = [
  { action: 'Updated system settings', user: 'Admin Sarah', time: '2m ago', type: 'System' },
  { action: 'Exported member report (PDF)', user: 'Marcus Vance', time: '1h ago', type: 'System' },
  { action: 'Sent 12 welcome emails', user: 'Email service', time: '3h ago', type: 'Email' },
]

const emailMetrics = {
  deliveryRate: '98.2%',
  openRate: '24.1%',
  bounces: '0.4%',
  totalSent: '3,420',
}

const retentionData = {
  newMembers: '55%',
  returningMembers: '31%',
  churnedAccounts: '14%',
}

export function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Export Center</h1>
          <p className="text-sm text-muted">Generate real-time exports, review system metrics, and monitor fitness operations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Download className="size-4" />
            Export PDF
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download className="size-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((report) => {
          const Icon = report.icon
          return (
            <div key={report.title} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
              <p className="text-2xl font-bold text-foreground mb-2">{report.value}</p>
              <p className="text-xs text-muted">{report.description}</p>
            </div>
          )
        })}
      </div>

      {/* Date Range Filter */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">This Month</Button>
            <Button variant="ghost" size="sm">Last 30 Days</Button>
            <Button variant="primary" size="sm">Custom</Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Calendar className="size-4" />
            <span>Range: Jan 1 - Jan 31, 2025</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Revenue Report</h3>
          <p className="text-sm text-muted mb-6">Total Revenue</p>
          <div className="h-48 flex items-end gap-3">
            {['Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                  style={{ height: `${30 + (i * 12)}%` }}
                />
                <span className="text-xs text-muted">{month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">$60k</p>
              <p className="text-xs text-muted">Mornings</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">$40k</p>
              <p className="text-xs text-muted">Midday</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">$20k</p>
              <p className="text-xs text-muted">Evenings</p>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Attendance Report</h3>
          <p className="text-sm text-muted mb-6">Check-ins today</p>
          <div className="h-48 flex items-end gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
                  style={{ height: `${40 + (i * 10)}%` }}
                />
                <span className="text-xs text-muted">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">6am-11am</p>
              <p className="text-xs text-muted">Mornings</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">12pm-4pm</p>
              <p className="text-xs text-muted">Midday</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">5pm-9pm</p>
              <p className="text-xs text-muted">Evenings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Audit Logs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Audit Logs</h3>
          <div className="space-y-3">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{log.action}</p>
                  <p className="text-xs text-muted">by {log.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{log.time}</p>
                  <span className="text-xs text-muted">{log.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Metrics */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Email & Notifications</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-surface">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted">Delivery rate</span>
                <span className="font-semibold text-foreground">{emailMetrics.deliveryRate}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '98.2%' }} />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted">Open rate</span>
                <span className="font-semibold text-foreground">{emailMetrics.openRate}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '24.1%' }} />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted">Bounces</span>
                <span className="font-semibold text-foreground">{emailMetrics.bounces}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '0.4%' }} />
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted">Total emails sent</p>
              <p className="text-xl font-bold text-foreground">{emailMetrics.totalSent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Member Retention */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Member Retention</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-surface">
            <p className="text-3xl font-bold text-green-600">{retentionData.newMembers}</p>
            <p className="text-sm text-muted mt-1">New Members</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-surface">
            <p className="text-3xl font-bold text-blue-600">{retentionData.returningMembers}</p>
            <p className="text-sm text-muted mt-1">Returning Members</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-surface">
            <p className="text-3xl font-bold text-red-600">{retentionData.churnedAccounts}</p>
            <p className="text-sm text-muted mt-1">Churned Accounts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

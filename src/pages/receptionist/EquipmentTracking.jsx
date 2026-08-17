import { Search, Filter, Plus, AlertTriangle, Wrench, CheckCircle, XCircle, Clock, MoreVertical } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const equipmentStats = [
  { label: 'Total Equipment', value: '156', icon: Wrench },
  { label: 'In Use', value: '89', icon: CheckCircle },
  { label: 'Maintenance', value: '12', icon: AlertTriangle },
  { label: 'Out of Service', value: '3', icon: XCircle },
]

const equipmentItems = [
  { id: 'EQ-001', name: 'Treadmill #1', category: 'Cardio', location: 'Cardio Zone', status: 'In Use', lastMaintenance: 'Oct 1, 2026' },
  { id: 'EQ-002', name: 'Treadmill #2', category: 'Cardio', location: 'Cardio Zone', status: 'Available', lastMaintenance: 'Oct 5, 2026' },
  { id: 'EQ-003', name: 'Treadmill #3', category: 'Cardio', location: 'Cardio Zone', status: 'Available', lastMaintenance: 'Oct 8, 2026' },
  { id: 'EQ-004', name: 'Treadmill #4', category: 'Cardio', location: 'Cardio Zone', status: 'Maintenance', lastMaintenance: 'Sep 15, 2026' },
  { id: 'EQ-005', name: 'Elliptical #1', category: 'Cardio', location: 'Cardio Zone', status: 'In Use', lastMaintenance: 'Oct 3, 2026' },
  { id: 'EQ-006', name: 'Smith Machine', category: 'Strength', location: 'Strength Zone', status: 'Maintenance', lastMaintenance: 'Sep 20, 2026' },
  { id: 'EQ-007', name: 'Bench Press #1', category: 'Strength', location: 'Strength Zone', status: 'In Use', lastMaintenance: 'Oct 10, 2026' },
  { id: 'EQ-008', name: 'Bench Press #2', category: 'Strength', location: 'Strength Zone', status: 'Available', lastMaintenance: 'Oct 7, 2026' },
  { id: 'EQ-009', name: 'Cable Machine #1', category: 'Strength', location: 'Strength Zone', status: 'Out of Service', lastMaintenance: 'Aug 15, 2026' },
  { id: 'EQ-010', name: 'Leg Press', category: 'Strength', location: 'Strength Zone', status: 'In Use', lastMaintenance: 'Oct 2, 2026' },
]

const maintenanceRequests = [
  { id: 'MR-001', equipment: 'Treadmill #4', issue: 'Motor making unusual noise', priority: 'High', reportedBy: 'Staff', date: 'Oct 14, 2026', status: 'Pending' },
  { id: 'MR-002', equipment: 'Smith Machine', issue: 'Cable replacement needed', priority: 'Medium', reportedBy: 'Trainer Elena', date: 'Oct 12, 2026', status: 'In Progress' },
  { id: 'MR-003', equipment: 'Cable Machine #1', issue: 'Complete overhaul required', priority: 'High', reportedBy: 'Admin', date: 'Sep 28, 2026', status: 'Pending' },
]

export function EquipmentTracking() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipment Tracking</h1>
          <p className="text-sm text-muted">Monitor equipment status, maintenance schedules, and issues</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Add Equipment
          </Button>
          <Button className="gap-2">
            <Wrench className="size-4" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {equipmentStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Maintenance Requests */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-600" />
            <h3 className="font-semibold text-foreground">Active Maintenance Requests</h3>
            <span className="text-xs text-red-600 font-medium">3 Pending</span>
          </div>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          {maintenanceRequests.map((request, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-red-100">
              <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                <Wrench className="size-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{request.equipment}</p>
                    <p className="text-xs text-muted">{request.issue}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    request.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                 <span>Reported: {request.date}</span>
                  <span>By: {request.reportedBy}</span>
                  <span>Status: {request.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">Update</Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment List */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">All Equipment</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search equipment..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Categories</option>
              <option>Cardio</option>
              <option>Strength</option>
              <option>Free Weights</option>
              <option>Machines</option>
            </select>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Status</option>
              <option>Available</option>
              <option>In Use</option>
              <option>Maintenance</option>
              <option>Out of Service</option>
            </select>
            <Button variant="ghost" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Location</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Last Maintenance</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentItems.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{item.id}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-muted">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-muted">{item.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Available' ? 'bg-green-100 text-green-700' :
                      item.status === 'In Use' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">{item.lastMaintenance}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Wrench className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted">Showing 10 of 156 equipment items</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Plus className="size-4" />
            Add New Equipment
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Wrench className="size-4" />
            Schedule Maintenance
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <AlertTriangle className="size-4" />
            Report Issue
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  )
}

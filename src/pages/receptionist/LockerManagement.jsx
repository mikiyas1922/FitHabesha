import { Search, Filter, Plus, DoorOpen, Lock, Unlock, AlertTriangle, MoreVertical, User, Clock } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const lockerStats = [
  { label: 'Total Lockers', value: '200', icon: DoorOpen },
  { label: 'Occupied', value: '167', icon: Lock },
  { label: 'Available', value: '33', icon: Unlock },
  { label: 'Maintenance', value: '2', icon: AlertTriangle },
]

const lockers = [
  { id: 'L-001', zone: 'A', number: 1, status: 'Occupied', member: 'Sarah Connor', memberSince: 'Jan 2024', assignedDate: 'Oct 10, 2026' },
  { id: 'L-002', zone: 'A', number: 2, status: 'Available', member: null, memberSince: null, assignedDate: null },
  { id: 'L-003', zone: 'A', number: 3, status: 'Occupied', member: 'David Hassel', memberSince: 'Mar 2024', assignedDate: 'Oct 8, 2026' },
  { id: 'L-004', zone: 'A', number: 4, status: 'Occupied', member: 'Marcus Vance', memberSince: 'Feb 2024', assignedDate: 'Oct 12, 2026' },
  { id: 'L-005', zone: 'A', number: 5, status: 'Available', member: null, memberSince: null, assignedDate: null },
  { id: 'L-006', zone: 'A', number: 6, status: 'Maintenance', member: null, memberSince: null, assignedDate: null },
  { id: 'L-007', zone: 'B', number: 7, status: 'Occupied', member: 'Emma Watson', memberSince: 'Apr 2024', assignedDate: 'Oct 5, 2026' },
  { id: 'L-008', zone: 'B', number: 8, status: 'Available', member: null, memberSince: null, assignedDate: null },
  { id: 'L-009', zone: 'B', number: 9, status: 'Occupied', member: 'John Carter', memberSince: 'May 2024', assignedDate: 'Oct 11, 2026' },
  { id: 'L-010', zone: 'B', number: 10, status: 'Available', member: null, memberSince: null, assignedDate: null },
]

const zones = ['A', 'B', 'C', 'D']

export function LockerManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Locker Management</h1>
          <p className="text-sm text-muted">Assign and manage locker allocations for members</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Plus className="size-4" />
            Add Locker
          </Button>
          <Button className="gap-2">
            <User className="size-4" />
            Assign Locker
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {lockerStats.map((stat) => {
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

      {/* Locker Grid Visual */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Locker Overview</h3>
          <div className="flex gap-2">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Zones</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>Zone {zone}</option>
              ))}
            </select>
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Status</option>
              <option>Available</option>
              <option>Occupied</option>
              <option>Maintenance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: 50 }).map((_, i) => {
            const status = i % 7 === 0 ? 'Maintenance' : i % 3 === 0 ? 'Available' : 'Occupied'
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  status === 'Available' 
                    ? 'bg-green-100 border-2 border-green-300 hover:bg-green-200' 
                    : status === 'Occupied'
                    ? 'bg-blue-100 border-2 border-blue-300 hover:bg-blue-200'
                    : 'bg-red-100 border-2 border-red-300 hover:bg-red-200'
                }`}
              >
                <span className="text-xs font-medium text-foreground">{i + 1}</span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300" />
            <span className="text-muted">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300" />
            <span className="text-muted">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300" />
            <span className="text-muted">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Locker List */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Locker Assignments</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <input
                type="text"
                placeholder="Search lockers..."
                className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
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
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Locker ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Zone</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Number</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Assigned Member</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Assigned Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lockers.map((locker) => (
                <tr key={locker.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{locker.id}</td>
                  <td className="py-3 px-4 text-sm text-muted">Zone {locker.zone}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{locker.number}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      locker.status === 'Available' ? 'bg-green-100 text-green-700' :
                      locker.status === 'Occupied' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {locker.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {locker.member ? (
                      <div>
                        <p className="font-medium">{locker.member}</p>
                        <p className="text-xs text-muted">Since {locker.memberSince}</p>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">{locker.assignedDate || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {locker.status === 'Available' ? (
                        <Button size="sm" variant="secondary" className="gap-1">
                          <User className="size-3" />
                          Assign
                        </Button>
                      ) : locker.status === 'Occupied' ? (
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Unlock className="size-3" />
                          Release
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Lock className="size-3" />
                          Repair
                        </Button>
                      )}
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
          <p className="text-sm text-muted">Showing 10 of 200 lockers</p>
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
            Add New Locker
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <User className="size-4" />
            Assign to Member
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Unlock className="size-4" />
            Release All Expired
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <AlertTriangle className="size-4" />
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  )
}

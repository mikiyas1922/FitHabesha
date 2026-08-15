import { Search, Filter, Plus, User, Mail, Phone, Calendar, MoreVertical, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'

const members = [
  { id: 'M-001', name: 'Sarah Connor', email: 'sarah.c@email.com', phone: '+251 911 123 456', membership: 'Premium', status: 'Active', joinDate: 'Jan 15, 2024', lastVisit: 'Oct 15, 2026', avatar: 'SC' },
  { id: 'M-002', name: 'David Hassel', email: 'david.h@email.com', phone: '+251 922 234 567', membership: 'Standard', status: 'Active', joinDate: 'Mar 22, 2024', lastVisit: 'Oct 14, 2026', avatar: 'DH' },
  { id: 'M-003', name: 'Marcus Vance', email: 'marcus.v@email.com', phone: '+251 933 345 678', membership: 'Premium', status: 'Active', joinDate: 'Feb 10, 2024', lastVisit: 'Oct 15, 2026', avatar: 'MV' },
  { id: 'M-004', name: 'Emma Watson', email: 'emma.w@email.com', phone: '+251 944 456 789', membership: 'Standard', status: 'Active', joinDate: 'Apr 5, 2024', lastVisit: 'Oct 13, 2026', avatar: 'EW' },
  { id: 'M-005', name: 'John Carter', email: 'john.c@email.com', phone: '+251 955 567 890', membership: 'Premium', status: 'Inactive', joinDate: 'May 18, 2024', lastVisit: 'Sep 28, 2026', avatar: 'JC' },
  { id: 'M-006', name: 'Clara Oswald', email: 'clara.o@email.com', phone: '+251 966 678 901', membership: 'Standard', status: 'Active', joinDate: 'Jun 30, 2024', lastVisit: 'Oct 15, 2026', avatar: 'CO' },
  { id: 'M-007', name: 'Thomas Anderson', email: 'thomas.a@email.com', phone: '+251 977 789 012', membership: 'Premium', status: 'Active', joinDate: 'Jul 12, 2024', lastVisit: 'Oct 12, 2026', avatar: 'TA' },
  { id: 'M-008', name: 'Lisa Park', email: 'lisa.p@email.com', phone: '+251 988 890 123', membership: 'Standard', status: 'Active', joinDate: 'Aug 25, 2024', lastVisit: 'Oct 14, 2026', avatar: 'LP' },
]

export function MembersDirectory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members Directory</h1>
          <p className="text-sm text-muted">View and manage all gym members</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Filter className="size-4" />
            Advanced Filter
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Memberships</option>
            <option>Premium</option>
            <option>Standard</option>
            <option>Basic</option>
          </select>
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Sort by: Name</option>
            <option>Join Date</option>
            <option>Last Visit</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member) => (
          <div key={member.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted">{member.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="size-4" />
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Mail className="size-3" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Phone className="size-3" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Calendar className="size-3" />
                <span>Joined: {member.joinDate}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Membership</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  member.membership === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {member.membership}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Status</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {member.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Last Visit</span>
                <span className="text-xs text-muted">{member.lastVisit}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                View Profile
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <CreditCard className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Showing 8 of 892 members</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled>Previous</Button>
          <Button variant="ghost" size="sm">Next</Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Button variant="secondary" className="gap-2 justify-start">
            <Plus className="size-4" />
            Register New Member
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <CreditCard className="size-4" />
            Manage Subscriptions
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Mail className="size-4" />
            Send Bulk Email
          </Button>
          <Button variant="secondary" className="gap-2 justify-start">
            <Filter className="size-4" />
            Export Directory
          </Button>
        </div>
      </div>
    </div>
  )
}

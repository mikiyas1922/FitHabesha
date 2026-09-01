export const navByRole = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
    { label: 'Staff', path: '/admin/staff', icon: 'UserPlus' },
    { label: 'Members', path: '/admin/members', icon: 'Users' },
    { label: 'Trainers', path: '/admin/trainers', icon: 'Dumbbell' },
    { label: 'Today\'s Check-ins', path: '/admin/checkins', icon: 'Clock' },
    { label: 'Classes', path: '/admin/classes', icon: 'Calendar' },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: 'CreditCard' },
    { label: 'Feedback & Ratings', path: '/admin/feedback', icon: 'MessageSquare', badge: 1 },
    { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
    { label: 'Profile', path: '/admin/settings', icon: 'Settings' },
  ],
  trainer: [
    { label: 'Dashboard', path: '/trainer', icon: 'LayoutDashboard' },
    { label: 'My Clients', path: '/trainer/clients', icon: 'Users' },
    { label: 'Schedule', path: '/trainer/schedule', icon: 'Calendar' },
    { label: 'Workout Plans', path: '/trainer/workouts', icon: 'ClipboardList' },
    { label: 'Meal Plans', path: '/trainer/meals', icon: 'Apple' },
    { label: 'My Ratings', path: '/trainer/ratings', icon: 'Star' },
    { label: 'Profile', path: '/trainer/settings', icon: 'Settings' },
  ],
  receptionist: [
    { label: 'Quick Check-in', path: '/receptionist', icon: 'UserCheck' },
    { label: 'Today\'s Check-ins', path: '/receptionist/checkins', icon: 'Clock' },
    { label: 'Staff', path: '/receptionist/staff', icon: 'UserPlus' },
    { label: 'Members', path: '/receptionist/members', icon: 'Users' },
    { label: 'Walk-ins', path: '/receptionist/walk-in', icon: 'UserPlus' },
    { label: 'Lockers', path: '/receptionist/lockers', icon: 'Lock', badge: 22 },
    { label: 'Equipment', path: '/receptionist/equipment', icon: 'Wrench' },
    { label: 'Profile', path: '/receptionist/settings', icon: 'Settings' },
  ],
  member: [
    { label: 'Home', path: '/member', icon: 'Home' },
    { label: 'Workouts', path: '/member/workouts', icon: 'Dumbbell' },
    { label: 'Meal Plans', path: '/member/meals', icon: 'Apple' },
    { label: 'Classes', path: '/member/classes', icon: 'Calendar' },
    { label: 'Trainers', path: '/member/trainers', icon: 'Users' },
    { label: 'Subscriptions', path: '/member/subscriptions', icon: 'CreditCard' },
    { label: 'Feedback', path: '/member/feedback', icon: 'MessageSquare' },
    { label: 'Profile', path: '/member/settings', icon: 'Settings' },

  ],
}

export const roleLabels = {
  admin: 'System Admin',
  trainer: 'Trainer',
  receptionist: 'Front Desk Staff',
  member: 'Active Member',
}

export const roleUsers = {
  admin: { name: 'Adele Sarah', title: 'System Admin', initials: 'AS' },
  trainer: { name: 'Clara Redman', title: 'Trainer', initials: 'CR' },
  receptionist: { name: "D'New Thomas", title: 'Front Desk Staff', initials: 'DT' },
  member: { name: 'Marcus Vance', title: 'Active Member', initials: 'MV' },
}

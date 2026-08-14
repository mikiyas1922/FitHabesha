// UI display types (for frontend components)
export const members = [
  { id: 'GYM-M025-X', name: 'Marcus Vance', email: 'marcus.vance@example.com', phone: '+1 (555) 000-0000', membershipType: 'VIP All-Access', status: 'active', joinDate: '2022-01-15', trainer: 'Coach Harrison', lastCheckIn: 'Yesterday, 8:15 PM', visitsPerMonth: 22 },
  { id: 'GYM-3029-A', name: 'Mamoa Shibeshi', email: 'mamoa@email.com', phone: '+251 911 234 567', membershipType: 'Premium', status: 'active', joinDate: '2024-01-15', trainer: 'Daniel Tadesse', lastCheckIn: 'Today, 9:00 AM', visitsPerMonth: 18 },
  { id: 'GYM-1284-C', name: 'Jonathan Vance', email: 'jonathan@email.com', phone: '+251 922 345 678', membershipType: 'Standard', status: 'active', joinDate: '2024-03-20', trainer: 'Sara Mohammed', lastCheckIn: '3 days ago', visitsPerMonth: 12 },
  { id: 'GYM-5091-D', name: 'Clarissa Reyes', email: 'clarissa@email.com', phone: '+251 933 456 789', membershipType: 'Basic', status: 'inactive', joinDate: '2024-02-10', lastCheckIn: 'Oct 14, 2024', visitsPerMonth: 4 },
  { id: 'GYM-0820-F', name: 'Devon Lane', email: 'devon@email.com', phone: '+251 944 567 890', membershipType: 'Premium', status: 'expired', joinDate: '2023-11-05', lastCheckIn: 'Sep 20, 2024', visitsPerMonth: 0 },
  { id: 'GYM-2305-K', name: 'Sarah Connor', email: 'sarah@email.com', phone: '+251 955 678 901', membershipType: 'VIP All-Access', status: 'active', joinDate: '2024-04-01', trainer: 'Daniel Tadesse', lastCheckIn: 'Today, 3:58 PM', visitsPerMonth: 25 },
]

export const trainers = [
  { id: 'TR-001', name: 'Elena Rostova', email: 'elena@fitaddis.com', specialty: 'HIIT', specialties: ['HIIT', 'Cardio'], rating: 4.9, clients: 18, sessions: 142, status: 'active' },
  { id: 'TR-002', name: 'Daniel Park', email: 'daniel@fitaddis.com', specialty: 'Strength', specialties: ['Strength', 'CrossFit'], rating: 4.8, clients: 22, sessions: 168, status: 'active' },
  { id: 'TR-003', name: 'Sara Mohammed', email: 'sara@fitaddis.com', specialty: 'Yoga', specialties: ['Yoga', 'Pilates'], rating: 4.9, clients: 15, sessions: 120, status: 'active' },
  { id: 'TR-004', name: 'Michael Johnson', email: 'michael@fitaddis.com', specialty: 'CrossFit', specialties: ['CrossFit', 'HIIT'], rating: 4.6, clients: 12, sessions: 98, status: 'active' },
  { id: 'TR-005', name: 'Elena Petrov', email: 'elena.p@fitaddis.com', specialty: 'Nutrition', specialties: ['Nutrition', 'Wellness'], rating: 4.7, clients: 10, sessions: 85, status: 'active' },
  { id: 'TR-006', name: 'Clara Redman', email: 'clara@fitaddis.com', specialty: 'Strength', specialties: ['Strength', 'Rehab'], rating: 4.8, clients: 20, sessions: 155, status: 'active' },
]

export const trainerClients = [
  { id: 'FC-0012', name: 'Sarah Connor', goal: 'Weight Loss', weight: '85.0 kg', bmi: 24.1, lastSession: 'Yesterday', progress: 75, avatar: 'SC' },
  { id: 'FC-0018', name: 'David Hassel', goal: 'Muscle Building', weight: '92.3 kg', bmi: 26.8, lastSession: '3 days ago', progress: 45, avatar: 'DH' },
  { id: 'FC-0025', name: 'Marcus Vance', goal: 'Fat Loss', weight: '88.5 kg', bmi: 25.5, lastSession: 'Today, 9 AM', progress: 60, avatar: 'MV' },
  { id: 'FC-0031', name: 'Emily Watson', goal: 'Weight Loss', weight: '68.2 kg', bmi: 22.4, lastSession: 'Oct 14, 2024', progress: 82, avatar: 'EW' },
  { id: 'FC-0040', name: 'John Carter', goal: 'Muscle Building', weight: '78.5 kg', bmi: 23.1, lastSession: 'Yesterday', progress: 55, avatar: 'JC' },
  { id: 'FC-0047', name: 'Clara Oswald', goal: 'Fat Loss', weight: '62.0 kg', bmi: 21.8, lastSession: 'Today, 11 AM', progress: 100, avatar: 'CO' },
]

export const equipment = [
  { id: 'EQ-1054', name: 'Treadmill Pro X500', category: 'Cardio', status: 'available', location: 'Floor 1 - Main Zone', lastMaintenance: '2024-04-10', condition: 5 },
  { id: 'EQ-1089', name: 'Bench Press Station', category: 'Strength', status: 'in-use', location: 'Floor 2 - Cardio Row', lastMaintenance: '2024-05-15', condition: 4 },
  { id: 'EQ-1102', name: 'Rowing Machine R200', category: 'Cardio', status: 'available', location: 'Floor 1 - Main Zone', lastMaintenance: '2024-06-10', condition: 5 },
  { id: 'EQ-1134', name: 'Squat Rack', category: 'Strength', status: 'maintenance', location: 'Studio B - Mind/Body', lastMaintenance: '2024-04-20', condition: 3 },
  { id: 'EQ-1156', name: 'Spin Cycle Pro', category: 'Cycle', status: 'in-use', location: 'Floor 2 - Cardio Row', lastMaintenance: '2024-05-28', condition: 4 },
  { id: 'EQ-1178', name: 'Dumbbell Set 25lb', category: 'Free Weights', status: 'broken', location: 'Floor 1 - Main Zone', lastMaintenance: '2024-06-05', condition: 2 },
]

export const lockers = [
  { id: 'LK-101', number: 'L-101', status: 'available' },
  { id: 'LK-102', number: 'L-102', status: 'available' },
  { id: 'LK-103', number: 'L-103', member: 'Sarah Connor', status: 'occupied' },
  { id: 'LK-114', number: 'L-114', member: 'Marcus Vance', status: 'occupied' },
  { id: 'LK-115', number: 'L-115', status: 'available' },
  { id: 'LK-120', number: 'L-120', status: 'maintenance' },
  { id: 'LK-125', number: 'L-125', member: 'David Hassel', status: 'occupied' },
  { id: 'LK-130', number: 'L-130', status: 'available' },
]

export const ratings = [
  { id: 'R-001', memberName: 'Sarah Connor', score: 5, comment: 'Excellent trainer! Very motivating and knowledgeable about strength training.', date: '10:30 AM', punctuality: 5, communication: 5, knowledge: 5, engagement: 5 },
  { id: 'R-002', memberName: 'David Hassel', score: 5, comment: 'Best sessions I have had. Clara pushes me just the right amount every time.', date: 'Yesterday', punctuality: 5, communication: 4.8, knowledge: 5, engagement: 4.7 },
  { id: 'R-003', memberName: 'Marcus Vance', score: 4, comment: 'Great progress on my rehab program. Would love more variety in workouts.', date: '2 days ago', punctuality: 4.9, communication: 4.8, knowledge: 5, engagement: 4.7 },
  { id: 'R-004', memberName: 'Emily Watson', score: 5, comment: 'Professional and patient. Good progress so far on my weight loss goals.', date: '3 days ago', punctuality: 5, communication: 5, knowledge: 4.9, engagement: 4.8 },
]

export const subscriptions = [
  { date: 'Jan 15, 2025', member: 'Mamoa Shibeshi', memberId: 'GYM-3029-A', amount: 'Br6,000', type: 'Renewal', status: 'completed' },
  { date: 'Jan 14, 2025', member: 'Jonathan Vance', memberId: 'GYM-1284-C', amount: 'Br3,750', type: 'New', status: 'pending' },
  { date: 'Jan 13, 2025', member: 'Clarissa Reyes', memberId: 'GYM-5091-D', amount: 'Br2,250', type: 'New', status: 'failed' },
  { date: 'Jan 12, 2025', member: 'Devon Lane', memberId: 'GYM-0820-F', amount: 'Br3,750', type: 'New', status: 'expired' },
  { date: 'Jan 11, 2025', member: 'Sarah Connor', memberId: 'GYM-2305-K', amount: 'Br7,500', type: 'Renewal', status: 'completed' },
]

export const flaggedReviews = [
  { id: 'FR-001', member: 'Robert T.', score: 2, comment: 'Locker room #3 was dirty and smelled at 6 PM...', category: 'CLEANLINESS', categoryColor: 'danger' },
  { id: 'FR-002', member: 'Thomas C.', score: 3, comment: 'Dumbbell pairs are often disorganized. Half the 25lb set are missing...', category: 'EQUIPMENT', categoryColor: 'warning' },
  { id: 'FR-003', member: 'Clarissa M.', score: 2, comment: 'The peak hour congestion is getting worse. Wait times of 20 minutes for a free bench...', category: 'CONGESTION', categoryColor: 'danger' },
]

export const walkIns = [
  { name: 'Alex Turner', time: '2:30 PM', passType: 'Day Pass', status: 'checked-in' },
  { name: 'Maria Santos', time: '1:45 PM', passType: '1 Week Pass', status: 'checked-in' },
  { name: 'James Wilson', time: '12:15 PM', passType: 'Day Pass', status: 'checked-in' },
  { name: 'Lisa Chen', time: '11:00 AM', passType: 'Day Pass', status: 'checked-in' },
]

export const adminStats = [
  { label: 'Total Members', value: 248, change: '+12% vs last mo', trend: 'up' },
  { label: 'Active Sessions', value: 34, change: '+5% vs last mo', trend: 'up' },
  { label: 'Monthly Revenue', value: '$48,250', change: '+12% vs last mo', trend: 'up' },
  { label: 'Trainer Rating', value: '4.8/5.0', change: '+0.2', trend: 'up' },
]

export const trainerStats = [
  { label: 'Active Clients', value: 12, change: '+2 this week', trend: 'up' },
  { label: 'Sessions This Week', value: 18, change: '+3 vs last week', trend: 'up' },
  { label: 'Average Rating', value: '4.9/5.0', change: '+0.1', trend: 'up' },
  { label: 'Workout Plans', value: 8, change: '2 drafts', trend: 'up' },
]

export const receptionistStats = [
  { label: 'Check-ins Today', value: 47, change: '+15% vs yesterday', trend: 'up' },
  { label: 'Walk-ins', value: 18, change: '+12.5% vs yesterday', trend: 'up' },
  { label: 'Available Lockers', value: 156, change: '24 assigned today', trend: 'up' },
  { label: 'Equipment Issues', value: 3, change: '2 resolved today', trend: 'down' },
]

export const memberStats = [
  { label: 'Workouts This Week', value: 4, change: '+1 vs last week', trend: 'up' },
  { label: 'Calories Burned', value: '2,450', change: '+15% vs last week', trend: 'up' },
  { label: 'Current Streak', value: '12 days', change: 'Personal best!', trend: 'up' },
  { label: 'Next Session', value: 'Tomorrow, 10 AM', change: 'With Coach Daniel', trend: 'up' },
]

export const scheduleSessions = [
  { time: '09:00 AM', client: 'Sarah Connor', type: 'Weight Training', status: 'completed' },
  { time: '11:00 AM', client: 'Marcus Vance', type: 'HIIT', status: 'active' },
  { time: '02:00 PM', client: 'David Hassel', type: 'Strength', status: 'upcoming' },
  { time: '04:00 PM', client: 'Emily Watson', type: 'Yoga', status: 'upcoming' },
  { time: '05:30 PM', client: 'John Carter', type: 'CrossFit', status: 'upcoming' },
]

export const weekSchedule = [
  { day: 'Monday', date: 'Jan 13', sessions: 4 },
  { day: 'Tuesday', date: 'Jan 14', sessions: 5 },
  { day: 'Wednesday', date: 'Jan 15', sessions: 3 },
  { day: 'Thursday', date: 'Jan 16', sessions: 6 },
  { day: 'Friday', date: 'Jan 17', sessions: 4 },
  { day: 'Saturday', date: 'Jan 18', sessions: 2 },
  { day: 'Sunday', date: 'Jan 19', sessions: 0 },
]

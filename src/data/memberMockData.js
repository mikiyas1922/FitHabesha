// Frontend-only mock data for member features (swap with API when backend is ready)

export const memberWorkoutPlans = [
  {
    id: 'WP-001',
    name: 'Upper Body Strength',
    trainer: 'Daniel Tadesse',
    day: 'Today',
    status: 'active',
    exercises: [
      { name: 'Bench Press', sets: '4 × 12', done: true },
      { name: 'Incline Dumbbell Press', sets: '3 × 10', done: true },
      { name: 'Cable Flyes', sets: '3 × 15', done: false },
      { name: 'Push-ups', sets: '3 × 20', done: false },
      { name: 'Tricep Dips', sets: '3 × 12', done: false },
    ],
  },
  {
    id: 'WP-002',
    name: 'Lower Body Power',
    trainer: 'Daniel Tadesse',
    day: 'Wednesday',
    status: 'scheduled',
    exercises: [
      { name: 'Barbell Squats', sets: '4 × 10', done: false },
      { name: 'Romanian Deadlifts', sets: '3 × 12', done: false },
      { name: 'Leg Press', sets: '3 × 15', done: false },
      { name: 'Walking Lunges', sets: '3 × 12 each', done: false },
    ],
  },
  {
    id: 'WP-003',
    name: 'HIIT Conditioning',
    trainer: 'Daniel Tadesse',
    day: 'Friday',
    status: 'scheduled',
    exercises: [
      { name: 'Burpees', sets: '4 × 15', done: false },
      { name: 'Box Jumps', sets: '4 × 12', done: false },
      { name: 'Battle Ropes', sets: '3 × 45 sec', done: false },
      { name: 'Mountain Climbers', sets: '3 × 30 sec', done: false },
    ],
  },
]

export const memberMealPlans = [
  {
    id: 'MP-001',
    name: 'Muscle Building Plan',
    trainer: 'Daniel Tadesse',
    calories: 2400,
    protein: 180,
    carbs: 260,
    fats: 70,
    meals: [
      { time: '7:00 AM', name: 'Protein Oats Bowl', calories: 420, items: 'Oats, banana, whey protein, almonds' },
      { time: '12:30 PM', name: 'Grilled Chicken & Rice', calories: 650, items: 'Chicken breast, brown rice, steamed vegetables' },
      { time: '4:00 PM', name: 'Pre-Workout Snack', calories: 280, items: 'Greek yogurt, berries, honey' },
      { time: '7:30 PM', name: 'Salmon & Sweet Potato', calories: 580, items: 'Grilled salmon, sweet potato, salad' },
    ],
  },
]

export const memberClasses = [
  { id: 'CL-001', name: 'Morning Yoga Flow', instructor: 'Sara Mohammed', day: 'Mon & Wed', time: '7:00 AM', spots: 8, capacity: 20, booked: false },
  { id: 'CL-002', name: 'HIIT Blast', instructor: 'Daniel Tadesse', day: 'Tue & Thu', time: '6:00 PM', spots: 3, capacity: 15, booked: true },
  { id: 'CL-003', name: 'Spin Cycle', instructor: 'Elena Rostova', day: 'Sat', time: '9:00 AM', spots: 12, capacity: 25, booked: false },
  { id: 'CL-004', name: 'Strength Foundations', instructor: 'Clara Redman', day: 'Fri', time: '5:30 PM', spots: 5, capacity: 12, booked: false },
]

export const memberTrainer = {
  name: 'Daniel Tadesse',
  specialty: 'Strength & HIIT',
  rating: 4.9,
  clients: 22,
  sessionsCompleted: 168,
  email: 'daniel@fitaddis.com',
  phone: '+251 911 000 001',
  bio: 'Certified strength coach focused on sustainable muscle building and fat loss programs tailored to your goals.',
  nextSession: { date: 'Tomorrow', time: '10:00 AM', type: 'Strength Training' },
}

export const memberSubscription = {
  plan: 'Premium Monthly',
  status: 'active',
  price: 'Br 3,750',
  billingCycle: 'Monthly',
  nextBilling: 'Sep 13, 2026',
  memberSince: 'Aug 2026',
  features: ['Unlimited gym access', '2 trainer sessions/month', 'Locker access', 'Group classes'],
}

export const memberBillingHistory = [
  { date: 'Aug 13, 2026', amount: 'Br 3,750', type: 'New Membership', status: 'completed' },
  { date: 'Jul 13, 2026', amount: 'Br 500', type: 'Registration Fee', status: 'completed' },
]

export const memberUpcomingSessions = [
  { date: 'Tomorrow', time: '10:00 AM', trainer: 'Daniel Tadesse', type: 'Strength Training' },
  { date: 'Wed, Aug 15', time: '02:00 PM', trainer: 'Daniel Tadesse', type: 'HIIT' },
  { date: 'Fri, Aug 17', time: '09:00 AM', trainer: 'Daniel Tadesse', type: 'Strength Training' },
]

export const memberPastFeedback = [
  { id: 'FB-001', category: 'Trainer', rating: 5, comment: 'Great session today! Very motivating.', date: 'Aug 10, 2026' },
  { id: 'FB-002', category: 'Equipment', rating: 4, comment: 'Most equipment is well maintained.', date: 'Aug 5, 2026' },
]

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://gym-management-system-backend-xb5m.onrender.com/api/v1' // 👈 Ensure /v1 is included

export const API_BASE_URL_V1 = API_BASE_URL

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ADMIN: {
    REGISTER: '/admin/register',
    STAFF: '/admin/staff',
    MEMBERS: '/admin/members',
    MEMBERS_DEACTIVATE: (id) => `/admin/members/${id}/deactivate`,
    MEMBERS_REACTIVATE: (id) => `/admin/members/${id}/reactivate`,
    USERS: '/admin/users',
  },
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
  // Members
  MEMBERS: {
    LIST: '/members',
    DETAIL: (id) => `/members/${id}`,
    BY_USER_ID: (userId) => `/members/user/${userId}`,
    BY_UNIQUE_ID: (uniqueMemberId) => `/members/unique/${encodeURIComponent(uniqueMemberId)}`,
    CREATE: '/members',
    UPDATE: (id) => `/members/${id}`,
    DELETE: (id) => `/members/${id}`,
    PROFILE: (id) => `/members/${id}/profile`,
  },
  // Trainers (Used by both admin & general users)
  TRAINERS: {
    LIST: '/trainers', // 👈 Targets GET /api/v1/trainers
    DETAIL: (id) => `/trainers/${id}`,
    CREATE: '/trainers',
    UPDATE: (id) => `/trainers/${id}`,
    DELETE: (id) => `/trainers/${id}`,
    CLIENTS: (id) => `/trainers/${id}/clients`,
  },
  // Subscriptions
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    DETAIL: (id) => `/subscriptions/${id}`,
    CREATE: '/subscriptions',
    UPDATE: (id) => `/subscriptions/${id}`,
    DELETE: (id) => `/subscriptions/${id}`,
  },
  // Workouts
  WORKOUTS: {
    LIST: '/workouts',
    DETAIL: (id) => `/workouts/${id}`,
    CREATE: '/workouts',
    UPDATE: (id) => `/workouts/${id}`,
    DELETE: (id) => `/workouts/${id}`,
  },
  // Meal Plans
  MEAL_PLANS: {
    LIST: '/meal-plans',
    DETAIL: (id) => `/meal-plans/${id}`,
    CREATE: '/meal-plans',
    UPDATE: (id) => `/meal-plans/${id}`,
    DELETE: (id) => `/meal-plans/${id}`,
  },
  // Classes
  CLASSES: {
    LIST: '/classes',
    DETAIL: (id) => `/classes/${id}`,
    CREATE: '/classes',
    UPDATE: (id) => `/classes/${id}`,
    DELETE: (id) => `/classes/${id}`,
    BOOKINGS: '/classes/bookings',
  },
  // Equipment
  EQUIPMENT: {
    LIST: '/equipment',
    DETAIL: (id) => `/equipment/${id}`,
    CREATE: '/equipment',
    UPDATE: (id) => `/equipment/${id}`,
    DELETE: (id) => `/equipment/${id}`,
  },
  // Lockers
  LOCKERS: {
    LIST: '/lockers',
    DETAIL: (id) => `/lockers/${id}`,
    CREATE: '/lockers',
    UPDATE: (id) => `/lockers/${id}`,
    DELETE: (id) => `/lockers/${id}`,
  },
  // Reports & Analytics
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    REVENUE: '/reports/revenue',
    ATTENDANCE: '/reports/attendance',
  },
  CHECKIN: {
    MEMBER_BY_UNIQUE_ID: (uniqueId) => `/checkin/member/${encodeURIComponent(uniqueId)}`,
    TODAY: '/checkin/today',
  },
}
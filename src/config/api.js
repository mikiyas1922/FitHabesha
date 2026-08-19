// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://gym-management-system-backend-xb5m.onrender.com/api/v1'

// API Endpoints — match production Swagger at /api/v1
export const API_ENDPOINTS = {
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
    MEMBERS_DEACTIVATE: (id) => `/admin/members/${id}`,
    MEMBERS_REACTIVATE: (id) => `/admin/members/${id}/reactivate`,
    TRAINERS_DEACTIVATE: (id) => `/admin/trainers/${id}`,
    TRAINERS_REACTIVATE: (id) => `/admin/trainers/${id}/reactivate`,
  },
  MEMBERS: {
    LIST: '/members',
    DETAIL: (id) => `/members/${id}`,
    UPDATE: (id) => `/members/${id}`,
    ME: '/members/me',
    BY_USER_ID: (userId) => `/members/user/${userId}`,
    BY_UNIQUE_ID: (uniqueMemberId) => `/members/unique/${encodeURIComponent(uniqueMemberId)}`,
  },
  TRAINERS: {
    LIST: '/trainers',
    ME: '/trainers/me',
    DETAIL: (id) => `/trainers/${id}`,
    UPDATE: (id) => `/trainers/${id}`,
    SCHEDULE: (id) => `/trainers/${id}/schedule`,
    ROSTER: (id) => `/trainers/${id}/roster`,
    CLASS_ROSTER: (trainerId, classId) => `/trainers/${trainerId}/classes/${classId}/roster`,
    FEEDBACK: (id) => `/trainers/${id}/feedback`,
    ATTENDANCE: (memberProfileId) => `/trainers/attendance/${memberProfileId}`,
  },
  CLASSES: {
    LIST: '/classes',
    DETAIL: (id) => `/classes/${id}`,
    CREATE: '/classes',
    UPDATE: (id) => `/classes/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    DETAIL: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}`,
    RESCHEDULE: (id) => `/bookings/${id}/reschedule`,
    MEMBER: (memberProfileId) => `/bookings/member/${memberProfileId}`,
  },
  CHECKIN: {
    MEMBER_BY_UNIQUE_ID: (uniqueId) => `/checkin/member/${encodeURIComponent(uniqueId)}`,
    CHECKIN: (uniqueId) => `/checkin/${encodeURIComponent(uniqueId)}`,
    OVERRIDE: (uniqueId) => `/checkin/override/${encodeURIComponent(uniqueId)}`,
    HISTORY: (memberId) => `/checkin/history/${memberId}`,
    TODAY: '/checkin/today',
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    DETAIL: (id) => `/subscriptions/${id}`,
    CREATE: '/subscriptions',
    UPDATE: (id) => `/subscriptions/${id}`,
    DELETE: (id) => `/subscriptions/${id}`,
  },
  WORKOUTS: {
    LIST: '/workouts',
    DETAIL: (id) => `/workouts/${id}`,
    CREATE: '/workouts',
    UPDATE: (id) => `/workouts/${id}`,
    DELETE: (id) => `/workouts/${id}`,
  },
  MEAL_PLANS: {
    LIST: '/meal-plans',
    DETAIL: (id) => `/meal-plans/${id}`,
    CREATE: '/meal-plans',
    UPDATE: (id) => `/meal-plans/${id}`,
    DELETE: (id) => `/meal-plans/${id}`,
  },
  EQUIPMENT: {
    LIST: '/equipment',
    DETAIL: (id) => `/equipment/${id}`,
    CREATE: '/equipment',
    UPDATE: (id) => `/equipment/${id}`,
    DELETE: (id) => `/equipment/${id}`,
  },
  LOCKERS: {
    LIST: '/lockers',
    DETAIL: (id) => `/lockers/${id}`,
    CREATE: '/lockers',
    UPDATE: (id) => `/lockers/${id}`,
    DELETE: (id) => `/lockers/${id}`,
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    REVENUE: '/reports/revenue',
    ATTENDANCE: '/reports/attendance',
  },
}

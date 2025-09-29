export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api"

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  GOOGLE_LOGIN: "/auth/google-login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/me",
  REFRESH: "/auth/refresh",
  CHANGE_PASSWORD: "/auth/change-password",
  GMAIL_AUTHORIZE: "/auth/gmail/authorize",
  GMAIL_CALLBACK: "/auth/gmail/callback",

  // Users
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,

  // Employees
  EMPLOYEES: "/employees",
  EMPLOYEE_BY_ID: (id: string) => `/employees/${id}`,

  // Departments
  DEPARTMENTS: "/departments",
  DEPARTMENT_BY_ID: (id: string) => `/departments/${id}`,

  // Jobs
  JOBS: "/jobs",
  JOB_BY_ID: (id: string) => `/jobs/${id}`,

  // Candidates
  CANDIDATES: "/candidates",
  CANDIDATE_BY_ID: (id: string) => `/candidates/${id}`,

  // Interviews
  INTERVIEWS: "/interviews",
  INTERVIEW_BY_ID: (id: string) => `/interviews/${id}`,

  // Gmail
  GMAIL_SEND: "/gmail/send",
  GMAIL_MESSAGES: "/gmail/messages",
  GMAIL_MESSAGE_BY_ID: (id: string) => `/gmail/messages/${id}`,

  // Dashboard
  DASHBOARD_STATS: "/dashboard/stats",
  DASHBOARD_RECENT_ACTIVITIES: "/dashboard/recent-activities",
}

export const createApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_BASE_URL}${endpoint}`

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value)
    })
  }

  return url
}

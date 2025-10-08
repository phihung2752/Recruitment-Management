// Permission constants
export const PERMISSIONS = {
  // User management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  
  // Employee management
  EMPLOYEES_VIEW: 'employees.view',
  EMPLOYEES_CREATE: 'employees.create',
  EMPLOYEES_EDIT: 'employees.edit',
  EMPLOYEES_DELETE: 'employees.delete',
  
  // Candidate management
  CANDIDATES_VIEW: 'candidates.view',
  CANDIDATES_CREATE: 'candidates.create',
  CANDIDATES_EDIT: 'candidates.edit',
  CANDIDATES_DELETE: 'candidates.delete',
  
  // Interview management
  INTERVIEWS_VIEW: 'interviews.view',
  INTERVIEWS_CREATE: 'interviews.create',
  INTERVIEWS_EDIT: 'interviews.edit',
  INTERVIEWS_DELETE: 'interviews.delete',
  
  // Job posting management
  JOBS_VIEW: 'jobs.view',
  JOBS_CREATE: 'jobs.create',
  JOBS_EDIT: 'jobs.edit',
  JOBS_DELETE: 'jobs.delete',
  
  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
  
  // System administration
  SYSTEM_ADMIN: 'system.admin',
  SYSTEM_SETTINGS: 'system.settings',
  
  // Calendar
  CALENDAR_VIEW: 'calendar.view',
  CALENDAR_EDIT: 'calendar.edit',
  
  // Notifications
  NOTIFICATIONS_VIEW: 'notifications.view',
  NOTIFICATIONS_SEND: 'notifications.send'
} as const

// Role definitions with permissions
export const ROLE_PERMISSIONS = {
  Admin: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_EDIT,
    PERMISSIONS.EMPLOYEES_DELETE,
    PERMISSIONS.CANDIDATES_VIEW,
    PERMISSIONS.CANDIDATES_CREATE,
    PERMISSIONS.CANDIDATES_EDIT,
    PERMISSIONS.CANDIDATES_DELETE,
    PERMISSIONS.INTERVIEWS_VIEW,
    PERMISSIONS.INTERVIEWS_CREATE,
    PERMISSIONS.INTERVIEWS_EDIT,
    PERMISSIONS.INTERVIEWS_DELETE,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
    PERMISSIONS.JOBS_EDIT,
    PERMISSIONS.JOBS_DELETE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.CALENDAR_EDIT,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_SEND
  ],
  HR: [
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_EDIT,
    PERMISSIONS.CANDIDATES_VIEW,
    PERMISSIONS.CANDIDATES_CREATE,
    PERMISSIONS.CANDIDATES_EDIT,
    PERMISSIONS.CANDIDATES_DELETE,
    PERMISSIONS.INTERVIEWS_VIEW,
    PERMISSIONS.INTERVIEWS_CREATE,
    PERMISSIONS.INTERVIEWS_EDIT,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
    PERMISSIONS.JOBS_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.CALENDAR_EDIT,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_SEND
  ],
  Manager: [
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.CANDIDATES_VIEW,
    PERMISSIONS.INTERVIEWS_VIEW,
    PERMISSIONS.INTERVIEWS_CREATE,
    PERMISSIONS.INTERVIEWS_EDIT,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  Employee: [
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  Interviewer: [
    PERMISSIONS.CANDIDATES_VIEW,
    PERMISSIONS.INTERVIEWS_VIEW,
    PERMISSIONS.INTERVIEWS_EDIT,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ]
} as const

// Permission descriptions
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.USERS_VIEW]: 'Xem danh sách người dùng',
  [PERMISSIONS.USERS_CREATE]: 'Tạo người dùng mới',
  [PERMISSIONS.USERS_EDIT]: 'Chỉnh sửa thông tin người dùng',
  [PERMISSIONS.USERS_DELETE]: 'Xóa người dùng',
  
  [PERMISSIONS.EMPLOYEES_VIEW]: 'Xem danh sách nhân viên',
  [PERMISSIONS.EMPLOYEES_CREATE]: 'Tạo nhân viên mới',
  [PERMISSIONS.EMPLOYEES_EDIT]: 'Chỉnh sửa thông tin nhân viên',
  [PERMISSIONS.EMPLOYEES_DELETE]: 'Xóa nhân viên',
  
  [PERMISSIONS.CANDIDATES_VIEW]: 'Xem danh sách ứng viên',
  [PERMISSIONS.CANDIDATES_CREATE]: 'Tạo ứng viên mới',
  [PERMISSIONS.CANDIDATES_EDIT]: 'Chỉnh sửa thông tin ứng viên',
  [PERMISSIONS.CANDIDATES_DELETE]: 'Xóa ứng viên',
  
  [PERMISSIONS.INTERVIEWS_VIEW]: 'Xem danh sách phỏng vấn',
  [PERMISSIONS.INTERVIEWS_CREATE]: 'Tạo lịch phỏng vấn',
  [PERMISSIONS.INTERVIEWS_EDIT]: 'Chỉnh sửa phỏng vấn',
  [PERMISSIONS.INTERVIEWS_DELETE]: 'Xóa phỏng vấn',
  
  [PERMISSIONS.JOBS_VIEW]: 'Xem danh sách việc làm',
  [PERMISSIONS.JOBS_CREATE]: 'Tạo tin tuyển dụng',
  [PERMISSIONS.JOBS_EDIT]: 'Chỉnh sửa tin tuyển dụng',
  [PERMISSIONS.JOBS_DELETE]: 'Xóa tin tuyển dụng',
  
  [PERMISSIONS.REPORTS_VIEW]: 'Xem báo cáo',
  [PERMISSIONS.REPORTS_EXPORT]: 'Xuất báo cáo',
  
  [PERMISSIONS.SYSTEM_ADMIN]: 'Quản trị hệ thống',
  [PERMISSIONS.SYSTEM_SETTINGS]: 'Cài đặt hệ thống',
  
  [PERMISSIONS.CALENDAR_VIEW]: 'Xem lịch',
  [PERMISSIONS.CALENDAR_EDIT]: 'Chỉnh sửa lịch',
  
  [PERMISSIONS.NOTIFICATIONS_VIEW]: 'Xem thông báo',
  [PERMISSIONS.NOTIFICATIONS_SEND]: 'Gửi thông báo'
} as const

// Check if user has permission
export function hasPermission(userPermissions: string[], permission: string): boolean {
  return userPermissions.includes(permission) || userPermissions.includes(PERMISSIONS.SYSTEM_ADMIN)
}

// Check if user has any of the permissions
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission))
}

// Check if user has all permissions
export function hasAllPermissions(userPermissions: string[], permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userPermissions, permission))
}

// Get permissions for role
export function getRolePermissions(role: string): string[] {
  return [...(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [])]
}

// Get all available permissions
export function getAllPermissions(): string[] {
  return Object.values(PERMISSIONS)
}

// Get permission description
export function getPermissionDescription(permission: string): string {
  return PERMISSION_DESCRIPTIONS[permission as keyof typeof PERMISSION_DESCRIPTIONS] || permission
}





import { apiClient } from "@/src/api/client"

// Types for dashboard data
export interface DashboardStats {
  totalEmployees: number
  totalAttendance: number
  totalVacations: number
  interviewsScheduled: number
  hiredCandidates: number
  activeJobs: number
}

export interface AttendanceData {
  month: string
  attendance: number
  permission: number
  vacation: number
}

export interface Meeting {
  id: string
  name: string
  date: string
  duration: string
}

export interface Request {
  id: string
  name: string
  jobTitle: string
  details: string
}

export interface JobStatus {
  status: string
  count: number
}

export interface DepartmentHiring {
  department: string
  filled: number
  total: number
  percentage: number
}

// Dashboard service for fetching dashboard data
export const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/dashboard/stats")
    if (response.success && response.data) {
      return response.data
    }
    // Return default values if API fails
    return {
      totalEmployees: 0,
      totalAttendance: 0,
      totalVacations: 0,
      interviewsScheduled: 0,
      hiredCandidates: 0,
      activeJobs: 0,
    }
  },

  // Get attendance data for chart
  getAttendanceData: async (): Promise<AttendanceData[]> => {
    const response = await apiClient.get<AttendanceData[]>("/dashboard/attendance")
    if (response.success && response.data) {
      return response.data
    }
    // Return mock data if API fails
    return [
      { month: "Jan", attendance: 85, permission: 10, vacation: 5 },
      { month: "Feb", attendance: 88, permission: 8, vacation: 4 },
      { month: "Mar", attendance: 82, permission: 12, vacation: 6 },
      { month: "Apr", attendance: 90, permission: 7, vacation: 3 },
      { month: "May", attendance: 87, permission: 9, vacation: 4 },
      { month: "Jun", attendance: 89, permission: 8, vacation: 3 },
    ]
  },

  // Get today's meetings
  getTodaysMeetings: async (): Promise<Meeting[]> => {
    const response = await apiClient.get<Meeting[]>("/dashboard/meetings/today")
    if (response.success && response.data) {
      return response.data
    }
    return []
  },

  // Get today's requests
  getTodaysRequests: async (): Promise<Request[]> => {
    const response = await apiClient.get<Request[]>("/dashboard/requests/today")
    if (response.success && response.data) {
      return response.data
    }
    return []
  },

  // Get job status distribution
  getJobStatusDistribution: async (): Promise<JobStatus[]> => {
    const response = await apiClient.get<JobStatus[]>("/dashboard/jobs/status")
    if (response.success && response.data) {
      return response.data
    }
    // Return mock data if API fails
    return [
      { status: "Active", count: 15 },
      { status: "Closed", count: 8 },
      { status: "Draft", count: 3 },
      { status: "Paused", count: 2 },
    ]
  },

  // Get department hiring progress
  getDepartmentHiringProgress: async (): Promise<DepartmentHiring[]> => {
    const response = await apiClient.get<DepartmentHiring[]>("/dashboard/departments/hiring")
    if (response.success && response.data) {
      return response.data
    }
    // Return mock data if API fails
    return [
      { department: "Engineering", filled: 8, total: 10, percentage: 80 },
      { department: "Marketing", filled: 5, total: 6, percentage: 83 },
      { department: "Sales", filled: 12, total: 15, percentage: 80 },
      { department: "HR", filled: 3, total: 4, percentage: 75 },
    ]
  },
}

import { apiClient } from "../client"
import { API_ENDPOINTS, createApiUrl } from "../config"

export interface Interview {
  id: string
  candidateId: string
  interviewerId: string
  scheduledDate: Date
  duration: number
  type: "phone" | "video" | "in-person"
  status: "scheduled" | "completed" | "cancelled"
  meetingLink?: string
  notes?: string
}

export interface InterviewFeedback {
  interviewId: string
  technicalSkills: number
  communicationSkills: number
  problemSolving: number
  culturalFit: number
  overallRating: number
  comments: string
}

export const interviewsService = {
  async getInterviews(params?: {
    candidateId?: string
    status?: string
    date?: string
  }) {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const endpoint = `${API_ENDPOINTS.INTERVIEWS.LIST}?${queryParams.toString()}`
    return apiClient.get<Interview[]>(endpoint)
  },

  async scheduleInterview(interviewData: Omit<Interview, "id">) {
    return apiClient.post<Interview>(API_ENDPOINTS.INTERVIEWS.SCHEDULE, interviewData)
  },

  async updateInterview(id: string, interviewData: Partial<Interview>) {
    const endpoint = createApiUrl(API_ENDPOINTS.INTERVIEWS.UPDATE, { id })
    return apiClient.put<Interview>(endpoint, interviewData)
  },

  async submitFeedback(feedback: InterviewFeedback) {
    return apiClient.post(API_ENDPOINTS.INTERVIEWS.FEEDBACK, feedback)
  },
}

import { apiClient } from "../api-client"

// Types for interviews
export interface Interview {
  id: string
  candidateId: string
  candidateName: string
  position: string
  type: "Phone" | "Video" | "In-person" | "Technical"
  date: string
  time: string
  duration: number
  interviewerId: string
  interviewerName: string
  status: "Scheduled" | "Completed" | "Cancelled"
}

export interface InterviewDetail extends Interview {
  candidateEmail: string
  candidatePhone: string
  location?: string
  meetingLink?: string
  notes?: string
  feedback?: {
    technicalSkills: number
    communicationSkills: number
    problemSolving: number
    culturalFit: number
    overallRating: number
    comments: string
  }
}

export interface ScheduleInterviewRequest {
  candidateId: string
  type: Interview["type"]
  date: string
  time: string
  duration: number
  interviewerId: string
  location?: string
  meetingLink?: string
  notes?: string
}

export interface InterviewFeedbackRequest {
  technicalSkills: number
  communicationSkills: number
  problemSolving: number
  culturalFit: number
  overallRating: number
  comments: string
}

// Interviews service for fetching interviews data
export const interviewsService = {
  // Get all interviews
  getInterviews: async (): Promise<Interview[]> => {
    return apiClient.get<Interview[]>("/interviews")
  },

  // Get today's interviews
  getTodaysInterviews: async (): Promise<Interview[]> => {
    return apiClient.get<Interview[]>("/interviews/today")
  },

  // Get interview by id
  getInterviewById: async (id: string): Promise<InterviewDetail> => {
    return apiClient.get<InterviewDetail>(`/interviews/${id}`)
  },

  // Schedule interview
  scheduleInterview: async (interview: ScheduleInterviewRequest): Promise<InterviewDetail> => {
    return apiClient.post<InterviewDetail>("/interviews", interview)
  },

  // Update interview
  updateInterview: async (id: string, interview: Partial<ScheduleInterviewRequest>): Promise<InterviewDetail> => {
    return apiClient.put<InterviewDetail>(`/interviews/${id}`, interview)
  },

  // Cancel interview
  cancelInterview: async (id: string): Promise<void> => {
    return apiClient.put<void>(`/interviews/${id}/cancel`, {})
  },

  // Submit interview feedback
  submitFeedback: async (id: string, feedback: InterviewFeedbackRequest): Promise<InterviewDetail> => {
    return apiClient.post<InterviewDetail>(`/interviews/${id}/feedback`, feedback)
  },

  // Get interviews by candidate
  getInterviewsByCandidate: async (candidateId: string): Promise<Interview[]> => {
    return apiClient.get<Interview[]>(`/interviews/candidate/${candidateId}`)
  },
}

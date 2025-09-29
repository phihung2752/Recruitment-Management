import { apiClient } from "../api-client"

// Types for candidates
export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  status: "New" | "Screening" | "Interview" | "Technical" | "Final" | "Offer" | "Hired" | "Rejected"
  priority: "Low" | "Medium" | "High" | "Urgent"
  rating: number
  source: string
  appliedDate: string
  skills: string[]
}

export interface CandidateDetail extends Candidate {
  experience: number
  education: string
  location: string
  salary: {
    expected: number
    offered?: number
  }
  notes: string
  documents: {
    cv: string
    coverLetter?: string
    portfolio?: string
    certificates?: string[]
  }
  interviews: {
    id: string
    type: "Phone" | "Video" | "In-person" | "Technical"
    date: string
    interviewer: string
    status: "Scheduled" | "Completed" | "Cancelled"
    feedback?: string
    score?: number
  }[]
}

export interface CreateCandidateRequest {
  name: string
  email: string
  phone: string
  position: string
  source: string
  skills: string[]
  experience: number
  education: string
  location: string
  expectedSalary: number
  notes?: string
}

// Candidates service for fetching candidates data
export const candidatesService = {
  // Get all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    return apiClient.get<Candidate[]>("/candidates")
  },

  // Get candidate by id
  getCandidateById: async (id: string): Promise<CandidateDetail> => {
    return apiClient.get<CandidateDetail>(`/candidates/${id}`)
  },

  // Create candidate
  createCandidate: async (candidate: CreateCandidateRequest): Promise<CandidateDetail> => {
    return apiClient.post<CandidateDetail>("/candidates", candidate)
  },

  // Update candidate
  updateCandidate: async (id: string, candidate: Partial<CreateCandidateRequest>): Promise<CandidateDetail> => {
    return apiClient.put<CandidateDetail>(`/candidates/${id}`, candidate)
  },

  // Delete candidate
  deleteCandidate: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/candidates/${id}`)
  },

  // Change candidate status
  changeCandidateStatus: async (id: string, status: Candidate["status"]): Promise<CandidateDetail> => {
    return apiClient.put<CandidateDetail>(`/candidates/${id}/status`, { status })
  },

  // Upload CV
  uploadCV: async (id: string, file: File): Promise<CandidateDetail> => {
    return apiClient.uploadFile<CandidateDetail>(`/candidates/${id}/cv`, file)
  },
}

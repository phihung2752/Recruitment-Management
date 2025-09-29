import { apiClient } from "../client"

export interface Candidate {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  jobId: number
  resume?: string
  status: string
  appliedDate: string
  createdAt: string
  updatedAt?: string
  job: {
    id: number
    title: string
    department: {
      name: string
    }
  }
  interviews: Array<{
    id: number
    scheduledDate: string
    type: string
    status: string
    result?: string
  }>
}

export interface CreateCandidateRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  jobId: number
  resume?: string
  status?: string
}

export interface UpdateCandidateRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  jobId?: number
  resume?: string
  status?: string
}

class CandidateService {
  async getAll() {
    return apiClient.get<Candidate[]>("/candidates")
  }

  async getById(id: number) {
    return apiClient.get<Candidate>(`/candidates/${id}`)
  }

  async getByJob(jobId: number) {
    return apiClient.get<Candidate[]>(`/candidates/job/${jobId}`)
  }

  async create(candidate: CreateCandidateRequest) {
    return apiClient.post<Candidate>("/candidates", candidate)
  }

  async update(id: number, candidate: UpdateCandidateRequest) {
    return apiClient.put<Candidate>(`/candidates/${id}`, candidate)
  }

  async delete(id: number) {
    return apiClient.delete(`/candidates/${id}`)
  }
}

export const candidateService = new CandidateService()

import { apiClient } from "../client"

export interface Job {
  id: number
  title: string
  description?: string
  departmentId: number
  minSalary?: number
  maxSalary?: number
  status: string
  createdAt: string
  updatedAt?: string
  department: {
    id: number
    name: string
  }
}

export interface CreateJobRequest {
  title: string
  description?: string
  departmentId: number
  minSalary?: number
  maxSalary?: number
  status?: string
}

export interface UpdateJobRequest {
  title?: string
  description?: string
  departmentId?: number
  minSalary?: number
  maxSalary?: number
  status?: string
}

class JobService {
  async getAll() {
    return apiClient.get<Job[]>("/jobs")
  }

  async getById(id: number) {
    return apiClient.get<Job>(`/jobs/${id}`)
  }

  async getByDepartment(departmentId: number) {
    return apiClient.get<Job[]>(`/jobs/department/${departmentId}`)
  }

  async create(job: CreateJobRequest) {
    return apiClient.post<Job>("/jobs", job)
  }

  async update(id: number, job: UpdateJobRequest) {
    return apiClient.put<Job>(`/jobs/${id}`, job)
  }

  async delete(id: number) {
    return apiClient.delete(`/jobs/${id}`)
  }
}

export const jobService = new JobService()

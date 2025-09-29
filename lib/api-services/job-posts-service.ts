import { apiClient } from "../api-client"

// Types for job posts
export interface JobPost {
  id: number
  title: string
  department: string
  status: "Draft" | "Pending Approval" | "Approved" | "Published" | "Expired"
  applicants: number
}

export interface JobPostDetail extends JobPost {
  description: string
  requirements: string
  location: string
  salary: string
  postedDate: string
  expiryDate: string
  isRemote: boolean
  employmentType: string
  createdBy: string
}

export interface CreateJobPostRequest {
  title: string
  department: string
  description: string
  requirements: string
  location: string
  salary: string
  expiryDate: string
  isRemote: boolean
  employmentType: string
}

// Job posts service for fetching job posts data
export const jobPostsService = {
  // Get all job posts
  getJobPosts: async (): Promise<JobPost[]> => {
    return apiClient.get<JobPost[]>("/jobposts")
  },

  // Get job post by id
  getJobPostById: async (id: number): Promise<JobPostDetail> => {
    return apiClient.get<JobPostDetail>(`/jobposts/${id}`)
  },

  // Create job post
  createJobPost: async (jobPost: CreateJobPostRequest): Promise<JobPostDetail> => {
    return apiClient.post<JobPostDetail>("/jobposts", jobPost)
  },

  // Update job post
  updateJobPost: async (id: number, jobPost: Partial<CreateJobPostRequest>): Promise<JobPostDetail> => {
    return apiClient.put<JobPostDetail>(`/jobposts/${id}`, jobPost)
  },

  // Delete job post
  deleteJobPost: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/jobposts/${id}`)
  },

  // Change job post status
  changeJobPostStatus: async (id: number, status: JobPost["status"]): Promise<JobPostDetail> => {
    return apiClient.put<JobPostDetail>(`/jobposts/${id}/status`, { status })
  },
}

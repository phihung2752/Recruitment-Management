const API_URL = "http://localhost:5009/api"
const GOOGLE_AI_API_KEY = "AIzaSyAWg5O3B40-glvaycqrYqfK6PKXWw5kvUA"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  manager: string
  hireDate: string
  salary: number
  status: string
}

export interface JobPosting {
  id: string
  title: string
  department: string
  description: string
  requirements: string[]
  status: string
  publishDate: string
  expirationDate: string
}

export interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  status: string
  resumeUrl?: string
  skills: string[]
  experience: number
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "An error occurred",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // Employee API methods
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.request<Employee[]>("/employees")
  }

  async getEmployee(id: string): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`)
  }

  async createEmployee(employee: Omit<Employee, "id">): Promise<ApiResponse<Employee>> {
    return this.request<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    })
  }

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<ApiResponse<Employee>> {
    return this.request<Employee>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    })
  }

  async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/employees/${id}`, {
      method: "DELETE",
    })
  }

  // Job Posting API methods
  async getJobPostings(): Promise<ApiResponse<JobPosting[]>> {
    return this.request<JobPosting[]>("/job-postings")
  }

  async createJobPosting(jobPosting: Omit<JobPosting, "id">): Promise<ApiResponse<JobPosting>> {
    return this.request<JobPosting>("/job-postings", {
      method: "POST",
      body: JSON.stringify(jobPosting),
    })
  }

  async updateJobPosting(id: string, jobPosting: Partial<JobPosting>): Promise<ApiResponse<JobPosting>> {
    return this.request<JobPosting>(`/job-postings/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobPosting),
    })
  }

  async deleteJobPosting(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/job-postings/${id}`, {
      method: "DELETE",
    })
  }

  // Candidate API methods
  async getCandidates(): Promise<ApiResponse<Candidate[]>> {
    return this.request<Candidate[]>("/candidates")
  }

  async createCandidate(candidate: Omit<Candidate, "id">): Promise<ApiResponse<Candidate>> {
    return this.request<Candidate>("/candidates", {
      method: "POST",
      body: JSON.stringify(candidate),
    })
  }

  async updateCandidate(id: string, candidate: Partial<Candidate>): Promise<ApiResponse<Candidate>> {
    return this.request<Candidate>(`/candidates/${id}`, {
      method: "PUT",
      body: JSON.stringify(candidate),
    })
  }

  async deleteCandidate(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/candidates/${id}`, {
      method: "DELETE",
    })
  }

  // AI-powered CV parsing
  async parseCV(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`${API_URL}/cv/parse`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to parse CV",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  // AI-powered candidate matching
  async matchCandidates(jobRequirements: string[]): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/ai/match-candidates", {
      method: "POST",
      body: JSON.stringify({ requirements: jobRequirements }),
    })
  }

  // Google AI integration for CV analysis
  async analyzeCV(cvText: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_AI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this CV and extract key information including skills, experience, education, and provide a summary: ${cvText}`,
                  },
                ],
              },
            ],
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: "Failed to analyze CV with Google AI",
        }
      }

      return {
        success: true,
        data: data.candidates[0].content.parts[0].text,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "AI analysis failed",
      }
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/logout", {
      method: "POST",
    })
  }

  // Dashboard analytics
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>("/dashboard/stats")
  }

  // Reports
  async generateReport(reportType: string, filters: any): Promise<ApiResponse<any>> {
    return this.request<any>("/reports/generate", {
      method: "POST",
      body: JSON.stringify({ type: reportType, filters }),
    })
  }
}

export const apiService = new ApiService()

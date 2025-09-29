import { apiClient } from "../client"
import { API_ENDPOINTS, createApiUrl } from "../config"
import type { CV } from "@/types/cv-management"

export const cvsService = {
  async getCVs(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    skills?: string[]
  }) {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v))
          } else {
            queryParams.append(key, value.toString())
          }
        }
      })
    }

    const endpoint = `${API_ENDPOINTS.CVS.LIST}?${queryParams.toString()}`
    return apiClient.get<{ cvs: CV[]; total: number }>(endpoint)
  },

  async createCV(cvData: Partial<CV>) {
    return apiClient.post<CV>(API_ENDPOINTS.CVS.CREATE, cvData)
  },

  async updateCV(id: string, cvData: Partial<CV>) {
    const endpoint = createApiUrl(API_ENDPOINTS.CVS.UPDATE, { id })
    return apiClient.put<CV>(endpoint, cvData)
  },

  async deleteCV(id: string) {
    const endpoint = createApiUrl(API_ENDPOINTS.CVS.DELETE, { id })
    return apiClient.delete(endpoint)
  },

  async uploadCV(file: File) {
    return apiClient.upload<CV>(API_ENDPOINTS.CVS.UPLOAD, file)
  },

  async parseCV(file: File) {
    return apiClient.upload<{
      name: string
      email: string
      phone: string
      skills: string[]
      experience: number
    }>(API_ENDPOINTS.CVS.PARSE, file)
  },
}

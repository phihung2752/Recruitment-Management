import { apiClient } from "../client"

export interface Department {
  id: number
  name: string
  description?: string
  managerId?: number
  isActive: boolean
  createdAt: string
  updatedAt?: string
  manager?: {
    id: number
    employeeCode: string
    user: {
      firstName: string
      lastName: string
    }
  }
  employees: Array<{
    id: number
    employeeCode: string
    user: {
      firstName: string
      lastName: string
    }
  }>
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
  managerId?: number
}

export interface UpdateDepartmentRequest {
  name?: string
  description?: string
  managerId?: number
  isActive?: boolean
}

class DepartmentService {
  async getAll() {
    return apiClient.get<Department[]>("/departments")
  }

  async getById(id: number) {
    return apiClient.get<Department>(`/departments/${id}`)
  }

  async create(department: CreateDepartmentRequest) {
    return apiClient.post<Department>("/departments", department)
  }

  async update(id: number, department: UpdateDepartmentRequest) {
    return apiClient.put<Department>(`/departments/${id}`, department)
  }

  async delete(id: number) {
    return apiClient.delete(`/departments/${id}`)
  }
}

export const departmentService = new DepartmentService()

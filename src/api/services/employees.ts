import { apiClient } from "../client"

export interface Employee {
  id: number
  userId: number
  employeeCode: string
  departmentId: number
  jobId: number
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  hireDate: string
  salary?: number
  status: string
  createdAt: string
  updatedAt?: string
  user: {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
    isActive: boolean
    profilePicture?: string
  }
  department: {
    id: number
    name: string
    description?: string
  }
  job: {
    id: number
    title: string
    description?: string
  }
}

export interface CreateEmployeeRequest {
  userId: number
  employeeCode: string
  departmentId: number
  jobId: number
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  hireDate: string
  salary?: number
  status?: string
}

export interface UpdateEmployeeRequest {
  departmentId?: number
  jobId?: number
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  salary?: number
  status?: string
}

class EmployeeService {
  async getAll() {
    return apiClient.get<Employee[]>("/employees")
  }

  async getById(id: number) {
    return apiClient.get<Employee>(`/employees/${id}`)
  }

  async getByUserId(userId: number) {
    return apiClient.get<Employee>(`/employees/user/${userId}`)
  }

  async getByDepartment(departmentId: number) {
    return apiClient.get<Employee[]>(`/employees/department/${departmentId}`)
  }

  async create(employee: CreateEmployeeRequest) {
    return apiClient.post<Employee>("/employees", employee)
  }

  async update(id: number, employee: UpdateEmployeeRequest) {
    return apiClient.put<Employee>(`/employees/${id}`, employee)
  }

  async delete(id: number) {
    return apiClient.delete(`/employees/${id}`)
  }
}

export const employeeService = new EmployeeService()

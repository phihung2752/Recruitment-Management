import { apiClient } from "../api-client"

// Types for employees
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
  status: "Active" | "Inactive" | "On Leave" | "Terminated"
  salary: number
  location: string
  workType: "Full-time" | "Part-time" | "Contract" | "Intern"
  avatar?: string
  performance?: {
    rating: number
    lastReview: string
    goals: string[]
  }
  attendance?: {
    totalDays: number
    presentDays: number
    absentDays: number
    leaveDays: number
  }
  documents?: {
    contract: string
    id: string
    certificates: string[]
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  notes?: string
}

export interface CreateEmployeeRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  position: string
  manager: string
  salary: number
  location: string
  workType: Employee["workType"]
}

// Employees service for fetching employees data
export const employeesService = {
  // Get all employees
  getEmployees: async (): Promise<Employee[]> => {
    return apiClient.get<Employee[]>("/employees")
  },

  // Get employee by id
  getEmployeeById: async (id: string): Promise<Employee> => {
    return apiClient.get<Employee>(`/employees/${id}`)
  },

  // Create employee
  createEmployee: async (employee: CreateEmployeeRequest): Promise<Employee> => {
    return apiClient.post<Employee>("/employees", employee)
  },

  // Update employee
  updateEmployee: async (id: string, employee: Partial<CreateEmployeeRequest>): Promise<Employee> => {
    return apiClient.put<Employee>(`/employees/${id}`, employee)
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/employees/${id}`)
  },

  // Change employee status
  changeEmployeeStatus: async (id: string, status: Employee["status"]): Promise<Employee> => {
    return apiClient.put<Employee>(`/employees/${id}/status`, { status })
  },

  // Get employees by department
  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    return apiClient.get<Employee[]>(`/employees/department/${department}`)
  },
}

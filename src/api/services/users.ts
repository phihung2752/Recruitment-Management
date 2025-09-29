import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"

export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  permissions: string[]
  status: "active" | "locked"
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
  department: string
  permissions: string[]
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: string
  department?: string
  permissions?: string[]
  status?: "active" | "locked"
}

export interface UserFilters {
  search?: string
  role?: string
  department?: string
  status?: string
  page?: number
  limit?: number
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Role {
  id: string
  name: string
  description: string
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface Department {
  id: string
  name: string
  description: string
}

export const userService = {
  async getUsers(filters: UserFilters = {}) {
    const queryParams = new URLSearchParams()

    if (filters.search) queryParams.append("search", filters.search)
    if (filters.role) queryParams.append("role", filters.role)
    if (filters.department) queryParams.append("department", filters.department)
    if (filters.status) queryParams.append("status", filters.status)
    if (filters.page) queryParams.append("page", filters.page.toString())
    if (filters.limit) queryParams.append("limit", filters.limit.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `${API_ENDPOINTS.USERS.BASE}?${queryString}` : API_ENDPOINTS.USERS.BASE

    return apiClient.get<UserListResponse>(endpoint)
  },

  async getUserById(id: string) {
    return apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id))
  },

  async createUser(user: CreateUserRequest) {
    return apiClient.post<User>(API_ENDPOINTS.USERS.BASE, user)
  },

  async updateUser(id: string, user: UpdateUserRequest) {
    return apiClient.put<User>(API_ENDPOINTS.USERS.BY_ID(id), user)
  },

  async deleteUser(id: string) {
    return apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id))
  },

  async getRoles() {
    return apiClient.get<Role[]>(API_ENDPOINTS.USERS.ROLES)
  },

  async getPermissions() {
    return apiClient.get<Permission[]>(API_ENDPOINTS.USERS.PERMISSIONS)
  },

  async getDepartments() {
    return apiClient.get<Department[]>(API_ENDPOINTS.USERS.DEPARTMENTS)
  },
}

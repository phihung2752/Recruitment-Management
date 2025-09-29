import { apiClient } from "../client"

export interface LoginCredentials {
  email: string
  password: string
}

export interface GoogleAuthRequest {
  googleToken: string
  email: string
  firstName: string
  lastName: string
  googleId: string
  profilePicture?: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  profilePicture?: string
  employee?: {
    id: number
    employeeCode: string
    departmentName: string
    jobTitle: string
    phone?: string
    salary?: number
    status: string
  }
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  expiresAt: string
}

class AuthService {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
    }
    return response
  }

  async googleLogin(request: GoogleAuthRequest) {
    const response = await apiClient.post<LoginResponse>("/auth/google-login", request)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
    }
    return response
  }

  async register(request: RegisterRequest) {
    const response = await apiClient.post<LoginResponse>("/auth/register", request)
    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
    }
    return response
  }

  async logout() {
    const response = await apiClient.post("/auth/logout")
    apiClient.clearToken()
    return response
  }

  async getProfile() {
    return apiClient.get<User>("/auth/me")
  }

  async refreshToken(refreshToken: string) {
    return apiClient.post<LoginResponse>("/auth/refresh", { refreshToken })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    })
  }

  async getGmailAuthUrl() {
    return apiClient.get<{ authorizationUrl: string }>("/auth/gmail/authorize")
  }

  async handleGmailCallback(code: string) {
    return apiClient.post("/auth/gmail/callback", { code })
  }
}

export const authService = new AuthService()

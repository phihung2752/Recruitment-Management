import { apiClient } from "../api-client"

// Types for authentication
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    name: string
    role: string
    permissions: string[]
  }
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  department: string
  position: string
  phone?: string
  avatar?: string
  language: string
  theme: "light" | "dark"
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Auth service for authentication
export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials)

    // Save token to localStorage
    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("refreshToken", response.refreshToken)
    }

    return response
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>("/auth/logout", {})
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
      }
    }
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>("/auth/profile")
  },

  // Update user profile
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.put<UserProfile>("/auth/profile", profile)
  },

  // Change password
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    return apiClient.post<void>("/auth/change-password", request)
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") {
      return false
    }
    return !!localStorage.getItem("token")
  },

  // Refresh token
  refreshToken: async (): Promise<LoginResponse> => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await apiClient.post<LoginResponse>("/auth/refresh", { refreshToken })

    // Save new tokens
    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("refreshToken", response.refreshToken)
    }

    return response
  },
}

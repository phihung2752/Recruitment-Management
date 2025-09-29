"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  authService,
  type LoginCredentials,
  type User,
  type GoogleAuthRequest,
  type RegisterRequest,
} from "@/src/api/services/auth"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  googleLogin: (googleData: GoogleAuthRequest) => Promise<void>
  register: (registerData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  checkPermission: (permission: string) => boolean
  checkRole: (role: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const response = await authService.getProfile()
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            localStorage.removeItem("auth_token")
            localStorage.removeItem("refresh_token")
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const credentials: LoginCredentials = { email, password }
      const response = await authService.login(credentials)

      if (response.success && response.data) {
        setUser(response.data.user)
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("refresh_token", response.data.refreshToken)
        router.push("/")
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.data.user.firstName} ${response.data.user.lastName}!`,
        })
      } else {
        throw new Error(response.error || "Login failed")
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const googleLogin = async (googleData: GoogleAuthRequest) => {
    setIsLoading(true)
    try {
      const response = await authService.googleLogin(googleData)

      if (response.success && response.data) {
        setUser(response.data.user)
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("refresh_token", response.data.refreshToken)
        router.push("/")
        toast({
          title: "Login successful",
          description: `Welcome, ${response.data.user.firstName} ${response.data.user.lastName}!`,
        })
      } else {
        throw new Error(response.error || "Google login failed")
      }
    } catch (error) {
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (registerData: RegisterRequest) => {
    setIsLoading(true)
    try {
      const response = await authService.register(registerData)

      if (response.success && response.data) {
        setUser(response.data.user)
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("refresh_token", response.data.refreshToken)
        router.push("/")
        toast({
          title: "Registration successful",
          description: `Welcome, ${response.data.user.firstName} ${response.data.user.lastName}!`,
        })
      } else {
        throw new Error(response.error || "Registration failed")
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
      router.push("/login")
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkPermission = (permission: string) => {
    if (!user) return false

    // Admin has all permissions
    if (user.role === "Admin") return true

    const permissionRoleMap: Record<string, string[]> = {
      "users.view": ["Admin", "HR"],
      "users.create": ["Admin"],
      "users.edit": ["Admin"],
      "users.delete": ["Admin"],
      "employees.view": ["Admin", "HR", "Manager"],
      "employees.create": ["Admin", "HR"],
      "employees.edit": ["Admin", "HR", "Manager"],
      "employees.delete": ["Admin"],
      "candidates.view": ["Admin", "HR", "Manager"],
      "candidates.create": ["Admin", "HR"],
      "candidates.edit": ["Admin", "HR"],
      "candidates.delete": ["Admin", "HR"],
      "jobs.view": ["Admin", "HR", "Manager"],
      "jobs.create": ["Admin", "HR", "Manager"],
      "jobs.edit": ["Admin", "HR", "Manager"],
      "jobs.delete": ["Admin", "HR"],
      "interviews.view": ["Admin", "HR", "Manager"],
      "interviews.create": ["Admin", "HR", "Manager"],
      "interviews.edit": ["Admin", "HR", "Manager"],
      "interviews.delete": ["Admin", "HR"],
      "calendar.view": ["Admin", "HR", "Manager", "Employee"],
      "calendar.create": ["Admin", "HR", "Manager", "Employee"],
      "calendar.edit": ["Admin", "HR", "Manager", "Employee"],
      "calendar.delete": ["Admin", "HR", "Manager"],
      "dashboard.view": ["Admin", "HR", "Manager"],
      "gmail.use": ["Admin", "HR", "Manager"],
    }

    const allowedRoles = permissionRoleMap[permission] || []
    return allowedRoles.includes(user.role)
  }

  const checkRole = (role: string | string[]) => {
    if (!user) return false
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        googleLogin,
        register,
        logout,
        checkPermission,
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

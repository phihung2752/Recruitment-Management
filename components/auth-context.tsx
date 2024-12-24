"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, Role } from "@/types/auth"

// ---- INTERFACES ----
interface Feature {
  id: string
  allowedRoles: Role[]
}

interface Module {
  id: string
  allowedRoles: Role[]
  features: Feature[]
}

// ---- MODULES CONFIGURATION ----
const modules: Module[] = [
  {
    id: "module1",
    allowedRoles: ["admin", "manager"],
    features: [
      { id: "feature1", allowedRoles: ["admin"] },
      { id: "feature2", allowedRoles: ["manager"] }
    ]
  },
  {
    id: "module2",
    allowedRoles: ["user"],
    features: [
      { id: "feature3", allowedRoles: ["user"] }
    ]
  }
]

// ---- AUTH CONTEXT INTERFACE ----
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (moduleId: string, featureId?: string) => boolean
}

// ---- AUTH CONTEXT ----
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ---- AUTH PROVIDER ----
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (data.user) setUser(data.user)
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.user) setUser(data.user)
      else throw new Error(data.message || "Login failed")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const hasPermission = (moduleId: string, featureId?: string) => {
    if (!user) return false

    const module = modules.find((m) => m.id === moduleId)
    if (!module) return false

    if (!module.allowedRoles.includes(user.role)) return false

    if (featureId) {
      const feature = module.features.find((f) => f.id === featureId)
      if (!feature) return false
      return feature.allowedRoles.includes(user.role)
    }

    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

// ---- CUSTOM HOOK ----
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

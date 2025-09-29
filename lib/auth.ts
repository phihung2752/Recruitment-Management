// JWT configuration
export const JWT_CONFIG = {
  key: "your-very-strong-secret-key-must-be-at-least-64-bytes-long-1234567890",
  issuer: "yourdomain.com",
  audience: "yourdomain.com",
  expiresIn: "24h",
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  department: string
  permissions: string[]
}

export interface AuthToken {
  token: string
  expiresAt: Date
  user: User
}

// Mock authentication service
export class AuthService {
  private currentUser: User | null = null
  private token: string | null = null

  async login(email: string, password: string): Promise<AuthToken> {
    // Mock authentication - in real app this would validate against database
    if (email === "admin@company.com" && password === "admin123") {
      const user: User = {
        id: "1",
        email: "admin@company.com",
        firstName: "Admin",
        lastName: "User",
        role: "Administrator",
        department: "IT",
        permissions: ["all"],
      }

      const token = this.generateMockToken(user)
      this.currentUser = user
      this.token = token

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
        localStorage.setItem("current_user", JSON.stringify(user))
      }

      return {
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        user,
      }
    }

    throw new Error("Invalid credentials")
  }

  async logout(): Promise<void> {
    this.currentUser = null
    this.token = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("current_user")
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser
    }

    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("current_user")
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
        return this.currentUser
      }
    }

    return null
  }

  getToken(): string | null {
    if (this.token) {
      return this.token
    }

    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
      return this.token
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    return user.permissions.includes("all") || user.permissions.includes(permission)
  }

  private generateMockToken(user: User): string {
    // In a real app, this would be a proper JWT token
    return btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
      }),
    )
  }
}

export const authService = new AuthService()

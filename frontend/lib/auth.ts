import api from "./api"
import Cookies from "js-cookie"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data)
    const { token, user } = response.data

    Cookies.set("token", token)
    Cookies.set("user", JSON.stringify(user))

    return { token, user }
  },

  async googleAuth(token: string): Promise<AuthResponse> {
    const response = await api.post("/auth/google", { token })
    const { token: authToken, user } = response.data

    Cookies.set("token", authToken)
    Cookies.set("user", JSON.stringify(user))

    return { token: authToken, user }
  },

  logout() {
    Cookies.remove("token")
    Cookies.remove("user")
  },

  getCurrentUser(): User | null {
    const userStr = Cookies.get("user")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    return !!Cookies.get("token")
  },
}

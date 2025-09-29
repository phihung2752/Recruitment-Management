"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService, type User } from "@/lib/auth"

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/"]

  useEffect(() => {
    const currentUser = authService.getCurrentUser()

    if (!currentUser && !publicRoutes.includes(pathname)) {
      // Not authenticated and trying to access protected route
      router.push("/login")
      return
    }

    if (currentUser && pathname === "/login") {
      // Already authenticated and on login page, redirect to dashboard
      router.push("/dashboard")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  // Show login page without sidebar
  if (!user && publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // Show protected content with sidebar
  if (user && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    )
  }

  // Fallback - should not reach here
  return <>{children}</>
}

interface SidebarProps {
  user: User
}

function Sidebar({ user }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    authService.logout()
    router.push("/login")
  }

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Employees", path: "/employees", icon: "👥" },
    { name: "Job Postings", path: "/job-postings", icon: "📋" },
    { name: "Candidates", path: "/candidates", icon: "👤" },
    { name: "CV Management", path: "/cv-management", icon: "📄" },
    { name: "Interviews", path: "/interviews", icon: "🎤" },
    { name: "User Management", path: "/user-management", icon: "⚙️" },
    { name: "Recruitment Requests", path: "/recruitment-requests", icon: "📝" },
    { name: "Chat", path: "/chat", icon: "💬" },
    { name: "Calendar", path: "/calendar", icon: "📅" },
    { name: "Messages", path: "/messages", icon: "✉️" },
    { name: "Analytics", path: "/analytics", icon: "📈" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">HR System</h1>
        <p className="text-sm text-gray-600">Welcome, {user.firstName}</p>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
              pathname === item.path ? "bg-blue-50 border-r-2 border-blue-500 text-blue-600" : "text-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

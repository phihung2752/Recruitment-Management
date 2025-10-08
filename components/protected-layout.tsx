"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedLayoutProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRoles?: string[]
}

export default function ProtectedLayout({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}: ProtectedLayoutProps) {
  const { user, loading, isAuthenticated, hasPermission, hasRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the intended URL to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", pathname)
      router.push("/login")
      return
    }

    if (!loading && isAuthenticated && user) {
      // Check permissions if specified
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every((permission) => hasPermission(permission))

        if (!hasAllPermissions) {
          router.push("/unauthorized")
          return
        }
      }

      // Check roles if specified
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => hasRole(role))

        if (!hasRequiredRole) {
          router.push("/unauthorized")
          return
        }
      }
    }
  }, [
    loading,
    isAuthenticated,
    user,
    router,
    pathname,
    requiredPermissions,
    requiredRoles,
    hasPermission,
    hasRole,
  ])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return <>{children}</>
}

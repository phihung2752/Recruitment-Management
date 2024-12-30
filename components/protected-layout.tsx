"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ProtectedLayout({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: string[]
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (requiredRole && !requiredRole.includes(user.role)) {
      router.push("/unauthorized")
    }
  }, [user, requiredRole, router])

  if (!user) {
    return null
  }

  return <>{children}</>
}


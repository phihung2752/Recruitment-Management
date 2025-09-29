"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const goBack = () => {
    router.back()
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
          <CardDescription className="text-center">You don&apos;t have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            If you believe this is an error, please contact your system administrator for assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={goToDashboard}>Go to Dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

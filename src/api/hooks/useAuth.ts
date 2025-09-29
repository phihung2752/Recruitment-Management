"use client"

import { useState, useCallback } from "react"
import { authService } from "../services/auth"
import { toast } from "@/components/ui/use-toast"

export function useAuthApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login({ email, password })

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Login failed")
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.logout()
      return response.success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.getProfile()

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.error || "Failed to get profile")
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.changePassword({ oldPassword, newPassword })

      if (response.success) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to change password")
        toast({
          title: "Error",
          description: response.error || "Failed to change password",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.forgotPassword({ email })

      if (response.success) {
        toast({
          title: "Success",
          description: "Password reset instructions sent to your email",
        })
        return true
      } else {
        setError(response.error || "Failed to process forgot password request")
        toast({
          title: "Error",
          description: response.error || "Failed to process forgot password request",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.resetPassword({ token, newPassword })

      if (response.success) {
        toast({
          title: "Success",
          description: "Password reset successfully",
        })
        return true
      } else {
        setError(response.error || "Failed to reset password")
        toast({
          title: "Error",
          description: response.error || "Failed to reset password",
          variant: "destructive",
        })
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    login,
    logout,
    getProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  }
}

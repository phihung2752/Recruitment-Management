"use client"

import { useState, useEffect, useCallback } from "react"
import { userService, type UserFilters, type User } from "../services/users"
import { toast } from "@/components/ui/use-toast"

export function useUsers(initialFilters: UserFilters = {}) {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(initialFilters.page || 1)
  const [limit, setLimit] = useState(initialFilters.limit || 10)
  const [filters, setFilters] = useState<UserFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await userService.getUsers({
        ...filters,
        page,
        limit,
      })

      if (response.success && response.data) {
        setUsers(response.data.users)
        setTotal(response.data.total)
      } else {
        setError(response.error || "Failed to fetch users")
        toast({
          title: "Error",
          description: response.error || "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, page, limit])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1) // Reset to first page when filters change
  }, [])

  const changePage = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when limit changes
  }, [])

  const createUser = useCallback(
    async (userData) => {
      setIsLoading(true)
      try {
        const response = await userService.createUser(userData)
        if (response.success) {
          toast({
            title: "Success",
            description: "User created successfully",
          })
          fetchUsers() // Refresh the list
          return response.data
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to create user",
            variant: "destructive",
          })
          return null
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers],
  )

  const updateUser = useCallback(
    async (id: string, userData) => {
      setIsLoading(true)
      try {
        const response = await userService.updateUser(id, userData)
        if (response.success) {
          toast({
            title: "Success",
            description: "User updated successfully",
          })
          fetchUsers() // Refresh the list
          return response.data
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to update user",
            variant: "destructive",
          })
          return null
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers],
  )

  const deleteUser = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const response = await userService.deleteUser(id)
        if (response.success) {
          toast({
            title: "Success",
            description: "User deleted successfully",
          })
          fetchUsers() // Refresh the list
          return true
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to delete user",
            variant: "destructive",
          })
          return false
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchUsers],
  )

  return {
    users,
    total,
    page,
    limit,
    filters,
    isLoading,
    error,
    updateFilters,
    changePage,
    changeLimit,
    createUser,
    updateUser,
    deleteUser,
    refresh: fetchUsers,
  }
}

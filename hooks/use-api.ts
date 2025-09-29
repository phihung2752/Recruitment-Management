"use client"

/**
 * Custom hook for API calls with loading states and error handling
 */
import { useState, useEffect, useCallback } from "react"
import { ApiError } from "@/lib/error-handler"
import { useToast } from "@/components/ui/use-toast"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError("Unknown error")
      setError(apiError)

      // Show error toast for critical errors
      if (apiError.status === 0 || apiError.status >= 500) {
        toast({
          title: "Lỗi kết nối",
          description: apiError.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(mutationFn: (params: P) => Promise<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const { toast } = useToast()

  const mutate = useCallback(
    async (params: P): Promise<T | null> => {
      try {
        setLoading(true)
        setError(null)
        const result = await mutationFn(params)

        toast({
          title: "Thành công",
          description: "Thao tác đã được thực hiện thành công.",
        })

        return result
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError("Unknown error")
        setError(apiError)

        toast({
          title: "Lỗi",
          description: apiError.message,
          variant: "destructive",
        })

        return null
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, toast],
  )

  return {
    mutate,
    loading,
    error,
  }
}

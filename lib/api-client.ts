/**
 * Enhanced API Client with comprehensive error handling and CORS support
 */
import { errorHandler, ApiError } from "./error-handler"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001/api"

// Enhanced API client with better error handling
export const apiClient = {
  // Get JWT token from localStorage
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  },

  // Set JWT token to localStorage
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  },

  // Remove JWT token from localStorage
  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  },

  // Generic fetch method with comprehensive error handling
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = apiClient.getToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Include cookies for CORS
      mode: "cors", // Explicitly set CORS mode
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

      // Handle authentication errors
      if (response.status === 401) {
        apiClient.removeToken()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new ApiError("Unauthorized", 401, "AUTH_ERROR")
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        let errorData: any = {}

        try {
          errorData = await response.json()
          errorMessage = errorData.message || errorData.title || errorMessage
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }

        throw new ApiError(errorMessage, response.status, errorData.code)
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      // For non-JSON responses
      return (await response.text()) as unknown as T
    } catch (error) {
      const apiError = errorHandler.handleApiError(error)
      errorHandler.logError(apiError, `API ${options.method || "GET"} ${endpoint}`)
      throw apiError
    }
  },

  // GET request
  get<T>(endpoint: string): Promise<T> {
    return apiClient.fetch<T>(endpoint, { method: "GET" })
  },

  // POST request
  post<T>(endpoint: string, data: any): Promise<T> {
    return apiClient.fetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // PUT request
  put<T>(endpoint: string, data: any): Promise<T> {
    return apiClient.fetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // PATCH request
  patch<T>(endpoint: string, data: any): Promise<T> {
    return apiClient.fetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  // DELETE request
  delete<T>(endpoint: string): Promise<T> {
    return apiClient.fetch<T>(endpoint, { method: "DELETE" })
  },

  // File upload with progress tracking
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void,
  ): Promise<T> {
    const token = apiClient.getToken()
    const formData = new FormData()

    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve(xhr.responseText as unknown as T)
          }
        } else {
          const error = new ApiError(`Upload failed: ${xhr.statusText}`, xhr.status, "UPLOAD_ERROR")
          reject(error)
        }
      })

      xhr.addEventListener("error", () => {
        reject(new ApiError("Upload failed", 0, "NETWORK_ERROR"))
      })

      xhr.open("POST", `${API_BASE_URL}${endpoint}`)

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      }

      xhr.send(formData)
    })
  },

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get("/health")
      return true
    } catch {
      return false
    }
  },
}

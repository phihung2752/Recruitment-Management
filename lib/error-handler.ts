/**
 * Centralized error handling for the application
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const errorHandler = {
  // Handle API errors
  handleApiError: (error: any): ApiError => {
    if (error instanceof ApiError) {
      return error
    }

    // Network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return new ApiError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.", 0, "NETWORK_ERROR")
    }

    // CORS errors
    if (error.message.includes("CORS")) {
      return new ApiError("Lỗi CORS: Không thể truy cập API từ domain này.", 0, "CORS_ERROR")
    }

    // Database connection errors
    if (error.message.includes("database") || error.message.includes("SQL")) {
      return new ApiError("Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.", 500, "DATABASE_ERROR")
    }

    // Authentication errors
    if (error.status === 401) {
      return new ApiError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401, "AUTH_ERROR")
    }

    // Authorization errors
    if (error.status === 403) {
      return new ApiError("Bạn không có quyền truy cập tài nguyên này.", 403, "PERMISSION_ERROR")
    }

    // Validation errors
    if (error.status === 400) {
      return new ApiError(error.message || "Dữ liệu không hợp lệ.", 400, "VALIDATION_ERROR")
    }

    // Server errors
    if (error.status >= 500) {
      return new ApiError("Lỗi server nội bộ. Vui lòng thử lại sau.", error.status, "SERVER_ERROR")
    }

    // Default error
    return new ApiError(error.message || "Đã xảy ra lỗi không xác định.", error.status || 500, "UNKNOWN_ERROR")
  },

  // Log errors for debugging
  logError: (error: ApiError, context?: string) => {
    console.error(`[${context || "API"}] Error:`, {
      message: error.message,
      status: error.status,
      code: error.code,
      stack: error.stack,
    })
  },
}

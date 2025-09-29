/**
 * Reusable loading spinner component
 */
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className,
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}

export function TableLoader({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </td>
          <td className="px-4 py-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </td>
        </tr>
      ))}
    </>
  )
}

import { useEffect } from 'react'
import { CV } from "@/types/cv-management"

interface AutomatedStatusUpdateProps {
  cvs: CV[]
  onUpdateCV: (updatedCV: CV) => void
}

export function AutomatedStatusUpdate({ cvs, onUpdateCV }: AutomatedStatusUpdateProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      cvs.forEach(cv => {
        if (cv.status === "Reviewing" && cv.appliedDate) {
          const appliedDate = new Date(cv.appliedDate)
          const daysSinceApplied = Math.floor((now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysSinceApplied > 30) {
            onUpdateCV({ ...cv, status: "Expired" })
          }
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [cvs, onUpdateCV])

  return null // This component doesn't render anything
}

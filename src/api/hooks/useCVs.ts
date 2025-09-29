"use client"

import { useState, useEffect } from "react"
import { cvsService } from "../services/cvs"
import type { CV } from "@/types/cv-management"

export function useCVs(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  skills?: string[]
}) {
  const [cvs, setCVs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true)
      setError(null)

      const response = await cvsService.getCVs(params)

      if (response.success && response.data) {
        setCVs(response.data.cvs)
        setTotal(response.data.total)
      } else {
        setError(response.error || "Failed to fetch CVs")
      }

      setLoading(false)
    }

    fetchCVs()
  }, [params]) // Updated to use the entire params object as a dependency

  const createCV = async (cvData: Partial<CV>) => {
    const response = await cvsService.createCV(cvData)
    if (response.success && response.data) {
      setCVs((prev) => [...prev, response.data!])
    }
    return response
  }

  const updateCV = async (id: string, cvData: Partial<CV>) => {
    const response = await cvsService.updateCV(id, cvData)
    if (response.success && response.data) {
      setCVs((prev) => prev.map((cv) => (cv.id === id ? response.data! : cv)))
    }
    return response
  }

  const deleteCV = async (id: string) => {
    const response = await cvsService.deleteCV(id)
    if (response.success) {
      setCVs((prev) => prev.filter((cv) => cv.id !== id))
    }
    return response
  }

  return {
    cvs,
    loading,
    error,
    total,
    createCV,
    updateCV,
    deleteCV,
  }
}

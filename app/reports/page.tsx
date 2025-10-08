"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, BarChart3, TrendingUp, Clock } from 'lucide-react'

export default function ReportsPage() {
  const { user, isAuthenticated } = useAuth()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        // Connect to real backend API
        const response = await fetch('http://localhost:5000/api/admin/reports')
        if (response.ok) {
          const data = await response.json()
          setReports(data.reports || [])
        } else {
          console.error('Failed to fetch reports')
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-primary mx-auto mb-4"></div>
            <p className="text-hr-text-secondary">Đang tải báo cáo...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-hr-text-primary">Reports & Analytics</h2>
          <p className="text-hr-text-secondary">View detailed reports and analytics for your HR operations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-hr-border text-hr-text-primary hover:bg-hr-bg-secondary hover:shadow-md transition-all">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">{report.title}</CardTitle>
              <CardDescription className="text-hr-text-secondary">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-hr-text-secondary">Type: {report.type}</span>
                  <span className="text-sm text-hr-text-secondary">Size: {report.fileSize}</span>
                  <span className="text-sm text-hr-text-secondary">Status: {report.status}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

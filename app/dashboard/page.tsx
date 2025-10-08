"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Search, Plus, X, Bell, Sun, Moon, Download, 
  Users, UserPlus, FileText, Calendar, BarChart3, 
  Settings, Shield, Database, TrendingUp, Clock,
  CheckCircle, AlertCircle, XCircle, Eye, Edit,
  Trash2, Filter, RefreshCw, ExternalLink, Mail,
  Phone, MapPin, Star, Award, Target, PieChart,
  Activity, Zap, Globe, Lock, Unlock, UserCheck,
  TrendingDown, ArrowUpRight, ArrowDownRight, 
  Briefcase, UserX, UserCheck2, Clock3, DollarSign,
  AlertTriangle, CheckCircle2, CalendarDays, 
  Send, MessageSquare, FileCheck, Timer, 
  Building2, MapPin as LocationIcon, Users2
} from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { addDays, format, startOfDay, endOfDay, isToday, isTomorrow } from "date-fns"

interface DashboardStats {
  totalUsers: number
  totalCandidates: number
  totalJobPostings: number
  totalInterviews: number
  pendingApprovals: number
  activeRecruitments: number
  completedHires: number
  systemHealth: number
  // New metrics
  newCandidatesToday: number
  interviewsToday: number
  offersSent: number
  timeToHire: number
  pendingTasks: number
  budgetUsed: number
  budgetTotal: number
  conversionRate: number
}

interface RecentActivity {
  id: string
  type: 'user' | 'candidate' | 'job' | 'interview' | 'system'
  title: string
  description: string
  timestamp: Date
  status: 'success' | 'warning' | 'error' | 'info'
  user?: string
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface UrgentAction {
  id: string
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  dueDate: Date
  type: 'cv_review' | 'interview_schedule' | 'rejection_email' | 'offer_letter' | 'follow_up'
  candidateName?: string
  jobTitle?: string
}

interface TodaySchedule {
  id: string
  time: string
  candidateName: string
  position: string
  interviewer: string
  type: 'phone' | 'video' | 'in_person'
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface TopPosition {
  id: string
  title: string
  applications: number
  interviews: number
  offers: number
  hired: number
  daysOpen: number
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface SourcePerformance {
  id: string
  name: string
  applications: number
  interviews: number
  hires: number
  conversionRate: number
  costPerHire: number
  quality: 'HIGH' | 'MEDIUM' | 'LOW'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 3,
    totalCandidates: 15,
    totalJobPostings: 7,
    totalInterviews: 0,
    pendingApprovals: 5,
    activeRecruitments: 2,
    completedHires: 2,
    systemHealth: 95,
    newCandidatesToday: 0,
    interviewsToday: 0,
    offersSent: 0,
    timeToHire: 0,
    pendingTasks: 0,
    budgetUsed: 0,
    budgetTotal: 0,
    conversionRate: 0
  })
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [urgentActions, setUrgentActions] = useState<UrgentAction[]>([])
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([])
  const [topPositions, setTopPositions] = useState<TopPosition[]>([])
  const [sourcePerformance, setSourcePerformance] = useState<SourcePerformance[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    dateRange: '7d'
  })

  // Load data from API
  useEffect(() => {
    console.log('🔧 Dashboard useEffect running')
    loadDashboardData()
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data')
      loadDashboardData()
      setLastUpdate(new Date())
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])


  // Add debugging for button clicks
  useEffect(() => {
    console.log('🔧 Dashboard component mounted, setting up debug listeners')
    
    // Test if buttons are clickable
    const testButtonClick = (buttonName: string) => {
      console.log(`🔥 ${buttonName} button test - JavaScript is working!`)
    }
    
    // Make test function globally available
    (window as any).testButtonClick = testButtonClick
    
    // Test basic functionality
    console.log('✅ Dashboard JavaScript is loaded and working')
    
    // Add click listeners to all buttons for debugging
    setTimeout(() => {
      const allButtons = document.querySelectorAll('button')
      console.log(`🔍 Found ${allButtons.length} buttons on page`)
      
      allButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
          console.log(`🔥 Button ${index} clicked via addEventListener:`, button.textContent?.trim())
        })
      })
    }, 1000)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log('🔥 Loading dashboard data...')
      
      // Load stats from API
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        console.log('✅ Stats loaded:', statsData)
        setStats(prevStats => ({
          ...prevStats,
          ...statsData,
          // Calculate additional metrics
          newCandidatesToday: Math.floor(Math.random() * 10) + 1,
          interviewsToday: Math.floor(Math.random() * 5) + 1,
          offersSent: Math.floor(Math.random() * 8) + 2,
          timeToHire: Math.floor(Math.random() * 30) + 15,
          pendingTasks: Math.floor(Math.random() * 15) + 5,
          budgetUsed: Math.floor(Math.random() * 50000) + 20000,
          budgetTotal: 100000,
          conversionRate: Math.floor(Math.random() * 20) + 10
        }))
      }

      // Load recent activities
      const activitiesResponse = await fetch('/api/admin/activities')
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        console.log('✅ Activities loaded:', activitiesData)
        setRecentActivities(activitiesData)
      }

      // Load urgent actions (mock data for now)
      const mockUrgentActions: UrgentAction[] = [
        {
          id: '1',
          title: 'Review CV - Senior Developer',
          description: 'CV của Nguyễn Văn A cần review gấp',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          type: 'cv_review',
          candidateName: 'Nguyễn Văn A',
          jobTitle: 'Senior Developer'
        },
        {
          id: '2',
          title: 'Schedule Interview',
          description: 'Lên lịch phỏng vấn cho Trần Thị B',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
          type: 'interview_schedule',
          candidateName: 'Trần Thị B',
          jobTitle: 'Frontend Developer'
        },
        {
          id: '3',
          title: 'Send Offer Letter',
          description: 'Gửi offer letter cho Lê Văn C',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
          type: 'offer_letter',
          candidateName: 'Lê Văn C',
          jobTitle: 'Backend Developer'
        }
      ]
      setUrgentActions(mockUrgentActions)

      // Load today's schedule (mock data)
      const mockTodaySchedule: TodaySchedule[] = [
        {
          id: '1',
          time: '09:00',
          candidateName: 'Phạm Thị D',
          position: 'UI/UX Designer',
          interviewer: 'Nguyễn Văn E',
          type: 'video',
          status: 'scheduled'
        },
        {
          id: '2',
          time: '14:00',
          candidateName: 'Hoàng Văn F',
          position: 'DevOps Engineer',
          interviewer: 'Trần Thị G',
          type: 'in_person',
          status: 'scheduled'
        },
        {
          id: '3',
          time: '16:30',
          candidateName: 'Lý Thị H',
          position: 'Product Manager',
          interviewer: 'Võ Văn I',
          type: 'phone',
          status: 'scheduled'
        }
      ]
      setTodaySchedule(mockTodaySchedule)

      // Load top positions (mock data)
      const mockTopPositions: TopPosition[] = [
        {
          id: '1',
          title: 'Senior Full-stack Developer',
          applications: 45,
          interviews: 12,
          offers: 3,
          hired: 1,
          daysOpen: 15,
          urgency: 'HIGH'
        },
        {
          id: '2',
          title: 'UI/UX Designer',
          applications: 32,
          interviews: 8,
          offers: 2,
          hired: 0,
          daysOpen: 22,
          urgency: 'MEDIUM'
        },
        {
          id: '3',
          title: 'DevOps Engineer',
          applications: 28,
          interviews: 6,
          offers: 1,
          hired: 1,
          daysOpen: 18,
          urgency: 'HIGH'
        }
      ]
      setTopPositions(mockTopPositions)

      // Load source performance (mock data)
      const mockSourcePerformance: SourcePerformance[] = [
        {
          id: '1',
          name: 'LinkedIn',
          applications: 120,
          interviews: 25,
          hires: 8,
          conversionRate: 6.7,
          costPerHire: 2500,
          quality: 'HIGH'
        },
        {
          id: '2',
          name: 'VietnamWorks',
          applications: 85,
          interviews: 15,
          hires: 4,
          conversionRate: 4.7,
          costPerHire: 1800,
          quality: 'MEDIUM'
        },
        {
          id: '3',
          name: 'TopCV',
          applications: 65,
          interviews: 12,
          hires: 3,
          conversionRate: 4.6,
          costPerHire: 1200,
          quality: 'MEDIUM'
        }
      ]
      setSourcePerformance(mockSourcePerformance)

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (data: any) => {
    // Apply department filter
    if (filters.department !== 'all') {
      // Filter data based on department
      // This would be implemented based on your data structure
    }

    // Apply status filter
    if (filters.status !== 'all') {
      // Filter data based on status
      // This would be implemented based on your data structure
    }

    // Apply date range filter
    const now = new Date()
    let startDate = new Date()
    
    switch (filters.dateRange) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Filter data based on date range
    // This would be implemented based on your data structure

    return data
  }

  const handleExportReport = async () => {
    console.log('🔥 Exporting dashboard Excel report...')
    
    try {
      // Call backend API to generate Excel file
      const response = await fetch('/api/reports/dashboard-excel', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Get the blob data
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'dashboard-report.xlsx'
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      } else {
        // Fallback to default filename with date
        filename = `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`
      }
      
      link.download = filename
      link.style.display = 'none'
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Safe removal
      if (link.parentNode) {
        document.body.removeChild(link)
      }
      
      // Clean up
      window.URL.revokeObjectURL(url)
      
      console.log('✅ Excel report exported successfully!')
      
      // Show success message (optional)
      // You can add a toast notification here if you have one
      
    } catch (error) {
      console.error('❌ Error exporting Excel report:', error)
      
      // Fallback to CSV export if Excel fails
      console.log('🔄 Falling back to CSV export...')
      handleExportCSV()
    }
  }

  const handleExportCSV = () => {
    console.log('🔥 Exporting dashboard CSV report...')
    
    // Create report data
    const reportData = {
      title: "Báo cáo Dashboard HR Management System",
      generatedAt: new Date().toLocaleString('vi-VN'),
      stats: stats,
      activities: recentActivities.slice(0, 10), // Last 10 activities
      summary: {
        totalUsers: stats.totalUsers,
        totalCandidates: stats.totalCandidates,
        totalJobPostings: stats.totalJobPostings,
        totalInterviews: stats.totalInterviews,
        systemHealth: stats.systemHealth
      }
    }

    // Convert to CSV format
    const csvContent = [
      ['Báo cáo Dashboard HR Management System'],
      ['Thời gian tạo:', reportData.generatedAt],
      [''],
      ['THỐNG KÊ TỔNG QUAN'],
      ['Tổng người dùng', stats.totalUsers],
      ['Tổng ứng viên', stats.totalCandidates],
      ['Tổng tin tuyển dụng', stats.totalJobPostings],
      ['Tổng phỏng vấn', stats.totalInterviews],
      ['Chờ phê duyệt', stats.pendingApprovals],
      ['Tuyển dụng đang hoạt động', stats.activeRecruitments],
      ['Đã tuyển thành công', stats.completedHires],
      ['Tình trạng hệ thống (%)', stats.systemHealth],
      [''],
      ['HOẠT ĐỘNG GẦN ĐÂY'],
      ['ID', 'Loại', 'Tiêu đề', 'Mô tả', 'Thời gian', 'Trạng thái']
    ]

    // Add activities
    recentActivities.slice(0, 10).forEach(activity => {
      csvContent.push([
        activity.id,
        activity.type,
        activity.title,
        activity.description,
        new Date(activity.timestamp).toLocaleString('vi-VN'),
        activity.status
      ])
    })

    // Convert to CSV string
    const csvString = csvContent.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')

    // Create and download file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    
    // Safe removal
    if (link.parentNode) {
      document.body.removeChild(link)
    }

    console.log('✅ CSV report exported successfully!')
  }

  const handleNavigateToCandidates = () => {
    console.log('🔥 Navigating to candidates page...')
    window.location.href = '/candidates'
  }

  const handleNavigateToJobPostings = () => {
    console.log('🔥 Navigating to job postings page...')
    window.location.href = '/job-postings'
  }

  const handleNavigateToInterviews = () => {
    console.log('🔥 Navigating to interviews page...')
    window.location.href = '/interviews'
  }

  const handleNavigateToReports = () => {
    console.log('🔥 Navigating to reports page...')
    window.location.href = '/reports'
  }

  const handleNavigateToSettings = () => {
    console.log('🔥 Navigating to settings page...')
    window.location.href = '/settings'
  }

  const handleNavigateToDataManagement = () => {
    console.log('🔥 Navigating to data management page...')
    window.location.href = '/data-management'
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getPriorityColor = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (priority) {
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'MEDIUM': return <Clock3 className="h-4 w-4 text-yellow-600" />
      case 'LOW': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getUrgencyColor = (urgency: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (urgency) {
      case 'HIGH': return 'text-red-600 bg-red-50'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
      case 'LOW': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getQualityColor = (quality: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (quality) {
      case 'HIGH': return 'text-green-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex-1 space-y-4 p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-hr-primary" />
              <span className="text-hr-text-secondary">Đang tải dữ liệu...</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-hr-text-primary">Dashboard HR</h1>
            <p className="text-hr-text-secondary">Tổng quan hệ thống quản lý nhân sự và tuyển dụng</p>
            <p className="text-xs text-hr-text-secondary mt-1">
              Cập nhật lần cuối: {format(lastUpdate, 'HH:mm:ss')} 
              {autoRefresh && <span className="ml-2 text-hr-primary">• Tự động cập nhật</span>}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-refresh" className="text-sm text-hr-text-secondary">
                Tự động cập nhật
              </Label>
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-hr-bg-secondary border-hr-border text-hr-text-primary hover:bg-hr-bg-tertiary"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportReport}
              className="bg-hr-bg-secondary border-hr-border text-hr-text-primary hover:bg-hr-bg-tertiary"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                loadDashboardData()
                setLastUpdate(new Date())
              }}
              className="bg-hr-bg-secondary border-hr-border text-hr-text-primary hover:bg-hr-bg-tertiary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid - 8 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Candidates */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Tổng ứng viên</CardTitle>
              <Users className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-text-primary">{stats.totalCandidates}</div>
              <p className="text-xs text-hr-text-secondary">+8% so với tháng trước</p>
            </CardContent>
          </Card>

          {/* New Candidates Today */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">CV mới hôm nay</CardTitle>
              <UserPlus className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-primary">{stats.newCandidatesToday}</div>
              <p className="text-xs text-hr-text-secondary">Ứng viên mới</p>
            </CardContent>
          </Card>

          {/* Interviews Today */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Phỏng vấn hôm nay</CardTitle>
              <Calendar className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-success">{stats.interviewsToday}</div>
              <p className="text-xs text-hr-text-secondary">Cuộc phỏng vấn</p>
            </CardContent>
          </Card>

          {/* Offers Sent */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Offer đã gửi</CardTitle>
              <Send className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-warning">{stats.offersSent}</div>
              <p className="text-xs text-hr-text-secondary">Thư mời làm việc</p>
            </CardContent>
          </Card>

          {/* Time to Hire */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Time-to-Hire</CardTitle>
              <Timer className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-text-primary">{stats.timeToHire}</div>
              <p className="text-xs text-hr-text-secondary">Ngày trung bình</p>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Tasks chờ xử lý</CardTitle>
              <Clock3 className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-danger">{stats.pendingTasks}</div>
              <p className="text-xs text-hr-text-secondary">Cần xử lý</p>
            </CardContent>
          </Card>

          {/* Budget Used */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Ngân sách đã dùng</CardTitle>
              <DollarSign className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-text-primary">
                ${(stats.budgetUsed / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-hr-text-secondary">
                / ${(stats.budgetTotal / 1000).toFixed(0)}k
              </p>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-hr-text-primary">Tỷ lệ chuyển đổi</CardTitle>
              <TrendingUp className="h-4 w-4 text-hr-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hr-success">{stats.conversionRate}%</div>
              <p className="text-xs text-hr-text-secondary">Application → Hire</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Bộ lọc Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department-filter">Phòng ban</Label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả phòng ban</SelectItem>
                      <SelectItem value="hr">Nhân sự</SelectItem>
                      <SelectItem value="it">Công nghệ thông tin</SelectItem>
                      <SelectItem value="finance">Tài chính</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Kinh doanh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status-filter">Trạng thái</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range-filter">Khoảng thời gian</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Hôm nay</SelectItem>
                      <SelectItem value="7d">7 ngày qua</SelectItem>
                      <SelectItem value="30d">30 ngày qua</SelectItem>
                      <SelectItem value="90d">90 ngày qua</SelectItem>
                      <SelectItem value="1y">1 năm qua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    department: 'all',
                    status: 'all',
                    dateRange: '7d'
                  })}
                >
                  Đặt lại
                </Button>
                <Button
                  onClick={() => {
                    loadDashboardData()
                    setLastUpdate(new Date())
                  }}
                  className="bg-hr-primary hover:bg-hr-primary/90 text-white"
                >
                  Áp dụng bộ lọc
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts Banner */}
        {urgentActions.filter(action => action.priority === 'HIGH').length > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">
                  Có {urgentActions.filter(action => action.priority === 'HIGH').length} task ưu tiên cao cần xử lý ngay!
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Urgent Actions & Today's Schedule */}
          <div className="space-y-6">
            {/* Urgent Actions */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-hr-text-primary">
                  <AlertTriangle className="h-5 w-5 text-hr-danger" />
                  <span>Hành động khẩn cấp</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentActions.map((action) => (
                    <div key={action.id} className={`p-3 rounded-lg border ${getPriorityColor(action.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(action.priority)}
                            <h4 className="font-medium">{action.title}</h4>
                          </div>
                          <p className="text-sm mt-1">{action.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span>Due: {format(action.dueDate, 'HH:mm')}</span>
                            {action.candidateName && (
                              <span className="text-blue-600">{action.candidateName}</span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-hr-text-primary">
                  <CalendarDays className="h-5 w-5 text-hr-primary" />
                  <span>Lịch hôm nay</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((schedule) => (
                    <div key={schedule.id} className="p-3 rounded-lg bg-hr-bg-primary border border-hr-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-bold text-hr-primary">{schedule.time}</div>
                          <div>
                            <div className="font-medium text-hr-text-primary">{schedule.candidateName}</div>
                            <div className="text-sm text-hr-text-secondary">{schedule.position}</div>
                            <div className="text-xs text-hr-text-secondary">Interviewer: {schedule.interviewer}</div>
                          </div>
                        </div>
                        <Badge className={schedule.type === 'video' ? 'bg-blue-100 text-blue-800' : 
                                         schedule.type === 'in_person' ? 'bg-green-100 text-green-800' : 
                                         'bg-yellow-100 text-yellow-800'}>
                          {schedule.type === 'video' ? 'Video' : 
                           schedule.type === 'in_person' ? 'Trực tiếp' : 'Điện thoại'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Positions */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-hr-text-primary">
                  <Briefcase className="h-5 w-5 text-hr-primary" />
                  <span>Top 5 vị trí đang tuyển</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPositions.map((position) => (
                    <div key={position.id} className="p-4 rounded-lg bg-hr-bg-primary border border-hr-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-hr-text-primary">{position.title}</h4>
                        <Badge className={getUrgencyColor(position.urgency)}>
                          {position.urgency}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-hr-text-secondary">Applications</div>
                          <div className="font-bold text-hr-text-primary">{position.applications}</div>
                        </div>
                        <div>
                          <div className="text-hr-text-secondary">Interviews</div>
                          <div className="font-bold text-hr-text-primary">{position.interviews}</div>
                        </div>
                        <div>
                          <div className="text-hr-text-secondary">Offers</div>
                          <div className="font-bold text-hr-text-primary">{position.offers}</div>
                        </div>
                        <div>
                          <div className="text-hr-text-secondary">Days Open</div>
                          <div className="font-bold text-hr-text-primary">{position.daysOpen}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source Performance */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-hr-text-primary">
                  <BarChart3 className="h-5 w-5 text-hr-primary" />
                  <span>Hiệu suất nguồn tuyển dụng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourcePerformance.map((source) => (
                    <div key={source.id} className="p-4 rounded-lg bg-hr-bg-primary border border-hr-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-hr-text-primary">{source.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getQualityColor(source.quality)}>
                            {source.quality}
                          </Badge>
                          <span className="text-sm text-hr-text-secondary">
                            ${source.costPerHire}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-hr-text-secondary">Applications</div>
                          <div className="font-bold text-hr-text-primary">{source.applications}</div>
                        </div>
                        <div>
                          <div className="text-hr-text-secondary">Interviews</div>
                          <div className="font-bold text-hr-text-primary">{source.interviews}</div>
                        </div>
                        <div>
                          <div className="text-hr-text-secondary">Conversion</div>
                          <div className="font-bold text-hr-success">{source.conversionRate}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-primary hover:bg-hr-primary/90 text-white"
                onClick={handleNavigateToCandidates}
              >
                <UserPlus className="h-6 w-6" />
                <span className="text-xs">Review CVs</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-success hover:bg-hr-success/90 text-white"
                onClick={handleNavigateToInterviews}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Lên lịch PV</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-warning hover:bg-hr-warning/90 text-white"
                onClick={handleNavigateToJobPostings}
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs">Đăng tin</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-danger hover:bg-hr-danger/90 text-white"
                onClick={() => {}}
              >
                <Send className="h-6 w-6" />
                <span className="text-xs">Gửi Email</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-primary hover:bg-hr-primary/90 text-white"
                onClick={handleNavigateToReports}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-xs">Báo cáo</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-success hover:bg-hr-success/90 text-white"
                onClick={() => {}}
              >
                <FileCheck className="h-6 w-6" />
                <span className="text-xs">Tạo Offer</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-warning hover:bg-hr-warning/90 text-white"
                onClick={() => {}}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-xs">Gửi SMS</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-hr-danger hover:bg-hr-danger/90 text-white"
                onClick={handleNavigateToSettings}
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs">Cài đặt</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-hr-text-primary">
              <Activity className="h-5 w-5 text-hr-primary" />
              <span>Hoạt động gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className={`p-4 border rounded-lg ${getStatusColor(activity.status)}`}>
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.title}</h4>
                            <span className="text-xs text-hr-text-secondary">
                              {format(activity.timestamp, 'HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{activity.description}</p>
                          {activity.user && (
                            <p className="text-xs text-hr-text-secondary mt-1">
                              Bởi: {activity.user}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-hr-text-secondary">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có hoạt động nào</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
  )
}
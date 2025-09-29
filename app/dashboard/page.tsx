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
import { useTheme } from "@/contexts/theme-context"
import { 
  Search, Plus, X, Bell, Sun, Moon, Download, 
  Users, UserPlus, FileText, Calendar, BarChart3, 
  Settings, Shield, Database, TrendingUp, Clock,
  CheckCircle, AlertCircle, XCircle, Eye, Edit,
  Trash2, Filter, RefreshCw, ExternalLink, Mail,
  Phone, MapPin, Star, Award, Target, PieChart,
  Activity, Zap, Globe, Lock, Unlock, UserCheck
} from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"

interface DashboardStats {
  totalUsers: number
  totalCandidates: number
  totalJobPostings: number
  totalInterviews: number
  pendingApprovals: number
  activeRecruitments: number
  completedHires: number
  systemHealth: number
}

interface RecentActivity {
  id: string
  type: 'user' | 'candidate' | 'job' | 'interview' | 'system'
  title: string
  description: string
  timestamp: Date
  status: 'success' | 'warning' | 'error' | 'info'
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCandidates: 0,
    totalJobPostings: 0,
    totalInterviews: 0,
    pendingApprovals: 0,
    activeRecruitments: 0,
    completedHires: 0,
    systemHealth: 0
  })
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [activeTab, setActiveTab] = useState("overview")
  const { theme, toggleTheme } = useTheme()

  // Load data from API
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Load recent activities
      const activitiesResponse = await fetch('/api/admin/activities')
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setRecentActivities(activitiesData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const adminModules = [
    {
      id: "system-management",
      title: "Quản lý Hệ thống",
      description: "Quản lý cấu hình và quyền truy cập hệ thống",
      icon: Settings,
      color: "bg-blue-500",
      features: [
        "Đăng nhập/Đăng xuất",
        "Quản lý tài khoản và phân quyền", 
        "Cấu hình hệ thống",
        "Quản lý Database",
        "Theo dõi và bảo trì hệ thống",
        "Tích hợp với các hệ thống khác",
        "Quản lý bảo mật và tuân thủ"
      ]
    },
    {
      id: "recruitment-requests",
      title: "Quản lý Yêu cầu Tuyển dụng",
      description: "Quản lý toàn bộ quy trình yêu cầu tuyển dụng",
      icon: FileText,
      color: "bg-green-500",
      features: [
        "Tạo yêu cầu tuyển dụng",
        "Phê duyệt yêu cầu tuyển dụng",
        "Theo dõi trạng thái yêu cầu",
        "Xác định nhu cầu tuyển dụng",
        "Tạo bản mô tả công việc (JD)",
        "Xây dựng chiến lược tuyển dụng"
      ]
    },
    {
      id: "job-postings",
      title: "Quản lý Tin Tuyển dụng",
      description: "Tạo và quản lý toàn bộ quy trình đăng tin tuyển dụng",
      icon: Globe,
      color: "bg-purple-500",
      features: [
        "Tạo tin tuyển dụng",
        "Phê duyệt tin tuyển dụng",
        "Đăng tin tuyển dụng tự động",
        "Quản lý trạng thái tin tuyển dụng",
        "Tối ưu hóa tin đăng",
        "Theo dõi hiệu quả tin đăng"
      ]
    },
    {
      id: "candidate-management",
      title: "Quản lý Ứng viên",
      description: "Quản lý toàn diện thông tin và quy trình xử lý ứng viên",
      icon: Users,
      color: "bg-orange-500",
      features: [
        "Nhập thông tin ứng viên",
        "Tìm kiếm và lọc ứng viên",
        "Đánh giá sơ bộ ứng viên",
        "Quản lý hồ sơ ứng viên",
        "Liên lạc với ứng viên",
        "So sánh ứng viên"
      ]
    },
    {
      id: "interview-management",
      title: "Quản lý Phỏng vấn",
      description: "Tổ chức và quản lý toàn bộ quy trình phỏng vấn",
      icon: Calendar,
      color: "bg-red-500",
      features: [
        "Lên lịch phỏng vấn",
        "Gửi thông báo phỏng vấn",
        "Quản lý lịch phỏng vấn thông minh",
        "Tạo quy trình phỏng vấn",
        "Hỗ trợ phỏng vấn trực tuyến",
        "Sử dụng AI hỗ trợ đặt câu hỏi"
      ]
    },
    {
      id: "evaluation-ranking",
      title: "Đánh giá và Xếp hạng",
      description: "Quản lý quy trình đánh giá và xếp hạng ứng viên",
      icon: Star,
      color: "bg-yellow-500",
      features: [
        "Nhập đánh giá ứng viên",
        "Tính toán xếp hạng",
        "So sánh ứng viên",
        "Đánh giá chuyên sâu",
        "Phân tích dữ liệu ứng viên",
        "Hệ thống đánh giá nâng cao"
      ]
    },
    {
      id: "hiring-decisions",
      title: "Quyết định Tuyển dụng",
      description: "Quản lý quy trình ra quyết định tuyển dụng",
      icon: UserCheck,
      color: "bg-indigo-500",
      features: [
        "Đề xuất tuyển dụng",
        "Phê duyệt tuyển dụng",
        "Gửi thông báo kết quả",
        "Đề xuất mức lương",
        "Tạo đề xuất hợp đồng",
        "Quản lý quy trình chấp nhận offer"
      ]
    },
    {
      id: "onboarding-process",
      title: "Quy trình Onboarding",
      description: "Quản lý toàn bộ quy trình onboarding nhân viên mới",
      icon: UserPlus,
      color: "bg-teal-500",
      features: [
        "Tạo kế hoạch onboarding",
        "Theo dõi tiến độ onboarding",
        "Đánh giá kết quả onboarding",
        "Quản lý tài liệu onboarding",
        "Phân công mentor",
        "Đánh giá trong thời gian thử việc"
      ]
    },
    {
      id: "reports-analytics",
      title: "Báo cáo và Phân tích",
      description: "Tạo báo cáo và phân tích dữ liệu tuyển dụng",
      icon: BarChart3,
      color: "bg-pink-500",
      features: [
        "Tạo báo cáo tuyển dụng",
        "Phân tích hiệu quả tuyển dụng",
        "Dự báo nhu cầu tuyển dụng",
        "Phân tích xu hướng thị trường",
        "Báo cáo về đa dạng và hòa nhập",
        "Phân tích ROI của quá trình tuyển dụng"
      ]
    },
    {
      id: "system-integration",
      title: "Tích hợp Hệ thống",
      description: "Tích hợp với các hệ thống và công nghệ khác",
      icon: Zap,
      color: "bg-cyan-500",
      features: [
        "Tích hợp với hệ thống quản lý nhân sự",
        "Tích hợp với các trang tuyển dụng",
        "Tích hợp với hệ thống đánh giá năng lực",
        "Tích hợp AI và Machine Learning",
        "Tích hợp với LinkedIn",
        "Hỗ trợ đa nền tảng"
      ]
    },
    {
      id: "employee-management",
      title: "Quản lý Nhân viên",
      description: "Quản lý thông tin và hoạt động của nhân viên",
      icon: Shield,
      color: "bg-emerald-500",
      features: [
        "Cập nhật thông tin cá nhân",
        "Xem tin tuyển dụng nội bộ",
        "Ứng tuyển vào vị trí nội bộ",
        "Quản lý đơn xin nghỉ phép",
        "Xem thông tin đánh giá hiệu suất"
      ]
    }
  ]

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Quản trị</h1>
          <p className="text-muted-foreground">Tổng quan hệ thống quản lý nhân sự và tuyển dụng</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button variant="outline" size="sm" onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
            className="ml-4"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Switch>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ứng viên</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">+8% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin tuyển dụng</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobPostings}</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phỏng vấn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterviews}</div>
            <p className="text-xs text-muted-foreground">+5% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/candidates'}
            >
              <UserPlus className="h-6 w-6" />
              <span className="text-xs">Thêm ứng viên</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/job-postings'}
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs">Tạo tin tuyển dụng</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/interviews'}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-xs">Lên lịch phỏng vấn</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/reports'}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">Xem báo cáo</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs">Cấu hình hệ thống</span>
            </Button>
            <Button 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => window.location.href = '/data-management'}
            >
              <Database className="h-6 w-6" />
              <span className="text-xs">Quản lý dữ liệu</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="modules" onClick={() => window.location.href = '/admin-functions'}>Chức năng quản trị</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động gần đây</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Tình trạng hệ thống</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hiệu suất tổng thể</span>
                    <span className="font-medium">{stats.systemHealth}%</span>
                  </div>
                  <Progress value={stats.systemHealth} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database</span>
                    <Badge variant="outline" className="text-green-600">Hoạt động tốt</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>API Services</span>
                    <Badge variant="outline" className="text-green-600">Hoạt động tốt</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Email Service</span>
                    <Badge variant="outline" className="text-yellow-600">Cảnh báo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Chờ phê duyệt</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-orange-600">{stats.pendingApprovals}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yêu cầu tuyển dụng</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tin tuyển dụng</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ứng viên</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module) => {
              const IconComponent = module.icon
              return (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${module.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {module.features.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{module.features.length - 3} chức năng khác
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className={`p-4 border rounded-lg ${getStatusColor(activity.status)}`}>
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(activity.status)}
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm opacity-80">{activity.description}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {activity.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Chưa có hoạt động nào</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Phiên bản</span>
                    <span className="text-sm font-medium">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-sm font-medium">SQL Server 2022</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bộ nhớ sử dụng</span>
                    <span className="text-sm font-medium">2.4GB / 8GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Certificate</span>
                    <Badge variant="outline" className="text-green-600">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firewall</span>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup</span>
                    <Badge variant="outline" className="text-green-600">Latest</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logs</span>
                    <Badge variant="outline" className="text-yellow-600">Warning</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
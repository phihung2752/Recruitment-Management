"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  Shield, 
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Star,
  UserCheck,
  Globe,
  Lock,
  Unlock
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AdminFunctionsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")

  const adminModules = [
    {
      id: "system-management",
      title: "Quản lý Hệ thống",
      description: "Quản lý cấu hình và quyền truy cập hệ thống",
      icon: Settings,
      color: "blue",
      features: [
        "Đăng nhập/Đăng xuất",
        "Quản lý tài khoản và phân quyền", 
        "Cấu hình hệ thống",
        "Bảo mật và xác thực"
      ],
      status: "active",
      progress: 95
    },
    {
      id: "recruitment-requests",
      title: "Quản lý Yêu cầu Tuyển dụng",
      description: "Quản lý toàn bộ quy trình yêu cầu tuyển dụng",
      icon: FileText,
      color: "green",
      features: [
        "Tạo yêu cầu tuyển dụng",
        "Phê duyệt yêu cầu tuyển dụng",
        "Theo dõi trạng thái yêu cầu",
        "Báo cáo yêu cầu"
      ],
      status: "active",
      progress: 88
    },
    {
      id: "job-postings",
      title: "Quản lý Tin Tuyển dụng",
      description: "Tạo và quản lý toàn bộ quy trình đăng tin tuyển dụng",
      icon: Globe,
      color: "purple",
      features: [
        "Tạo tin tuyển dụng",
        "Phê duyệt tin tuyển dụng",
        "Đăng tin tuyển dụng tự động",
        "Quản lý template"
      ],
      status: "active",
      progress: 92
    },
    {
      id: "candidate-management",
      title: "Quản lý Ứng viên",
      description: "Quản lý toàn diện thông tin và quy trình xử lý ứng viên",
      icon: Users,
      color: "orange",
      features: [
        "Nhập thông tin ứng viên",
        "Tìm kiếm và lọc ứng viên",
        "Đánh giá sơ bộ ứng viên",
        "Quản lý CV và tài liệu"
      ],
      status: "active",
      progress: 90
    },
    {
      id: "interview-management",
      title: "Quản lý Phỏng vấn",
      description: "Tổ chức và quản lý toàn bộ quy trình phỏng vấn",
      icon: Calendar,
      color: "red",
      features: [
        "Lên lịch phỏng vấn",
        "Gửi thông báo phỏng vấn",
        "Quản lý lịch phỏng vấn thông minh",
        "Đánh giá kết quả phỏng vấn"
      ],
      status: "active",
      progress: 85
    },
    {
      id: "evaluation-ranking",
      title: "Đánh giá và Xếp hạng",
      description: "Quản lý quy trình đánh giá và xếp hạng ứng viên",
      icon: Star,
      color: "yellow",
      features: [
        "Nhập đánh giá ứng viên",
        "Tính toán xếp hạng",
        "So sánh ứng viên",
        "Báo cáo đánh giá"
      ],
      status: "active",
      progress: 78
    },
    {
      id: "recruitment-decision",
      title: "Quyết định Tuyển dụng",
      description: "Quản lý quy trình ra quyết định tuyển dụng",
      icon: UserCheck,
      color: "purple",
      features: [
        "Đề xuất tuyển dụng",
        "Phê duyệt tuyển dụng",
        "Gửi thư mời làm việc",
        "Theo dõi quyết định"
      ],
      status: "active",
      progress: 82
    },
    {
      id: "onboarding-process",
      title: "Quy trình Onboarding",
      description: "Quản lý toàn bộ quy trình onboarding nhân viên mới",
      icon: Target,
      color: "teal",
      features: [
        "Tạo kế hoạch onboarding",
        "Quản lý checklist",
        "Theo dõi tiến độ",
        "Đánh giá hiệu quả"
      ],
      status: "active",
      progress: 75
    },
    {
      id: "reports-analytics",
      title: "Báo cáo và Phân tích",
      description: "Tạo báo cáo và phân tích dữ liệu tuyển dụng",
      icon: BarChart3,
      color: "pink",
      features: [
        "Tạo báo cáo tuyển dụng",
        "Phân tích hiệu quả",
        "Dashboard thống kê",
        "Xuất báo cáo"
      ],
      status: "active",
      progress: 88
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "error": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle
      case "warning": return AlertCircle
      case "error": return AlertCircle
      default: return Clock
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100", 
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      red: "text-red-600 bg-red-100",
      yellow: "text-yellow-600 bg-yellow-100",
      teal: "text-teal-600 bg-teal-100",
      pink: "text-pink-600 bg-pink-100"
    }
    return colors[color as keyof typeof colors] || "text-gray-600 bg-gray-100"
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Admin Functions")}</h1>
          <p className="text-muted-foreground">{t("Comprehensive management functions for HR system")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            {t("System Settings")}
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>{t("System Overview")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">9</div>
              <div className="text-sm text-muted-foreground">{t("Active Modules")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-muted-foreground">{t("System Health")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-muted-foreground">{t("Uptime")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-muted-foreground">{t("Issues")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="modules">{t("Modules")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Module Status")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminModules.slice(0, 5).map((module) => {
                    const StatusIcon = getStatusIcon(module.status)
                    return (
                      <div key={module.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${getColorClasses(module.color)}`}>
                            <module.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{module.title}</p>
                            <p className="text-xs text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(module.status)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {t(module.status)}
                          </Badge>
                          <div className="w-16">
                            <Progress value={module.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Recent Activity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm">System configuration updated</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm">New candidate added</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm">Job posting published</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminModules.map((module) => {
              const StatusIcon = getStatusIcon(module.status)
              return (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-full ${getColorClasses(module.color)}`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <Badge className={getStatusColor(module.status)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {t(module.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{t("Progress")}</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{t("Features")}:</p>
                        {module.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                        {module.features.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{module.features.length - 3} more features
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <module.icon className="mr-1 h-3 w-3" />
                          {t("View")}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Module Performance")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>{t("Performance analytics will be displayed here")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Usage Statistics")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminModules.slice(0, 4).map((module) => (
                    <div key={module.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <module.icon className="h-4 w-4" />
                        <span className="text-sm">{module.title}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{module.progress}%</div>
                        <div className="text-xs text-muted-foreground">Usage</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

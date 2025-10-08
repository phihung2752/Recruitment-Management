"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  XCircle,
  MoreHorizontal,
  Filter,
  Search,
  Send,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import Pagination from "@/components/pagination"
import { toast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: 'email' | 'sms' | 'push' | 'system'
  title: string
  message: string
  recipient: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'interview' | 'deadline' | 'reminder' | 'system' | 'marketing'
  createdAt: string
  scheduledAt?: string
  deliveredAt?: string
  readAt?: string
  template: string
  metadata: {
    candidateId?: string
    interviewId?: string
    jobId?: string
    userId?: string
  }
}

interface NotificationSettings {
  email: {
    enabled: boolean
    interviewReminders: boolean
    deadlineAlerts: boolean
    systemUpdates: boolean
    marketing: boolean
  }
  sms: {
    enabled: boolean
    interviewReminders: boolean
    urgentAlerts: boolean
  }
  push: {
    enabled: boolean
    interviewReminders: boolean
    deadlineAlerts: boolean
    systemUpdates: boolean
  }
  schedule: {
    workingHours: {
      start: string
      end: string
    }
    timezone: string
    quietHours: boolean
  }
}

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      interviewReminders: true,
      deadlineAlerts: true,
      systemUpdates: true,
      marketing: false
    },
    sms: {
      enabled: false,
      interviewReminders: true,
      urgentAlerts: true
    },
    push: {
      enabled: true,
      interviewReminders: true,
      deadlineAlerts: true,
      systemUpdates: true
    },
    schedule: {
      workingHours: {
        start: "09:00",
        end: "18:00"
      },
      timezone: "Asia/Ho_Chi_Minh",
      quietHours: true
    }
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("all")

  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'email',
        title: 'Nhắc nhở phỏng vấn',
        message: 'Phỏng vấn với Nguyễn Văn A sẽ diễn ra lúc 14:00 hôm nay',
        recipient: 'hr@company.com',
        status: 'delivered',
        priority: 'high',
        category: 'interview',
        createdAt: '2024-01-15T10:00:00Z',
        deliveredAt: '2024-01-15T10:01:00Z',
        template: 'interview_reminder',
        metadata: {
          candidateId: '1',
          interviewId: '1'
        }
      },
      {
        id: '2',
        type: 'sms',
        title: 'Cảnh báo deadline',
        message: 'Deadline nộp hồ sơ Backend Developer còn 2 giờ',
        recipient: '+84901234567',
        status: 'sent',
        priority: 'urgent',
        category: 'deadline',
        createdAt: '2024-01-15T14:00:00Z',
        scheduledAt: '2024-01-15T16:00:00Z',
        template: 'deadline_alert',
        metadata: {
          jobId: '1'
        }
      },
      {
        id: '3',
        type: 'push',
        title: 'Cập nhật hệ thống',
        message: 'Hệ thống sẽ bảo trì từ 02:00-04:00 ngày mai',
        recipient: 'all_users',
        status: 'delivered',
        priority: 'medium',
        category: 'system',
        createdAt: '2024-01-15T18:00:00Z',
        deliveredAt: '2024-01-15T18:01:00Z',
        template: 'system_maintenance',
        metadata: {}
      },
      {
        id: '4',
        type: 'email',
        title: 'Kết quả phỏng vấn',
        message: 'Ứng viên Trần Thị B đã pass vòng phỏng vấn kỹ thuật',
        recipient: 'tech.lead@company.com',
        status: 'pending',
        priority: 'medium',
        category: 'interview',
        createdAt: '2024-01-15T16:30:00Z',
        scheduledAt: '2024-01-15T17:00:00Z',
        template: 'interview_result',
        metadata: {
          candidateId: '2',
          interviewId: '2'
        }
      },
      {
        id: '5',
        type: 'email',
        title: 'Chào mừng nhân viên mới',
        message: 'Chào mừng Lê Văn C gia nhập team Engineering',
        recipient: 'le.van.c@company.com',
        status: 'failed',
        priority: 'low',
        category: 'system',
        createdAt: '2024-01-15T09:00:00Z',
        template: 'welcome_new_employee',
        metadata: {
          userId: '3'
        }
      }
    ]

    setNotifications(mockNotifications)
    setFilteredNotifications(mockNotifications)
    setLoading(false)
  }, [])

  // Filter notifications
  useEffect(() => {
    let filtered = notifications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(notif => notif.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter(notif => notif.type === typeFilter)
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(notif => notif.category === categoryFilter)
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchTerm, statusFilter, typeFilter, categoryFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Đã gửi'
      case 'delivered':
        return 'Đã giao'
      case 'failed':
        return 'Thất bại'
      case 'pending':
        return 'Chờ gửi'
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'sms':
        return <MessageSquare className="h-4 w-4" />
      case 'push':
        return <Bell className="h-4 w-4" />
      case 'system':
        return <Settings className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleNotificationAction = (action: string, notificationId: string) => {
    switch (action) {
      case 'resend':
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, status: 'pending' as const } : notif
        ))
        toast({
          title: "Thành công",
          description: "Đã đưa thông báo vào hàng đợi gửi lại",
        })
        break
      case 'cancel':
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, status: 'failed' as const } : notif
        ))
        toast({
          title: "Thành công",
          description: "Đã hủy thông báo",
        })
        break
      case 'delete':
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        toast({
          title: "Thành công",
          description: "Đã xóa thông báo",
        })
        break
    }
  }

  const handleSendTestNotification = () => {
    toast({
      title: "Test thành công",
      description: "Đã gửi thông báo test",
    })
  }

  const handleSaveSettings = () => {
    toast({
      title: "Thành công",
      description: "Đã lưu cài đặt thông báo",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hr-text-primary">Quản lý thông báo</h1>
            <p className="text-hr-text-secondary">Gửi và quản lý thông báo hệ thống</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSendTestNotification}
              variant="outline"
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              <Send className="h-4 w-4 mr-2" />
              Gửi test
            </Button>
            <Button
              onClick={() => setActiveTab('settings')}
              variant="outline"
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Tổng thông báo</p>
                  <p className="text-2xl font-bold text-hr-text-primary">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-hr-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Đã gửi</p>
                  <p className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Chờ gửi</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {notifications.filter(n => n.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Thất bại</p>
                  <p className="text-2xl font-bold text-red-600">
                    {notifications.filter(n => n.status === 'failed').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          {/* All Notifications Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Filters */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-hr-text-secondary">Tìm kiếm</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hr-text-secondary h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Tiêu đề, nội dung, người nhận..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-hr-text-secondary">Trạng thái</Label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                    >
                      <option value="All">Tất cả</option>
                      <option value="sent">Đã gửi</option>
                      <option value="delivered">Đã giao</option>
                      <option value="pending">Chờ gửi</option>
                      <option value="failed">Thất bại</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-hr-text-secondary">Loại</Label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                    >
                      <option value="All">Tất cả</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-hr-text-secondary">Danh mục</Label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                    >
                      <option value="All">Tất cả</option>
                      <option value="interview">Phỏng vấn</option>
                      <option value="deadline">Deadline</option>
                      <option value="reminder">Nhắc nhở</option>
                      <option value="system">Hệ thống</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Danh sách thông báo ({filteredNotifications.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className="bg-hr-bg-primary border-hr-border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {getTypeIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-hr-text-primary">{notification.title}</h3>
                                <Badge className={getStatusColor(notification.status)}>
                                  {getStatusText(notification.status)}
                                </Badge>
                                <Badge variant="outline" className={`border-hr-border ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority === 'urgent' ? 'Khẩn cấp' :
                                   notification.priority === 'high' ? 'Cao' :
                                   notification.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                </Badge>
                                <Badge variant="outline" className="border-hr-border text-hr-text-primary">
                                  {notification.category === 'interview' ? 'Phỏng vấn' :
                                   notification.category === 'deadline' ? 'Deadline' :
                                   notification.category === 'reminder' ? 'Nhắc nhở' :
                                   notification.category === 'system' ? 'Hệ thống' : 'Marketing'}
                                </Badge>
                              </div>
                              
                              <p className="text-hr-text-secondary mb-3">{notification.message}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-hr-text-secondary">
                                <div>
                                  <span>Người nhận:</span>
                                  <p className="font-medium text-hr-text-primary">{notification.recipient}</p>
                                </div>
                                <div>
                                  <span>Tạo lúc:</span>
                                  <p className="font-medium text-hr-text-primary">
                                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                  </p>
                                </div>
                                {notification.deliveredAt && (
                                  <div>
                                    <span>Giao lúc:</span>
                                    <p className="font-medium text-hr-text-primary">
                                      {new Date(notification.deliveredAt).toLocaleString('vi-VN')}
                                    </p>
                                  </div>
                                )}
                                {notification.scheduledAt && (
                                  <div>
                                    <span>Lên lịch:</span>
                                    <p className="font-medium text-hr-text-primary">
                                      {new Date(notification.scheduledAt).toLocaleString('vi-VN')}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            {notification.status === 'failed' && (
                              <Button
                                size="sm"
                                onClick={() => handleNotificationAction('resend', notification.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                              >
                                Gửi lại
                              </Button>
                            )}
                            {notification.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleNotificationAction('cancel', notification.id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                              >
                                Hủy
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleNotificationAction('delete', notification.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Thông báo Email</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.filter(n => n.type === 'email').map((notification) => (
                    <div key={notification.id} className="p-4 bg-hr-bg-primary rounded-lg border border-hr-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-hr-text-primary">{notification.title}</h4>
                            <p className="text-sm text-hr-text-secondary">{notification.recipient}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(notification.status)}>
                          {getStatusText(notification.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS Tab */}
          <TabsContent value="sms" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Thông báo SMS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.filter(n => n.type === 'sms').map((notification) => (
                    <div key={notification.id} className="p-4 bg-hr-bg-primary rounded-lg border border-hr-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium text-hr-text-primary">{notification.title}</h4>
                            <p className="text-sm text-hr-text-secondary">{notification.recipient}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(notification.status)}>
                          {getStatusText(notification.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Cài đặt thông báo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-hr-text-primary">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Bật thông báo email</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi thông báo qua email</p>
                      </div>
                      <Switch
                        checked={settings.email.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, enabled: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Nhắc nhở phỏng vấn</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi email nhắc nhở trước phỏng vấn</p>
                      </div>
                      <Switch
                        checked={settings.email.interviewReminders}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, interviewReminders: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Cảnh báo deadline</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi email cảnh báo deadline</p>
                      </div>
                      <Switch
                        checked={settings.email.deadlineAlerts}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, deadlineAlerts: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Cập nhật hệ thống</Label>
                        <p className="text-sm text-hr-text-secondary">Thông báo về cập nhật hệ thống</p>
                      </div>
                      <Switch
                        checked={settings.email.systemUpdates}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, systemUpdates: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Email marketing</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi email marketing và quảng cáo</p>
                      </div>
                      <Switch
                        checked={settings.email.marketing}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, marketing: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-hr-text-primary">SMS Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Bật thông báo SMS</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi thông báo qua SMS</p>
                      </div>
                      <Switch
                        checked={settings.sms.enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          sms: { ...prev.sms, enabled: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Nhắc nhở phỏng vấn</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi SMS nhắc nhở phỏng vấn</p>
                      </div>
                      <Switch
                        checked={settings.sms.interviewReminders}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          sms: { ...prev.sms, interviewReminders: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-hr-text-primary">Cảnh báo khẩn cấp</Label>
                        <p className="text-sm text-hr-text-secondary">Gửi SMS cho cảnh báo khẩn cấp</p>
                      </div>
                      <Switch
                        checked={settings.sms.urgentAlerts}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          sms: { ...prev.sms, urgentAlerts: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-hr-text-primary">Lịch gửi thông báo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-hr-text-secondary">Giờ làm việc bắt đầu</Label>
                      <input
                        type="time"
                        value={settings.schedule.workingHours.start}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            workingHours: { ...prev.schedule.workingHours, start: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                      />
                    </div>
                    <div>
                      <Label className="text-hr-text-secondary">Giờ làm việc kết thúc</Label>
                      <input
                        type="time"
                        value={settings.schedule.workingHours.end}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            workingHours: { ...prev.schedule.workingHours, end: e.target.value }
                          }
                        }))}
                        className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-hr-text-primary">Chế độ im lặng</Label>
                      <p className="text-sm text-hr-text-secondary">Không gửi thông báo ngoài giờ làm việc</p>
                    </div>
                    <Switch
                      checked={settings.schedule.quietHours}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, quietHours: checked }
                      }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-hr-primary hover:bg-hr-primary-dark text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Lưu cài đặt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}







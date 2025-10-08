"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search,
  ChevronRight,
  ExternalLink,
  Download,
  Video,
  FileText,
  Users,
  Settings,
  Calendar,
  Briefcase,
  BarChart3,
  Bell,
  UserCog,
  FileText as FileTextIcon,
  PlayCircle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { toast } from "@/hooks/use-toast"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
  notHelpful: number
}

interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastUpdated: string
  views: number
  helpful: number
}

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export default function HelpPage() {
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("faq")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium"
  })

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Làm thế nào để tạo một cuộc phỏng vấn mới?',
      answer: 'Để tạo cuộc phỏng vấn mới, bạn có thể:\n1. Vào trang Interviews\n2. Chọn ứng viên cần phỏng vấn\n3. Nhấn nút "Lên lịch phỏng vấn"\n4. Điền thông tin chi tiết và lưu',
      category: 'Interviews',
      tags: ['phỏng vấn', 'lên lịch', 'ứng viên'],
      helpful: 15,
      notHelpful: 2
    },
    {
      id: '2',
      question: 'Cách quản lý quyền truy cập của người dùng?',
      answer: 'Trong trang User Management:\n1. Chọn người dùng cần chỉnh sửa\n2. Nhấn nút "Chỉnh sửa"\n3. Thay đổi Role và Permissions\n4. Lưu thay đổi',
      category: 'User Management',
      tags: ['quyền', 'người dùng', 'role'],
      helpful: 12,
      notHelpful: 1
    },
    {
      id: '3',
      question: 'Làm sao để import CV hàng loạt?',
      answer: 'Trong trang CV Management:\n1. Chọn tab "Import CV"\n2. Chọn phương thức import (Email, Upload, Portal)\n3. Upload file hoặc cấu hình kết nối\n4. Xem kết quả import',
      category: 'CV Management',
      tags: ['import', 'CV', 'hàng loạt'],
      helpful: 8,
      notHelpful: 0
    },
    {
      id: '4',
      question: 'Cách xem báo cáo thống kê?',
      answer: 'Vào trang Reports hoặc Analytics:\n1. Chọn loại báo cáo cần xem\n2. Điều chỉnh khoảng thời gian\n3. Chọn phòng ban hoặc bộ lọc\n4. Xuất báo cáo nếu cần',
      category: 'Reports',
      tags: ['báo cáo', 'thống kê', 'analytics'],
      helpful: 20,
      notHelpful: 3
    },
    {
      id: '5',
      question: 'Làm thế nào để cấu hình thông báo email?',
      answer: 'Trong trang Settings:\n1. Chọn tab "Notifications"\n2. Cấu hình các loại thông báo\n3. Thiết lập lịch gửi\n4. Test và lưu cài đặt',
      category: 'Settings',
      tags: ['thông báo', 'email', 'cấu hình'],
      helpful: 6,
      notHelpful: 1
    }
  ]

  const articles: Article[] = [
    {
      id: '1',
      title: 'Hướng dẫn sử dụng hệ thống HR Management',
      content: 'Hệ thống HR Management cung cấp đầy đủ các tính năng để quản lý quy trình tuyển dụng...',
      category: 'Getting Started',
      tags: ['hướng dẫn', 'bắt đầu', 'tổng quan'],
      lastUpdated: '2024-01-15',
      views: 156,
      helpful: 25
    },
    {
      id: '2',
      title: 'Cấu hình quyền và vai trò người dùng',
      content: 'Hệ thống hỗ trợ 5 vai trò chính: Admin, HR, Manager, Employee, Interviewer...',
      category: 'User Management',
      tags: ['quyền', 'vai trò', 'bảo mật'],
      lastUpdated: '2024-01-10',
      views: 89,
      helpful: 18
    },
    {
      id: '3',
      title: 'Tích hợp AI trong quy trình tuyển dụng',
      content: 'Hệ thống tích hợp AI để hỗ trợ screening CV, tạo câu hỏi phỏng vấn...',
      category: 'AI Features',
      tags: ['AI', 'tích hợp', 'tuyển dụng'],
      lastUpdated: '2024-01-12',
      views: 67,
      helpful: 14
    },
    {
      id: '4',
      title: 'Quản lý lịch phỏng vấn và đồng bộ calendar',
      content: 'Hướng dẫn sử dụng tính năng calendar và đồng bộ với Google Calendar...',
      category: 'Calendar',
      tags: ['lịch', 'calendar', 'đồng bộ'],
      lastUpdated: '2024-01-08',
      views: 112,
      helpful: 22
    }
  ]

  const tickets: Ticket[] = [
    {
      id: '1',
      title: 'Không thể đăng nhập vào hệ thống',
      description: 'Tôi gặp lỗi khi đăng nhập với tài khoản admin',
      status: 'resolved',
      priority: 'high',
      category: 'Technical',
      createdAt: '2024-01-14T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      assignedTo: 'Support Team'
    },
    {
      id: '2',
      title: 'Cần hỗ trợ cấu hình email SMTP',
      description: 'Tôi muốn cấu hình gửi email tự động từ hệ thống',
      status: 'in-progress',
      priority: 'medium',
      category: 'Configuration',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
      assignedTo: 'Technical Team'
    },
    {
      id: '3',
      title: 'Lỗi hiển thị dữ liệu trong báo cáo',
      description: 'Báo cáo không hiển thị đúng dữ liệu thống kê',
      status: 'open',
      priority: 'low',
      category: 'Bug Report',
      createdAt: '2024-01-15T16:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z'
    }
  ]

  const categories = [
    'All',
    'Getting Started',
    'User Management',
    'Interviews',
    'CV Management',
    'Calendar',
    'Reports',
    'Settings',
    'AI Features',
    'Technical',
    'Configuration'
  ]

  const filteredFAQs = faqs.filter(faq => 
    (selectedCategory === 'All' || faq.category === selectedCategory) &&
    (searchTerm === '' || 
     faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const filteredArticles = articles.filter(article => 
    (selectedCategory === 'All' || article.category === selectedCategory) &&
    (searchTerm === '' || 
     article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const handleSubmitTicket = () => {
    if (!ticketForm.title || !ticketForm.description) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Thành công",
      description: "Đã tạo ticket hỗ trợ thành công",
    })
    
    setShowTicketForm(false)
    setTicketForm({ title: "", description: "", category: "", priority: "medium" })
  }

  const handleHelpful = (id: string, type: 'faq' | 'article') => {
    toast({
      title: "Cảm ơn",
      description: "Phản hồi của bạn đã được ghi nhận",
    })
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hr-text-primary">Trung tâm trợ giúp</h1>
            <p className="text-hr-text-secondary">Tìm kiếm câu trả lời và hỗ trợ kỹ thuật</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTicketForm(true)}
              className="bg-hr-primary hover:bg-hr-primary-dark text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Tạo ticket hỗ trợ
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hr-text-secondary h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm câu hỏi, bài viết, hướng dẫn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-hr-primary mx-auto mb-2" />
              <h3 className="font-semibold text-hr-text-primary">Tài liệu</h3>
              <p className="text-sm text-hr-text-secondary">Hướng dẫn chi tiết</p>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-hr-text-primary">Video hướng dẫn</h3>
              <p className="text-sm text-hr-text-secondary">Tutorial videos</p>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-hr-text-primary">Hotline</h3>
              <p className="text-sm text-hr-text-secondary">1900-1234</p>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-hr-text-primary">Email hỗ trợ</h3>
              <p className="text-sm text-hr-text-secondary">support@company.com</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="articles">Tài liệu</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Câu hỏi thường gặp ({filteredFAQs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="bg-hr-bg-primary border-hr-border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-hr-text-primary mb-2">{faq.question}</h3>
                              <p className="text-hr-text-secondary whitespace-pre-line">{faq.answer}</p>
                              <div className="flex flex-wrap gap-1 mt-3">
                                {faq.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {faq.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-hr-border">
                            <div className="flex items-center gap-4 text-sm text-hr-text-secondary">
                              <span>{faq.helpful} hữu ích</span>
                              <span>{faq.notHelpful} không hữu ích</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleHelpful(faq.id, 'faq')}
                                className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Hữu ích
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleHelpful(faq.id, 'faq')}
                                className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Không hữu ích
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Tài liệu hướng dẫn ({filteredArticles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="bg-hr-bg-primary border-hr-border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileTextIcon className="h-4 w-4 text-hr-primary" />
                              <h3 className="font-semibold text-hr-text-primary">{article.title}</h3>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                {article.category}
                              </Badge>
                            </div>
                            <p className="text-hr-text-secondary mb-3">{article.content}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {article.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-hr-text-secondary">
                              <span>👁️ {article.views} lượt xem</span>
                              <span>👍 {article.helpful} hữu ích</span>
                              <span>📅 Cập nhật: {article.lastUpdated}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                            >
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Xem
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleHelpful(article.id, 'article')}
                              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Hữu ích
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Tickets hỗ trợ của tôi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="bg-hr-bg-primary border-hr-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-hr-text-primary">{ticket.title}</h3>
                              <Badge className={
                                ticket.status === 'resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                                ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                ticket.status === 'open' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                'bg-gray-100 text-gray-800 border-gray-200'
                              }>
                                {ticket.status === 'resolved' ? 'Đã giải quyết' :
                                 ticket.status === 'in-progress' ? 'Đang xử lý' :
                                 ticket.status === 'open' ? 'Mở' : 'Đóng'}
                              </Badge>
                              <Badge variant="outline" className={
                                ticket.priority === 'urgent' ? 'text-red-600 border-red-200' :
                                ticket.priority === 'high' ? 'text-orange-600 border-orange-200' :
                                ticket.priority === 'medium' ? 'text-yellow-600 border-yellow-200' :
                                'text-green-600 border-green-200'
                              }>
                                {ticket.priority === 'urgent' ? 'Khẩn cấp' :
                                 ticket.priority === 'high' ? 'Cao' :
                                 ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                              </Badge>
                            </div>
                            <p className="text-hr-text-secondary mb-3">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-sm text-hr-text-secondary">
                              <span>📅 Tạo: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                              <span>🔄 Cập nhật: {new Date(ticket.updatedAt).toLocaleDateString('vi-VN')}</span>
                              {ticket.assignedTo && <span>👤 Giao cho: {ticket.assignedTo}</span>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardHeader>
                  <CardTitle className="text-hr-text-primary">Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-hr-text-primary">Hotline hỗ trợ</p>
                      <p className="text-hr-text-secondary">1900-1234 (24/7)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-hr-text-primary">Email hỗ trợ</p>
                      <p className="text-hr-text-secondary">support@company.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-hr-text-primary">Live Chat</p>
                      <p className="text-hr-text-secondary">Có sẵn 9:00-18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-hr-text-primary">Giờ làm việc</p>
                      <p className="text-hr-text-secondary">Thứ 2-6: 8:00-17:30</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardHeader>
                  <CardTitle className="text-hr-text-primary">Tạo ticket hỗ trợ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-hr-text-secondary">Tiêu đề</label>
                    <Input
                      placeholder="Mô tả ngắn gọn vấn đề"
                      value={ticketForm.title}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-hr-text-secondary">Mô tả chi tiết</label>
                    <Textarea
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                      value={ticketForm.description}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-hr-text-secondary">Danh mục</label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                      >
                        <option value="">Chọn danh mục</option>
                        <option value="Technical">Kỹ thuật</option>
                        <option value="Configuration">Cấu hình</option>
                        <option value="Bug Report">Báo lỗi</option>
                        <option value="Feature Request">Yêu cầu tính năng</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-hr-text-secondary">Mức độ ưu tiên</label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full mt-1 p-2 border border-hr-border rounded-md bg-hr-bg-primary text-hr-text-primary"
                      >
                        <option value="low">Thấp</option>
                        <option value="medium">Trung bình</option>
                        <option value="high">Cao</option>
                        <option value="urgent">Khẩn cấp</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSubmitTicket}
                    className="w-full bg-hr-primary hover:bg-hr-primary-dark text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Gửi ticket hỗ trợ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}







"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  MoreHorizontal,
  BarChart3,
  Download,
  Upload,
  Award,
  Clock,
  Briefcase,
  GraduationCap
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import Pagination from "@/components/pagination"
import { toast } from "@/hooks/use-toast"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  manager: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive' | 'on-leave' | 'terminated'
  employeeType: 'full-time' | 'part-time' | 'contract' | 'intern'
  workLocation: string
  emergencyContact: string
  emergencyPhone: string
  address: string
  skills: string[]
  certifications: string[]
  performance: {
    rating: number
    lastReview: string
    goals: string[]
  }
  attendance: {
    totalDays: number
    presentDays: number
    absentDays: number
    lateDays: number
  }
  benefits: {
    healthInsurance: boolean
    dentalInsurance: boolean
    retirementPlan: boolean
    paidTimeOff: number
  }
}

interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  newHires: number
  averageSalary: number
  departmentCount: number
  turnoverRate: number
}

export default function EmployeesPage() {
  const { user, isAuthenticated } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [stats, setStats] = useState<EmployeeStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    newHires: 0,
    averageSalary: 0,
    departmentCount: 0,
    turnoverRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch real data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('/api/employees', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setEmployees(data.employees || [])
          setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
        } else {
          console.error('Failed to fetch employees:', response.statusText)
          setEmployees([])
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  // Filter employees
  useEffect(() => {
    let filtered = employees

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(emp => emp.status === statusFilter)
    }

    // Department filter
    if (departmentFilter !== "All") {
      filtered = filtered.filter(emp => emp.department === departmentFilter)
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, statusFilter, departmentFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc'
      case 'inactive':
        return 'Không hoạt động'
      case 'on-leave':
        return 'Nghỉ phép'
      case 'terminated':
        return 'Đã nghỉ việc'
      default:
        return status
    }
  }

  const getEmployeeTypeText = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'Toàn thời gian'
      case 'part-time':
        return 'Bán thời gian'
      case 'contract':
        return 'Hợp đồng'
      case 'intern':
        return 'Thực tập'
      default:
        return type
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEmployeeAction = (action: string, employeeId: string) => {
    switch (action) {
      case 'activate':
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeId ? { ...emp, status: 'active' as const } : emp
        ))
        toast({
          title: "Thành công",
          description: "Đã kích hoạt nhân viên",
        })
        break
      case 'deactivate':
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeId ? { ...emp, status: 'inactive' as const } : emp
        ))
        toast({
          title: "Thành công",
          description: "Đã vô hiệu hóa nhân viên",
        })
        break
      case 'terminate':
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeId ? { ...emp, status: 'terminated' as const } : emp
        ))
        toast({
          title: "Thành công",
          description: "Đã chấm dứt hợp đồng",
        })
        break
      case 'delete':
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId))
        toast({
          title: "Thành công",
          description: "Đã xóa nhân viên",
        })
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermissions={['employee.read']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hr-text-primary">Quản lý nhân viên</h1>
            <p className="text-hr-text-secondary">Quản lý thông tin và hồ sơ nhân viên</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-hr-primary hover:bg-hr-primary-dark hover:shadow-md text-white transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân viên
            </Button>
            <Button
              variant="outline"
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary hover:shadow-md transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary hover:shadow-md transition-all"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Tổng nhân viên</p>
                  <p className="text-2xl font-bold text-hr-text-primary">{stats.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-hr-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Đang làm việc</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Nhân viên mới</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.newHires}</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Lương trung bình</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.averageSalary.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-hr-text-secondary">Tìm kiếm</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hr-text-secondary h-4 w-4" />
                  <Input
                    placeholder="Tên, email, vị trí..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-hr-text-secondary">Trạng thái</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Tất cả</SelectItem>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="on-leave">Nghỉ phép</SelectItem>
                    <SelectItem value="terminated">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-hr-text-secondary">Phòng ban</Label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Tất cả</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-hr-text-secondary">Sắp xếp</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                    <SelectItem value="hireDate">Ngày vào làm</SelectItem>
                    <SelectItem value="salary">Lương cao nhất</SelectItem>
                    <SelectItem value="performance">Hiệu suất cao nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employees List */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Danh sách nhân viên ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="bg-hr-bg-primary border-hr-border hover:shadow-md hover:scale-105 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-hr-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-hr-text-primary">
                              {employee.firstName} {employee.lastName}
                            </h3>
                            <Badge className={getStatusColor(employee.status)}>
                              {getStatusText(employee.status)}
                            </Badge>
                            <Badge variant="outline" className="border-hr-border text-hr-text-primary">
                              {getEmployeeTypeText(employee.employeeType)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-hr-text-secondary mb-4">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {employee.position}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {employee.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {employee.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {employee.phone}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-hr-text-secondary">Ngày vào làm:</span>
                              <p className="text-hr-text-primary">
                                {new Date(employee.hireDate).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div>
                              <span className="text-hr-text-secondary">Lương:</span>
                              <p className="text-hr-text-primary">
                                {employee.salary.toLocaleString('vi-VN')} VNĐ
                              </p>
                            </div>
                            <div>
                              <span className="text-hr-text-secondary">Hiệu suất:</span>
                              <p className="text-hr-text-primary">
                                ⭐ {employee.performance.rating}/5
                              </p>
                            </div>
                            <div>
                              <span className="text-hr-text-secondary">Chấm công:</span>
                              <p className="text-hr-text-primary">
                                {employee.attendance.presentDays}/{employee.attendance.totalDays} ngày
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {employee.skills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {employee.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{employee.skills.length - 5} kỹ năng khác
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setShowEditDialog(true)
                            }}
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary hover:shadow-md transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary hover:shadow-md transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary hover:shadow-md transition-all"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-1">
                          {employee.status === 'inactive' && (
                            <Button
                              size="sm"
                              onClick={() => handleEmployeeAction('activate', employee.id)}
                              className="bg-green-600 hover:bg-green-700 hover:shadow-md text-white text-xs transition-all"
                            >
                              Kích hoạt
                            </Button>
                          )}
                          {employee.status === 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleEmployeeAction('deactivate', employee.id)}
                              className="bg-yellow-600 hover:bg-yellow-700 hover:shadow-md text-white text-xs transition-all"
                            >
                              Vô hiệu hóa
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleEmployeeAction('terminate', employee.id)}
                            className="bg-red-600 hover:bg-red-700 hover:shadow-md text-white text-xs transition-all"
                          >
                            Chấm dứt
                          </Button>
                        </div>
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

        {/* Create Employee Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[800px] bg-hr-bg-primary text-hr-text-primary border-hr-border">
            <DialogHeader>
              <DialogTitle>Thêm nhân viên mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-hr-text-secondary">Họ</Label>
                  <Input placeholder="Nhập họ" className="mt-1" />
                </div>
                <div>
                  <Label className="text-hr-text-secondary">Tên</Label>
                  <Input placeholder="Nhập tên" className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-hr-text-secondary">Email</Label>
                  <Input placeholder="email@company.com" className="mt-1" />
                </div>
                <div>
                  <Label className="text-hr-text-secondary">Số điện thoại</Label>
                  <Input placeholder="0901234567" className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-hr-text-secondary">Vị trí</Label>
                  <Input placeholder="Senior Developer" className="mt-1" />
                </div>
                <div>
                  <Label className="text-hr-text-secondary">Phòng ban</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-hr-text-secondary">Ngày vào làm</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label className="text-hr-text-secondary">Lương</Label>
                  <Input placeholder="25000000" className="mt-1" />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary hover:shadow-md transition-all"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateDialog(false)
                    toast({
                      title: "Thành công",
                      description: "Đã thêm nhân viên mới",
                    })
                  }}
                  className="bg-hr-primary hover:bg-hr-primary-dark hover:shadow-md text-white transition-all"
                >
                  Thêm nhân viên
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
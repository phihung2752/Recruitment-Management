"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import Pagination from "@/components/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield,
  UserCheck,
  UserX,
  Filter,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react'

interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
}

interface CreateUserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: number;
}

export default function UserManagementPage() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roleId: 1
  })
  const [editUserData, setEditUserData] = useState<CreateUserData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roleId: 1
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi tải danh sách người dùng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createUserData)
      })

      if (response.ok) {
        setSuccess('Tạo người dùng thành công!')
        setIsCreateDialogOpen(false)
        setCreateUserData({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          roleId: 1
        })
        loadUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi tạo người dùng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo người dùng')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditUserData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      roleId: 1 // Default role for now
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/users/${editingUser.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editUserData)
      })

      if (response.ok) {
        setSuccess('Cập nhật người dùng thành công!')
        setIsEditDialogOpen(false)
        setEditingUser(null)
        loadUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi cập nhật người dùng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật người dùng')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return

    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setSuccess('Xóa người dùng thành công!')
        loadUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi xóa người dùng')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa người dùng')
    }
  }

  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
      
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setSuccess(`Cập nhật trạng thái người dùng thành ${newStatus}!`)
        loadUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800 border-red-200'
      case 'HR': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Manager': return 'bg-green-100 text-green-800 border-green-200'
      case 'Employee': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Interviewer': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <ProtectedRoute requiredPermissions={['user.read']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-hr-primary rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-hr-text-primary">Quản lý người dùng</h1>
              <p className="text-hr-text-secondary">Quản lý tài khoản và phân quyền người dùng</p>
            </div>
          </div>
          {hasPermission('users.create') && (
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="bg-hr-primary hover:bg-hr-primary-dark text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo người dùng mới
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách người dùng ({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 border border-hr-border rounded-lg hover:bg-hr-bg-secondary">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-hr-primary bg-opacity-20 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-hr-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-hr-text-primary">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-hr-text-secondary">{user.email}</p>
                        <p className="text-xs text-hr-text-secondary">@{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getRoleBadgeClass(user.roleName)}>
                        {user.roleName}
                      </Badge>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-hr-text-secondary">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Chưa đăng nhập'}
                        </p>
                        <p className="text-xs text-hr-text-secondary">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {hasPermission('users.edit') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {hasPermission('users.edit') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.userId, user.status)}
                          >
                            {user.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                        )}
                        {hasPermission('users.delete') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.userId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    value={createUserData.firstName}
                    onChange={(e) => setCreateUserData({...createUserData, firstName: e.target.value})}
                    placeholder="Nhập họ"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    value={createUserData.lastName}
                    onChange={(e) => setCreateUserData({...createUserData, lastName: e.target.value})}
                    placeholder="Nhập tên"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={createUserData.username}
                  onChange={(e) => setCreateUserData({...createUserData, username: e.target.value})}
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData({...createUserData, email: e.target.value})}
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={createUserData.password}
                    onChange={(e) => setCreateUserData({...createUserData, password: e.target.value})}
                    placeholder="Nhập mật khẩu"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Tạo người dùng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">Họ</Label>
                  <Input
                    id="editFirstName"
                    value={editUserData.firstName}
                    onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})}
                    placeholder="Nhập họ"
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Tên</Label>
                  <Input
                    id="editLastName"
                    value={editUserData.lastName}
                    onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})}
                    placeholder="Nhập tên"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editUsername">Tên đăng nhập</Label>
                <Input
                  id="editUsername"
                  value={editUserData.username}
                  onChange={(e) => setEditUserData({...editUserData, username: e.target.value})}
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <Label htmlFor="editPassword">Mật khẩu mới (để trống nếu không thay đổi)</Label>
                <div className="relative">
                  <Input
                    id="editPassword"
                    type={showPassword ? "text" : "password"}
                    value={editUserData.password}
                    onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateUser} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
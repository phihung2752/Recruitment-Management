"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Users, 
  Key, 
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface Role {
  id: string
  name: string
  description: string
  isSystemRole: boolean
  userCount: number
  createdAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: string
  resource: string
  createdAt: string
}

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  status: string
  roleName: string
  createdAt: string
}

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userRoles, setUserRoles] = useState<Role[]>([])
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    loadData()
  }, [currentPage])

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Pagination functions
  const getCurrentPageItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [rolesRes, permissionsRes, usersRes] = await Promise.all([
        fetch('/api/admin/roles'),
        fetch('/api/admin/permissions'),
        fetch('/api/users')
      ])

      const rolesData = await rolesRes.json()
      const permissionsData = await permissionsRes.json()
      const usersData = await usersRes.json()

      if (rolesData.roles) {
        setRoles(rolesData.roles)
        setTotalItems(rolesData.roles.length)
      }
      if (permissionsData.permissions) setPermissions(permissionsData.permissions)
      if (usersData.success && usersData.users) setUsers(usersData.users)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
      })

      if (response.ok) {
        loadData()
        if (selectedUser?.id === userId) {
          loadUserRoles(userId)
        }
      }
    } catch (error) {
      console.error('Error assigning role:', error)
    }
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadData()
        if (selectedUser?.id === userId) {
          loadUserRoles(userId)
        }
      }
    } catch (error) {
      console.error('Error removing role:', error)
    }
  }

  const loadUserRoles = async (userId: string) => {
    // This would need a separate API endpoint to get user's roles
    // For now, we'll use the roles from the main list
    setUserRoles(roles.filter(role => role.userCount > 0))
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    loadUserRoles(user.id)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-hr-primary" />
            <p className="text-hr-text-secondary">Đang tải dữ liệu quyền...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-hr-primary" />
        <div>
          <h1 className="text-3xl font-bold">Quản lý quyền</h1>
          <p className="text-hr-text-secondary">Quản lý vai trò và quyền hạn người dùng</p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Vai trò</TabsTrigger>
          <TabsTrigger value="permissions">Quyền hạn</TabsTrigger>
          <TabsTrigger value="assignments">Phân quyền</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách vai trò</CardTitle>
                <Button className="bg-hr-primary hover:bg-hr-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo vai trò mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCurrentPageItems(roles).map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{role.name}</h3>
                        <p className="text-sm text-hr-text-secondary">{role.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                            {role.isSystemRole ? "Hệ thống" : "Tùy chỉnh"}
                          </Badge>
                          <span className="text-xs text-hr-text-muted">
                            {role.userCount} người dùng
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.isSystemRole && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-hr-text-secondary">
                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} vai trò
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-hr-primary text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách quyền hạn</CardTitle>
                <Button className="bg-hr-primary hover:bg-hr-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo quyền mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Key className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{permission.name}</h3>
                        <p className="text-sm text-hr-text-secondary">{permission.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{permission.module}</Badge>
                          <Badge variant="outline">{permission.action}</Badge>
                          <Badge variant="outline">{permission.resource}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'border-hr-primary bg-hr-primary/10' 
                          : 'hover:bg-hr-bg-secondary'
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                          <p className="text-sm text-hr-text-secondary">@{user.username}</p>
                          <Badge variant="outline" className="text-xs">
                            {user.roleName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Role Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Phân quyền cho {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'người dùng'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Vai trò hiện tại:</h4>
                      {userRoles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{role.name}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Thêm vai trò:</h4>
                      {roles.filter(role => !userRoles.some(ur => ur.id === role.id)).map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{role.name}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignRole(selectedUser.id, role.id)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-hr-text-secondary text-center py-8">
                    Chọn một người dùng để phân quyền
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

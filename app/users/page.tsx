'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Edit, Trash2, Eye, Key, Mail, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string
  employeeId: string
  position: string
  level: string
  employmentType: string
  employmentStatus: string
  workLocation: string
  joinDate: string
  lastLoginAt: string
  avatarUrl: string
  status: string
  roleName: string
  departmentName: string
  managerName: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      console.log('Loading users...')
      const response = await fetch('/api/users')
      const data = await response.json()
      
      console.log('API Response:', data)
      
      if (data.success) {
        setUsers(data.users)
        console.log('Users loaded:', data.users.length)
      } else {
        setError(data.message || 'Failed to load users')
        console.error('API Error:', data.message)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
      console.log('Loading finished')
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (user.username || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.firstName || '').toLowerCase().includes(searchLower) ||
      (user.lastName || '').toLowerCase().includes(searchLower) ||
      (user.phone || '').toLowerCase().includes(searchLower) ||
      (user.employeeId || '').toLowerCase().includes(searchLower) ||
      (user.position || '').toLowerCase().includes(searchLower) ||
      (user.departmentName || '').toLowerCase().includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-primary mx-auto mb-4"></div>
            <p className="text-hr-text-secondary">Đang tải dữ liệu người dùng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={loadUsers} className="bg-hr-primary text-white">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-hr-text-primary">User Management</h1>
        <Button className="bg-hr-primary text-white hover:bg-hr-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search users by name, email, phone, employee ID, position, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-hr-bg-secondary border-hr-border text-hr-text-primary"
        />
      </div>

      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getCurrentPageItems().map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-hr-border rounded-lg hover:bg-hr-bg-primary transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <Users className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-lg text-hr-text-primary">{user.firstName} {user.lastName}</h3>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                        {user.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-hr-text-secondary">
                      <div>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Employee ID:</strong> {user.employeeId || 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Position:</strong> {user.position || 'N/A'}</p>
                        <p><strong>Department:</strong> {user.departmentName || 'N/A'}</p>
                        <p><strong>Manager:</strong> {user.managerName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">{user.roleName}</Badge>
                      <Badge variant="outline" className="text-xs">{user.employmentType || 'Full-time'}</Badge>
                      <Badge variant="outline" className="text-xs">{user.workLocation || 'HQ'}</Badge>
                      {user.joinDate && (
                        <span className="text-xs text-hr-text-secondary">
                          Joined: {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" title="View Profile">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Reset Password">
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Send Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="More Actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-hr-text-secondary">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "bg-hr-primary text-white" : "border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-hr-text-secondary">No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
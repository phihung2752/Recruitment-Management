'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Users, Plus, Edit, Trash2, Eye, Key, Mail, MoreVertical, ChevronLeft, ChevronRight, Save, X, Filter, Calendar as CalendarIcon, CheckSquare, Square, Send, UserCog, UserX, Download, Upload } from "lucide-react"

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
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Edit form states
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editFormOpen, setEditFormOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<User>>({})
  const [saving, setSaving] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: '',
    employmentType: '',
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined }
  })
  const [showFilters, setShowFilters] = useState(false)
  
  // Bulk actions states
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  
  // Reset password states
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
  
  // Add user states
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [addUserData, setAddUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    employeeId: '',
    position: '',
    level: '',
    employmentType: 'Full-time',
    employmentStatus: 'Active',
    workLocation: '',
    joinDate: '',
    avatarUrl: '',
    departmentName: '',
    managerName: '',
    password: '',
    confirmPassword: ''
  })
  const [addUserLoading, setAddUserLoading] = useState(false)

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
    const matchesSearch = (
      (user.username || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.firstName || '').toLowerCase().includes(searchLower) ||
      (user.lastName || '').toLowerCase().includes(searchLower) ||
      (user.phone || '').toLowerCase().includes(searchLower) ||
      (user.employeeId || '').toLowerCase().includes(searchLower) ||
      (user.position || '').toLowerCase().includes(searchLower) ||
      (user.departmentName || '').toLowerCase().includes(searchLower)
    )
    
    const matchesRole = !filters.role || user.roleName === filters.role
    const matchesStatus = !filters.status || user.status === filters.status
    const matchesDepartment = !filters.department || user.departmentName === filters.department
    const matchesEmploymentType = !filters.employmentType || user.employmentType === filters.employmentType
    
    let matchesDateRange = true
    if (filters.dateRange.from && user.joinDate) {
      const joinDate = new Date(user.joinDate)
      matchesDateRange = joinDate >= filters.dateRange.from
    }
    if (filters.dateRange.to && user.joinDate) {
      const joinDate = new Date(user.joinDate)
      matchesDateRange = matchesDateRange && joinDate <= filters.dateRange.to
    }
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment && matchesEmploymentType && matchesDateRange
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

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditFormData({
      ...user,
      // Ensure all fields have default values
      phone: user.phone || '',
      employeeId: user.employeeId || '',
      position: user.position || '',
      level: user.level || '',
      employmentType: user.employmentType || 'Full-time',
      employmentStatus: user.employmentStatus || 'Active',
      workLocation: user.workLocation || '',
      joinDate: user.joinDate || '',
      avatarUrl: user.avatarUrl || '',
      departmentName: user.departmentName || '',
      managerName: user.managerName || ''
    })
    setEditFormOpen(true)
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      setSaving(true)
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEditFormOpen(false)
        setEditingUser(null)
        setEditFormData({})
        loadUsers() // Reload users to show updated data
      } else {
        setError(data.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditFormOpen(false)
    setEditingUser(null)
    setEditFormData({})
  }

  const handleFilterChange = (key: string, value: string | Date | undefined) => {
    if (key === 'dateRange') {
      setFilters(prev => ({ ...prev, dateRange: value as { from: Date | undefined, to: Date | undefined } }))
      } else {
      setFilters(prev => ({ ...prev, [key]: value }))
    }
  }

  const clearFilters = () => {
    setFilters({
      role: '',
      status: '',
      department: '',
      employmentType: '',
      dateRange: { from: undefined, to: undefined }
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.role) count++
    if (filters.status) count++
    if (filters.department) count++
    if (filters.employmentType) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === getCurrentPageItems().length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(getCurrentPageItems().map(user => user.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return

    try {
      setBulkActionLoading(true)
      
      switch (action) {
        case 'sendEmail':
          // Implement bulk email sending
          console.log('Sending emails to:', selectedUsers)
          break
        case 'changeRole':
          // Implement bulk role change
          console.log('Changing roles for:', selectedUsers)
          break
        case 'deactivate':
          // Implement bulk deactivation
          console.log('Deactivating users:', selectedUsers)
          break
        case 'export':
          // Implement bulk export
          console.log('Exporting users:', selectedUsers)
          break
        case 'delete':
          // Implement bulk deletion
          console.log('Deleting users:', selectedUsers)
          break
      }
      
      // Clear selection after action
      setSelectedUsers([])
      setShowBulkActions(false)
      
    } catch (error) {
      console.error('Bulk action error:', error)
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user)
    setNewPassword('')
    setConfirmPassword('')
    setResetPasswordOpen(true)
  }

  const handleConfirmResetPassword = async () => {
    if (!resetPasswordUser) return
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setResetPasswordLoading(true)
      
      const response = await fetch(`/api/users/${resetPasswordUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResetPasswordOpen(false)
        setResetPasswordUser(null)
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        // Show success message
        console.log('Password reset successfully')
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      setError('Failed to reset password')
    } finally {
      setResetPasswordLoading(false)
    }
  }

  const handleCancelResetPassword = () => {
    setResetPasswordOpen(false)
    setResetPasswordUser(null)
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Remove user from list
        setUsers(users.filter(user => user.id !== userId))
        console.log('User deleted successfully')
      } else {
        setError(data.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
    }
  }

  const handleAddUser = () => {
    setAddUserData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      employeeId: '',
      position: '',
      level: '',
      employmentType: 'Full-time',
      employmentStatus: 'Active',
      workLocation: '',
      joinDate: '',
      avatarUrl: '',
      departmentName: '',
      managerName: '',
      password: '',
      confirmPassword: ''
    })
    setAddUserOpen(true)
  }

  const handleSaveNewUser = async () => {
    // Validation
    if (!addUserData.username || !addUserData.email || !addUserData.firstName || !addUserData.lastName) {
      setError('Username, email, first name, and last name are required')
      return
    }

    if (!addUserData.password || addUserData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (addUserData.password !== addUserData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setAddUserLoading(true)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addUserData),
      })

      const data = await response.json()

      if (data.success) {
        setAddUserOpen(false)
        setAddUserData({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          employeeId: '',
          position: '',
          level: '',
          employmentType: 'Full-time',
          employmentStatus: 'Active',
          workLocation: '',
          joinDate: '',
          avatarUrl: '',
          departmentName: '',
          managerName: '',
          password: '',
          confirmPassword: ''
        })
        loadUsers() // Reload users to show new user
        setError('')
      } else {
        setError(data.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user')
    } finally {
      setAddUserLoading(false)
    }
  }

  const handleCancelAddUser = () => {
    setAddUserOpen(false)
    setAddUserData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      employeeId: '',
      position: '',
      level: '',
      employmentType: 'Full-time',
      employmentStatus: 'Active',
      workLocation: '',
      joinDate: '',
      avatarUrl: '',
      departmentName: '',
      managerName: '',
      password: '',
      confirmPassword: ''
    })
    setError('')
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
        <Button 
          onClick={handleAddUser}
          className="bg-hr-primary text-white hover:bg-hr-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
                  <Input
            type="text"
            placeholder="Search users by name, email, phone, employee ID, position, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-hr-bg-secondary border-hr-border text-hr-text-primary"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
          >
                  <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
                </Button>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              Clear Filters
            </Button>
          )}
              </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                  <Label className="text-hr-text-primary">Role</Label>
                  <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                  <div>
                  <Label className="text-hr-text-primary">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                  <div>
                  <Label className="text-hr-text-primary">Department</Label>
                  <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                  <div>
                  <Label className="text-hr-text-primary">Employment Type</Label>
                  <Select value={filters.employmentType} onValueChange={(value) => handleFilterChange('employmentType', value)}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-hr-text-primary">Join Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-hr-bg-primary border-hr-border text-hr-text-primary hover:bg-hr-bg-secondary"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? filters.dateRange.from.toLocaleDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-hr-bg-secondary border-hr-border">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => handleFilterChange('dateRange', { ...filters.dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  </div>

                <div>
                  <Label className="text-hr-text-primary">Join Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-hr-bg-primary border-hr-border text-hr-text-primary hover:bg-hr-bg-secondary"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? filters.dateRange.to.toLocaleDateString() : "Select date"}
                </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-hr-bg-secondary border-hr-border">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => handleFilterChange('dateRange', { ...filters.dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  </div>
                </div>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="bg-hr-primary/10 border-hr-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-hr-text-primary font-medium">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
                  <Button 
                    variant="outline" 
                  size="sm"
                  onClick={() => setSelectedUsers([])}
                  className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                  >
                  Clear Selection
                  </Button>
                </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('sendEmail')}
                  disabled={bulkActionLoading}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('changeRole')}
                  disabled={bulkActionLoading}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Change Role
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={bulkActionLoading}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                  disabled={bulkActionLoading}
                  className="bg-purple-500 text-white hover:bg-purple-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  disabled={bulkActionLoading}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            </CardContent>
          </Card>
        )}

      <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
          <CardTitle className="text-hr-text-primary">Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {/* Select All Header */}
            <div className="flex items-center space-x-4 p-2 border-b border-hr-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="p-1 h-auto"
              >
                {selectedUsers.length === getCurrentPageItems().length && getCurrentPageItems().length > 0 ? (
                  <CheckSquare className="h-4 w-4 text-hr-primary" />
                ) : (
                  <Square className="h-4 w-4 text-hr-text-secondary" />
                )}
              </Button>
              <span className="text-sm text-hr-text-secondary">Select All</span>
            </div>

            {getCurrentPageItems().map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-hr-border rounded-lg hover:bg-hr-bg-primary transition-colors">
                  <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectUser(user.id)}
                    className="p-1 h-auto"
                  >
                    {selectedUsers.includes(user.id) ? (
                      <CheckSquare className="h-4 w-4 text-hr-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-hr-text-secondary" />
                    )}
                  </Button>
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    title="View Profile"
                    onClick={() => router.push(`/users/${user.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Edit" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                    title="Reset Password"
                    onClick={() => handleResetPassword(user)}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="Send Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" title="More Actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    title="Delete" 
                    onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                    className="bg-red-500 text-white hover:bg-red-600"
                    >
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
                  
                  {(() => {
                    const pages = []
                    const maxVisiblePages = 5
                    
                    if (totalPages <= maxVisiblePages) {
                      // Show all pages if total is small
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <Button 
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm" 
                            onClick={() => handlePageChange(i)}
                            className={currentPage === i ? "bg-hr-primary text-white" : "border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"}
                          >
                            {i}
                          </Button>
                        )
                      }
                    } else {
                      // Show smart pagination
                      if (currentPage <= 3) {
                        // Show first 3 pages + ... + last page
                        for (let i = 1; i <= 3; i++) {
                          pages.push(
                            <Button 
                              key={i}
                              variant={currentPage === i ? "default" : "outline"}
                              size="sm" 
                              onClick={() => handlePageChange(i)}
                              className={currentPage === i ? "bg-hr-primary text-white" : "border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"}
                            >
                              {i}
                            </Button>
                          )
                        }
                        pages.push(<span key="ellipsis1" className="px-2 text-hr-text-secondary">...</span>)
                        pages.push(
                          <Button 
                            key={totalPages}
                            variant={currentPage === totalPages ? "default" : "outline"}
                            size="sm" 
                            onClick={() => handlePageChange(totalPages)}
                            className={currentPage === totalPages ? "bg-hr-primary text-white" : "border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"}
                          >
                            {totalPages}
                          </Button>
                        )
                      } else if (currentPage >= totalPages - 2) {
                        // Show first page + ... + last 3 pages
                        pages.push(
                          <Button 
                            key={1}
                            variant="outline"
                            size="sm" 
                            onClick={() => handlePageChange(1)}
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                          >
                            1
                          </Button>
                        )
                        pages.push(<span key="ellipsis2" className="px-2 text-hr-text-secondary">...</span>)
                        for (let i = totalPages - 2; i <= totalPages; i++) {
                          pages.push(
                            <Button 
                              key={i}
                              variant={currentPage === i ? "default" : "outline"}
                              size="sm" 
                              onClick={() => handlePageChange(i)}
                              className={currentPage === i ? "bg-hr-primary text-white" : "border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"}
                            >
                              {i}
                            </Button>
                          )
                        }
                      } else {
                        // Show first page + ... + current-1, current, current+1 + ... + last page
                        pages.push(
                          <Button 
                            key={1}
                            variant="outline"
                            size="sm" 
                            onClick={() => handlePageChange(1)}
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                          >
                            1
                          </Button>
                        )
                        pages.push(<span key="ellipsis3" className="px-2 text-hr-text-secondary">...</span>)
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                          pages.push(
                            <Button 
                              key={i}
                              variant={currentPage === i ? "default" : "outline"}
                              size="sm" 
                              onClick={() => handlePageChange(i)}
                              className={currentPage === i ? "bg-hr-primary text-white" : "border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"}
                            >
                              {i}
                            </Button>
                          )
                        }
                        pages.push(<span key="ellipsis4" className="px-2 text-hr-text-secondary">...</span>)
                        pages.push(
                    <Button 
                            key={totalPages}
                            variant="outline"
                      size="sm" 
                            onClick={() => handlePageChange(totalPages)}
                            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                          >
                            {totalPages}
                          </Button>
                        )
                      }
                      
                      return pages
                    })()}
                  })}
                  
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

      {/* Edit User Dialog */}
      <Dialog open={editFormOpen} onOpenChange={setEditFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-hr-bg-secondary border-hr-border">
          <DialogHeader>
            <DialogTitle className="text-hr-text-primary">Edit User: {editingUser?.firstName} {editingUser?.lastName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-hr-text-primary">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-hr-text-primary">First Name</Label>
                  <Input
                    id="firstName"
                    value={editFormData.firstName || ''}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
    </div>
                <div>
                  <Label htmlFor="lastName" className="text-hr-text-primary">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editFormData.lastName || ''}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-hr-text-primary">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-hr-text-primary">Phone</Label>
                  <Input
                    id="phone"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-hr-text-primary">Work Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId" className="text-hr-text-primary">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={editFormData.employeeId || ''}
                    onChange={(e) => setEditFormData({...editFormData, employeeId: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="text-hr-text-primary">Position</Label>
                  <Input
                    id="position"
                    value={editFormData.position || ''}
                    onChange={(e) => setEditFormData({...editFormData, position: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="level" className="text-hr-text-primary">Level</Label>
                  <Select value={editFormData.level || ''} onValueChange={(value) => setEditFormData({...editFormData, level: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employmentType" className="text-hr-text-primary">Employment Type</Label>
                  <Select value={editFormData.employmentType || ''} onValueChange={(value) => setEditFormData({...editFormData, employmentType: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employmentStatus" className="text-hr-text-primary">Employment Status</Label>
                  <Select value={editFormData.employmentStatus || ''} onValueChange={(value) => setEditFormData({...editFormData, employmentStatus: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Probation">Probation</SelectItem>
                      <SelectItem value="Notice Period">Notice Period</SelectItem>
                      <SelectItem value="Resigned">Resigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workLocation" className="text-hr-text-primary">Work Location</Label>
                  <Input
                    id="workLocation"
                    value={editFormData.workLocation || ''}
                    onChange={(e) => setEditFormData({...editFormData, workLocation: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate" className="text-hr-text-primary">Join Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={editFormData.joinDate || ''}
                    onChange={(e) => setEditFormData({...editFormData, joinDate: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-hr-text-primary">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departmentName" className="text-hr-text-primary">Department</Label>
                  <Input
                    id="departmentName"
                    value={editFormData.departmentName || ''}
                    onChange={(e) => setEditFormData({...editFormData, departmentName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="managerName" className="text-hr-text-primary">Manager</Label>
                  <Input
                    id="managerName"
                    value={editFormData.managerName || ''}
                    onChange={(e) => setEditFormData({...editFormData, managerName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="avatarUrl" className="text-hr-text-primary">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={editFormData.avatarUrl || ''}
                    onChange={(e) => setEditFormData({...editFormData, avatarUrl: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-hr-text-primary">Status</Label>
                  <Select value={editFormData.status || ''} onValueChange={(value) => setEditFormData({...editFormData, status: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-hr-border">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={saving}
                className="bg-hr-primary text-white hover:bg-hr-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="max-w-md bg-hr-bg-secondary border-hr-border">
          <DialogHeader>
            <DialogTitle className="text-hr-text-primary">
              Reset Password for {resetPasswordUser?.firstName} {resetPasswordUser?.lastName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword" className="text-hr-text-primary">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-hr-text-primary">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                placeholder="Confirm new password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelResetPassword}
                className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmResetPassword}
                disabled={resetPasswordLoading || !newPassword || !confirmPassword}
                className="bg-hr-primary text-white hover:bg-hr-primary/90"
              >
                {resetPasswordLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-hr-bg-secondary border-hr-border">
          <DialogHeader>
            <DialogTitle className="text-hr-text-primary">Add New User</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-hr-text-primary">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-username" className="text-hr-text-primary">Username *</Label>
                  <Input
                    id="add-username"
                    value={addUserData.username}
                    onChange={(e) => setAddUserData({...addUserData, username: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add-email" className="text-hr-text-primary">Email *</Label>
                  <Input
                    id="add-email"
                    type="email"
                    value={addUserData.email}
                    onChange={(e) => setAddUserData({...addUserData, email: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add-firstName" className="text-hr-text-primary">First Name *</Label>
                  <Input
                    id="add-firstName"
                    value={addUserData.firstName}
                    onChange={(e) => setAddUserData({...addUserData, firstName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add-lastName" className="text-hr-text-primary">Last Name *</Label>
                  <Input
                    id="add-lastName"
                    value={addUserData.lastName}
                    onChange={(e) => setAddUserData({...addUserData, lastName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add-phone" className="text-hr-text-primary">Phone</Label>
                  <Input
                    id="add-phone"
                    value={addUserData.phone}
                    onChange={(e) => setAddUserData({...addUserData, phone: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="add-password" className="text-hr-text-primary">Password *</Label>
                  <Input
                    id="add-password"
                    type="password"
                    value={addUserData.password}
                    onChange={(e) => setAddUserData({...addUserData, password: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="add-confirmPassword" className="text-hr-text-primary">Confirm Password *</Label>
                  <Input
                    id="add-confirmPassword"
                    type="password"
                    value={addUserData.confirmPassword}
                    onChange={(e) => setAddUserData({...addUserData, confirmPassword: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-hr-text-primary">Work Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-employeeId" className="text-hr-text-primary">Employee ID</Label>
                  <Input
                    id="add-employeeId"
                    value={addUserData.employeeId}
                    onChange={(e) => setAddUserData({...addUserData, employeeId: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="add-position" className="text-hr-text-primary">Position</Label>
                  <Input
                    id="add-position"
                    value={addUserData.position}
                    onChange={(e) => setAddUserData({...addUserData, position: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="add-level" className="text-hr-text-primary">Level</Label>
                  <Select value={addUserData.level} onValueChange={(value) => setAddUserData({...addUserData, level: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Director">Director</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-employmentType" className="text-hr-text-primary">Employment Type</Label>
                  <Select value={addUserData.employmentType} onValueChange={(value) => setAddUserData({...addUserData, employmentType: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-employmentStatus" className="text-hr-text-primary">Employment Status</Label>
                  <Select value={addUserData.employmentStatus} onValueChange={(value) => setAddUserData({...addUserData, employmentStatus: value})}>
                    <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent className="bg-hr-bg-secondary border-hr-border">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Probation">Probation</SelectItem>
                      <SelectItem value="Notice Period">Notice Period</SelectItem>
                      <SelectItem value="Resigned">Resigned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-workLocation" className="text-hr-text-primary">Work Location</Label>
                  <Input
                    id="add-workLocation"
                    value={addUserData.workLocation}
                    onChange={(e) => setAddUserData({...addUserData, workLocation: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="add-joinDate" className="text-hr-text-primary">Join Date</Label>
                  <Input
                    id="add-joinDate"
                    type="date"
                    value={addUserData.joinDate}
                    onChange={(e) => setAddUserData({...addUserData, joinDate: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-hr-text-primary">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-departmentName" className="text-hr-text-primary">Department</Label>
                  <Input
                    id="add-departmentName"
                    value={addUserData.departmentName}
                    onChange={(e) => setAddUserData({...addUserData, departmentName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="add-managerName" className="text-hr-text-primary">Manager</Label>
                  <Input
                    id="add-managerName"
                    value={addUserData.managerName}
                    onChange={(e) => setAddUserData({...addUserData, managerName: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="add-avatarUrl" className="text-hr-text-primary">Avatar URL</Label>
                  <Input
                    id="add-avatarUrl"
                    value={addUserData.avatarUrl}
                    onChange={(e) => setAddUserData({...addUserData, avatarUrl: e.target.value})}
                    className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-hr-border">
              <Button
                variant="outline"
                onClick={handleCancelAddUser}
                className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewUser}
                disabled={addUserLoading}
                className="bg-hr-primary text-white hover:bg-hr-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {addUserLoading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
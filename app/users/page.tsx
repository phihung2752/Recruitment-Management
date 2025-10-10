"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Key,
  Mail,
  MoreVertical
} from "lucide-react"

interface User {
  Id: string
  Username: string
  Email: string
  FirstName: string
  LastName: string
  Phone: string
  EmployeeId: string
  Position: string
  Level: string
  EmploymentType: string
  EmploymentStatus: string
  WorkLocation: string
  JoinDate: string
  LastLoginAt: string
  AvatarUrl: string
  Status: string
  RoleName: string
  DepartmentName: string
  ManagerName: string
  CreatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  })
  const [submitting, setSubmitting] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  
  const router = useRouter()

  // Pagination functions
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
        setTotalItems(data.users.length)
      } else {
        setError(data.message || 'Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('User created successfully')
        setNewUser({ username: "", email: "", password: "", firstName: "", lastName: "" })
        setShowAddForm(false)
        loadUsers()
      } else {
        setError(data.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSuccess('User deleted successfully')
        loadUsers()
      } else {
        setError(data.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
    }
  }

  const filteredUsers = users.filter(user => 
    user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.Phone && user.Phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.EmployeeId && user.EmployeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.Position && user.Position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.DepartmentName && user.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-hr-primary" />
            <p className="text-hr-text-secondary">Đang tải dữ liệu người dùng...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-hr-primary" />
          <div>
            <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
            <p className="text-hr-text-secondary">Quản lý tài khoản và phân quyền người dùng</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-hr-primary hover:bg-hr-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Tạo người dùng mới
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add User Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getCurrentPageItems().map((user) => (
                <div key={user.Id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.AvatarUrl ? (
                        <img src={user.AvatarUrl} alt={user.FirstName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <Users className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-lg">{user.FirstName} {user.LastName}</h3>
                        <Badge variant={user.Status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                          {user.Status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Email:</strong> {user.Email}</p>
                          <p><strong>Phone:</strong> {user.Phone || 'N/A'}</p>
                          <p><strong>Employee ID:</strong> {user.EmployeeId || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Position:</strong> {user.Position || 'N/A'}</p>
                          <p><strong>Department:</strong> {user.DepartmentName}</p>
                          <p><strong>Manager:</strong> {user.ManagerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">{user.RoleName}</Badge>
                        <Badge variant="outline" className="text-xs">{user.EmploymentType || 'Full-time'}</Badge>
                        <Badge variant="outline" className="text-xs">{user.WorkLocation || 'HQ'}</Badge>
                        {user.JoinDate && (
                          <span className="text-xs text-gray-500">
                            Joined: {new Date(user.JoinDate).toLocaleDateString()}
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
                    <Button 
                      size="sm" 
                      variant="outline"
                      title="Delete"
                      onClick={() => handleDeleteUser(user.Id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
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
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


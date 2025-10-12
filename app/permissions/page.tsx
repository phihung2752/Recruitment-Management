'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Key,
  Shield,
  Users,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'

interface Permission {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  type: string
  module: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    category: '',
    type: '',
    module: '',
    isActive: true
  })

  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/permissions')

        if (response.ok) {
          const data = await response.json()
          setPermissions(data.permissions || [])
          setTotalPages(data.totalPages || 1)
        } else {
          console.error('Failed to fetch permissions')
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [currentPage, searchTerm, categoryFilter, typeFilter])

  // Filter permissions
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'All' || permission.category === categoryFilter
    const matchesType = typeFilter === 'All' || permission.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  // Pagination
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredPermissions.length)
  const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex)

  const handleCreatePermission = async () => {
    try {
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setPermissions(prev => [data.permission, ...prev])
        setShowCreateDialog(false)
        setFormData({
          name: '',
          displayName: '',
          description: '',
          category: '',
          type: '',
          module: '',
          isActive: true
        })
      }
    } catch (error) {
      console.error('Error creating permission:', error)
    }
  }

  const handleEditPermission = async () => {
    if (!editingPermission) return

    try {
      const response = await fetch('/api/permissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissionId: editingPermission.id,
          ...formData
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPermissions(prev => prev.map(p => p.id === editingPermission.id ? data.permission : p))
        setShowEditDialog(false)
        setEditingPermission(null)
      }
    } catch (error) {
      console.error('Error updating permission:', error)
    }
  }

  const handleDeletePermission = async (permissionId: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return

    try {
      const response = await fetch(`/api/permissions?permissionId=${permissionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPermissions(prev => prev.filter(p => p.id !== permissionId))
      }
    } catch (error) {
      console.error('Error deleting permission:', error)
    }
  }

  const handleSelectPermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPermissions.length === paginatedPermissions.length) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(paginatedPermissions.map(p => p.id))
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'create': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-yellow-100 text-yellow-800'
      case 'delete': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'User Management': return <Users className="w-4 h-4" />
      case 'Recruitment': return <Users className="w-4 h-4" />
      case 'Employee Management': return <Users className="w-4 h-4" />
      case 'Reporting': return <Settings className="w-4 h-4" />
      case 'System': return <Settings className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-hr-text-primary">Permissions</h1>
          <p className="text-hr-text-secondary">Manage system permissions and access control</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-hr-primary hover:bg-hr-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., user.read"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., View Users"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Permission description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User Management">User Management</SelectItem>
                    <SelectItem value="Recruitment">Recruitment</SelectItem>
                    <SelectItem value="Employee Management">Employee Management</SelectItem>
                    <SelectItem value="Reporting">Reporting</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module" className="text-right">Module</Label>
                <Input
                  id="module"
                  value={formData.module}
                  onChange={(e) => setFormData(prev => ({ ...prev, module: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Users"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreatePermission}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hr-text-muted h-4 w-4" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="User Management">User Management</SelectItem>
                <SelectItem value="Recruitment">Recruitment</SelectItem>
                <SelectItem value="Employee Management">Employee Management</SelectItem>
                <SelectItem value="Reporting">Reporting</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Permissions ({filteredPermissions.length})</span>
            {selectedPermissions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-hr-text-muted">
                  {selectedPermissions.length} selected
                </span>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hr-border">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.length === paginatedPermissions.length && paginatedPermissions.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-hr-text-primary">Permission</th>
                    <th className="text-left p-3 font-medium text-hr-text-primary">Category</th>
                    <th className="text-left p-3 font-medium text-hr-text-primary">Type</th>
                    <th className="text-left p-3 font-medium text-hr-text-primary">Module</th>
                    <th className="text-left p-3 font-medium text-hr-text-primary">Status</th>
                    <th className="text-left p-3 font-medium text-hr-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPermissions.map((permission) => (
                    <tr key={permission.id} className="border-b border-hr-border hover:bg-hr-bg-primary/50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handleSelectPermission(permission.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-hr-text-primary">{permission.displayName}</div>
                          <div className="text-sm text-hr-text-muted">{permission.name}</div>
                          <div className="text-sm text-hr-text-muted">{permission.description}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(permission.category)}
                          <span className="text-hr-text-primary">{permission.category}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getTypeColor(permission.type)}>
                          {permission.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-hr-text-primary">{permission.module}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {permission.isActive ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                          <span className={permission.isActive ? 'text-green-600' : 'text-red-600'}>
                            {permission.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPermission(permission)
                              setFormData({
                                name: permission.name,
                                displayName: permission.displayName,
                                description: permission.description,
                                category: permission.category,
                                type: permission.type,
                                module: permission.module,
                                isActive: permission.isActive
                              })
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePermission(permission.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-hr-text-muted">
                Showing {startIndex + 1} to {endIndex} of {filteredPermissions.length} permissions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-hr-text-primary">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-displayName" className="text-right">Display Name</Label>
              <Input
                id="edit-displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User Management">User Management</SelectItem>
                  <SelectItem value="Recruitment">Recruitment</SelectItem>
                  <SelectItem value="Employee Management">Employee Management</SelectItem>
                  <SelectItem value="Reporting">Reporting</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-module" className="text-right">Module</Label>
              <Input
                id="edit-module"
                value={formData.module}
                onChange={(e) => setFormData(prev => ({ ...prev, module: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-active" className="text-right">Active</Label>
              <Switch
                id="edit-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditPermission}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

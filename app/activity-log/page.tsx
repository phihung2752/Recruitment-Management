'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  User, 
  Edit, 
  Key, 
  Mail, 
  Trash2, 
  Plus, 
  Calendar,
  Filter,
  Search,
  Clock,
  UserCog,
  Shield,
  FileText,
  Download,
  RefreshCw
} from "lucide-react"
import ActivityLog from "@/components/activity-log"

interface ActivityLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  description: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
  details?: any
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      
      // Generate comprehensive mock data
      const mockActivities: ActivityLogEntry[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          action: 'profile_updated',
          description: 'Updated personal information',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { fields: ['firstName', 'lastName', 'email'] }
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'password_changed',
          description: 'Password changed successfully',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Johnson',
          action: 'login',
          description: 'User logged in',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
        },
        {
          id: '4',
          userId: 'user1',
          userName: 'John Doe',
          action: 'role_changed',
          description: 'Role changed from Employee to Manager',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { oldRole: 'Employee', newRole: 'Manager' }
        },
        {
          id: '5',
          userId: 'user4',
          userName: 'Sarah Wilson',
          action: 'email_sent',
          description: 'Welcome email sent',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '6',
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'permission_changed',
          description: 'Permissions updated for HR module',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          details: { module: 'HR', permissions: ['read', 'write', 'delete'] }
        },
        {
          id: '7',
          userId: 'user5',
          userName: 'David Brown',
          action: 'document_uploaded',
          description: 'CV document uploaded',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.104',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          details: { fileName: 'cv_david_brown.pdf', fileSize: '2.5MB' }
        },
        {
          id: '8',
          userId: 'user3',
          userName: 'Mike Johnson',
          action: 'profile_updated',
          description: 'Updated work information',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          details: { fields: ['position', 'department', 'manager'] }
        },
        {
          id: '9',
          userId: 'user1',
          userName: 'John Doe',
          action: 'login',
          description: 'User logged in',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '10',
          userId: 'user4',
          userName: 'Sarah Wilson',
          action: 'password_changed',
          description: 'Password changed successfully',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      ]

      setActivities(mockActivities)
    } catch (error) {
      console.error('Error loading activities:', error)
      setError('Failed to load activity log')
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'profile_updated':
        return <Edit className="h-4 w-4 text-blue-500" />
      case 'password_changed':
        return <Key className="h-4 w-4 text-green-500" />
      case 'login':
        return <User className="h-4 w-4 text-purple-500" />
      case 'role_changed':
        return <UserCog className="h-4 w-4 text-orange-500" />
      case 'email_sent':
        return <Mail className="h-4 w-4 text-cyan-500" />
      case 'permission_changed':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'document_uploaded':
        return <FileText className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'profile_updated':
        return 'bg-blue-100 text-blue-800'
      case 'password_changed':
        return 'bg-green-100 text-green-800'
      case 'login':
        return 'bg-purple-100 text-purple-800'
      case 'role_changed':
        return 'bg-orange-100 text-orange-800'
      case 'email_sent':
        return 'bg-cyan-100 text-cyan-800'
      case 'permission_changed':
        return 'bg-red-100 text-red-800'
      case 'document_uploaded':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatActionName = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesUser = !filterUser || activity.userId === filterUser
    
    const matchesAction = !filterAction || activity.action === filterAction
    
    const matchesDate = !filterDate || 
      new Date(activity.timestamp).toDateString() === new Date(filterDate).toDateString()
    
    return matchesSearch && matchesUser && matchesAction && matchesDate
  })

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActivities = filteredActivities.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const exportActivities = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Description', 'IP Address'].join(','),
      ...filteredActivities.map(activity => [
        new Date(activity.timestamp).toISOString(),
        activity.userName,
        formatActionName(activity.action),
        activity.description,
        activity.ipAddress || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-primary mx-auto mb-4"></div>
            <p className="text-hr-text-secondary">Loading activity log...</p>
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
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadActivities} className="bg-hr-primary text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-hr-text-primary">Activity Log</h1>
          <Badge variant="outline" className="text-hr-text-secondary">
            {filteredActivities.length} activities
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={exportActivities}
            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={loadActivities}
            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-hr-text-secondary" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-hr-bg-primary border-hr-border text-hr-text-primary"
              />
            </div>
            
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent className="bg-hr-bg-secondary border-hr-border">
                <SelectItem value="">All Users</SelectItem>
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
                <SelectItem value="user3">Mike Johnson</SelectItem>
                <SelectItem value="user4">Sarah Wilson</SelectItem>
                <SelectItem value="user5">David Brown</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="bg-hr-bg-primary border-hr-border text-hr-text-primary">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent className="bg-hr-bg-secondary border-hr-border">
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="profile_updated">Profile Updated</SelectItem>
                <SelectItem value="password_changed">Password Changed</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="role_changed">Role Changed</SelectItem>
                <SelectItem value="email_sent">Email Sent</SelectItem>
                <SelectItem value="permission_changed">Permission Changed</SelectItem>
                <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
            />
          </div>
          
          {(searchTerm || filterUser || filterAction || filterDate) && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterUser('')
                  setFilterAction('')
                  setFilterDate('')
                }}
                className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentActivities.length > 0 ? (
              currentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border border-hr-border rounded-lg hover:bg-hr-bg-primary transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={`text-xs ${getActionBadgeColor(activity.action)}`}>
                        {formatActionName(activity.action)}
                      </Badge>
                      <span className="text-sm text-hr-text-secondary">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-hr-text-primary font-medium mb-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-hr-text-secondary">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {activity.userName}
                      </span>
                      {activity.ipAddress && (
                        <span className="flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {activity.ipAddress}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    {activity.details && (
                      <div className="mt-2 p-2 bg-hr-bg-primary rounded text-xs text-hr-text-secondary">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(activity.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-hr-text-secondary">No activities found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-hr-text-secondary">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredActivities.length)} of {filteredActivities.length} activities
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                >
                  Previous
                </Button>
                <span className="text-sm text-hr-text-secondary">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  FileText
} from "lucide-react"

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

interface ActivityLogProps {
  userId?: string
  showFilters?: boolean
  maxEntries?: number
}

export default function ActivityLog({ userId, showFilters = true, maxEntries = 50 }: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    loadActivities()
  }, [userId])

  const loadActivities = async () => {
    try {
      setLoading(true)
      
      // For now, generate mock data
      const mockActivities: ActivityLogEntry[] = [
        {
          id: '1',
          userId: userId || 'user1',
          userName: 'John Doe',
          action: 'profile_updated',
          description: 'Updated personal information',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          details: { fields: ['firstName', 'lastName', 'email'] }
        },
        {
          id: '2',
          userId: userId || 'user1',
          userName: 'John Doe',
          action: 'password_changed',
          description: 'Password changed successfully',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '3',
          userId: userId || 'user1',
          userName: 'John Doe',
          action: 'login',
          description: 'User logged in',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: '4',
          userId: userId || 'user1',
          userName: 'John Doe',
          action: 'role_changed',
          description: 'Role changed from Employee to Manager',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          details: { oldRole: 'Employee', newRole: 'Manager' }
        },
        {
          id: '5',
          userId: userId || 'user1',
          userName: 'John Doe',
          action: 'email_sent',
          description: 'Welcome email sent',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        }
      ]

      setActivities(mockActivities.slice(0, maxEntries))
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
    
    const matchesAction = !filterAction || activity.action === filterAction
    
    const matchesDate = !filterDate || 
      new Date(activity.timestamp).toDateString() === new Date(filterDate).toDateString()
    
    return matchesSearch && matchesAction && matchesDate
  })

  if (loading) {
    return (
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-primary"></div>
            <span className="ml-3 text-hr-text-secondary">Loading activities...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={loadActivities}
              className="mt-4 bg-hr-primary text-white hover:bg-hr-primary/90"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-hr-bg-secondary border-hr-border">
      <CardHeader>
        <CardTitle className="text-hr-text-primary flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Activity Log ({filteredActivities.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-hr-text-secondary" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-hr-bg-primary border-hr-border text-hr-text-primary"
                />
              </div>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-48 bg-hr-bg-primary border-hr-border text-hr-text-primary">
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
              {(searchTerm || filterAction || filterDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setFilterAction('')
                    setFilterDate('')
                  }}
                  className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
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
              {searchTerm || filterAction || filterDate ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setFilterAction('')
                    setFilterDate('')
                  }}
                  className="mt-4 border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

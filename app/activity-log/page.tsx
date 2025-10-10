'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, User, Edit, Key, Mail, Clock, Download, RefreshCw } from "lucide-react"

interface ActivityLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  description: string
  timestamp: string
  ipAddress?: string
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      
      // Generate simple mock data
      const mockActivities: ActivityLogEntry[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          action: 'profile_updated',
          description: 'Updated personal information',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'password_changed',
          description: 'Password changed successfully',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.101'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Mike Johnson',
          action: 'login',
          description: 'User logged in',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.102'
        },
        {
          id: '4',
          userId: 'user1',
          userName: 'John Doe',
          action: 'role_changed',
          description: 'Role changed from Employee to Manager',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.100'
        },
        {
          id: '5',
          userId: 'user4',
          userName: 'Sarah Wilson',
          action: 'email_sent',
          description: 'Welcome email sent',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.103'
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
        return <User className="h-4 w-4 text-orange-500" />
      case 'email_sent':
        return <Mail className="h-4 w-4 text-cyan-500" />
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
    
    return matchesSearch
  })

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

      {/* Search */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Search Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-hr-bg-primary border-hr-border text-hr-text-primary"
          />
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
        </CardContent>
      </Card>
    </div>
  )
}
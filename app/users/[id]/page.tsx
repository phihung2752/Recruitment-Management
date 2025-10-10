'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Users, 
  Shield,
  Activity,
  FileText,
  Settings,
  Key,
  Clock,
  Award,
  GraduationCap
} from "lucide-react"
import ActivityLog from "@/components/activity-log"

interface UserProfile {
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

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) {
      loadUserProfile()
    }
  }, [userId])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
      } else {
        setError(data.message || 'Failed to load user profile')
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-primary mx-auto mb-4"></div>
            <p className="text-hr-text-secondary">Đang tải thông tin người dùng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="space-y-6 p-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error || 'User not found'}</p>
            <Button onClick={() => router.back()} className="bg-hr-primary text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
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
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-hr-text-primary">User Profile</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-hr-primary text-white hover:bg-hr-primary/90">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="bg-hr-primary text-white text-xl">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-hr-text-primary">
                  {user.firstName} {user.lastName}
                </h2>
                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                  {user.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {user.roleName}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-hr-text-secondary">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>{user.position || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.workLocation || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{user.departmentName || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-hr-bg-secondary border-hr-border">
          <TabsTrigger value="overview" className="text-hr-text-primary data-[state=active]:bg-hr-primary data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="personal" className="text-hr-text-primary data-[state=active]:bg-hr-primary data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="work" className="text-hr-text-primary data-[state=active]:bg-hr-primary data-[state=active]:text-white">
            <Building className="h-4 w-4 mr-2" />
            Work
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-hr-text-primary data-[state=active]:bg-hr-primary data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-hr-text-primary data-[state=active]:bg-hr-primary data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-hr-text-primary data-[state=active]:bg-hr-primary data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-hr-text-secondary">Username</p>
                    <p className="font-medium text-hr-text-primary">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Employee ID</p>
                    <p className="font-medium text-hr-text-primary">{user.employeeId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Email</p>
                    <p className="font-medium text-hr-text-primary">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Phone</p>
                    <p className="font-medium text-hr-text-primary">{user.phone || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-hr-text-secondary">Position</p>
                    <p className="font-medium text-hr-text-primary">{user.position || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Level</p>
                    <p className="font-medium text-hr-text-primary">{user.level || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Department</p>
                    <p className="font-medium text-hr-text-primary">{user.departmentName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Manager</p>
                    <p className="font-medium text-hr-text-primary">{user.managerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Employment Type</p>
                    <p className="font-medium text-hr-text-primary">{user.employmentType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Work Location</p>
                    <p className="font-medium text-hr-text-primary">{user.workLocation || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-hr-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-hr-text-primary">Account Created</p>
                    <p className="text-xs text-hr-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {user.joinDate && (
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-hr-text-primary">Joined Company</p>
                      <p className="text-xs text-hr-text-secondary">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {user.lastLoginAt && (
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-hr-text-primary">Last Login</p>
                      <p className="text-xs text-hr-text-secondary">
                        {new Date(user.lastLoginAt).toLocaleDateString()} at {new Date(user.lastLoginAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-hr-text-secondary">Full Name</p>
                    <p className="font-medium text-hr-text-primary">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Email</p>
                    <p className="font-medium text-hr-text-primary">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Phone</p>
                    <p className="font-medium text-hr-text-primary">{user.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-hr-text-secondary">Username</p>
                    <p className="font-medium text-hr-text-primary">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Status</p>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-hr-text-secondary">Avatar</p>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="bg-hr-primary text-white">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Tab */}
        <TabsContent value="work" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-hr-text-secondary">Position</p>
                  <p className="font-medium text-hr-text-primary">{user.position || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Level</p>
                  <p className="font-medium text-hr-text-primary">{user.level || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Employment Type</p>
                  <p className="font-medium text-hr-text-primary">{user.employmentType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Employment Status</p>
                  <p className="font-medium text-hr-text-primary">{user.employmentStatus || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Work Location</p>
                  <p className="font-medium text-hr-text-primary">{user.workLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Join Date</p>
                  <p className="font-medium text-hr-text-primary">
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-hr-text-secondary">Department</p>
                  <p className="font-medium text-hr-text-primary">{user.departmentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Manager</p>
                  <p className="font-medium text-hr-text-primary">{user.managerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Role</p>
                  <Badge variant="outline">{user.roleName}</Badge>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Employee ID</p>
                  <p className="font-medium text-hr-text-primary">{user.employeeId || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-hr-text-secondary">Primary Role</p>
                  <Badge variant="default" className="mt-1">{user.roleName}</Badge>
                </div>
                <div>
                  <p className="text-hr-text-secondary">Permissions</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-hr-text-primary">Read user data</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-hr-text-primary">Update own profile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-hr-text-primary">Limited admin access</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <ActivityLog userId={user.id} showFilters={true} maxEntries={20} />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents & Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-hr-text-secondary">No documents uploaded yet</p>
                <Button className="mt-4 bg-hr-primary text-white">
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

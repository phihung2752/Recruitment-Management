"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  Users, 
  Video,
  Phone,
  MapPin,
  Filter,
  SortAsc,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Download,
  RefreshCw
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"

interface Interview {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  candidatePosition: string
  interviewerId: string
  interviewerName: string
  interviewerEmail: string
  jobTitle: string
  department: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  type: 'online' | 'in-person'
  location?: string
  meetingLink?: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  result?: 'pass' | 'fail' | 'on-hold'
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function InterviewSchedulerPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [sortBy, setSortBy] = useState("scheduledDate")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Mock data
  const mockInterviews: Interview[] = [
    {
      id: "int-001",
      candidateId: "cand-001",
      candidateName: "Nguyễn Văn A",
      candidateEmail: "nguyenvana@email.com",
      candidatePosition: "Frontend Developer",
      interviewerId: "int-001",
      interviewerName: "Trần Thị B",
      interviewerEmail: "tranthib@company.com",
      jobTitle: "Senior Frontend Developer",
      department: "Engineering",
      scheduledDate: "2025-10-01",
      scheduledTime: "09:00",
      duration: 60,
      type: "online",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      status: "pending",
      createdAt: "2025-09-29T10:00:00Z",
      updatedAt: "2025-09-29T10:00:00Z"
    },
    {
      id: "int-002",
      candidateId: "cand-002",
      candidateName: "Lê Văn C",
      candidateEmail: "levanc@email.com",
      candidatePosition: "Backend Developer",
      interviewerId: "int-002",
      interviewerName: "Phạm Văn D",
      interviewerEmail: "phamvand@company.com",
      jobTitle: "Backend Developer",
      department: "Engineering",
      scheduledDate: "2025-10-02",
      scheduledTime: "14:00",
      duration: 90,
      type: "in-person",
      location: "Tầng 5, Tòa nhà ABC, 123 Đường XYZ",
      status: "in-progress",
      createdAt: "2025-09-29T11:00:00Z",
      updatedAt: "2025-09-29T11:00:00Z"
    },
    {
      id: "int-003",
      candidateId: "cand-003",
      candidateName: "Hoàng Thị E",
      candidateEmail: "hoangthie@email.com",
      candidatePosition: "UX Designer",
      interviewerId: "int-003",
      interviewerName: "Võ Văn F",
      interviewerEmail: "vovanf@company.com",
      jobTitle: "UX Designer",
      department: "Design",
      scheduledDate: "2025-09-30",
      scheduledTime: "10:30",
      duration: 75,
      type: "online",
      meetingLink: "https://zoom.us/j/123456789",
      status: "completed",
      result: "pass",
      notes: "Ứng viên có kỹ năng tốt, phù hợp với vị trí",
      createdAt: "2025-09-28T09:00:00Z",
      updatedAt: "2025-09-30T11:30:00Z"
    }
  ]

  // Fetch interviews
  const fetchInterviews = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInterviews(mockInterviews)
    } catch (error) {
      console.error('Error fetching interviews:', error)
      toast({
        title: "Error",
        description: "Failed to fetch interviews",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsClient(true)
    fetchInterviews()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock
      case "in-progress": return AlertCircle
      case "completed": return CheckCircle
      case "cancelled": return XCircle
      default: return Clock
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'online' ? Video : Phone
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.interviewerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || interview.status === statusFilter
    const matchesType = typeFilter === "All" || interview.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const sortedInterviews = filteredInterviews.sort((a, b) => {
    switch (sortBy) {
      case "scheduledDate":
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      case "candidateName":
        return a.candidateName.localeCompare(b.candidateName)
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const handleCreateInterview = () => {
    setIsCreateDialogOpen(true)
  }

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview)
  }

  const handleEditInterview = (interview: Interview) => {
    // TODO: Implement edit functionality
    console.log('Edit interview:', interview)
  }

  const handleDeleteInterview = (interview: Interview) => {
    // TODO: Implement delete functionality
    console.log('Delete interview:', interview)
  }

  const handleSendReminder = (interview: Interview) => {
    // TODO: Implement send reminder functionality
    console.log('Send reminder for:', interview)
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${interview.candidateName}`,
    })
  }

  const handleJoinMeeting = (interview: Interview) => {
    if (interview.type === 'online' && interview.meetingLink) {
      window.open(interview.meetingLink, '_blank')
    }
  }

  if (!isClient || loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Interview Scheduler</h1>
          <p className="text-muted-foreground">Quản lý lịch phỏng vấn và đánh giá ứng viên</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleCreateInterview}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search interviews..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="scheduledDate">Sort by Date</option>
                <option value="candidateName">Sort by Candidate</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedInterviews.map((interview) => {
          const StatusIcon = getStatusIcon(interview.status)
          const TypeIcon = getTypeIcon(interview.type)
          
          return (
            <Card key={interview.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/api/placeholder/40/40`} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                        {interview.candidateName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {interview.candidateName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {interview.jobTitle}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {interview.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Interview Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDateTime(interview.scheduledDate, interview.scheduledTime)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{interview.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{interview.interviewerName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <TypeIcon className="mr-2 h-4 w-4" />
                    <span className="capitalize">{interview.type}</span>
                    {interview.type === 'online' && interview.meetingLink && (
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                        onClick={() => handleJoinMeeting(interview)}
                      >
                        Join Meeting
                      </Button>
                    )}
                  </div>
                  
                  {interview.type === 'in-person' && interview.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span className="truncate">{interview.location}</span>
                    </div>
                  )}
                </div>

                {/* Result */}
                {interview.result && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Result:</span>
                    <Badge 
                      variant={interview.result === 'pass' ? 'default' : interview.result === 'fail' ? 'destructive' : 'secondary'}
                      className={interview.result === 'pass' ? 'bg-green-100 text-green-800' : interview.result === 'fail' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {interview.result.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInterview(interview)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditInterview(interview)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInterview(interview)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {interview.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendReminder(interview)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Remind
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {sortedInterviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No interviews found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "All" || typeFilter !== "All" 
                ? "Try adjusting your filters to see more results."
                : "Get started by scheduling your first interview."
              }
            </p>
            <Button onClick={handleCreateInterview}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}






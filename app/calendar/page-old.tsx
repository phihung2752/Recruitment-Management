"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Bell, 
  Filter, 
  Download, 
  Share2,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Mail,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { toast } from "@/hooks/use-toast"

interface CalendarEvent {
  id: string
  title: string
  type: 'interview' | 'deadline' | 'meeting' | 'onboarding' | 'other'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  startTime: string
  endTime: string
  date: string
  candidateName?: string
  candidateEmail?: string
  position?: string
  interviewer?: string
  interviewerEmail?: string
  location?: string
  meetingLink?: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  isRecurring: boolean
  reminder: number[] // minutes before event
}

interface CalendarStats {
  totalEvents: number
  interviewsToday: number
  deadlinesThisWeek: number
  completedInterviews: number
  successRate: number
}

export default function CalendarPage() {
  const { user, isAuthenticated } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda' | 'timeline'>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    interviewsToday: 0,
    deadlinesThisWeek: 0,
    completedInterviews: 0,
    successRate: 0
  })

  // Mock data
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Phỏng vấn Frontend Developer',
        type: 'interview',
        status: 'scheduled',
        startTime: '09:00',
        endTime: '10:00',
        date: '2024-01-15',
        candidateName: 'Nguyễn Văn A',
        candidateEmail: 'nguyen.van.a@email.com',
        position: 'Frontend Developer',
        interviewer: 'HR Manager',
        interviewerEmail: 'hr@company.com',
        location: 'Phòng họp A',
        description: 'Phỏng vấn kỹ thuật vòng 1',
        priority: 'high',
        isRecurring: false,
        reminder: [15, 60, 1440] // 15 min, 1 hour, 1 day
      },
      {
        id: '2',
        title: 'Deadline nộp hồ sơ Backend',
        type: 'deadline',
        status: 'scheduled',
        startTime: '17:00',
        endTime: '17:00',
        date: '2024-01-16',
        description: 'Hạn chót nộp hồ sơ cho vị trí Backend Developer',
        priority: 'high',
        isRecurring: false,
        reminder: [60, 1440]
      },
      {
        id: '3',
        title: 'Onboarding nhân viên mới',
        type: 'onboarding',
        status: 'scheduled',
        startTime: '08:30',
        endTime: '17:00',
        date: '2024-01-18',
        candidateName: 'Trần Thị B',
        position: 'UI/UX Designer',
        location: 'Văn phòng chính',
        description: 'Ngày đầu tiên làm việc',
        priority: 'medium',
        isRecurring: false,
        reminder: [1440]
      },
      {
        id: '4',
        title: 'Meeting team HR',
        type: 'meeting',
        status: 'scheduled',
        startTime: '14:00',
        endTime: '15:30',
        date: '2024-01-17',
        location: 'Phòng họp B',
        description: 'Họp team HR hàng tuần',
        priority: 'medium',
        isRecurring: true,
        reminder: [15, 60]
      }
    ]

    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
    
    // Calculate stats
    const today = new Date().toISOString().split('T')[0]
    const thisWeek = getWeekDates(new Date())
    
    const totalEvents = mockEvents.length
    const interviewsToday = mockEvents.filter(e => 
      e.type === 'interview' && e.date === today
    ).length
    const deadlinesThisWeek = mockEvents.filter(e => 
      e.type === 'deadline' && thisWeek.includes(e.date)
    ).length
    const completedInterviews = mockEvents.filter(e => 
      e.type === 'interview' && e.status === 'completed'
    ).length
    const successRate = completedInterviews > 0 ? 85 : 0

    setStats({
      totalEvents,
      interviewsToday,
      deadlinesThisWeek,
      completedInterviews,
      successRate
    })
  }, [])

  // Filter events
  useEffect(() => {
    let filtered = events

    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === eventTypeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }, [events, eventTypeFilter, statusFilter])

  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'onboarding':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'rescheduled':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTime = (time: string) => {
    return time
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredEvents.filter(event => event.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  const handleCreateEvent = () => {
    setShowCreateDialog(true)
  }

  const handleEventAction = (action: string, eventId: string) => {
    switch (action) {
      case 'complete':
        setEvents(prev => prev.map(e => 
          e.id === eventId ? { ...e, status: 'completed' as const } : e
        ))
        toast({
          title: "Thành công",
          description: "Đã đánh dấu sự kiện hoàn thành",
        })
        break
      case 'cancel':
        setEvents(prev => prev.map(e => 
          e.id === eventId ? { ...e, status: 'cancelled' as const } : e
        ))
        toast({
          title: "Thành công",
          description: "Đã hủy sự kiện",
        })
        break
      case 'reschedule':
        toast({
          title: "Thông báo",
          description: "Chức năng dời lịch sẽ được phát triển",
        })
        break
      case 'delete':
        setEvents(prev => prev.filter(e => e.id !== eventId))
        toast({
          title: "Thành công",
          description: "Đã xóa sự kiện",
        })
        break
    }
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-hr-text-primary">
            {getMonthName(currentDate)}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-hr-bg-secondary border border-hr-border rounded-lg overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-hr-bg-primary">
            {weekDays.map((day, index) => (
              <div key={index} className="p-3 text-center text-sm font-medium text-hr-text-secondary border-r border-hr-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-32 border-r border-b border-hr-border last:border-r-0"></div>
              }

              const dayEvents = getEventsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={`h-32 border-r border-b border-hr-border last:border-r-0 p-2 ${
                    isToday ? 'bg-hr-primary/10' : 'bg-hr-bg-primary'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-hr-primary' : 'text-hr-text-primary'}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                      >
                        <div className="truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{event.startTime}</div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-hr-text-secondary">
                        +{dayEvents.length - 3} sự kiện khác
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderAgendaView = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-hr-text-primary">Danh sách sự kiện</h2>
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="bg-hr-bg-secondary border-hr-border hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getEventColor(event.type)}>
                        {event.type === 'interview' ? 'Phỏng vấn' :
                         event.type === 'deadline' ? 'Deadline' :
                         event.type === 'meeting' ? 'Họp' :
                         event.type === 'onboarding' ? 'Onboarding' : 'Khác'}
                      </Badge>
                      <Badge variant="outline" className="border-hr-border text-hr-text-primary">
                        {event.status === 'scheduled' ? 'Đã lên lịch' :
                         event.status === 'completed' ? 'Hoàn thành' :
                         event.status === 'cancelled' ? 'Đã hủy' : 'Dời lịch'}
                      </Badge>
                      {event.priority === 'high' && (
                        <Star className="h-4 w-4 text-red-500 fill-current" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-hr-text-primary mb-1">{event.title}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-hr-text-secondary">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      {event.candidateName && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.candidateName}
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-hr-text-secondary mt-2">{event.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEventClick(event)}
                      className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEventAction('complete', event.id)}
                      className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEventAction('delete', event.id)}
                      className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-primary"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermissions={['interview.read']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-hr-text-primary">Lịch HR</h1>
            <p className="text-hr-text-secondary">Quản lý lịch phỏng vấn và sự kiện</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCreateEvent}
              className="bg-hr-primary hover:bg-hr-primary-dark text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo sự kiện
            </Button>
            <Button
              variant="outline"
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Tổng sự kiện</p>
                  <p className="text-2xl font-bold text-hr-text-primary">{stats.totalEvents}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-hr-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">PV hôm nay</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.interviewsToday}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Deadline tuần</p>
                  <p className="text-2xl font-bold text-red-600">{stats.deadlinesThisWeek}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-hr-bg-secondary border-hr-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-hr-text-secondary">Tỷ lệ thành công</p>
                  <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-hr-text-secondary">View:</Label>
                <Select value={view} onValueChange={(value: any) => setView(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Tháng</SelectItem>
                    <SelectItem value="week">Tuần</SelectItem>
                    <SelectItem value="day">Ngày</SelectItem>
                    <SelectItem value="agenda">Danh sách</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-hr-text-secondary">Loại:</Label>
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="interview">Phỏng vấn</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="meeting">Họp</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-hr-text-secondary">Trạng thái:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="rescheduled">Dời lịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Content */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-6">
            {view === 'month' && renderMonthView()}
            {view === 'agenda' && renderAgendaView()}
            {view === 'week' && (
              <div className="text-center py-8 text-hr-text-secondary">
                Chế độ xem tuần đang được phát triển
              </div>
            )}
            {view === 'day' && (
              <div className="text-center py-8 text-hr-text-secondary">
                Chế độ xem ngày đang được phát triển
              </div>
            )}
            {view === 'timeline' && (
              <div className="text-center py-8 text-hr-text-secondary">
                Chế độ xem timeline đang được phát triển
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Detail Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="sm:max-w-[600px] bg-hr-bg-primary text-hr-text-primary border-hr-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedEvent && getStatusIcon(selectedEvent.status)}
                {selectedEvent?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-hr-text-secondary">Loại sự kiện</Label>
                    <Badge className={getEventColor(selectedEvent.type)}>
                      {selectedEvent.type === 'interview' ? 'Phỏng vấn' :
                       selectedEvent.type === 'deadline' ? 'Deadline' :
                       selectedEvent.type === 'meeting' ? 'Họp' :
                       selectedEvent.type === 'onboarding' ? 'Onboarding' : 'Khác'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-hr-text-secondary">Ưu tiên</Label>
                    <p className={`font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                      {selectedEvent.priority === 'high' ? 'Cao' :
                       selectedEvent.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-hr-text-secondary">Ngày</Label>
                    <p className="text-hr-text-primary">
                      {new Date(selectedEvent.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-hr-text-secondary">Thời gian</Label>
                    <p className="text-hr-text-primary">
                      {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </p>
                  </div>
                </div>

                {selectedEvent.candidateName && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-hr-text-secondary">Ứng viên</Label>
                      <p className="text-hr-text-primary">{selectedEvent.candidateName}</p>
                    </div>
                    <div>
                      <Label className="text-hr-text-secondary">Email</Label>
                      <p className="text-hr-text-primary">{selectedEvent.candidateEmail}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.interviewer && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-hr-text-secondary">Người phỏng vấn</Label>
                      <p className="text-hr-text-primary">{selectedEvent.interviewer}</p>
                    </div>
                    <div>
                      <Label className="text-hr-text-secondary">Email PV</Label>
                      <p className="text-hr-text-primary">{selectedEvent.interviewerEmail}</p>
                    </div>
                  </div>
                )}

                {selectedEvent.location && (
                  <div>
                    <Label className="text-hr-text-secondary">Địa điểm</Label>
                    <p className="text-hr-text-primary">{selectedEvent.location}</p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <Label className="text-hr-text-secondary">Mô tả</Label>
                    <p className="text-hr-text-primary">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowEventDialog(false)}
                    className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={() => handleEventAction('complete', selectedEvent.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Hoàn thành
                  </Button>
                  <Button
                    onClick={() => handleEventAction('reschedule', selectedEvent.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Dời lịch
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Event Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px] bg-hr-bg-primary text-hr-text-primary border-hr-border">
            <DialogHeader>
              <DialogTitle>Tạo sự kiện mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-hr-text-secondary">Tiêu đề</Label>
                <Input placeholder="Nhập tiêu đề sự kiện" className="mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-hr-text-secondary">Loại sự kiện</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interview">Phỏng vấn</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="meeting">Họp</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-hr-text-secondary">Ưu tiên</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-hr-text-secondary">Ngày</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label className="text-hr-text-secondary">Thời gian bắt đầu</Label>
                  <Input type="time" className="mt-1" />
                </div>
              </div>

              <div>
                <Label className="text-hr-text-secondary">Mô tả</Label>
                <Textarea placeholder="Nhập mô tả sự kiện" className="mt-1" />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-hr-border text-hr-text-primary hover:bg-hr-bg-primary"
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateDialog(false)
                    toast({
                      title: "Thành công",
                      description: "Đã tạo sự kiện mới",
                    })
                  }}
                  className="bg-hr-primary hover:bg-hr-primary-dark text-white"
                >
                  Tạo sự kiện
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

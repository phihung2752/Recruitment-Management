'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Calendar as CalendarIcon } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Calendar as CalendarIconLucide, 
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
  BarChart3,
  Play,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share,
  Settings,
  RefreshCw,
  Search,
  Grid3X3,
  List,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import VideoCall from '@/components/video-call'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CalendarEvent {
  id: string
  title: string
  type: 'interview' | 'deadline' | 'meeting' | 'onboarding' | 'training' | 'other'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  startTime: string
  endTime: string
  date: string
  candidateName?: string
  candidateEmail?: string
  position?: string
  interviewer?: string
  location?: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attendees?: string[]
  notes?: string
  reminder?: number
  videoLink?: string
  meetingId?: string
  meetingPassword?: string
  isVideoCall?: boolean
  platform?: 'zoom' | 'teams' | 'google_meet' | 'custom'
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: string
  }
  color?: string
  isAllDay?: boolean
}

interface CalendarStats {
  totalEvents: number
  todayEvents: number
  upcomingInterviews: number
  completedInterviews: number
}

export default function CalendarPage() {
  const { user, isAuthenticated } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<CalendarStats>({
    totalEvents: 0,
    todayEvents: 0,
    upcomingInterviews: 0,
    completedInterviews: 0
  })

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('/api/calendar/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
          setFilteredEvents(data.events || [])
        } else {
          console.error('Failed to fetch events:', response.statusText)
          // Fallback to mock data
          setEvents(getMockEvents())
          setFilteredEvents(getMockEvents())
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents(getMockEvents())
        setFilteredEvents(getMockEvents())
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Mock data for demonstration
  const getMockEvents = (): CalendarEvent[] => [
    {
      id: '1',
      title: 'Interview - Nguyễn Văn A',
      type: 'interview',
      status: 'scheduled',
      startTime: '10:00',
      endTime: '11:00',
      date: format(new Date(), 'yyyy-MM-dd'),
      candidateName: 'Nguyễn Văn A',
      candidateEmail: 'nguyen.van.a@email.com',
      position: 'Frontend Developer',
      interviewer: 'Trần Thị B',
      location: 'Meeting Room A',
      description: 'Technical interview for Frontend Developer position',
      priority: 'high',
      attendees: ['nguyen.van.a@email.com', 'tran.thi.b@company.com'],
      isVideoCall: true,
      platform: 'zoom',
      videoLink: 'https://zoom.us/j/123456789',
      meetingId: '123 456 789',
      meetingPassword: 'interview123',
      color: '#3b82f6',
      reminder: 15
    },
    {
      id: '2',
      title: 'Team Standup',
      type: 'meeting',
      status: 'scheduled',
      startTime: '09:00',
      endTime: '09:30',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      location: 'Conference Room B',
      description: 'Daily team standup meeting',
      priority: 'medium',
      attendees: ['team@company.com'],
      isVideoCall: false,
      color: '#10b981',
      reminder: 5
    },
    {
      id: '3',
      title: 'Interview - Lê Văn C',
      type: 'interview',
      status: 'scheduled',
      startTime: '14:00',
      endTime: '15:00',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      candidateName: 'Lê Văn C',
      candidateEmail: 'le.van.c@email.com',
      position: 'Full-stack Developer',
      interviewer: 'Phạm Thị D',
      location: 'Meeting Room A',
      description: 'Technical interview for Full-stack Developer position',
      priority: 'high',
      attendees: ['le.van.c@email.com', 'pham.thi.d@company.com'],
      isVideoCall: true,
      platform: 'google_meet',
      videoLink: 'https://meet.google.com/abc-defg-hij',
      meetingId: 'abc-defg-hij',
      color: '#3b82f6',
      reminder: 30
    },
    {
      id: '4',
      title: 'Application Deadline',
      type: 'deadline',
      status: 'scheduled',
      startTime: '23:59',
      endTime: '23:59',
      date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      description: 'Deadline for Senior Developer applications',
      priority: 'urgent',
      isAllDay: true,
      color: '#ef4444',
      reminder: 60
    }
  ]

  // Calculate stats
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const totalEvents = events.length
    const todayEvents = events.filter(event => event.date === today).length
    const upcomingInterviews = events.filter(event => 
      event.type === 'interview' && 
      event.status === 'scheduled' && 
      new Date(event.date) >= new Date()
    ).length
    const completedInterviews = events.filter(event => 
      event.type === 'interview' && 
      event.status === 'completed'
    ).length

    setStats({
      totalEvents,
      todayEvents,
      upcomingInterviews,
      completedInterviews
    })
  }, [events])

  // Filter events
  useEffect(() => {
    let filtered = events

    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === eventTypeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.position?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }, [events, eventTypeFilter, statusFilter, searchTerm])

  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color
    switch (event.type) {
      case 'interview': return '#3b82f6'
      case 'meeting': return '#10b981'
      case 'deadline': return '#ef4444'
      case 'onboarding': return '#8b5cf6'
      case 'training': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      case 'rescheduled': return <RefreshCw className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days: Date[] = []
    let day = startDate

    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayEvents = filteredEvents.filter(event => 
            isSameDay(new Date(event.date), day)
          )
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={day.toISOString()}
              className={`bg-white p-1 min-h-[120px] ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600' : ''
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: getEventColor(event) + '20', color: getEventColor(event) }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center space-x-1">
                      {event.isVideoCall && <Video className="h-3 w-3" />}
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const days: Date[] = []
    let day = weekStart

    while (day <= weekEnd) {
      days.push(day)
      day = addDays(day, 1)
    }

    return (
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        <div className="bg-gray-100 p-2 text-center text-sm font-medium">
          Time
        </div>
        {days.map(day => (
          <div key={day.toISOString()} className="bg-gray-100 p-2 text-center text-sm font-medium">
            <div>{format(day, 'EEE')}</div>
            <div className="text-lg font-bold">{format(day, 'd')}</div>
          </div>
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <React.Fragment key={i}>
            <div className="bg-gray-50 p-2 text-sm text-gray-600">
              {i.toString().padStart(2, '0')}:00
            </div>
            {days.map(day => {
              const dayEvents = filteredEvents.filter(event => 
                isSameDay(new Date(event.date), day) &&
                parseInt(event.startTime.split(':')[0]) === i
              )
              return (
                <div key={`${day.toISOString()}-${i}`} className="bg-white p-1 min-h-[40px]">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: getEventColor(event) + '20', color: getEventColor(event) }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center space-x-1">
                        {event.isVideoCall && <Video className="h-3 w-3" />}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = filteredEvents.filter(event => 
      isSameDay(new Date(event.date), selectedDate || new Date())
    )

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {format(selectedDate || new Date(), 'EEEE, MMMM d, yyyy', { locale: vi })}
          </h2>
        </div>
        <div className="space-y-2">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this day
            </div>
          ) : (
            dayEvents.map(event => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority}
                        </Badge>
                        <Badge variant="outline">
                          {getStatusIcon(event.status)}
                          <span className="ml-1 capitalize">{event.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.isVideoCall && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <Video className="h-4 w-4" />
                            <span>Video Call</span>
                          </div>
                        )}
                      </div>
                      {event.candidateName && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Candidate:</span> {event.candidateName}
                          {event.position && <span> - {event.position}</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {event.isVideoCall && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event)
                            setShowVideoCall(true)
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderAgendaView = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => 
      new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime()
    )

    return (
      <div className="space-y-4">
        {sortedEvents.map(event => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge className={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                    <Badge variant="outline">
                      {getStatusIcon(event.status)}
                      <span className="ml-1 capitalize">{event.status}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CalendarIconLucide className="h-4 w-4" />
                      <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.isVideoCall && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Video className="h-4 w-4" />
                        <span>Video Call</span>
                      </div>
                    )}
                  </div>
                  {event.candidateName && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Candidate:</span> {event.candidateName}
                      {event.position && <span> - {event.position}</span>}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {event.isVideoCall && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowVideoCall(true)
                      }}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <ProtectedRoute requiredPermissions={['interview.read']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Manage interviews, meetings, and events</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button onClick={() => setShowEventDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarIconLucide className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.todayEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
              <Video className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.upcomingInterviews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.completedInterviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar Controls</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  <CalendarIconLucide className="h-4 w-4 mr-1" />
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Day
                </Button>
                <Button
                  variant={viewMode === 'agenda' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('agenda')}
                >
                  <List className="h-4 w-4 mr-1" />
                  Agenda
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="interview">Interviews</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="deadline">Deadlines</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'agenda' && renderAgendaView()}
          </CardContent>
        </Card>

        {/* Event Details Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                  <Badge className={getPriorityColor(selectedEvent.priority)}>
                    {selectedEvent.priority}
                  </Badge>
                  <Badge variant="outline">
                    {getStatusIcon(selectedEvent.status)}
                    <span className="ml-1 capitalize">{selectedEvent.status}</span>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date & Time</Label>
                    <p className="text-sm text-gray-600">
                      {format(new Date(selectedEvent.date), 'MMM d, yyyy')} at {selectedEvent.startTime} - {selectedEvent.endTime}
                    </p>
                  </div>
                  
                  {selectedEvent.location && (
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                    </div>
                  )}
                  
                  {selectedEvent.candidateName && (
                    <div>
                      <Label className="text-sm font-medium">Candidate</Label>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.candidateName} - {selectedEvent.position}
                      </p>
                    </div>
                  )}
                  
                  {selectedEvent.interviewer && (
                    <div>
                      <Label className="text-sm font-medium">Interviewer</Label>
                      <p className="text-sm text-gray-600">{selectedEvent.interviewer}</p>
                    </div>
                  )}
                </div>
                
                {selectedEvent.isVideoCall && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Video Call Details</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Platform:</span> {selectedEvent.platform}
                      </div>
                      <div>
                        <span className="font-medium">Meeting ID:</span> {selectedEvent.meetingId}
                      </div>
                      {selectedEvent.meetingPassword && (
                        <div>
                          <span className="font-medium">Password:</span> {selectedEvent.meetingPassword}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Link:</span> 
                        <a href={selectedEvent.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          {selectedEvent.videoLink}
                        </a>
                      </div>
                    </div>
                    <Button 
                      className="mt-3 w-full"
                      onClick={() => {
                        setShowVideoCall(true)
                        setSelectedEvent(null)
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Join Video Call
                    </Button>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Video Call Component */}
        <VideoCall
          isOpen={showVideoCall}
          onClose={() => setShowVideoCall(false)}
          event={selectedEvent || {
            id: '1',
            title: 'Interview - Sample',
            candidateName: 'Sample Candidate',
            position: 'Developer',
            interviewer: 'Sample Interviewer',
            videoLink: 'https://zoom.us/j/123456789',
            meetingId: '123456789',
            platform: 'zoom'
          }}
        />
      </div>
    </ProtectedRoute>
  )
}

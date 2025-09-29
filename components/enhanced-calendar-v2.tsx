"use client"

import { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  startOfWeek,
  endOfWeek,
  isToday,
  isAfter,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Video,
  Search,
  User,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: "interview" | "meeting" | "deadline" | "holiday" | "training" | "review"
  status: "scheduled" | "confirmed" | "cancelled" | "completed"
  attendees: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
    status: "pending" | "accepted" | "declined" | "tentative"
  }[]
  location?: string
  meetingLink?: string
  priority: "low" | "medium" | "high" | "urgent"
  reminders: {
    time: number // minutes before
    method: "email" | "notification" | "sms"
  }[]
  relatedTo?: {
    type: "candidate" | "employee" | "job"
    id: string
    name: string
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
  notes?: string
  recurring?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly"
    interval: number
    endDate?: Date
    count?: number
  }
}

const eventTypes = [
  { value: "interview", label: "Interview", color: "bg-blue-500" },
  { value: "meeting", label: "Meeting", color: "bg-green-500" },
  { value: "deadline", label: "Deadline", color: "bg-red-500" },
  { value: "holiday", label: "Holiday", color: "bg-purple-500" },
  { value: "training", label: "Training", color: "bg-orange-500" },
  { value: "review", label: "Review", color: "bg-yellow-500" },
]

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-gray-100 text-gray-800",
}

export function EnhancedCalendarV2() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month")
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Interview with John Doe",
      description: "Technical interview for Senior Developer position",
      startTime: new Date(2024, 11, 22, 9, 0),
      endTime: new Date(2024, 11, 22, 10, 30),
      type: "interview",
      status: "scheduled",
      attendees: [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@company.com",
          role: "HR Manager",
          status: "accepted",
        },
        {
          id: "2",
          name: "Mike Wilson",
          email: "mike@company.com",
          role: "Tech Lead",
          status: "pending",
        },
      ],
      location: "Conference Room A",
      meetingLink: "https://meet.google.com/abc-def-ghi",
      priority: "high",
      reminders: [
        { time: 15, method: "email" },
        { time: 5, method: "notification" },
      ],
      relatedTo: {
        type: "candidate",
        id: "candidate-1",
        name: "John Doe",
      },
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Team Standup",
      description: "Daily team standup meeting",
      startTime: new Date(2024, 11, 23, 9, 0),
      endTime: new Date(2024, 11, 23, 9, 30),
      type: "meeting",
      status: "confirmed",
      attendees: [
        {
          id: "1",
          name: "Development Team",
          email: "dev-team@company.com",
          role: "Team",
          status: "accepted",
        },
      ],
      priority: "medium",
      reminders: [{ time: 5, method: "notification" }],
      createdBy: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      recurring: {
        frequency: "daily",
        interval: 1,
        endDate: new Date(2024, 11, 31),
      },
    },
  ])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    type: "meeting",
    priority: "medium",
    status: "scheduled",
    attendees: [],
    reminders: [{ time: 15, method: "email" }],
  })
  const { toast } = useToast()

  // Navigation functions
  const nextPeriod = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7))
    } else if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const previousPeriod = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7))
    } else if (viewMode === "day") {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Get events for specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        isSameDay(eventDate, date) &&
        (filterType === "all" || event.type === filterType) &&
        (filterStatus === "all" || event.status === filterStatus) &&
        (searchTerm === "" || event.title.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
  }

  // Get events for current view
  const getEventsForCurrentView = () => {
    let startDate: Date
    let endDate: Date

    if (viewMode === "month") {
      startDate = startOfMonth(currentDate)
      endDate = endOfMonth(currentDate)
    } else if (viewMode === "week") {
      startDate = startOfWeek(currentDate)
      endDate = endOfWeek(currentDate)
    } else {
      startDate = new Date(currentDate)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(currentDate)
      endDate.setHours(23, 59, 59, 999)
    }

    return events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate >= startDate &&
        eventDate <= endDate &&
        (filterType === "all" || event.type === filterType) &&
        (filterStatus === "all" || event.status === filterStatus) &&
        (searchTerm === "" || event.title.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
  }

  // Handle event creation
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      description: newEvent.description,
      startTime: new Date(newEvent.startTime!),
      endTime: new Date(newEvent.endTime!),
      type: (newEvent.type as CalendarEvent["type"]) || "meeting",
      status: (newEvent.status as CalendarEvent["status"]) || "scheduled",
      attendees: newEvent.attendees || [],
      location: newEvent.location,
      meetingLink: newEvent.meetingLink,
      priority: (newEvent.priority as CalendarEvent["priority"]) || "medium",
      reminders: newEvent.reminders || [{ time: 15, method: "email" }],
      relatedTo: newEvent.relatedTo,
      createdBy: "current-user",
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: newEvent.notes,
      recurring: newEvent.recurring,
    }

    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      type: "meeting",
      priority: "medium",
      status: "scheduled",
      attendees: [],
      reminders: [{ time: 15, method: "email" }],
    })
    setShowEventDialog(false)

    toast({
      title: "Event Created",
      description: "Your event has been created successfully",
    })
  }

  // Handle event update
  const handleUpdateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, ...updates, updatedAt: new Date() } : event)))

    toast({
      title: "Event Updated",
      description: "Event has been updated successfully",
    })
  }

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setSelectedEvent(null)
    setShowEventDetails(false)

    toast({
      title: "Event Deleted",
      description: "Event has been deleted successfully",
    })
  }

  // Render calendar grid for month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-medium text-muted-foreground bg-muted">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] p-2 border cursor-pointer hover:bg-accent transition-colors",
                !isCurrentMonth && "text-muted-foreground bg-muted/50",
                isSelected && "bg-primary/10 border-primary",
                isCurrentDay && "bg-blue-50 border-blue-200",
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className={cn("text-sm font-medium mb-1", isCurrentDay && "text-blue-600 font-bold")}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => {
                  const eventType = eventTypes.find((t) => t.value === event.type)
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "text-xs p-1 rounded truncate cursor-pointer hover:opacity-80",
                        eventType?.color || "bg-gray-500",
                        "text-white",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                        setShowEventDetails(true)
                      }}
                    >
                      {format(event.startTime, "HH:mm")} {event.title}
                    </div>
                  )
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div>
          {weekDays.map((day) => (
            <div key={day.toString()} className="p-2 text-center border-r">
              <div className="font-medium">{format(day, "EEE")}</div>
              <div className={cn("text-sm", isToday(day) && "text-blue-600 font-bold")}>{format(day, "MMM d")}</div>
            </div>
          ))}
        </div>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-8">
            <div className="border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-16 p-2 border-b text-xs text-muted-foreground">
                  {format(new Date().setHours(hour, 0), "HH:mm")}
                </div>
              ))}
            </div>
            {weekDays.map((day) => (
              <div key={day.toString()} className="border-r relative">
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-b"></div>
                ))}
                {getEventsForDate(day).map((event) => {
                  const startHour = event.startTime.getHours()
                  const startMinute = event.startTime.getMinutes()
                  const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60)
                  const top = (startHour + startMinute / 60) * 64
                  const height = duration * 64
                  const eventType = eventTypes.find((t) => t.value === event.type)

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute left-1 right-1 p-1 rounded text-xs cursor-pointer hover:opacity-80",
                        eventType?.color || "bg-gray-500",
                        "text-white",
                      )}
                      style={{ top: `${top}px`, height: `${Math.max(height, 32)}px` }}
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventDetails(true)
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="truncate">
                        {format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDate(currentDate)

    return (
      <div className="flex">
        <div className="w-20 border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-16 p-2 border-b text-xs text-muted-foreground">
              {format(new Date().setHours(hour, 0), "HH:mm")}
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b"></div>
          ))}
          {dayEvents.map((event) => {
            const startHour = event.startTime.getHours()
            const startMinute = event.startTime.getMinutes()
            const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60)
            const top = (startHour + startMinute / 60) * 64
            const height = duration * 64
            const eventType = eventTypes.find((t) => t.value === event.type)

            return (
              <div
                key={event.id}
                className={cn(
                  "absolute left-2 right-2 p-2 rounded cursor-pointer hover:opacity-80",
                  eventType?.color || "bg-gray-500",
                  "text-white",
                )}
                style={{ top: `${top}px`, height: `${Math.max(height, 48)}px` }}
                onClick={() => {
                  setSelectedEvent(event)
                  setShowEventDetails(true)
                }}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm">
                  {format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
                </div>
                {event.location && (
                  <div className="text-xs flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render agenda view
  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(
        (event) =>
          isAfter(event.startTime, new Date()) &&
          (filterType === "all" || event.type === filterType) &&
          (filterStatus === "all" || event.status === filterStatus) &&
          (searchTerm === "" || event.title.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 20)

    return (
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const eventType = eventTypes.find((t) => t.value === event.type)
            return (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedEvent(event)
                  setShowEventDetails(true)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={cn("w-3 h-3 rounded-full", eventType?.color)} />
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={cn("text-xs", priorityColors[event.priority])}>{event.priority}</Badge>
                        <Badge className={cn("text-xs", statusColors[event.status])}>{event.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(event.startTime, "MMM d, yyyy 'at' HH:mm")} - {format(event.endTime, "HH:mm")}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees.length > 0 && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {event.attendees.length} attendees
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {upcomingEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No upcoming events found</div>
          )}
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={previousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px]">
            {viewMode === "month" && format(currentDate, "MMMM yyyy")}
            {viewMode === "week" && `Week of ${format(startOfWeek(currentDate), "MMM d, yyyy")}`}
            {viewMode === "day" && format(currentDate, "EEEE, MMMM d, yyyy")}
            {viewMode === "agenda" && "Upcoming Events"}
          </h2>
          <Button variant="outline" size="icon" onClick={nextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={newEvent.startTime ? format(new Date(newEvent.startTime), "yyyy-MM-dd'T'HH:mm") : ""}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: new Date(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={newEvent.endTime ? format(new Date(newEvent.endTime), "yyyy-MM-dd'T'HH:mm") : ""}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: new Date(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newEvent.priority}
                      onValueChange={(value) => setNewEvent({ ...newEvent, priority: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Meeting location"
                  />
                </div>

                <div>
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    value={newEvent.meetingLink || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-4">
          {viewMode === "month" && renderMonthView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "day" && renderDayView()}
          {viewMode === "agenda" && renderAgendaView()}
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Event Details
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                {selectedEvent.description && <p className="text-muted-foreground mt-1">{selectedEvent.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        eventTypes.find((t) => t.value === selectedEvent.type)?.color,
                      )}
                    />
                    <span className="text-sm">{eventTypes.find((t) => t.value === selectedEvent.type)?.label}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={cn("text-xs mt-1", priorityColors[selectedEvent.priority])}>
                    {selectedEvent.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Time</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(selectedEvent.startTime, "MMM d, yyyy 'at' HH:mm")} -{" "}
                    {format(selectedEvent.endTime, "HH:mm")}
                  </span>
                </div>
              </div>

              {selectedEvent.location && (
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedEvent.location}</span>
                  </div>
                </div>
              )}

              {selectedEvent.meetingLink && (
                <div>
                  <Label className="text-sm font-medium">Meeting Link</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={selectedEvent.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              )}

              {selectedEvent.attendees.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Attendees ({selectedEvent.attendees.length})</Label>
                  <div className="space-y-2 mt-2">
                    {selectedEvent.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{attendee.name}</p>
                            <p className="text-xs text-muted-foreground">{attendee.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {attendee.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.relatedTo && (
                <div>
                  <Label className="text-sm font-medium">Related To</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {selectedEvent.relatedTo.type === "candidate" && <User className="h-4 w-4 text-muted-foreground" />}
                    {selectedEvent.relatedTo.type === "employee" && <Users className="h-4 w-4 text-muted-foreground" />}
                    {selectedEvent.relatedTo.type === "job" && <Briefcase className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm">{selectedEvent.relatedTo.name}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CalendarIcon, ChevronLeft, ChevronRight, Users, Printer, Download, Plus, CalendarIcon as CalendarLucide } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Meeting {
  id: string
  title: string
  date: string // Changed to string format
  startTime: string
  endTime: string
  attendees: string[]
  type: "individual" | "group"
  platform?: "zoom" | "teams" | "meet"
  link?: string
}

export function EnhancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "30 min meeting with omer",
      date: "2024-12-22", // Fixed date format
      startTime: "09:00",
      endTime: "10:30",
      attendees: ["omer@example.com"],
      type: "individual"
    },
    {
      id: "2",
      title: "Group Interview - Frontend",
      date: "2024-12-23", // Fixed date format
      startTime: "11:00",
      endTime: "12:30",
      attendees: ["candidate1@example.com", "interviewer1@example.com", "interviewer2@example.com"],
      type: "group"
    }
  ])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(),
    to: undefined
  })

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  // Get days for the current month
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  // Helper function to get meetings for a specific day
  const getMeetingsForDay = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = parseISO(meeting.date)
      return format(meetingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Interview</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Search..." 
              className="max-w-[200px]"
            />
            <div className="flex-1" />
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Meetings
            </Button>
            <Button variant="outline" size="sm">
              <CalendarLucide className="h-4 w-4 mr-2" />
              Events
            </Button>
          </div>

          {/* Upcoming Meetings */}
          <div className="grid gap-4 md:grid-cols-2">
            {meetings.map(meeting => (
              <Card key={meeting.id} className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-lg">
                    <div className="text-2xl font-bold">
                      {format(parseISO(meeting.date), "dd")}
                    </div>
                    <div className="text-sm">
                      {format(parseISO(meeting.date), "MMM")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{meeting.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {meeting.startTime} - {meeting.endTime}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* All Meetings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">All Meetings</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center space-x-4">
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        format(dateRange.from, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ from: date, to: undefined })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        format(dateRange.to, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button>Apply</Button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-medium">
                  {format(currentDate, "MMMM yyyy")}
                </h3>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-muted">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-4 text-center border-b font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  const dayMeetings = getMeetingsForDay(day)
                  return (
                    <div
                      key={day.toString()}
                      className={cn(
                        "min-h-[120px] p-2 border",
                        !isSameMonth(day, currentDate) && "text-muted-foreground bg-muted/50"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")} className="font-medium">
                        {format(day, "d")}
                      </time>
                      <div className="mt-1 space-y-1">
                        {dayMeetings.map(meeting => (
                          <div
                            key={meeting.id}
                            className={cn(
                              "text-xs p-1 rounded-md truncate",
                              meeting.type === "group" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-green-100 text-green-700"
                            )}
                          >
                            {meeting.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


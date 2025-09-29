"use client"

import { useState } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CalendarIcon, ChevronLeft, ChevronRight, Users, Printer, Download, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Meeting {
  id: string
  title: string
  date: string
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
      date: "2024-12-22",
      startTime: "09:00",
      endTime: "10:30",
      attendees: ["omer@example.com"],
      type: "individual"
    },
    {
      id: "2",
      title: "Group Interview - Frontend",
      date: "2024-12-23",
      startTime: "11:00",
      endTime: "12:30",
      attendees: ["candidate1@example.com", "interviewer1@example.com", "interviewer2@example.com"],
      type: "group"
    }
  ])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const getMeetingsForDay = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = parseISO(meeting.date)
      return isSameDay(meetingDate, date)
    })
  }

  return (
    <div className="space-y-4">
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
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Meetings
          </Button>
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Events
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayMeetings = getMeetingsForDay(day)
          return (
            <Button
              key={day.toString()}
              variant="outline"
              className={cn(
                "h-20 p-0 font-normal",
                !isSameMonth(day, currentDate) && "text-muted-foreground",
                isSameDay(day, selectedDate) && "bg-accent text-accent-foreground"
              )}
              onClick={() => setSelectedDate(day)}
            >
              <time dateTime={format(day, "yyyy-MM-dd")} className="absolute top-1 left-1">
                {format(day, "d")}
              </time>
              {dayMeetings.length > 0 && (
                <div className="absolute bottom-1 right-1">
                  <Badge variant="secondary" className="text-xs">
                    {dayMeetings.length}
                  </Badge>
                </div>
              )}
            </Button>
          )
        })}
      </div>

      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">
              Meetings for {format(selectedDate, "MMMM d, yyyy")}
            </h4>
            <ScrollArea className="h-[200px]">
              {getMeetingsForDay(selectedDate).map((meeting) => (
                <div key={meeting.id} className="mb-2 p-2 bg-accent rounded-md">
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {meeting.startTime} - {meeting.endTime}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

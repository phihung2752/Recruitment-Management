"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedCalendar } from "./enhanced-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock } from 'lucide-react'
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Candidate, InterviewRound } from "./interview-management"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

interface AutomatedSchedulingProps {
  candidate: Candidate
  interviewRounds: InterviewRound[]
}

export function AutomatedScheduling({ candidate, interviewRounds }: AutomatedSchedulingProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [selectedDuration, setSelectedDuration] = useState<string>()
  const [selectedRound, setSelectedRound] = useState<string>()

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00"
  ]

  const durations = [
    "30 minutes", "45 minutes", "1 hour", "1.5 hours", "2 hours"
  ]

  const handleSchedule = () => {
    if (selectedDate && selectedTime && selectedDuration && selectedRound) {
      // In a real application, you would send this data to your backend
      console.log({
        candidate: candidate.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        duration: selectedDuration,
        round: selectedRound
      })
      toast({
        title: "Interview Scheduled",
        description: `Interview for ${candidate.name} scheduled on ${format(selectedDate, "PPP")} at ${selectedTime} for ${selectedDuration}.`,
      })
      // Reset form
      setSelectedDate(undefined)
      setSelectedTime(undefined)
      setSelectedDuration(undefined)
      setSelectedRound(undefined)
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields before scheduling.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule Interview for {candidate.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="quick">Quick Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <ScrollArea className="h-[500px] w-full rounded-md border">
              <EnhancedCalendar />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="quick" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Select onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time">
                      {selectedTime ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{selectedTime}</span>
                        </div>
                      ) : (
                        "Select time"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Select onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Interview Round</label>
                <Select onValueChange={setSelectedRound}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select round" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewRounds.map((round) => (
                      <SelectItem key={round.id} value={round.id}>
                        {round.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setSelectedDate(undefined)
                setSelectedTime(undefined)
                setSelectedDuration(undefined)
                setSelectedRound(undefined)
              }}>
                Cancel
              </Button>
              <Button onClick={handleSchedule}>Schedule Interview</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Candidate, InterviewRound } from "./interview-management"

interface InterviewSchedulerProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

export function InterviewScheduler({ candidates, interviewRounds }: InterviewSchedulerProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleScheduleInterview = () => {
    // In a real application, this would send the data to your backend
    console.log("Scheduling interview:", { selectedCandidate, selectedRound, selectedDate })
    // You would then update the candidate's status and send notifications
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Interview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedCandidate}>
          <SelectTrigger>
            <SelectValue placeholder="Select Candidate" />
          </SelectTrigger>
          <SelectContent>
            {candidates.map(candidate => (
              <SelectItem key={candidate.id} value={candidate.id}>{candidate.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedRound}>
          <SelectTrigger>
            <SelectValue placeholder="Select Interview Round" />
          </SelectTrigger>
          <SelectContent>
            {interviewRounds.map(round => (
              <SelectItem key={round.id} value={round.id}>{round.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />

        <Button onClick={handleScheduleInterview} className="w-full">Schedule Interview</Button>
      </CardContent>
    </Card>
  )
}


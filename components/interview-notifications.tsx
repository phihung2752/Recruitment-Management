"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Candidate, InterviewRound } from "./interview-management"

interface InterviewNotificationsProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

export function InterviewNotifications({ candidates, interviewRounds }: InterviewNotificationsProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [notificationMessage, setNotificationMessage] = useState<string>("")

  const handleSendNotification = () => {
    // In a real application, this would send the notification to your backend
    console.log("Sending notification:", { selectedCandidate, selectedRound, notificationMessage })
    // You would then send an email or other notification to the candidate
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Interview Notification</CardTitle>
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

        <Textarea
          placeholder="Enter notification message"
          value={notificationMessage}
          onChange={(e) => setNotificationMessage(e.target.value)}
        />

        <Button onClick={handleSendNotification} className="w-full">Send Notification</Button>
      </CardContent>
    </Card>
  )
}


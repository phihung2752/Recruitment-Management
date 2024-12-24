"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Candidate, InterviewRound } from "./interview-management"

interface OnlineInterviewSupportProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

export function OnlineInterviewSupport({ candidates, interviewRounds }: OnlineInterviewSupportProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [meetingLink, setMeetingLink] = useState<string>("")

  const handleCreateMeeting = () => {
    // In a real application, this would create a meeting using a video conferencing API
    console.log("Creating online meeting:", { selectedCandidate, selectedRound, meetingLink })
    // You would then send the meeting link to the candidate and interviewer
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Online Interview</CardTitle>
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

        <Input
          placeholder="Enter meeting link (optional)"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
        />

        <Button onClick={handleCreateMeeting} className="w-full">Create Online Interview</Button>
      </CardContent>
    </Card>
  )
}


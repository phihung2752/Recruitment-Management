"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Candidate, InterviewRound } from "./interview-management"

interface InPersonInterviewManagementProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

interface Room {
  id: string
  name: string
  capacity: number
}

interface Equipment {
  id: string
  name: string
  type: string
}

export function InPersonInterviewManagement({ candidates, interviewRounds }: InPersonInterviewManagementProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [notes, setNotes] = useState<string>("")

  // Mock data for rooms and equipment
  const rooms: Room[] = [
    { id: "1", name: "Conference Room A", capacity: 10 },
    { id: "2", name: "Interview Room B", capacity: 5 },
    { id: "3", name: "Meeting Room C", capacity: 8 },
  ]

  const equipment: Equipment[] = [
    { id: "1", name: "Projector", type: "Presentation" },
    { id: "2", name: "Whiteboard", type: "Writing" },
    { id: "3", name: "Laptop", type: "Computing" },
    { id: "4", name: "Video Camera", type: "Recording" },
  ]

  const handleScheduleInPersonInterview = () => {
    // In a real application, this would send the data to your backend
    console.log("Scheduling in-person interview:", {
      selectedCandidate,
      selectedRound,
      selectedRoom,
      selectedEquipment,
      notes,
    })
    // You would then update the candidate's status and send notifications
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule In-Person Interview</CardTitle>
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

        <Select onValueChange={setSelectedRoom}>
          <SelectTrigger>
            <SelectValue placeholder="Select Room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room.id} value={room.id}>{room.name} (Capacity: {room.capacity})</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Equipment</label>
          {equipment.map(item => (
            <div key={item.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`equipment-${item.id}`}
                value={item.id}
                checked={selectedEquipment.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEquipment([...selectedEquipment, item.id])
                  } else {
                    setSelectedEquipment(selectedEquipment.filter(id => id !== item.id))
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={`equipment-${item.id}`}>{item.name} ({item.type})</label>
            </div>
          ))}
        </div>

        <Textarea
          placeholder="Additional notes or requirements"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={handleScheduleInPersonInterview} className="w-full">Schedule In-Person Interview</Button>
      </CardContent>
    </Card>
  )
}


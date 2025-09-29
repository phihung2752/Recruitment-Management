"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CV } from "@/types/cv-management"

interface CandidateCommunicationProps {
  cvs: CV[]
  onAddCommunication: (cvId: string, message: string) => void
}

export function CandidateCommunication({ cvs, onAddCommunication }: CandidateCommunicationProps) {
  const [selectedCV, setSelectedCV] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleSendMessage = () => {
    if (selectedCV && message) {
      onAddCommunication(selectedCV, message)
      setMessage("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Communication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedCV} onValueChange={setSelectedCV}>
            <SelectTrigger>
              <SelectValue placeholder="Select candidate" />
            </SelectTrigger>
            <SelectContent>
              {cvs.map((cv) => (
                <SelectItem key={cv.id} value={cv.id}>{cv.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage} disabled={!selectedCV || !message}>
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

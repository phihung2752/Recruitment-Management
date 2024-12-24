"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Candidate, InterviewRound } from "./interview-management"

interface InterviewFeedbackProps {
  candidates: Candidate[]
  interviewRounds: InterviewRound[]
}

export function InterviewFeedback({ candidates, interviewRounds }: InterviewFeedbackProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [rating, setRating] = useState<number>(3)

  const handleSubmitFeedback = () => {
    // In a real application, this would send the data to your backend
    console.log("Submitting feedback:", {
      selectedCandidate,
      selectedRound,
      feedback,
      rating,
    })
    // You would then update the candidate's feedback in the database
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Interview Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Overall Rating</label>
          <Slider
            min={1}
            max={5}
            step={0.1}
            value={[rating]}
            onValueChange={(value) => setRating(value[0])}
          />
          <div className="text-sm text-gray-500">
            Rating: {rating.toFixed(1)} / 5
          </div>
        </div>

        <Textarea
          placeholder="Provide detailed feedback about the candidate's performance..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
        />

        <Button onClick={handleSubmitFeedback} className="w-full">Submit Feedback</Button>
      </CardContent>
    </Card>
  )
}


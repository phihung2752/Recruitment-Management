"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FeedbackSystemProps {
  candidateId: string
  interviewRound: string
}

export function FeedbackSystem({ candidateId, interviewRound }: FeedbackSystemProps) {
  const [rating, setRating] = useState<string>("")
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    // In a real application, you would send this data to your backend
    console.log({ candidateId, interviewRound, rating, feedback })
    // Reset form
    setRating("")
    setFeedback("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Overall Rating</Label>
          <RadioGroup value={rating} onValueChange={setRating}>
            <div className="flex space-x-2">
              <RadioGroupItem value="1" id="r1" />
              <Label htmlFor="r1">1</Label>
            </div>
            <div className="flex space-x-2">
              <RadioGroupItem value="2" id="r2" />
              <Label htmlFor="r2">2</Label>
            </div>
            <div className="flex space-x-2">
              <RadioGroupItem value="3" id="r3" />
              <Label htmlFor="r3">3</Label>
            </div>
            <div className="flex space-x-2">
              <RadioGroupItem value="4" id="r4" />
              <Label htmlFor="r4">4</Label>
            </div>
            <div className="flex space-x-2">
              <RadioGroupItem value="5" id="r5" />
              <Label htmlFor="r5">5</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="feedback">Detailed Feedback</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide detailed feedback about the candidate's performance..."
          />
        </div>
        <Button onClick={handleSubmit}>Submit Feedback</Button>
      </CardContent>
    </Card>
  )
}


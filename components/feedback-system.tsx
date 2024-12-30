"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface FeedbackSystemProps {
  candidateId: string
  interviewRound: string
}

export function FeedbackSystem({ candidateId, interviewRound }: FeedbackSystemProps) {
  const [rating, setRating] = useState<string>("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Error",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log({ candidateId, interviewRound, rating, feedback })
      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been successfully recorded.",
      })
      // Reset form
      setRating("")
      setFeedback("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interview Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base">Overall Rating</Label>
          <RadioGroup value={rating} onValueChange={setRating} className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value.toString()} id={`r${value}`} />
                <Label htmlFor={`r${value}`} className="text-sm">
                  {value} - {value === 1 ? "Poor" : value === 2 ? "Fair" : value === 3 ? "Average" : value === 4 ? "Good" : "Excellent"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-base">Detailed Feedback</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide detailed feedback about the candidate's performance..."
            className="min-h-[150px]"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

interface Feedback {
  id: string
  interviewer: string
  timestamp: Date
  rating: number
  comment: string
  type: "positive" | "negative" | "neutral"
}

export function RealTimeFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [newFeedback, setNewFeedback] = useState({
    rating: 3,
    comment: "",
    type: "neutral" as "positive" | "negative" | "neutral"
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const mockFeedback: Feedback = {
        id: Date.now().toString(),
        interviewer: "Mock Interviewer",
        timestamp: new Date(),
        rating: Math.floor(Math.random() * 5) + 1,
        comment: "Automated feedback for testing",
        type: Math.random() > 0.5 ? "positive" : "negative"
      }
      setFeedback(prev => [...prev, mockFeedback])
    }, 30000) // Add new feedback every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSubmitFeedback = () => {
    const newEntry: Feedback = {
      id: Date.now().toString(),
      interviewer: "Current Interviewer",
      timestamp: new Date(),
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      type: newFeedback.type
    }
    setFeedback(prev => [...prev, newEntry])
    setNewFeedback({
      rating: 3,
      comment: "",
      type: "neutral"
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Provide Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[newFeedback.rating]}
                onValueChange={([value]) => setNewFeedback(prev => ({ ...prev, rating: value }))}
                max={5}
                step={0.5}
                className="flex-1"
              />
              <span className="font-medium">{newFeedback.rating}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <div className="flex space-x-2">
              <Button
                variant={newFeedback.type === "positive" ? "default" : "outline"}
                onClick={() => setNewFeedback(prev => ({ ...prev, type: "positive" }))}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Positive
              </Button>
              <Button
                variant={newFeedback.type === "negative" ? "default" : "outline"}
                onClick={() => setNewFeedback(prev => ({ ...prev, type: "negative" }))}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Negative
              </Button>
              <Button
                variant={newFeedback.type === "neutral" ? "default" : "outline"}
                onClick={() => setNewFeedback(prev => ({ ...prev, type: "neutral" }))}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Neutral
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Enter your feedback..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSubmitFeedback} className="w-full">
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real-time Feedback Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg space-y-2 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.interviewer}</span>
                  <Badge
                    variant={
                      item.type === "positive" ? "default" :
                      item.type === "negative" ? "destructive" :
                      "secondary"
                    }
                  >
                    {item.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.timestamp.toLocaleTimeString()}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <span>{item.rating}/5</span>
                </div>
                <p className="text-sm">{item.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

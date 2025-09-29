"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CV } from "@/types/cv-management"

const stages = [
  "Applied",
  "Screening",
  "Interview Scheduled",
  "Interview Completed",
  "Offer Extended",
  "Offer Accepted",
  "Hired"
]

interface CandidateProgressTrackerProps {
  cv: CV
  onUpdateProgress: (cvId: string, newStage: string) => void
}

export function CandidateProgressTracker({ cv, onUpdateProgress }: CandidateProgressTrackerProps) {
  const [currentStage, setCurrentStage] = useState(cv.progressStage || "Applied")

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage)
    onUpdateProgress(cv.id, newStage)
    toast({
      title: "Progress Updated",
      description: `${cv.name}'s progress has been updated to ${newStage}.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Current Stage:</span>
            <Badge>{currentStage}</Badge>
          </div>
          <Select onValueChange={handleStageChange} value={currentStage}>
            <SelectTrigger>
              <SelectValue placeholder="Select new stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage, index) => (
              <Badge
                key={stage}
                variant={stages.indexOf(currentStage) >= index ? "default" : "outline"}
              >
                {stage}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

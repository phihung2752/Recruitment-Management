"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CV, InterviewFeedbackForm } from "@/types/cv-management"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface InterviewSchedulerProps {
  cvs?: CV[]
  onScheduleInterview: (cvId: string, date: Date, link: string) => void
  onSubmitFeedback: (cvId: string, feedback: InterviewFeedbackForm) => void
}

export function InterviewScheduler({ cvs = [], onScheduleInterview, onSubmitFeedback }: InterviewSchedulerProps) {
  const [selectedCV, setSelectedCV] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [meetingLink, setMeetingLink] = useState("")
  const [feedback, setFeedback] = useState<InterviewFeedbackForm>({
    technicalSkills: 0,
    communicationSkills: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    comments: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching CVs
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSchedule = async () => {
    if (selectedCV && selectedDate && meetingLink) {
      try {
        // Import interview service
        const { interviewsService } = await import("@/src/api/services/interviews")

        const response = await interviewsService.scheduleInterview({
          candidateId: selectedCV,
          interviewerId: "current-user-id", // Get from auth context
          scheduledDate: selectedDate,
          duration: 60,
          type: "video",
          status: "scheduled",
          meetingLink,
        })

        if (response.success) {
          onScheduleInterview(selectedCV, selectedDate, meetingLink)
          setSelectedCV("")
          setSelectedDate(undefined)
          setMeetingLink("")

          // Show success toast
          const { toast } = await import("@/components/ui/use-toast")
          toast({
            title: "Interview Scheduled",
            description: "Interview has been scheduled successfully",
          })
        }
      } catch (error) {
        console.error("Failed to schedule interview:", error)
      }
    }
  }

  const handleFeedback = async () => {
    if (selectedCV) {
      try {
        const { interviewsService } = await import("@/src/api/services/interviews")

        const response = await interviewsService.submitFeedback({
          interviewId: selectedCV, // This should be interview ID, not CV ID
          ...feedback,
        })

        if (response.success) {
          onSubmitFeedback(selectedCV, feedback)
          setSelectedCV("")
          setFeedback({
            technicalSkills: 0,
            communicationSkills: 0,
            problemSolving: 0,
            culturalFit: 0,
            overallRating: 0,
            comments: "",
          })
        }
      } catch (error) {
        console.error("Failed to submit feedback:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasCVs = Array.isArray(cvs) && cvs.length > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Interview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            {hasCVs ? (
              <Select value={selectedCV} onValueChange={setSelectedCV}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {cvs.map((cv) => (
                    <SelectItem key={cv.id} value={cv.id}>
                      {cv.name} - {cv.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">No candidates available</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </div>

          <div className="space-y-2">
            <Label>Meeting Link</Label>
            <Input
              placeholder="Enter Zoom/Meet link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>

          <Button onClick={handleSchedule} disabled={!selectedCV || !selectedDate || !meetingLink}>
            Schedule Interview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interview Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Candidate</Label>
            {hasCVs ? (
              <Select value={selectedCV} onValueChange={setSelectedCV}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {cvs
                    .filter((cv) => cv.interviewStatus === "Completed")
                    .map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.name} - {cv.interviewDate ? format(new Date(cv.interviewDate), "PPp") : "No date"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">No candidates available</p>
            )}
          </div>

          <div className="space-y-4">
            {["technicalSkills", "communicationSkills", "problemSolving", "culturalFit", "overallRating"].map(
              (skill) => (
                <div key={skill} className="space-y-2">
                  <Label>{skill.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</Label>
                  <Select
                    value={feedback[skill as keyof InterviewFeedbackForm]?.toString()}
                    onValueChange={(value) => setFeedback({ ...feedback, [skill]: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Stars
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ),
            )}

            <div className="space-y-2">
              <Label>Comments</Label>
              <Input
                value={feedback.comments}
                onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                placeholder="Enter feedback comments"
              />
            </div>

            <Button onClick={handleFeedback} disabled={!selectedCV}>
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

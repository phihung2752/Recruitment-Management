"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RecruitmentRequest = {
  id: string
  position: string
  department: string
  requester: string
  status: "Pending" | "Approved" | "Rejected"
  description: string
  requiredSkills: string[]
  experienceLevel: string
  expectedSalary: string
}

interface RecruitmentRequestDetailProps {
  request: RecruitmentRequest
  onUpdateStatus: (id: string, newStatus: "Approved" | "Rejected", feedback: string) => void
}

export function RecruitmentRequestDetail({ request, onUpdateStatus }: RecruitmentRequestDetailProps) {
  const [feedback, setFeedback] = useState("")
  const [newStatus, setNewStatus] = useState<"Approved" | "Rejected" | "">("")

  const handleSubmit = () => {
    if (newStatus) {
      onUpdateStatus(request.id, newStatus, feedback)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{request.position} - Recruitment Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Department</Label>
            <Input value={request.department} readOnly />
          </div>
          <div>
            <Label>Requester</Label>
            <Input value={request.requester} readOnly />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={request.status} readOnly />
          </div>
          <div>
            <Label>Experience Level</Label>
            <Input value={request.experienceLevel} readOnly />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={request.description} readOnly className="mt-1" />
        </div>
        <div>
          <Label>Required Skills</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {request.requiredSkills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Label>Expected Salary</Label>
          <Input value={request.expectedSalary} readOnly />
        </div>
        {request.status === "Pending" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback on this recruitment request"
              />
            </div>
            <div>
              <Label htmlFor="status">Update Status</Label>
              <Select onValueChange={(value: "Approved" | "Rejected") => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approve</SelectItem>
                  <SelectItem value="Rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={!newStatus}>Submit Decision</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


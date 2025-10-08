"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Phone, 
  MapPin,
  Send,
  X,
  Plus,
  User,
  Briefcase,
  Building
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface CreateInterviewDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (interview: any) => void
}

interface Candidate {
  id: string
  name: string
  email: string
  position: string
  department: string
}

interface Interviewer {
  id: string
  name: string
  email: string
  department: string
  role: string
}

interface JobPosition {
  id: string
  title: string
  department: string
  level: string
}

export default function CreateInterviewDialog({ isOpen, onClose, onSuccess }: CreateInterviewDialogProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    candidateId: "",
    interviewerId: "",
    jobPositionId: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 60,
    type: "online" as "online" | "in-person",
    location: "",
    meetingLink: "",
    notes: ""
  })

  // Mock data
  const candidates: Candidate[] = [
    { id: "cand-001", name: "Nguyễn Văn A", email: "nguyenvana@email.com", position: "Frontend Developer", department: "Engineering" },
    { id: "cand-002", name: "Lê Văn C", email: "levanc@email.com", position: "Backend Developer", department: "Engineering" },
    { id: "cand-003", name: "Hoàng Thị E", email: "hoangthie@email.com", position: "UX Designer", department: "Design" }
  ]

  const interviewers: Interviewer[] = [
    { id: "int-001", name: "Trần Thị B", email: "tranthib@company.com", department: "HR", role: "HR Manager" },
    { id: "int-002", name: "Phạm Văn D", email: "phamvand@company.com", department: "Engineering", role: "Tech Lead" },
    { id: "int-003", name: "Võ Văn F", email: "vovanf@company.com", department: "Design", role: "Design Manager" }
  ]

  const jobPositions: JobPosition[] = [
    { id: "job-001", title: "Senior Frontend Developer", department: "Engineering", level: "Senior" },
    { id: "job-002", title: "Backend Developer", department: "Engineering", level: "Mid" },
    { id: "job-003", title: "UX Designer", department: "Design", level: "Senior" }
  ]

  const selectedCandidate = candidates.find(c => c.id === formData.candidateId)
  const selectedInterviewer = interviewers.find(i => i.id === formData.interviewerId)
  const selectedJobPosition = jobPositions.find(j => j.id === formData.jobPositionId)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.candidateId || !formData.interviewerId || !formData.jobPositionId || !formData.scheduledDate || !formData.scheduledTime) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      // Create interview object
      const newInterview = {
        id: `int-${Date.now()}`,
        candidateId: formData.candidateId,
        candidateName: selectedCandidate?.name || "",
        candidateEmail: selectedCandidate?.email || "",
        candidatePosition: selectedCandidate?.position || "",
        interviewerId: formData.interviewerId,
        interviewerName: selectedInterviewer?.name || "",
        interviewerEmail: selectedInterviewer?.email || "",
        jobTitle: selectedJobPosition?.title || "",
        department: selectedJobPosition?.department || "",
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        duration: formData.duration,
        type: formData.type,
        location: formData.location,
        meetingLink: formData.meetingLink,
        status: "pending",
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // TODO: Send to API
      console.log('Creating interview:', newInterview)

      toast({
        title: "Success",
        description: "Interview scheduled successfully!",
      })

      onSuccess?.(newInterview)
      onClose()
      
      // Reset form
      setFormData({
        candidateId: "",
        interviewerId: "",
        jobPositionId: "",
        scheduledDate: "",
        scheduledTime: "",
        duration: 60,
        type: "online",
        location: "",
        meetingLink: "",
        notes: ""
      })
      setStep(1)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create interview",
        variant: "destructive"
      })
    }
  }

  const generateMeetingLink = () => {
    if (formData.type === 'online') {
      const randomId = Math.random().toString(36).substring(2, 15)
      const meetingLink = `https://meet.google.com/${randomId}`
      handleInputChange('meetingLink', meetingLink)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule New Interview</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidate">Candidate *</Label>
                <Select value={formData.candidateId} onValueChange={(value) => handleInputChange('candidateId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{candidate.name} - {candidate.position}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="interviewer">Interviewer *</Label>
                <Select value={formData.interviewerId} onValueChange={(value) => handleInputChange('interviewerId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewers.map((interviewer) => (
                      <SelectItem key={interviewer.id} value={interviewer.id}>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{interviewer.name} - {interviewer.role}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jobPosition">Job Position *</Label>
                <Select value={formData.jobPositionId} onValueChange={(value) => handleInputChange('jobPositionId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobPositions.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.title} - {job.department}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Select value={formData.duration.toString()} onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Schedule Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledDate">Date *</Label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="scheduledTime">Time *</Label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="type">Interview Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>Online</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in-person">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>In-Person</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'online' && (
              <div>
                <Label htmlFor="meetingLink">Meeting Link</Label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.meetingLink}
                    onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    placeholder="https://meet.google.com/..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateMeetingLink}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            )}

            {formData.type === 'in-person' && (
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter meeting location"
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes for the interview..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review & Confirm</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Candidate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCandidate && (
                    <div className="space-y-2">
                      <p className="font-medium">{selectedCandidate.name}</p>
                      <p className="text-sm text-gray-600">{selectedCandidate.email}</p>
                      <p className="text-sm text-gray-600">{selectedCandidate.position}</p>
                      <Badge variant="outline">{selectedCandidate.department}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interviewer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Interviewer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedInterviewer && (
                    <div className="space-y-2">
                      <p className="font-medium">{selectedInterviewer.name}</p>
                      <p className="text-sm text-gray-600">{selectedInterviewer.email}</p>
                      <p className="text-sm text-gray-600">{selectedInterviewer.role}</p>
                      <Badge variant="outline">{selectedInterviewer.department}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Position Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Job Position</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedJobPosition && (
                    <div className="space-y-2">
                      <p className="font-medium">{selectedJobPosition.title}</p>
                      <Badge variant="outline">{selectedJobPosition.department}</Badge>
                      <Badge variant="secondary">{selectedJobPosition.level}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Schedule Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {formData.scheduledDate && formData.scheduledTime 
                        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString('vi-VN')
                        : 'Not set'
                      }
                    </p>
                    <p className="text-sm text-gray-600">{formData.duration} minutes</p>
                    <div className="flex items-center space-x-2">
                      {formData.type === 'online' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                      <span className="text-sm capitalize">{formData.type}</span>
                    </div>
                    {formData.type === 'in-person' && formData.location && (
                      <p className="text-sm text-gray-600 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{formData.location}</span>
                      </p>
                    )}
                    {formData.type === 'online' && formData.meetingLink && (
                      <p className="text-sm text-blue-600 truncate">{formData.meetingLink}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          
          <div className="flex space-x-2">
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Send className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}






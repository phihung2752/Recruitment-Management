"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Phone, 
  MapPin,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Download,
  Edit,
  Trash2,
  MessageSquare,
  Brain,
  Target,
  BarChart3
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface InterviewDetails {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  candidatePosition: string
  candidateCV: string
  interviewerId: string
  interviewerName: string
  interviewerEmail: string
  jobTitle: string
  department: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  type: 'online' | 'in-person'
  location?: string
  meetingLink?: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  result?: 'pass' | 'fail' | 'on-hold'
  notes?: string
  feedback?: InterviewFeedback
  createdAt: string
  updatedAt: string
}

interface InterviewFeedback {
  technicalSkills: number
  communication: number
  problemSolving: number
  culturalFit: number
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string
  interviewerNotes: string
  aiAnalysis?: {
    sentimentScore: number
    confidenceLevel: number
    keyPoints: string[]
    suggestedQuestions: string[]
  }
}

export default function InterviewDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [interview, setInterview] = useState<InterviewDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [feedback, setFeedback] = useState<InterviewFeedback>({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallScore: 0,
    strengths: [],
    weaknesses: [],
    recommendations: "",
    interviewerNotes: ""
  })

  // Mock data
  const mockInterview: InterviewDetails = {
    id: params.id as string,
    candidateId: "cand-001",
    candidateName: "Nguyễn Văn A",
    candidateEmail: "nguyenvana@email.com",
    candidatePosition: "Frontend Developer",
    candidateCV: "/api/placeholder/cv.pdf",
    interviewerId: "int-001",
    interviewerName: "Trần Thị B",
    interviewerEmail: "tranthib@company.com",
    jobTitle: "Senior Frontend Developer",
    department: "Engineering",
    scheduledDate: "2025-10-01",
    scheduledTime: "09:00",
    duration: 60,
    type: "online",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "in-progress",
    notes: "Technical interview focusing on React and JavaScript",
    feedback: {
      technicalSkills: 8,
      communication: 7,
      problemSolving: 9,
      culturalFit: 8,
      overallScore: 8,
      strengths: ["Strong React skills", "Good problem-solving approach", "Clear communication"],
      weaknesses: ["Limited TypeScript experience", "Needs more testing knowledge"],
      recommendations: "Good candidate, recommend for next round",
      interviewerNotes: "Candidate showed strong technical skills and good communication. Would benefit from more TypeScript training.",
      aiAnalysis: {
        sentimentScore: 0.8,
        confidenceLevel: 0.85,
        keyPoints: ["Strong technical foundation", "Good communication skills", "Shows initiative"],
        suggestedQuestions: ["How do you handle state management in large React applications?", "Describe your experience with testing frameworks"]
      }
    },
    createdAt: "2025-09-29T10:00:00Z",
    updatedAt: "2025-09-29T10:00:00Z"
  }

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setInterview(mockInterview)
        if (mockInterview.feedback) {
          setFeedback(mockInterview.feedback)
        }
      } catch (error) {
        console.error('Error fetching interview:', error)
        toast({
          title: "Error",
          description: "Failed to fetch interview details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInterview()
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock
      case "in-progress": return AlertCircle
      case "completed": return CheckCircle
      case "cancelled": return XCircle
      default: return Clock
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleJoinMeeting = () => {
    if (interview?.type === 'online' && interview?.meetingLink) {
      window.open(interview.meetingLink, '_blank')
    }
  }

  const handleSaveFeedback = () => {
    // TODO: Implement save feedback
    toast({
      title: "Success",
      description: "Feedback saved successfully!",
    })
  }

  const handleUpdateStatus = (status: string) => {
    // TODO: Implement update status
    console.log('Update status to:', status)
    toast({
      title: "Status Updated",
      description: `Interview status updated to ${status}`,
    })
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading interview details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Interview not found</h3>
          <p className="text-muted-foreground mb-4">The interview you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const StatusIcon = getStatusIcon(interview.status)

  return (
    <div className="space-y-6 p-4 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Interview Details</h1>
            <p className="text-muted-foreground">{interview.candidateName} - {interview.jobTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(interview.status)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {interview.status}
          </Badge>
          
          {interview.type === 'online' && interview.meetingLink && (
            <Button onClick={handleJoinMeeting}>
              <Video className="mr-2 h-4 w-4" />
              Join Meeting
            </Button>
          )}
          
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidate Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Candidate Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/api/placeholder/64/64`} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold text-lg">
                      {interview.candidateName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{interview.candidateName}</h3>
                    <p className="text-gray-600">{interview.candidateEmail}</p>
                    <p className="text-gray-600">{interview.candidatePosition}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">CV:</span>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Download CV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Interview Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{formatDateTime(interview.scheduledDate, interview.scheduledTime)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{interview.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{interview.interviewerName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {interview.type === 'online' ? <Video className="h-4 w-4 text-gray-500" /> : <Phone className="h-4 w-4 text-gray-500" />}
                    <span className="text-sm capitalize">{interview.type}</span>
                  </div>
                  
                  {interview.type === 'in-person' && interview.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{interview.location}</span>
                    </div>
                  )}
                  
                  {interview.type === 'online' && interview.meetingLink && (
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-gray-500" />
                      <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleJoinMeeting}>
                        Join Meeting
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Position Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Job Position Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{interview.jobTitle}</h4>
                  <p className="text-gray-600">{interview.department}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-sm">
                    {interview.department}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Actions */}
          {interview.status === 'in-progress' && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => handleUpdateStatus('completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Interview
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateStatus('cancelled')}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Interview Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scoring */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Technical Skills</h4>
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.technicalSkills)}`}>
                    {feedback.technicalSkills}/10
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Communication</h4>
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.communication)}`}>
                    {feedback.communication}/10
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Problem Solving</h4>
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.problemSolving)}`}>
                    {feedback.problemSolving}/10
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Cultural Fit</h4>
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.culturalFit)}`}>
                    {feedback.culturalFit}/10
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                  {feedback.overallScore}/10
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Strengths</h4>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {feedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  value={feedback.recommendations}
                  onChange={(e) => setFeedback(prev => ({ ...prev, recommendations: e.target.value }))}
                  placeholder="Enter your recommendations..."
                  rows={3}
                />
              </div>

              {/* Interviewer Notes */}
              <div>
                <Label htmlFor="notes">Interviewer Notes</Label>
                <Textarea
                  id="notes"
                  value={feedback.interviewerNotes}
                  onChange={(e) => setFeedback(prev => ({ ...prev, interviewerNotes: e.target.value }))}
                  placeholder="Enter detailed notes about the interview..."
                  rows={4}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveFeedback}>
                  <Send className="mr-2 h-4 w-4" />
                  Save Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis" className="space-y-6">
          {interview.feedback?.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Sentiment Score</h4>
                    <div className="text-3xl font-bold text-blue-600">
                      {(interview.feedback.aiAnalysis.sentimentScore * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600">Positive sentiment detected</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Confidence Level</h4>
                    <div className="text-3xl font-bold text-green-600">
                      {(interview.feedback.aiAnalysis.confidenceLevel * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-600">Analysis confidence</p>
                  </div>
                </div>

                {/* Key Points */}
                <div>
                  <h4 className="font-semibold mb-3">Key Points Identified</h4>
                  <ul className="space-y-2">
                    {interview.feedback.aiAnalysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Questions */}
                <div>
                  <h4 className="font-semibold mb-3">Suggested Follow-up Questions</h4>
                  <ul className="space-y-2">
                    {interview.feedback.aiAnalysis.suggestedQuestions.map((question, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-purple-500 mt-1" />
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Interview Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Candidate CV</h4>
                      <p className="text-sm text-gray-600">Resume and portfolio</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Job Description</h4>
                      <p className="text-sm text-gray-600">Position requirements and responsibilities</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-purple-500" />
                    <div>
                      <h4 className="font-semibold">Interview Transcript</h4>
                      <p className="text-sm text-gray-600">AI-generated transcript</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}






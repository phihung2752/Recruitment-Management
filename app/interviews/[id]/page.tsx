"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Star, 
  Brain, 
  Target,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  currentPosition?: string
  experience?: string
  skills?: string
  status: string
  createdAt: string
  updatedAt: string
}

interface CVAnalysis {
  overallScore: number
  skillsMatch: number
  experienceMatch: number
  educationMatch: number
  recommendedLabels: string[]
  strengths: string[]
  weaknesses: string[]
  recommendation: string
  interviewQuestions: string[]
  suggestedSalary: string
  priority: string
}

export default function InterviewDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [interviewStep, setInterviewStep] = useState(1)
  const [notes, setNotes] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchCandidateData()
    }
  }, [params.id])

  const fetchCandidateData = async () => {
    try {
      setLoading(true)
      
      // Fetch candidate details
      const candidateResponse = await fetch(`/api/candidates/${params.id}`)
      if (candidateResponse.ok) {
        const candidateData = await candidateResponse.json()
        setCandidate(candidateData)
        
        // Simulate AI analysis
        await simulateAIAnalysis(candidateData)
      } else {
        toast.error("Failed to fetch candidate data")
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error)
      toast.error("Failed to fetch candidate data")
    } finally {
      setLoading(false)
    }
  }

  const simulateAIAnalysis = async (candidateData: Candidate) => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockAnalysis: CVAnalysis = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      skillsMatch: Math.floor(Math.random() * 30) + 70,
      experienceMatch: Math.floor(Math.random() * 30) + 70,
      educationMatch: Math.floor(Math.random() * 30) + 70,
      recommendedLabels: ["Senior", "React Expert", "Team Lead"],
      strengths: [
        "5+ năm kinh nghiệm React",
        "Có kinh nghiệm quản lý team",
        "Thành thạo TypeScript",
        "Có kinh nghiệm với testing"
      ],
      weaknesses: [
        "Thiếu kinh nghiệm với Node.js",
        "Chưa có kinh nghiệm với AWS"
      ],
      recommendation: "Strong Match",
      interviewQuestions: [
        "Bạn có thể chia sẻ về dự án React phức tạp nhất mà bạn đã làm?",
        "Làm thế nào bạn quản lý team trong dự án trước đây?",
        "Bạn có kinh nghiệm gì với testing trong React?",
        "Bạn có kinh nghiệm gì với performance optimization?",
        "Bạn có thể giải thích về state management trong React?"
      ],
      suggestedSalary: "25-35 triệu VND",
      priority: "High"
    }
    
    setAnalysis(mockAnalysis)
  }

  const handleNextStep = () => {
    if (interviewStep < 3) {
      setInterviewStep(interviewStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (interviewStep > 1) {
      setInterviewStep(interviewStep - 1)
    }
  }

  const handlePassCandidate = () => {
    toast.success("Candidate passed to next round!")
    // Here you would update the candidate status
  }

  const handleRejectCandidate = () => {
    toast.error("Candidate rejected")
    // Here you would update the candidate status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading candidate data...</p>
        </div>
      </div>
    )
  }

  if (!candidate || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Candidate not found</h2>
          <p className="text-muted-foreground">The candidate you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hr-bg-primary text-hr-text-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interview Details</h1>
            <p className="text-hr-text-secondary">AI-powered candidate analysis and interview</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrevStep} disabled={interviewStep === 1}>
              Previous
            </Button>
            <Button onClick={handleNextStep} disabled={interviewStep === 3}>
              Next
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {interviewStep} of 3</span>
            <span>{Math.round((interviewStep / 3) * 100)}% Complete</span>
          </div>
          <Progress value={(interviewStep / 3) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Info */}
          <div className="space-y-6">
            {/* Candidate Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Candidate Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-hr-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-hr-primary-600 font-bold text-xl">
                      {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{candidate.firstName} {candidate.lastName}</h3>
                    <p className="text-hr-text-secondary">{candidate.currentPosition || "No position"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-hr-text-secondary" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-hr-text-secondary" />
                      <span className="text-sm">{candidate.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-hr-text-secondary" />
                    <span className="text-sm">{candidate.experience || "0"} years experience</span>
                  </div>
                </div>

                {candidate.skills && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.split(',').map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-hr-primary-600">{analysis.overallScore}%</div>
                  <p className="text-sm text-hr-text-secondary">Overall Score</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Skills Match</span>
                      <span>{analysis.skillsMatch}%</span>
                    </div>
                    <Progress value={analysis.skillsMatch} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Experience Match</span>
                      <span>{analysis.experienceMatch}%</span>
                    </div>
                    <Progress value={analysis.experienceMatch} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Education Match</span>
                      <span>{analysis.educationMatch}%</span>
                    </div>
                    <Progress value={analysis.educationMatch} className="h-2" />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">AI Labels</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.recommendedLabels.map((label, index) => (
                      <Badge key={index} variant="outline" className="bg-hr-primary-50 text-hr-primary-700">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Priority</h4>
                  <Badge 
                    variant={analysis.priority === "High" ? "destructive" : analysis.priority === "Medium" ? "default" : "secondary"}
                  >
                    {analysis.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Interview Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: AI Analysis Details */}
            {interviewStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>AI Analysis Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">Strengths</h4>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recommendation</h4>
                    <Badge 
                      variant={analysis.recommendation === "Strong Match" ? "default" : "secondary"}
                      className="text-lg px-4 py-2"
                    >
                      {analysis.recommendation}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Suggested Salary Range</h4>
                    <p className="text-lg font-semibold text-hr-primary-600">{analysis.suggestedSalary}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Interview Questions */}
            {interviewStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>AI-Generated Interview Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.interviewQuestions.map((question, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-hr-bg-secondary">
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-hr-primary-100 text-hr-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <p className="text-sm">{question}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Interview Notes & Decision */}
            {interviewStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Interview Notes & Decision</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Interview Notes</label>
                    <textarea
                      className="w-full p-3 border rounded-lg bg-hr-bg-secondary text-hr-text-primary"
                      rows={6}
                      placeholder="Add your interview notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Overall Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-1 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      onClick={handlePassCandidate}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Pass to Next Round
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleRejectCandidate}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}





















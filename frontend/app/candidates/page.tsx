"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { InterviewRoundsTriangle } from "@/components/interview-rounds-triangle"
import {
  Search,
  User,
  Calendar,
  Star,
  Brain,
  MessageSquare,
  FileText,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  position: string
  location: string
  status: "pending" | "approved" | "rejected"
  avatar?: string
  appliedDate: string
  experience: string
  skills: string[]
  interviewRounds: Array<{
    id: number
    name: string
    status: "pending" | "passed" | "failed" | "current"
    interviewer: string
    interviewerAvatar?: string
    date?: string
    feedback?: string
  }>
  aiAnalysis?: {
    matchScore: number
    strengths: string[]
    concerns: string[]
    recommendation: string
  }
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    position: "Senior Developer",
    location: "New York, NY",
    status: "pending",
    appliedDate: "2024-01-15",
    experience: "5+ years",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    interviewRounds: [
      { id: 1, name: "Initial Screening", status: "passed", interviewer: "Sarah Johnson", date: "2024-01-20" },
      { id: 2, name: "Technical Interview", status: "current", interviewer: "Mike Chen", date: "2024-01-25" },
      { id: 3, name: "HR Interview", status: "pending", interviewer: "Lisa Wang" },
      { id: 4, name: "Final Round", status: "pending", interviewer: "David Brown" },
    ],
    aiAnalysis: {
      matchScore: 92,
      strengths: ["Strong technical skills", "Good communication", "Relevant experience"],
      concerns: ["Limited leadership experience"],
      recommendation: "Highly recommended for technical roles",
    },
  },
  {
    id: 2,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 234 567 8901",
    position: "Frontend Developer",
    location: "San Francisco, CA",
    status: "pending",
    appliedDate: "2024-01-18",
    experience: "3+ years",
    skills: ["React", "Vue.js", "CSS", "JavaScript"],
    interviewRounds: [
      { id: 1, name: "Phone Screening", status: "passed", interviewer: "Tom Wilson" },
      { id: 2, name: "Technical Test", status: "passed", interviewer: "Anna Lee" },
      { id: 3, name: "Team Interview", status: "pending", interviewer: "John Doe" },
    ],
    aiAnalysis: {
      matchScore: 88,
      strengths: ["Excellent frontend skills", "Creative problem solving"],
      concerns: ["Limited backend experience"],
      recommendation: "Great fit for frontend-focused roles",
    },
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "+1 234 567 8902",
    position: "React Developer",
    location: "Austin, TX",
    status: "pending",
    appliedDate: "2024-01-20",
    experience: "4+ years",
    skills: ["React", "Redux", "GraphQL", "Jest"],
    interviewRounds: [
      { id: 1, name: "Initial Call", status: "passed", interviewer: "Emma Davis" },
      { id: 2, name: "Code Review", status: "current", interviewer: "Alex Kim" },
    ],
    aiAnalysis: {
      matchScore: 85,
      strengths: ["Strong React expertise", "Good testing practices"],
      concerns: ["Limited full-stack experience"],
      recommendation: "Solid candidate for React-specific roles",
    },
  },
]

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(mockCandidates[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAnalyzeCandidate = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      // Update candidate with new analysis
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">Manage and review candidate applications</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Total: {candidates.length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Candidates
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                      selectedCandidate.id === candidate.id ? "bg-blue-50 border-l-blue-500" : "border-l-transparent"
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                        <p className="text-xs text-gray-500 mt-1">{candidate.email}</p>
                      </div>
                      <Badge className={`${getStatusColor(candidate.status)} flex items-center gap-1`}>
                        {getStatusIcon(candidate.status)}
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidate Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Interview Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interview Progress: {selectedCandidate.name}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Pass Round
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      Fail Round
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <InterviewRoundsTriangle rounds={selectedCandidate.interviewRounds} /> */}
              </CardContent>
            </Card>

            {/* Additional Information Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ai-analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                    <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                    <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ai-analysis" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">AI Candidate Analysis</h3>
                      <Button
                        onClick={handleAnalyzeCandidate}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Analyze Candidate
                          </>
                        )}
                      </Button>
                    </div>

                    {selectedCandidate.aiAnalysis && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {selectedCandidate.aiAnalysis.matchScore}%
                            </div>
                            <div className="text-sm text-gray-600">Match Score</div>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${selectedCandidate.aiAnalysis.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-green-700 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Strengths
                            </h4>
                            <ul className="space-y-1">
                              {selectedCandidate.aiAnalysis.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Areas of Concern
                            </h4>
                            <ul className="space-y-1">
                              {selectedCandidate.aiAnalysis.concerns.map((concern, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                  <XCircle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                  {concern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">AI Recommendation</h4>
                          <p className="text-blue-700">{selectedCandidate.aiAnalysis.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="scheduling" className="space-y-4">
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">Schedule Interview</h3>
                      <p className="text-gray-500">Interview scheduling feature coming soon</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="chatbot" className="space-y-4">
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">AI Interview Assistant</h3>
                      <p className="text-gray-500">AI-powered interview chatbot coming soon</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4">
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">Interview Feedback</h3>
                      <p className="text-gray-500">Feedback collection feature coming soon</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Skills Assessment</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="assessment" className="space-y-4">
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">Technical Assessment</h3>
                      <p className="text-gray-500">Assessment results will appear here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

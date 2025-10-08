"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Plus, 
  Search, 
  Users, 
  Bot,
  Brain,
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Mail,
  Send,
  FileText,
  User
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function InterviewsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("ai-analysis")
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5) // Chỉ hiện 5 CVs
  const [processingRound, setProcessingRound] = useState(false)

  // Pass/Fail Round functions
  const handlePassRound = async () => {
    if (!selectedCandidate) return
    
    setProcessingRound(true)
    try {
      // Update candidate status and interview rounds
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.id === selectedCandidate.id) {
          const updatedRounds = candidate.interviewRounds.map((round: any) => {
            if (round.status === 'current') {
              return { ...round, status: 'passed' }
            }
            return round
          })
          
          // Check if all rounds are passed
          const allPassed = updatedRounds.every((round: any) => round.status === 'passed')
          const newStatus = allPassed ? 'Hired' : 'Interviewed'
          
          return {
            ...candidate,
            status: newStatus,
            interviewRounds: updatedRounds
          }
        }
        return candidate
      })
      
      setCandidates(updatedCandidates)
      setSelectedCandidate(updatedCandidates.find(c => c.id === selectedCandidate.id))
      
      toast({
        title: "Success",
        description: "Round passed successfully!",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pass round",
        variant: "destructive"
      })
    } finally {
      setProcessingRound(false)
    }
  }

  const handleFailRound = async () => {
    if (!selectedCandidate) return
    
    setProcessingRound(true)
    try {
      // Update candidate status and interview rounds
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.id === selectedCandidate.id) {
          const updatedRounds = candidate.interviewRounds.map((round: any) => {
            if (round.status === 'current') {
              return { ...round, status: 'failed' }
            }
            return round
          })
          
          return {
            ...candidate,
            status: 'Rejected',
            interviewRounds: updatedRounds
          }
        }
        return candidate
      })
      
      setCandidates(updatedCandidates)
      setSelectedCandidate(updatedCandidates.find(c => c.id === selectedCandidate.id))
      
      toast({
        title: "Round Failed",
        description: "Candidate has been rejected",
        variant: "destructive"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process round",
        variant: "destructive"
      })
    } finally {
      setProcessingRound(false)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(candidates.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCandidates = candidates.slice(startIndex, endIndex)

  // Generate mock interview rounds based on candidate status
  const generateMockInterviewRounds = (status: string) => {
    const rounds = [
      { id: 1, name: "Phone Screening", status: "passed", date: "2025-09-25", interviewer: "HR Team" },
      { id: 2, name: "Technical Interview", status: "passed", date: "2025-09-26", interviewer: "Tech Lead" },
      { id: 3, name: "Final Interview", status: "current", date: "2025-09-27", interviewer: "Hiring Manager" }
    ]

    switch (status) {
      case "Hired":
        return rounds.map(round => ({ ...round, status: "passed" }))
      case "Rejected":
        return rounds.map((round, index) => ({ 
          ...round, 
          status: index < 2 ? "passed" : "failed" 
        }))
      case "Interviewed":
        return rounds.map((round, index) => ({ 
          ...round, 
          status: index < 2 ? "passed" : "current" 
        }))
      case "Applied":
        return rounds.map((round, index) => ({ 
          ...round, 
          status: index === 0 ? "current" : "pending" 
        }))
      default:
        return rounds.map(round => ({ ...round, status: "pending" }))
    }
  }

  // Fetch candidates from API
  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/candidates?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        // Filter chỉ qualified candidates (Applied, Interviewed, Hired)
        const qualifiedCandidates = (data.candidates || []).filter((candidate: any) => 
          ['Applied', 'Interviewed', 'Hired'].includes(candidate.status)
        )
        
        // Add mock interview rounds to each candidate
        const candidatesWithRounds = qualifiedCandidates.map((candidate: any) => ({
          ...candidate,
          interviewRounds: generateMockInterviewRounds(candidate.status)
        }))
        
        setCandidates(candidatesWithRounds)
        if (candidatesWithRounds.length > 0 && !selectedCandidate) {
          setSelectedCandidate(candidatesWithRounds[0])
        }
      } else {
        console.error('Failed to fetch candidates')
        toast({
          title: "Error",
          description: "Failed to fetch candidates",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
      toast({
        title: "Error", 
        description: "Failed to fetch candidates",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fix hydration error and fetch data
  useEffect(() => {
    setIsClient(true)
    fetchCandidates()
  }, [searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hired": return "bg-green-600 text-white"
      case "Rejected": return "bg-red-600 text-white"
      case "Interviewed": return "bg-blue-600 text-white"
      case "Applied": return "bg-yellow-500 text-black"
      case "Pending": return "bg-orange-500 text-white"
      default: return "bg-gray-600 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return CheckCircle
      case "current": return Clock
      case "pending": return AlertCircle
      case "failed": return XCircle
      default: return Clock
    }
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return "text-green-700"
    if (score >= 80) return "text-blue-700"
    if (score >= 70) return "text-amber-700"
    return "text-red-700"
  }

  const handleCollectCVs = async () => {
    console.log('🚀 Collect CVs clicked')
    try {
      const response = await fetch('/api/cv/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobSites: ["VietnamWorks", "TopCV", "ITviec"]
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "CV Collection Started",
          description: `Collected ${result.cvs?.length || 0} CVs from job sites`,
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to collect CVs",
        variant: "destructive"
      })
    }
  }

  const handleAIAnalysis = async () => {
    console.log('🚀 AI Analysis clicked')
    try {
      const response = await fetch('/api/cv/collect', {
        method: 'GET'
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "AI Analysis Started",
          description: `Analyzing ${result.cvs?.length || 0} CVs with AI`,
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to start AI analysis",
        variant: "destructive"
      })
    }
  }

  // Prevent hydration error
  if (!isClient || loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading candidates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredPermissions={['interview.read']}>
      <div className="space-y-4 p-4 bg-hr-bg-primary text-hr-text-primary min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("Interviews")}</h1>
          <p className="text-muted-foreground">{t("AI-powered interview management")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            onClick={handleCollectCVs}
          >
            <FileText className="mr-2 h-4 w-4" />
            {t("Collect CVs")}
          </Button>
          <Button 
            variant="outline" 
            className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            onClick={handleAIAnalysis}
          >
            <Bot className="mr-2 h-4 w-4" />
            {t("AI Analysis")}
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("Schedule Interview")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column - Candidates List */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t("Candidates")}
                <Badge variant="secondary">Total: {candidates.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  {paginatedCandidates.map((candidate) => (
                    <Card 
                      key={candidate.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCandidate?.id === candidate.id ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                                {`${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {`${candidate.firstName || ''} ${candidate.lastName || ''}`}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {candidate.currentPosition || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {candidate.email}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(candidate.status)} font-medium px-2 py-1`}>
                            {candidate.status}
                          </Badge>
                        </div>
                        
                        {/* Skills Preview */}
                        {candidate.skills && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.split(',').slice(0, 3).map((skill: string, index: number) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                              {candidate.skills.split(',').length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                                  +{candidate.skills.split(',').length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{candidate.email}</span>
                          <div className="flex items-center space-x-1">
                            <Brain className="h-3 w-3" />
                            <span className={`font-medium ${getAIScoreColor(candidate.aiScore)}`}>
                              {candidate.aiScore}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, candidates.length)} of {candidates.length} candidates
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="bg-white dark:bg-gray-800"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="bg-white dark:bg-gray-800"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Interview Progress & AI Analysis */}
        <div className="xl:col-span-2">
          {selectedCandidate ? (
            <div className="space-y-6">
              {/* Interview Progress */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Interview Progress: {selectedCandidate.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-green-600 text-white border-green-600 hover:bg-green-700 disabled:opacity-50"
                        onClick={handlePassRound}
                        disabled={processingRound || !selectedCandidate}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {processingRound ? "Processing..." : "Pass Round"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-red-600 text-white border-red-600 hover:bg-red-700 disabled:opacity-50"
                        onClick={handleFailRound}
                        disabled={processingRound || !selectedCandidate}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        {processingRound ? "Processing..." : "Fail Round"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Interview Rounds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedCandidate.interviewRounds || []).map((round: any) => {
                        const StatusIcon = getStatusIcon(round.status)
                        return (
                          <div 
                            key={round.id}
                            className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
                              round.status === 'current' ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : 
                              round.status === 'passed' ? 'bg-green-50 dark:bg-green-900/20' :
                              round.status === 'failed' ? 'bg-red-50 dark:bg-red-900/20' :
                              'bg-gray-50 dark:bg-gray-800'
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              round.status === 'passed' ? 'bg-green-600 text-white' : 
                              round.status === 'current' ? 'bg-purple-600 text-white' : 
                              round.status === 'failed' ? 'bg-red-600 text-white' :
                              'bg-gray-400 text-white'
                            }`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{round.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={round.interviewerAvatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                                    {round.interviewer.split(' ').map((n: string) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{round.interviewer}</span>
                                <span>•</span>
                                <span>{round.date}</span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(round.status)}>
                              {t(round.status)}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis & Gmail Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                      <TabsTrigger value="gmail">Gmail</TabsTrigger>
                      <TabsTrigger value="cv-collection">CV Collection</TabsTrigger>
                      <TabsTrigger value="ai-evaluation">AI Evaluation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ai-analysis" className="space-y-4">
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">AI Candidate Analysis</h3>
                        <p className="text-muted-foreground mb-4">
                          Advanced AI analysis using Google AI API
                        </p>
                        <Button 
                          className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100" 
                          onClick={handleAIAnalysis}
                        >
                          <Brain className="mr-2 h-4 w-4" />
                          Analyze with AI
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="gmail" className="space-y-4">
                      <div className="text-center py-8">
                        <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Gmail Integration</h3>
                        <p className="text-muted-foreground mb-4">
                          Send interview invitations and results via Gmail
                        </p>
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            onClick={handlePassRound}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Interview Invitation
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleFailRound}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Send Results Email
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cv-collection" className="space-y-4">
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">CV Collection from Job Sites</h3>
                        <p className="text-muted-foreground mb-4">
                          Automatically collect CVs from job posting sites
                        </p>
                        <Button 
                          className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" 
                          onClick={handleCollectCVs}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Start CV Collection
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="ai-evaluation" className="space-y-4">
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">AI CV Evaluation & Classification</h3>
                        <p className="text-muted-foreground mb-4">
                          AI-powered CV analysis and candidate classification
                        </p>
                        <Button 
                          className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100" 
                          onClick={handleAIAnalysis}
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Start AI Evaluation
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("Select a Candidate")}</h3>
                <p className="text-muted-foreground">
                  {t("Choose a candidate from the list to view their interview progress and AI analysis.")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
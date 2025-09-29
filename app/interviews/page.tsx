"use client"

import { useState, useEffect } from "react"
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
  Clock, 
  Users, 
  Bot,
  Brain,
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

  // Fetch candidates from API
  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/candidates?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates || [])
        if (data.candidates && data.candidates.length > 0 && !selectedCandidate) {
          setSelectedCandidate(data.candidates[0])
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
      case "passed": return "bg-green-50 text-green-700 border border-green-200"
      case "current": return "bg-blue-50 text-blue-700 border border-blue-200"
      case "pending": return "bg-amber-50 text-amber-700 border border-amber-200"
      case "failed": return "bg-red-50 text-red-700 border border-red-200"
      default: return "bg-gray-50 text-gray-700 border border-gray-200"
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

  const handlePassRound = async () => {
    console.log('🚀 Pass Round clicked')
    try {
      const response = await fetch('/api/email/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail: selectedCandidate?.email,
          candidateName: selectedCandidate?.name,
          position: selectedCandidate?.position,
          interviewDate: new Date(),
          location: "Office"
        })
      })

      if (response.ok) {
        toast({
          title: "Round Passed",
          description: "Gmail notification sent to candidate",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      })
    }
  }

  const handleFailRound = async () => {
    console.log('🚀 Fail Round clicked')
    try {
      const response = await fetch('/api/email/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail: selectedCandidate?.email,
          candidateName: selectedCandidate?.name,
          position: selectedCandidate?.position,
          interviewDate: new Date(),
          location: "Office"
        })
      })

      if (response.ok) {
        toast({
          title: "Round Failed",
          description: "Gmail notification sent to candidate",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      })
    }
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
    <div className="space-y-4 p-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidates List */}
        <div className="lg:col-span-1">
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
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Search candidates...")}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  {candidates.map((candidate) => (
                    <Card 
                      key={candidate.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedCandidate?.id === candidate.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>
                                {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
    <div>
                              <h3 className="font-medium">{candidate.name}</h3>
                              <p className="text-sm text-muted-foreground">{candidate.position}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(candidate.status)}>
                            {t(candidate.status)}
                          </Badge>
                        </div>
                        
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Interview Progress & AI Analysis */}
        <div className="lg:col-span-2">
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
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={handlePassRound}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        {t("Pass Round")}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={handleFailRound}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        {t("Fail Round")}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-4">Interview Rounds</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedCandidate.interviewRounds.map((round: any) => {
                        const StatusIcon = getStatusIcon(round.status)
                        return (
                          <div 
                            key={round.id}
                            className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
                              round.status === 'current' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              round.status === 'passed' ? 'bg-green-100 text-green-600' : 
                              round.status === 'current' ? 'bg-blue-100 text-blue-600' : 
                              round.status === 'failed' ? 'bg-red-100 text-red-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{round.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={round.interviewerAvatar} />
                                  <AvatarFallback>{round.interviewer.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span>{round.interviewer}</span>
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
  )
}
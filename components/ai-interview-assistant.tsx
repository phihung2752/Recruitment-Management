"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  Star, 
  Target, 
  Zap, 
  Lightbulb,
  Send,
  RefreshCw,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  BookOpen,
  Search,
  Filter,
  SortAsc,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Share2,
  Bookmark,
  Flag,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AIAssistantProps {
  candidateInfo?: {
    name: string
    position: string
    experience: string
    skills: string[]
    cvSummary?: string
  }
  jobDescription?: {
    title: string
    requirements: string[]
    responsibilities: string[]
    skills: string[]
  }
  onQuestionSelect?: (question: string) => void
  onScoreUpdate?: (scores: any) => void
}

interface SuggestedQuestion {
  id: string
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  relevance: number
  reasoning: string
}

interface AIScore {
  category: string
  score: number
  reasoning: string
  suggestions: string[]
}

export default function AIInterviewAssistant({ 
  candidateInfo, 
  jobDescription, 
  onQuestionSelect,
  onScoreUpdate 
}: AIAssistantProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("questions")
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([])
  const [aiScores, setAiScores] = useState<AIScore[]>([])
  const [cvSummary, setCvSummary] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data
  const mockQuestions: SuggestedQuestion[] = [
    {
      id: "q1",
      question: "Can you walk me through your experience with React hooks and state management?",
      category: "Technical",
      difficulty: "medium",
      relevance: 0.95,
      reasoning: "High relevance based on candidate's React experience and job requirements"
    },
    {
      id: "q2",
      question: "How do you handle performance optimization in large-scale applications?",
      category: "Technical",
      difficulty: "hard",
      relevance: 0.88,
      reasoning: "Important for senior-level position and matches candidate's background"
    },
    {
      id: "q3",
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      category: "Behavioral",
      difficulty: "medium",
      relevance: 0.92,
      reasoning: "Good for assessing problem-solving skills and cultural fit"
    },
    {
      id: "q4",
      question: "How do you stay updated with the latest frontend technologies and trends?",
      category: "Learning",
      difficulty: "easy",
      relevance: 0.85,
      reasoning: "Shows continuous learning mindset, important for tech roles"
    },
    {
      id: "q5",
      question: "Can you explain the difference between controlled and uncontrolled components in React?",
      category: "Technical",
      difficulty: "easy",
      relevance: 0.90,
      reasoning: "Fundamental React concept, good for assessing basic knowledge"
    }
  ]

  const mockScores: AIScore[] = [
    {
      category: "Technical Skills",
      score: 8.5,
      reasoning: "Strong React experience, good understanding of modern JavaScript",
      suggestions: ["Ask about TypeScript experience", "Dive deeper into testing practices"]
    },
    {
      category: "Communication",
      score: 7.2,
      reasoning: "Clear explanations, good structure in responses",
      suggestions: ["Ask for more specific examples", "Test technical communication"]
    },
    {
      category: "Problem Solving",
      score: 8.8,
      reasoning: "Excellent approach to complex problems, shows analytical thinking",
      suggestions: ["Present a real-world scenario", "Ask about debugging strategies"]
    },
    {
      category: "Cultural Fit",
      score: 7.5,
      reasoning: "Shows enthusiasm, good team player attitude",
      suggestions: ["Ask about collaboration experience", "Discuss company values"]
    }
  ]

  useEffect(() => {
    setSuggestedQuestions(mockQuestions)
    setAiScores(mockScores)
  }, [])

  const generateQuestions = async () => {
    setIsGenerating(true)
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI response
      const newQuestions = [
        ...mockQuestions,
        {
          id: `q${Date.now()}`,
          question: "How would you implement a custom hook for API data fetching?",
          category: "Technical",
          difficulty: "hard" as const,
          relevance: 0.93,
          reasoning: "Advanced React concept, tests deep understanding"
        }
      ]
      
      setSuggestedQuestions(newQuestions)
      toast({
        title: "Questions Generated",
        description: "AI has generated new interview questions based on candidate profile",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateCVSummary = async () => {
    setIsGenerating(true)
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const summary = `Candidate with 5+ years of frontend development experience, specializing in React and JavaScript. Strong background in building scalable web applications, with expertise in state management, component architecture, and performance optimization. Previous experience includes working with TypeScript, Redux, and modern build tools. Shows good understanding of responsive design and accessibility principles.`
      
      setCvSummary(summary)
      toast({
        title: "CV Summary Generated",
        description: "AI has analyzed and summarized the candidate's CV",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate CV summary",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const updateAIScores = async () => {
    setIsLoading(true)
    try {
      // Simulate AI analysis based on notes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock AI analysis
      const updatedScores = aiScores.map(score => ({
        ...score,
        score: Math.min(10, score.score + (Math.random() - 0.5) * 0.5),
        suggestions: [...score.suggestions, "Consider asking follow-up questions"]
      }))
      
      setAiScores(updatedScores)
      onScoreUpdate?.(updatedScores)
      
      toast({
        title: "Scores Updated",
        description: "AI has analyzed your notes and updated the scores",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update scores",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionSelect = (question: SuggestedQuestion) => {
    onQuestionSelect?.(question.question)
    toast({
      title: "Question Selected",
      description: "Question added to your interview notes",
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI Interview Assistant</span>
          </h2>
          <p className="text-muted-foreground">AI-powered tools to enhance your interview process</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateQuestions} disabled={isGenerating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate Questions
          </Button>
          <Button variant="outline" onClick={generateCVSummary} disabled={isGenerating}>
            <FileText className="mr-2 h-4 w-4" />
            Analyze CV
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="scoring">AI Scoring</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
    <Card>
      <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Suggested Questions</span>
              </CardTitle>
      </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedQuestions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{question.category}</Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="secondary">
                            {(question.relevance * 100).toFixed(0)}% relevant
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {question.reasoning}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleQuestionSelect(question)}
                        className="ml-4"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Scoring Tab */}
        <TabsContent value="scoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>AI-Powered Scoring</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiScores.map((score, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{score.category}</h4>
                      <div className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                        {score.score.toFixed(1)}/10
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {score.reasoning}
                    </p>
                    <div>
                      <h5 className="text-sm font-medium mb-2">AI Suggestions:</h5>
                      <ul className="space-y-1">
                        {score.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                            <ArrowRight className="h-3 w-3" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Button onClick={updateAIScores} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Update Scores
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Interview Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Real-time Notes (AI will analyze these)
                  </label>
          <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes during the interview. AI will analyze these in real-time..."
                    rows={8}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {notes.length} characters
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>AI Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cvSummary ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2">CV Analysis Summary</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{cvSummary}</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">No CV summary available</p>
                    <Button 
                      variant="outline" 
                      onClick={generateCVSummary}
                      disabled={isGenerating}
                      className="mt-4"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Summary
                    </Button>
                  </div>
                )}
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">AI Insights</h4>
                  <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Strong technical background in React and JavaScript</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Good communication skills demonstrated</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Consider asking about TypeScript experience</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Shows potential for senior-level responsibilities</span>
                    </li>
                  </ul>
                </div>
              </div>
      </CardContent>
    </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
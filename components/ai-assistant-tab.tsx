'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Bot, FileText, MessageSquare, Target, BarChart3, Mail, Sparkles, Loader2 } from "lucide-react"

interface AIFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'processing' | 'inactive'
  progress?: number
}

export default function AIAssistantTab() {
  const [features, setFeatures] = useState<AIFeature[]>([
    {
      id: '1',
      title: 'Resume Screening',
      description: 'AI-powered resume analysis and candidate matching',
      icon: <FileText className="h-6 w-6" />,
      status: 'active',
      progress: 100
    },
    {
      id: '2',
      title: 'Question Generator',
      description: 'Generate personalized interview questions based on role and experience',
      icon: <MessageSquare className="h-6 w-6" />,
      status: 'processing',
      progress: 75
    },
    {
      id: '3',
      title: 'Email Writer',
      description: 'Automatically draft professional interview emails and follow-ups',
      icon: <Mail className="h-6 w-6" />,
      status: 'active',
      progress: 100
    },
    {
      id: '4',
      title: 'Candidate Matching',
      description: 'Match candidates to job requirements using AI algorithms',
      icon: <Target className="h-6 w-6" />,
      status: 'processing',
      progress: 60
    },
    {
      id: '5',
      title: 'Interview Analysis',
      description: 'Analyze interview performance and provide insights',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'inactive',
      progress: 0
    },
    {
      id: '6',
      title: 'HR Chatbot',
      description: 'AI assistant for answering HR questions and providing guidance',
      icon: <Bot className="h-6 w-6" />,
      status: 'active',
      progress: 100
    }
  ])

  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFeatureClick = async (featureId: string) => {
    setSelectedFeature(featureId)
    setIsProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'processing': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'processing': return 'Processing'
      case 'inactive': return 'Inactive'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-hr-text-primary mb-2">AI Assistant</h2>
        <p className="text-hr-text-secondary">Leverage AI to streamline your hiring process</p>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.id} 
            className={`bg-hr-bg-secondary border-hr-border hover:border-hr-accent transition-all duration-200 cursor-pointer ${
              selectedFeature === feature.id ? 'ring-2 ring-hr-accent' : ''
            }`}
            onClick={() => handleFeatureClick(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-hr-accent/20 text-hr-accent">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-hr-text-primary text-lg">{feature.title}</CardTitle>
                    <Badge className={getStatusColor(feature.status)}>
                      {getStatusText(feature.status)}
                    </Badge>
                  </div>
                </div>
                {isProcessing && selectedFeature === feature.id && (
                  <Loader2 className="h-5 w-5 animate-spin text-hr-accent" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-hr-text-secondary text-sm mb-4">{feature.description}</p>
              
              {feature.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-hr-text-secondary">Progress</span>
                    <span className="text-hr-text-primary">{feature.progress}%</span>
                  </div>
                  <Progress value={feature.progress} className="h-2" />
                </div>
              )}

              <Button 
                className="w-full mt-4 bg-hr-accent text-white hover:bg-hr-accent/90"
                disabled={feature.status === 'inactive' || isProcessing}
              >
                {isProcessing && selectedFeature === feature.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Use Feature
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-hr-text-primary">Recent AI Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-hr-bg-primary">
                  <FileText className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-hr-text-primary">Resume screening completed</p>
                    <p className="text-xs text-hr-text-secondary">15 candidates analyzed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-hr-bg-primary">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-hr-text-primary">Questions generated</p>
                    <p className="text-xs text-hr-text-secondary">12 technical questions for Frontend role</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-hr-bg-primary">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-hr-text-primary">Email templates created</p>
                    <p className="text-xs text-hr-text-secondary">3 follow-up emails sent</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-hr-text-primary">AI Recommendations</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-hr-bg-primary border-l-4 border-hr-accent">
                  <p className="text-sm text-hr-text-primary font-medium">Optimize Interview Process</p>
                  <p className="text-xs text-hr-text-secondary mt-1">
                    Consider adding behavioral questions for better candidate assessment
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-hr-bg-primary border-l-4 border-green-500">
                  <p className="text-sm text-hr-text-primary font-medium">Improve Response Time</p>
                  <p className="text-xs text-hr-text-secondary mt-1">
                    Send follow-up emails within 24 hours for better candidate experience
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-hr-bg-primary border-l-4 border-yellow-500">
                  <p className="text-sm text-hr-text-primary font-medium">Diversify Question Bank</p>
                  <p className="text-xs text-hr-text-secondary mt-1">
                    Add more situational questions to assess problem-solving skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface Placeholder */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Chat Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-hr-bg-primary rounded-lg border border-hr-border">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-4 text-hr-text-secondary" />
              <p className="text-hr-text-secondary">AI Chat interface will be implemented here</p>
              <p className="text-sm text-hr-text-secondary mt-2">
                Integration with OpenAI or similar AI service
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}







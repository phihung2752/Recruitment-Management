"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, 
  Upload, 
  Search, 
  Brain,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function CVManagementPage() {
  const { t } = useLanguage()
  const [selectedCV, setSelectedCV] = useState<any>(null)

  // Mock CV data
  const cvs = [
    {
      id: "1",
      candidateName: "John Smith",
      position: "Senior Developer",
      email: "john@example.com",
      status: "analyzed",
      aiScore: 92,
      skills: ["React", "Node.js", "TypeScript", "AWS"]
    },
    {
      id: "2",
      candidateName: "Alice Johnson", 
      position: "Frontend Developer",
      email: "alice@example.com",
      status: "processing",
      aiScore: 78,
      skills: ["Vue.js", "CSS", "JavaScript", "Figma"]
    },
    {
      id: "3",
      candidateName: "Bob Wilson",
      position: "React Developer", 
      email: "bob@example.com",
      status: "pending",
      aiScore: 0,
      skills: []
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed": return "bg-green-100 text-green-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      case "pending": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "analyzed": return CheckCircle
      case "processing": return Clock
      case "pending": return AlertCircle
      default: return Clock
    }
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{t("CV Management")}</h1>
          <p className="text-muted-foreground">{t("AI-powered CV analysis and candidate evaluation")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Brain className="mr-2 h-4 w-4" />
            {t("AI Analysis")}
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            {t("Upload CV")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Total CVs")}</p>
                <p className="text-xl font-bold">{cvs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Analyzed")}</p>
                <p className="text-xl font-bold">{cvs.filter(cv => cv.status === 'analyzed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Processing")}</p>
                <p className="text-xl font-bold">{cvs.filter(cv => cv.status === 'processing').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Avg AI Score")}</p>
                <p className="text-xl font-bold">
                  {Math.round(cvs.filter(cv => cv.aiScore > 0).reduce((sum, cv) => sum + cv.aiScore, 0) / cvs.filter(cv => cv.aiScore > 0).length) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - CV List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("CV List")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cvs.map((cv) => {
                  const StatusIcon = getStatusIcon(cv.status)
                  return (
                    <Card 
                      key={cv.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedCV?.id === cv.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedCV(cv)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {cv.candidateName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{cv.candidateName}</h3>
                              <p className="text-sm text-muted-foreground">{cv.position}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(cv.status)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {t(cv.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {cv.email}
                          </div>
                          
                          {cv.aiScore > 0 && (
                            <div className="flex items-center space-x-2">
                              <Brain className="h-3 w-3" />
                              <span className="text-sm font-medium text-blue-600">
                                AI Score: {cv.aiScore}%
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - CV Details */}
        <div className="lg:col-span-2">
          {selectedCV ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCV.candidateName}</CardTitle>
                  <p className="text-muted-foreground">{selectedCV.position}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">AI Analysis</h3>
                      {selectedCV.status === 'analyzed' ? (
                        <div className="text-center py-4">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {selectedCV.aiScore}%
                          </div>
                          <p className="text-muted-foreground">Overall AI Score</p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">AI Analysis Pending</h3>
                          <p className="text-muted-foreground mb-4">
                            This CV is currently being processed by our AI system
                          </p>
                          <Button>
                            <Brain className="mr-2 h-4 w-4" />
                            Start Analysis
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("Select a CV")}</h3>
                <p className="text-muted-foreground">
                  {t("Choose a CV from the list to view AI analysis and insights.")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
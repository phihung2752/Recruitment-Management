"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Star, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface AIScoreDetailProps {
  cv: {
    id: string
    name: string
    email: string
    aiScore: number
    jobMatch: number
    experience: number
    skills: number
    education: number
    cvQuality: number
    strengths: string[]
    weaknesses: string[]
    missingSkills: string[]
    redFlags: string[]
    recommendations: string[]
  }
  onClose: () => void
}

export default function AIScoreDetail({ cv, onClose }: AIScoreDetailProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-hr-bg-secondary border-hr-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-hr-text-primary">AI Score Analysis</CardTitle>
            <CardDescription className="text-hr-text-secondary">
              Detailed breakdown for {cv.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - cv.aiScore / 100)}`}
                  className={getScoreColor(cv.aiScore)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(cv.aiScore)}`}>
                    {cv.aiScore}%
                  </div>
                  <div className="text-sm text-hr-text-secondary">Overall Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-hr-bg-primary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary text-lg">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-hr-text-primary">Job Match</span>
                    <Badge className={getScoreBadgeColor(cv.jobMatch)}>
                      {cv.jobMatch}%
                    </Badge>
                  </div>
                  <Progress value={cv.jobMatch} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-hr-text-primary">Experience</span>
                    <Badge className={getScoreBadgeColor(cv.experience)}>
                      {cv.experience}%
                    </Badge>
                  </div>
                  <Progress value={cv.experience} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-hr-text-primary">Skills</span>
                    <Badge className={getScoreBadgeColor(cv.skills)}>
                      {cv.skills}%
                    </Badge>
                  </div>
                  <Progress value={cv.skills} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-hr-text-primary">Education</span>
                    <Badge className={getScoreBadgeColor(cv.education)}>
                      {cv.education}%
                    </Badge>
                  </div>
                  <Progress value={cv.education} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-hr-text-primary">CV Quality</span>
                    <Badge className={getScoreBadgeColor(cv.cvQuality)}>
                      {cv.cvQuality}%
                    </Badge>
                  </div>
                  <Progress value={cv.cvQuality} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-hr-bg-primary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary text-lg">AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {cv.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-hr-text-secondary flex items-center gap-2">
                        <Star className="h-3 w-3 text-green-600" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {cv.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-hr-text-secondary flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-yellow-600" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Red Flags
                  </h4>
                  <ul className="space-y-1">
                    {cv.redFlags.map((flag, index) => (
                      <li key={index} className="text-sm text-hr-text-secondary flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Missing Skills */}
          {cv.missingSkills.length > 0 && (
            <Card className="bg-hr-bg-primary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary text-lg">Missing Skills</CardTitle>
                <CardDescription className="text-hr-text-secondary">
                  Skills that would improve the candidate's profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cv.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-hr-border text-hr-text-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="bg-hr-bg-primary border-hr-border">
            <CardHeader>
              <CardTitle className="text-hr-text-primary text-lg">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cv.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-hr-text-secondary flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {recommendation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}







'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, XCircle } from "lucide-react"

interface InterviewAnalyticsRealProps {
  data?: {
    totalInterviews: number
    passRate: number
    averageDuration: number
    candidatesByStage: Array<{
      stage: string
      count: number
      percentage: number
    }>
    monthlyTrend: Array<{
      month: string
      interviews: number
      passRate: number
    }>
    topInterviewers: Array<{
      name: string
      interviews: number
      passRate: number
    }>
  }
}

export default function InterviewAnalyticsReal({ data }: InterviewAnalyticsRealProps) {
  // Mock data if no real data provided
  const analyticsData = data || {
    totalInterviews: 156,
    passRate: 68.5,
    averageDuration: 45,
    candidatesByStage: [
      { stage: "Screening", count: 45, percentage: 28.8 },
      { stage: "Technical", count: 38, percentage: 24.4 },
      { stage: "HR", count: 35, percentage: 22.4 },
      { stage: "Final", count: 28, percentage: 17.9 },
      { stage: "Offer", count: 10, percentage: 6.4 }
    ],
    monthlyTrend: [
      { month: "Jan", interviews: 12, passRate: 65 },
      { month: "Feb", interviews: 18, passRate: 72 },
      { month: "Mar", interviews: 25, passRate: 68 },
      { month: "Apr", interviews: 22, passRate: 71 },
      { month: "May", interviews: 28, passRate: 69 },
      { month: "Jun", interviews: 31, passRate: 67 }
    ],
    topInterviewers: [
      { name: "Sarah Johnson", interviews: 24, passRate: 75 },
      { name: "Mike Chen", interviews: 22, passRate: 68 },
      { name: "Emily Davis", interviews: 20, passRate: 80 },
      { name: "David Wilson", interviews: 18, passRate: 72 }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hr-text-secondary">Total Interviews</p>
                <p className="text-2xl font-bold text-hr-text-primary">{analyticsData.totalInterviews}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-hr-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hr-text-secondary">Pass Rate</p>
                <p className="text-2xl font-bold text-green-500">{analyticsData.passRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hr-text-secondary">Avg Duration</p>
                <p className="text-2xl font-bold text-hr-text-primary">{analyticsData.averageDuration}m</p>
              </div>
              <Clock className="h-8 w-8 text-hr-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-hr-text-secondary">Active Candidates</p>
                <p className="text-2xl font-bold text-hr-text-primary">
                  {analyticsData.candidatesByStage.reduce((sum, stage) => sum + stage.count, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-hr-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates by Stage */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Candidates by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.candidatesByStage.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-hr-text-primary">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-hr-text-secondary">{stage.count} candidates</span>
                    <Badge variant="outline" className="text-hr-text-secondary">
                      {stage.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={stage.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Monthly Interview Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.monthlyTrend.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-hr-bg-primary">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-hr-text-primary">{month.month}</span>
                  <span className="text-sm text-hr-text-secondary">{month.interviews} interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-hr-text-secondary">Pass Rate:</span>
                  <Badge 
                    variant={month.passRate >= 70 ? "default" : "secondary"}
                    className={month.passRate >= 70 ? "bg-green-500" : ""}
                  >
                    {month.passRate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Interviewers */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Top Interviewers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topInterviewers.map((interviewer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-hr-bg-primary">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hr-accent flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-hr-text-primary">{interviewer.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-hr-text-secondary">Interviews</p>
                    <p className="text-lg font-bold text-hr-text-primary">{interviewer.interviews}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-hr-text-secondary">Pass Rate</p>
                    <p className="text-lg font-bold text-green-500">{interviewer.passRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}







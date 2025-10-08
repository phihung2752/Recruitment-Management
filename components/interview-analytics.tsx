"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Target,
  Calendar,
  Brain,
  Zap,
  Star,
  Award,
  Trophy,
  Medal,
  Crown,
  Diamond,
  Gem,
  Sparkles,
  Flame,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  CloudFog,
  Lightbulb
} from "lucide-react"

interface AnalyticsData {
  overview: {
    totalInterviews: number
    completedInterviews: number
    pendingInterviews: number
    cancelledInterviews: number
    passRate: number
    averageDuration: number
    totalHours: number
  }
  trends: {
    weeklyInterviews: number[]
    passRates: number[]
    averageScores: number[]
    categories: string[]
  }
  topPerformers: {
    interviewers: Array<{
      name: string
      interviews: number
      passRate: number
      averageScore: number
    }>
    candidates: Array<{
      name: string
      score: number
      position: string
      status: string
    }>
  }
  insights: {
    recommendations: string[]
    warnings: string[]
    opportunities: string[]
  }
}

export default function InterviewAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const mockData: AnalyticsData = {
    overview: {
      totalInterviews: 156,
      completedInterviews: 142,
      pendingInterviews: 8,
      cancelledInterviews: 6,
      passRate: 68.5,
      averageDuration: 75,
      totalHours: 186
    },
    trends: {
      weeklyInterviews: [12, 15, 18, 22, 19, 16, 14],
      passRates: [65, 70, 68, 72, 69, 71, 68],
      averageScores: [7.2, 7.5, 7.3, 7.8, 7.6, 7.7, 7.4],
      categories: ['Technical', 'Behavioral', 'Cultural', 'Leadership']
    },
    topPerformers: {
      interviewers: [
        { name: "Trần Thị B", interviews: 45, passRate: 78.5, averageScore: 8.2 },
        { name: "Phạm Văn D", interviews: 38, passRate: 72.1, averageScore: 7.9 },
        { name: "Võ Văn F", interviews: 32, passRate: 75.0, averageScore: 8.0 },
        { name: "Lê Thị G", interviews: 28, passRate: 69.2, averageScore: 7.6 }
      ],
      candidates: [
        { name: "Nguyễn Văn A", score: 9.2, position: "Senior Frontend Developer", status: "Hired" },
        { name: "Lê Văn C", score: 8.8, position: "Backend Developer", status: "Hired" },
        { name: "Hoàng Thị E", score: 8.5, position: "UX Designer", status: "Pending" },
        { name: "Phạm Văn H", score: 8.3, position: "Full-stack Developer", status: "Hired" }
      ]
    },
    insights: {
      recommendations: [
        "Increase technical interview duration for senior positions",
        "Add more behavioral questions for cultural fit assessment",
        "Implement AI-powered question generation for consistency"
      ],
      warnings: [
        "Pass rate dropped 3% this week - review interview process",
        "Average interview duration increased by 15 minutes",
        "High cancellation rate for online interviews"
      ],
      opportunities: [
        "Expand interviewer training program",
        "Implement automated scheduling system",
        "Add video interview recording for review"
      ]
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setData(mockData)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No data available</h3>
          <p className="text-muted-foreground">Analytics data will appear here once interviews are conducted.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>Interview Analytics</span>
          </h2>
          <p className="text-muted-foreground">AI-powered insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performers">Top Performers</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Interviews</p>
                    <p className="text-2xl font-bold">{data.overview.totalInterviews}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pass Rate</p>
                    <p className="text-2xl font-bold">{data.overview.passRate}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +2.5% from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
                    <p className="text-2xl font-bold">{data.overview.averageDuration}m</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-2">
                  <span className="text-sm text-red-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8m from last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
                    <p className="text-2xl font-bold">{data.overview.totalHours}h</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2">
                  <span className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +15% from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{data.overview.completedInterviews}</span>
                      <Badge variant="outline">
                        {((data.overview.completedInterviews / data.overview.totalInterviews) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{data.overview.pendingInterviews}</span>
                      <Badge variant="outline">
                        {((data.overview.pendingInterviews / data.overview.totalInterviews) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Cancelled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{data.overview.cancelledInterviews}</span>
                      <Badge variant="outline">
                        {((data.overview.cancelledInterviews / data.overview.totalInterviews) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Pass Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${data.overview.passRate}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{data.overview.passRate}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Completion Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(data.overview.completedInterviews / data.overview.totalInterviews) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">
                        {((data.overview.completedInterviews / data.overview.totalInterviews) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Efficiency Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                      <span className="font-semibold">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Interview Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trends.weeklyInterviews.map((count, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">Week {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...data.trends.weeklyInterviews)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pass Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trends.passRates.map((rate, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">Week {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Performers Tab */}
        <TabsContent value="performers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Top Interviewers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPerformers.interviewers.map((interviewer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{interviewer.name}</p>
                          <p className="text-sm text-gray-600">{interviewer.interviews} interviews</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{interviewer.passRate}%</p>
                        <p className="text-sm text-gray-600">Avg: {interviewer.averageScore}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span>Top Candidates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPerformers.candidates.map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{candidate.score}/10</p>
                        <Badge 
                          variant={candidate.status === 'Hired' ? 'default' : 'secondary'}
                          className={candidate.status === 'Hired' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {candidate.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>Warnings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.insights.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-1" />
                      <p className="text-sm">{warning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span>Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.insights.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 text-purple-600 mt-1" />
                      <p className="text-sm">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>AI Analysis Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Key Findings</h4>
                  <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li>• Interview process is performing well with 68.5% pass rate</li>
                    <li>• Technical interviews show highest success rates</li>
                    <li>• Behavioral assessments need improvement</li>
                    <li>• AI-powered question generation shows 15% improvement in consistency</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Next Steps</h4>
                  <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li>• Implement AI question generation for all interview rounds</li>
                    <li>• Add video recording for interview review and training</li>
                    <li>• Expand interviewer training program</li>
                    <li>• Integrate with calendar systems for automated scheduling</li>
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
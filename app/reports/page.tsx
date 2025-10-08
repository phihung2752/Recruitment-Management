"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, Clock, DollarSign, Download, Users, Briefcase, Calendar, Target } from 'lucide-react'

export default function ReportsPage() {
  const { user, isAuthenticated } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  const [activeTab, setActiveTab] = useState('overview')

  if (!isAuthenticated) {
    return <div>Please log in to view reports.</div>
  }

  return (
    <ProtectedRoute requiredPermissions={['report.read']}>
      <div className="p-6 space-y-6 bg-hr-bg-primary text-hr-text-primary min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-hr-text-primary">Reports & Analytics</h1>
            <p className="text-hr-text-secondary">View detailed reports and analytics for your HR operations</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] bg-hr-bg-secondary border-hr-border">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-hr-border text-hr-text-primary">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-hr-bg-secondary border-hr-border">
            <TabsTrigger value="overview" className="text-hr-text-primary">Overview</TabsTrigger>
            <TabsTrigger value="recruitment" className="text-hr-text-primary">Recruitment</TabsTrigger>
            <TabsTrigger value="interviews" className="text-hr-text-primary">Interviews</TabsTrigger>
            <TabsTrigger value="performance" className="text-hr-text-primary">Performance</TabsTrigger>
            <TabsTrigger value="analytics" className="text-hr-text-primary">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-hr-text-secondary">Total Applications</p>
                      <p className="text-xl font-bold text-hr-text-primary">1,234</p>
                      <p className="text-xs text-green-600">+12% vs last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-hr-text-secondary">Hire Rate</p>
                      <p className="text-xl font-bold text-hr-text-primary">15.2%</p>
                      <p className="text-xs text-green-600">+2.1% vs last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-hr-text-secondary">Avg. Time to Hire</p>
                      <p className="text-xl font-bold text-hr-text-primary">28 days</p>
                      <p className="text-xs text-red-600">+3 days vs last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-hr-text-secondary">Cost per Hire</p>
                      <p className="text-xl font-bold text-hr-text-primary">$3,250</p>
                      <p className="text-xs text-green-600">-$150 vs last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardHeader>
                  <CardTitle className="text-hr-text-primary">Applications Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-hr-text-secondary">
                    Chart placeholder - Applications over time
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-hr-bg-secondary border-hr-border">
                <CardHeader>
                  <CardTitle className="text-hr-text-primary">Hire Rate by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-hr-text-secondary">
                    Chart placeholder - Hire rate by department
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recruitment Tab */}
          <TabsContent value="recruitment" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Recruitment Metrics</CardTitle>
                <CardDescription className="text-hr-text-secondary">Key recruitment performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-hr-border rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-hr-text-primary">1,234</p>
                    <p className="text-sm text-hr-text-secondary">Total Applications</p>
                  </div>
                  <div className="text-center p-4 border border-hr-border rounded-lg">
                    <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-hr-text-primary">45</p>
                    <p className="text-sm text-hr-text-secondary">Open Positions</p>
                  </div>
                  <div className="text-center p-4 border border-hr-border rounded-lg">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-hr-text-primary">15.2%</p>
                    <p className="text-sm text-hr-text-secondary">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Interview Analytics</CardTitle>
                <CardDescription className="text-hr-text-secondary">Interview performance and outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-hr-border rounded-lg">
                    <div>
                      <p className="font-medium text-hr-text-primary">Total Interviews</p>
                      <p className="text-sm text-hr-text-secondary">This month</p>
                    </div>
                    <p className="text-2xl font-bold text-hr-text-primary">156</p>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-hr-border rounded-lg">
                    <div>
                      <p className="font-medium text-hr-text-primary">Pass Rate</p>
                      <p className="text-sm text-hr-text-secondary">Candidates who passed</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">68%</p>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-hr-border rounded-lg">
                    <div>
                      <p className="font-medium text-hr-text-primary">Avg. Interview Score</p>
                      <p className="text-sm text-hr-text-secondary">Out of 10</p>
                    </div>
                    <p className="text-2xl font-bold text-hr-text-primary">7.2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Performance Metrics</CardTitle>
                <CardDescription className="text-hr-text-secondary">Employee and team performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-hr-border rounded-lg">
                    <div>
                      <p className="font-medium text-hr-text-primary">Employee Satisfaction</p>
                      <p className="text-sm text-hr-text-secondary">Based on surveys</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">4.2/5</p>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-hr-border rounded-lg">
                    <div>
                      <p className="font-medium text-hr-text-primary">Retention Rate</p>
                      <p className="text-sm text-hr-text-secondary">Last 12 months</p>
                    </div>
                    <p className="text-2xl font-bold text-hr-text-primary">92%</p>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-hr-border rounded-lg">
                    <div>
                      <p className="font-medium text-hr-text-primary">Training Completion</p>
                      <p className="text-sm text-hr-text-secondary">Required courses</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-hr-bg-secondary border-hr-border">
              <CardHeader>
                <CardTitle className="text-hr-text-primary">Advanced Analytics</CardTitle>
                <CardDescription className="text-hr-text-secondary">Deep insights and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-hr-border rounded-lg">
                    <h3 className="font-medium text-hr-text-primary mb-2">AI Insights</h3>
                    <p className="text-sm text-hr-text-secondary">
                      Based on current trends, we predict a 15% increase in applications next month.
                    </p>
                  </div>
                  <div className="p-4 border border-hr-border rounded-lg">
                    <h3 className="font-medium text-hr-text-primary mb-2">Recommendations</h3>
                    <p className="text-sm text-hr-text-secondary">
                      Consider expanding your talent pool by targeting specific skill sets in high demand.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detailed Reports */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Detailed Reports</CardTitle>
            <CardDescription className="text-hr-text-secondary">Export detailed reports for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-hr-border rounded-lg">
                <div>
                  <h3 className="font-medium text-hr-text-primary">Recruitment Report</h3>
                  <p className="text-sm text-hr-text-secondary">Comprehensive recruitment analytics</p>
                </div>
                <Button variant="outline" size="sm" className="border-hr-border text-hr-text-primary">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-hr-border rounded-lg">
                <div>
                  <h3 className="font-medium text-hr-text-primary">Interview Report</h3>
                  <p className="text-sm text-hr-text-secondary">Interview performance and outcomes</p>
                </div>
                <Button variant="outline" size="sm" className="border-hr-border text-hr-text-primary">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-hr-border rounded-lg">
                <div>
                  <h3 className="font-medium text-hr-text-primary">Employee Report</h3>
                  <p className="text-sm text-hr-text-secondary">Employee statistics and trends</p>
                </div>
                <Button variant="outline" size="sm" className="border-hr-border text-hr-text-primary">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
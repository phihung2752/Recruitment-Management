"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Users, Calendar, Briefcase, Clock, RefreshCcw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { dashboardService } from "@/lib/api-services/dashboard-service"

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function EnhancedDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendance: 0,
    totalVacations: 0,
    interviewsScheduled: 0,
    hiredCandidates: 0,
    activeJobs: 0,
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [todaysMeetings, setTodaysMeetings] = useState([])
  const [todaysRequests, setTodaysRequests] = useState([])
  const [jobStatusData, setJobStatusData] = useState([])
  const [departmentHiring, setDepartmentHiring] = useState([])

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [statsData, attendanceData, meetingsData, requestsData, jobStatusData, departmentHiringData] =
        await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAttendanceData(),
          dashboardService.getTodaysMeetings(),
          dashboardService.getTodaysRequests(),
          dashboardService.getJobStatusDistribution(),
          dashboardService.getDepartmentHiringProgress(),
        ])

      // Update state with fetched data
      setStats(statsData)
      setAttendanceData(attendanceData)
      setTodaysMeetings(meetingsData)
      setTodaysRequests(requestsData)
      setJobStatusData(jobStatusData)
      setDepartmentHiring(departmentHiringData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh dashboard data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
    toast({
      title: "Dashboard Refreshed",
      description: "Dashboard data has been updated.",
    })
  }

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Render trend indicator based on value
  const renderTrend = (value) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing || loading}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Employees */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Total Employees</div>
                  <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interviews Scheduled */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Interviews Scheduled</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.interviewsScheduled}</span>
                    {renderTrend(5)} {/* Example trend value */}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hired Candidates */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Hired Candidates</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{stats.hiredCandidates}</span>
                    {renderTrend(2)} {/* Example trend value */}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Attendance Summary</h3>
              <select className="rounded-md border p-1 text-sm">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#8884d8" name="Present" />
                    <Line type="monotone" dataKey="permission" stroke="#82ca9d" name="Permission" />
                    <Line type="monotone" dataKey="vacation" stroke="#ffc658" name="Vacation" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Today's Interviews */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Today&apos;s Interviews</h3>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : todaysMeetings.length > 0 ? (
                <div className="space-y-4">
                  {todaysMeetings.map((meeting, index) => (
                    <div key={meeting.id || index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{meeting.name}</div>
                        <div className="text-sm text-gray-500">{meeting.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{meeting.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No interviews scheduled for today</div>
              )}
            </CardContent>
          </Card>

          {/* Today's Requests */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Today&apos;s Requests</h3>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : todaysRequests.length > 0 ? (
                <div className="space-y-4">
                  {todaysRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.jobTitle}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="rounded-md bg-green-50 px-3 py-1 text-sm text-green-600">Accept</button>
                        <button className="rounded-md bg-red-50 px-3 py-1 text-sm text-red-600">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No pending requests for today</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Status and Department Hiring */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Status Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-medium">Job Status Distribution</h3>
            {loading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobStatusData}>
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Hiring Progress */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-medium">Department Hiring Progress</h3>
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                {departmentHiring.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{dept.department}</span>
                      <span className="text-sm text-gray-500">
                        {dept.filled}/{dept.total} positions filled
                      </span>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Process Funnel */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Recruitment Process Funnel</h3>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Applied", value: 120 },
                      { name: "Screening", value: 80 },
                      { name: "Interview", value: 40 },
                      { name: "Offer", value: 20 },
                      { name: "Hired", value: 15 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

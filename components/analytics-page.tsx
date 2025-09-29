"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Download, Users, Briefcase, Clock, DollarSign } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { addDays } from "date-fns"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [selectedDepartment, setSelectedDepartment] = useState("All")

  // Mock data for analytics
  const employeeGrowthData = [
    { month: "Jan", employees: 120, hires: 8, terminations: 2 },
    { month: "Feb", employees: 126, hires: 10, terminations: 4 },
    { month: "Mar", employees: 132, hires: 12, terminations: 6 },
    { month: "Apr", employees: 138, hires: 9, terminations: 3 },
    { month: "May", employees: 144, hires: 11, terminations: 5 },
    { month: "Jun", employees: 150, hires: 8, terminations: 2 },
  ]

  const departmentData = [
    { name: "Engineering", employees: 45, budget: 2250000 },
    { name: "Marketing", employees: 25, budget: 1250000 },
    { name: "Sales", employees: 30, budget: 1500000 },
    { name: "HR", employees: 15, budget: 750000 },
    { name: "Finance", employees: 20, budget: 1000000 },
    { name: "Operations", employees: 15, budget: 750000 },
  ]

  const performanceData = [
    { department: "Engineering", avgRating: 4.2, satisfaction: 85 },
    { department: "Marketing", avgRating: 4.0, satisfaction: 82 },
    { department: "Sales", avgRating: 4.5, satisfaction: 88 },
    { department: "HR", avgRating: 4.1, satisfaction: 80 },
    { department: "Finance", avgRating: 4.3, satisfaction: 86 },
    { department: "Operations", avgRating: 3.9, satisfaction: 78 },
  ]

  const attendanceData = [
    { month: "Jan", attendance: 95, remote: 30, office: 65 },
    { month: "Feb", attendance: 93, remote: 35, office: 58 },
    { month: "Mar", attendance: 96, remote: 40, office: 56 },
    { month: "Apr", attendance: 94, remote: 38, office: 56 },
    { month: "May", attendance: 97, remote: 42, office: 55 },
    { month: "Jun", attendance: 95, remote: 45, office: 50 },
  ]

  const recruitmentData = [
    { month: "Jan", applications: 150, interviews: 45, hires: 8 },
    { month: "Feb", applications: 180, interviews: 54, hires: 10 },
    { month: "Mar", applications: 200, interviews: 60, hires: 12 },
    { month: "Apr", applications: 165, interviews: 50, hires: 9 },
    { month: "May", applications: 190, interviews: 57, hires: 11 },
    { month: "Jun", applications: 175, interviews: 48, hires: 8 },
  ]

  const salaryDistribution = [
    { range: "40k-60k", count: 25 },
    { range: "60k-80k", count: 35 },
    { range: "80k-100k", count: 40 },
    { range: "100k-120k", count: 30 },
    { range: "120k+", count: 20 },
  ]

  const handleExportReport = () => {
    // Implementation for exporting analytics report
    console.log("Exporting analytics report...")
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">{t("Analytics & Reports")}</h1>
        <div className="flex space-x-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("All Departments")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t("All Departments")}</SelectItem>
              <SelectItem value="Engineering">{t("Engineering")}</SelectItem>
              <SelectItem value="Marketing">{t("Marketing")}</SelectItem>
              <SelectItem value="Sales">{t("Sales")}</SelectItem>
              <SelectItem value="HR">{t("HR")}</SelectItem>
              <SelectItem value="Finance">{t("Finance")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            {t("Export Report")}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("Total Employees")}</p>
                <p className="text-2xl font-bold">150</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("Open Positions")}</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-blue-600">3 new this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("Avg Attendance")}</p>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-green-600">+2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t("Avg Salary")}</p>
                <p className="text-2xl font-bold">$85k</p>
                <p className="text-xs text-blue-600">Market competitive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="employees">{t("Employees")}</TabsTrigger>
          <TabsTrigger value="recruitment">{t("Recruitment")}</TabsTrigger>
          <TabsTrigger value="performance">{t("Performance")}</TabsTrigger>
          <TabsTrigger value="attendance">{t("Attendance")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Employee Growth Trend")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={employeeGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="employees" stroke="#8884d8" name={t("Total Employees")} />
                    <Line type="monotone" dataKey="hires" stroke="#82ca9d" name={t("New Hires")} />
                    <Line type="monotone" dataKey="terminations" stroke="#ffc658" name={t("Terminations")} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Department Distribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="employees"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Salary Distribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salaryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Department Budget vs Headcount")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="employees" fill="#8884d8" name={t("Employees")} />
                    <Bar yAxisId="right" dataKey="budget" fill="#82ca9d" name={t("Budget ($)")} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Recruitment Funnel")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={recruitmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name={t("Applications")}
                  />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name={t("Interviews")}
                  />
                  <Area type="monotone" dataKey="hires" stackId="1" stroke="#ffc658" fill="#ffc658" name={t("Hires")} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Performance & Satisfaction by Department")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgRating" fill="#8884d8" name={t("Avg Rating")} />
                  <Bar yAxisId="right" dataKey="satisfaction" fill="#82ca9d" name={t("Satisfaction %")} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Attendance Trends")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="attendance" stroke="#8884d8" name={t("Overall Attendance %")} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Work Location Distribution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="remote"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name={t("Remote %")}
                    />
                    <Area
                      type="monotone"
                      dataKey="office"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name={t("Office %")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

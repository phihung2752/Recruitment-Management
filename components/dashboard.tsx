"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InteractiveAttendanceChart } from "@/components/interactive-attendance-chart"
import { RecruitmentDashboard } from "@/components/recruitment-dashboard"
import { NotificationBadge } from "@/components/notification-badge"
import { useTheme } from "@/contexts/theme-context"
import { Search, Plus, X, Bell, Sun, Moon, Download } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { DynamicReports } from "@/components/dynamic-reports"
import { CollaborationHub } from "@/components/collaboration-hub"
import { AICandidateMatcher } from "@/components/ai-candidate-matcher"
import { EmployeePerformanceTracker } from "@/components/employee-performance-tracker"
import { EmployeeTrainingTracker } from "@/components/employee-training-tracker"
import { LeaveManagementSystem } from "@/components/leave-management-system"
import { EmployeeOnboardingWorkflow } from "@/components/employee-onboarding-workflow"
import { HelpDocumentation } from "@/components/help-documentation"

interface Widget {
  id: string
  name: string
  component: React.ReactNode
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success"
  date: Date
}

export function Dashboard() {
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([
    { id: "attendance", name: "Attendance Chart", component: <InteractiveAttendanceChart /> },
    { id: "recruitment", name: "Recruitment KPIs", component: <RecruitmentDashboard /> },
    { id: "notifications", name: "Recent Notifications", component: <RecentNotifications /> },
    { id: "reports", name: "Dynamic Reports", component: <DynamicReports /> },
    { id: "collaboration", name: "Collaboration Hub", component: <CollaborationHub /> },
    { id: "ai-matcher", name: "AI Candidate Matcher", component: <AICandidateMatcher /> },
    { id: "performance", name: "Employee Performance", component: <EmployeePerformanceTracker /> },
    { id: "training", name: "Employee Training", component: <EmployeeTrainingTracker /> },
    { id: "leave", name: "Leave Management", component: <LeaveManagementSystem /> },
    { id: "onboarding", name: "Employee Onboarding", component: <EmployeeOnboardingWorkflow /> },
    { id: "help", name: "Help & Documentation", component: <HelpDocumentation /> },
  ])

  const [activeWidgets, setActiveWidgets] = useState<string[]>(["attendance", "recruitment", "reports", "ai-matcher", "performance", "training", "leave", "onboarding", "help"])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const { theme, toggleTheme } = useTheme()

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Interview Scheduled",
      message: "You have an interview scheduled with John Doe for the Senior Developer position at 2 PM today.",
      type: "info",
      date: new Date(),
    },
    {
      id: "2",
      title: "New Application",
      message: "A new application has been received for the UX Designer position.",
      type: "success",
      date: new Date(),
    },
    {
      id: "3",
      title: "Urgent: Review Required",
      message: "The hiring manager has requested an urgent review of the shortlisted candidates for the Marketing Manager role.",
      type: "warning",
      date: new Date(),
    },
  ])

  const addWidget = (widgetId: string) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId])
    }
  }

  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId))
  }

  const filteredWidgets = availableWidgets.filter(widget =>
    widget.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <NotificationBadge />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
            className="ml-4"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Switch>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/3 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <DatePickerWithRange
          date={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onDateChange={(newDateRange) => setDateRange(newDateRange)}
        />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeWidgets.map(widgetId => {
          const widget = availableWidgets.find(w => w.id === widgetId)
          if (!widget) return null
          return (
            <Card key={widget.id} className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeWidget(widget.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>{widget.component}</CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Widgets</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {filteredWidgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between">
                  <span>{widget.name}</span>
                  <Button
                    onClick={() => addWidget(widget.id)}
                    disabled={activeWidgets.includes(widget.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function RecentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Interview Scheduled",
      message: "You have an interview scheduled with John Doe for the Senior Developer position at 2 PM today.",
      type: "info",
      date: new Date(),
    },
    {
      id: "2",
      title: "New Application",
      message: "A new application has been received for the UX Designer position.",
      type: "success",
      date: new Date(),
    },
    {
      id: "3",
      title: "Urgent: Review Required",
      message: "The hiring manager has requested an urgent review of the shortlisted candidates for the Marketing Manager role.",
      type: "warning",
      date: new Date(),
    },
  ])

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className={`rounded-full p-2 ${
              notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
              notification.type === 'success' ? 'bg-green-100 text-green-600' :
              'bg-yellow-100 text-yellow-600'
            }`}>
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.date.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

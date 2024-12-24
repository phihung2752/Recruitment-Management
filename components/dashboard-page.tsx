"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

const attendanceData = [
  { month: "Jan", attendance: 25, permission: 15, vacation: 5 },
  { month: "Feb", attendance: 30, permission: 10, vacation: 3 },
  { month: "Mar", attendance: 28, permission: 12, vacation: 4 },
  { month: "Apr", attendance: 32, permission: 8, vacation: 2 },
  { month: "May", attendance: 35, permission: 14, vacation: 6 },
  { month: "Jun", attendance: 30, permission: 10, vacation: 3 },
]

const todaysMeetings = [
  { name: "Mariam Osama", date: "12/12/2022", duration: "2 Hours" },
  { name: "Ahmed Hassan", date: "12/12/2022", duration: "1 Hour" },
  { name: "Sara Ali", date: "12/12/2022", duration: "30 Minutes" },
]

const todaysRequests = [
  { id: "01", name: "Mariam Osama", jobTitle: "UI/UX Designer", details: "Holiday" },
  { id: "02", name: "Ahmed Hassan", jobTitle: "Software Engineer", details: "Leave Early" },
  { id: "03", name: "Sara Ali", jobTitle: "Product Manager", details: "Work from Home" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total Employees</div>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total Attendance</div>
            <div className="text-2xl font-bold">30</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-500">Total Vacations</div>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Attendance Summary</h3>
              <select className="rounded-md border p-1 text-sm">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
                  <Line type="monotone" dataKey="permission" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="vacation" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Today&apos;s Meetings</h3>
              <div className="space-y-4">
                {todaysMeetings.map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{meeting.name}</div>
                      <div className="text-sm text-gray-500">{meeting.date}</div>
                    </div>
                    <div className="text-sm text-gray-500">{meeting.duration}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Today&apos;s Requests</h3>
              <div className="space-y-4">
                {todaysRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-gray-500">{request.jobTitle}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-md bg-green-50 px-3 py-1 text-sm text-green-600">
                        Accept
                      </button>
                      <button className="rounded-md bg-red-50 px-3 py-1 text-sm text-red-600">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


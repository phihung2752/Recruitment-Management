"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  round: string
  passRate: number
  avgDuration: number
}

const mockData: AnalyticsData[] = [
  { round: "Initial Screening", passRate: 75, avgDuration: 30 },
  { round: "Technical Interview", passRate: 60, avgDuration: 60 },
  { round: "HR Interview", passRate: 80, avgDuration: 45 },
  { round: "Final Interview", passRate: 90, avgDuration: 50 },
]

export function InterviewAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Pass Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <XAxis dataKey="round" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="passRate" fill="#8884d8" name="Pass Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Interview Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <XAxis dataKey="round" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDuration" fill="#82ca9d" name="Avg. Duration (min)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


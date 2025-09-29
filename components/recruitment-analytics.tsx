"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CV } from "@/types/cv-management"
import { useState } from "react"

interface RecruitmentAnalyticsProps {
  cvs: CV[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function RecruitmentAnalytics({ cvs }: RecruitmentAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("month")

  // Calculate statistics
  const sourceData = cvs.reduce((acc, cv) => {
    acc[cv.source] = (acc[cv.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusData = cvs.reduce((acc, cv) => {
    acc[cv.status] = (acc[cv.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(sourceData).map(([name, value]) => ({
    name,
    value
  }))

  const barData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Application Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

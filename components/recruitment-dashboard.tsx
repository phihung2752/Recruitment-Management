"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', applicants: 400, interviews: 240, offers: 100 },
  { name: 'Feb', applicants: 300, interviews: 180, offers: 80 },
  { name: 'Mar', applicants: 500, interviews: 300, offers: 150 },
  { name: 'Apr', applicants: 280, interviews: 170, offers: 70 },
  { name: 'May', applicants: 390, interviews: 230, offers: 110 },
  { name: 'Jun', applicants: 490, interviews: 290, offers: 130 },
]

export function RecruitmentDashboard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recruitment KPIs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applicants" stroke="#8884d8" />
              <Line type="monotone" dataKey="interviews" stroke="#82ca9d" />
              <Line type="monotone" dataKey="offers" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


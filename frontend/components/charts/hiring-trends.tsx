"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const data = [
  { month: "Jan", applications: 120, hired: 8, interviews: 45 },
  { month: "Feb", applications: 150, hired: 12, interviews: 60 },
  { month: "Mar", applications: 180, hired: 15, interviews: 72 },
  { month: "Apr", applications: 200, hired: 18, interviews: 85 },
  { month: "May", applications: 165, hired: 14, interviews: 68 },
  { month: "Jun", applications: 190, hired: 16, interviews: 78 },
  { month: "Jul", applications: 220, hired: 20, interviews: 95 },
  { month: "Aug", applications: 185, hired: 17, interviews: 82 },
  { month: "Sep", applications: 210, hired: 19, interviews: 88 },
  { month: "Oct", applications: 175, hired: 15, interviews: 75 },
  { month: "Nov", applications: 195, hired: 18, interviews: 85 },
  { month: "Dec", applications: 160, hired: 13, interviews: 70 },
]

export default function HiringTrends() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Trends (2024)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Applications" />
          <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} name="Interviews" />
          <Line type="monotone" dataKey="hired" stroke="#EF4444" strokeWidth={2} name="Hired" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

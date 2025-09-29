import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { department: 'HR', averageSalary: 75000 },
  { department: 'Engineering', averageSalary: 110000 },
  { department: 'Marketing', averageSalary: 85000 },
  { department: 'Sales', averageSalary: 95000 },
  { department: 'Finance', averageSalary: 100000 },
]

export function PayrollOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageSalary" fill="#8884d8" name="Average Salary ($)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

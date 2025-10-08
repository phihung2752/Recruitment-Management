import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { addDays, format } from "date-fns"

interface RecruitmentReportProps {
  jobPostings: any[] // Replace with your actual JobPosting type
}

export function RecruitmentReport({ jobPostings }: RecruitmentReportProps) {
  const [reportType, setReportType] = useState<"applications" | "hires">("applications")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // In a real application, this data would be generated based on the actual job postings
  const mockReportData = [
    { date: "2024-01-01", applications: 10, hires: 2 },
    { date: "2024-01-08", applications: 15, hires: 3 },
    { date: "2024-01-15", applications: 20, hires: 4 },
    { date: "2024-01-22", applications: 18, hires: 3 },
    { date: "2024-01-29", applications: 25, hires: 5 },
  ]

  const handleGenerateReport = () => {
    // In a real application, this would generate the report based on the selected options
    console.log("Generating report:", { reportType, dateRange })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recruitment Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Select value={reportType} onValueChange={(value: "applications" | "hires") => setReportType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applications">Applications</SelectItem>
              <SelectItem value="hires">Hires</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange
            date={dateRange as { from: Date; to: Date } || { from: new Date(), to: new Date() }}
            onDateChange={setDateRange}
          />
          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockReportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={reportType} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

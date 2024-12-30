"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useLanguage } from "@/contexts/language-context"

const attendanceData = [
  { month: "Jan", attendance: 25, permission: 15, vacation: 5 },
  { month: "Feb", attendance: 30, permission: 10, vacation: 3 },
  { month: "Mar", attendance: 28, permission: 12, vacation: 4 },
  { month: "Apr", attendance: 32, permission: 8, vacation: 2 },
  { month: "May", attendance: 35, permission: 14, vacation: 6 },
  { month: "Jun", attendance: 30, permission: 10, vacation: 3 },
]

export function InteractiveAttendanceChart() {
  const [activeLines, setActiveLines] = useState({
    attendance: true,
    permission: true,
    vacation: true,
  })
  const { t } = useLanguage()

  const toggleLine = (line: keyof typeof activeLines) => {
    setActiveLines(prev => ({ ...prev, [line]: !prev[line] }))
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">{t('Attendance Summary')}</h3>
          <select className="rounded-md border p-1 text-sm">
            <option>{t('Monthly')}</option>
            <option>{t('Weekly')}</option>
          </select>
        </div>
        <div className="space-x-2 mb-4">
          <Button
            size="sm"
            variant={activeLines.attendance ? "default" : "outline"}
            onClick={() => toggleLine("attendance")}
          >
            {t('Attendance')}
          </Button>
          <Button
            size="sm"
            variant={activeLines.permission ? "default" : "outline"}
            onClick={() => toggleLine("permission")}
          >
            {t('Permission')}
          </Button>
          <Button
            size="sm"
            variant={activeLines.vacation ? "default" : "outline"}
            onClick={() => toggleLine("vacation")}
          >
            {t('Vacation')}
          </Button>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {activeLines.attendance && (
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" name={t('Attendance')} />
              )}
              {activeLines.permission && (
                <Line type="monotone" dataKey="permission" stroke="#82ca9d" name={t('Permission')} />
              )}
              {activeLines.vacation && (
                <Line type="monotone" dataKey="vacation" stroke="#ffc658" name={t('Vacation')} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


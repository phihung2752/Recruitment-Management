"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InteractiveAttendanceChart() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Attendance Overview</h3>
        <p className="text-sm text-muted-foreground">This week's attendance</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Present</span>
          <span className="font-medium">85%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Late</span>
          <span className="font-medium">10%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Absent</span>
          <span className="font-medium">5%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
        </div>
      </div>
    </div>
  )
}
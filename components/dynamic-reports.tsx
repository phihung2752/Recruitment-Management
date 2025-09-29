"use client"

export function DynamicReports() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Reports</h3>
        <p className="text-sm text-muted-foreground">Generate custom reports</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 border rounded text-sm">📊 Employee Performance</div>
        <div className="p-2 border rounded text-sm">📈 Recruitment Analytics</div>
        <div className="p-2 border rounded text-sm">⏰ Attendance Summary</div>
        <div className="p-2 border rounded text-sm">💰 Payroll Report</div>
      </div>
      
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm">
        Generate Report
      </button>
    </div>
  )
}
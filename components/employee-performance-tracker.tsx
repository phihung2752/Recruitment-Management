"use client"

export function EmployeePerformanceTracker() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Performance Tracker</h3>
        <p className="text-sm text-muted-foreground">Employee ratings</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Excellent</span>
          <span className="font-medium">65%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Good</span>
          <span className="font-medium">25%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Needs Improvement</span>
          <span className="font-medium">10%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
        </div>
      </div>
    </div>
  )
}
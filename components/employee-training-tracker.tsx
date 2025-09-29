"use client"

export function EmployeeTrainingTracker() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Training Progress</h3>
        <p className="text-sm text-muted-foreground">Current courses</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 border rounded text-sm">
          <div className="font-medium">React Advanced</div>
          <div className="text-muted-foreground">Progress: 80%</div>
        </div>
        <div className="p-2 border rounded text-sm">
          <div className="font-medium">Leadership Skills</div>
          <div className="text-muted-foreground">Progress: 60%</div>
        </div>
        <div className="p-2 border rounded text-sm">
          <div className="font-medium">Project Management</div>
          <div className="text-muted-foreground">Progress: 45%</div>
        </div>
      </div>
    </div>
  )
}
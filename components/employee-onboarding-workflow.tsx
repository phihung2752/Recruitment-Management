"use client"

export function EmployeeOnboardingWorkflow() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Onboarding</h3>
        <p className="text-sm text-muted-foreground">New employees</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 border rounded text-sm">
          <div className="font-medium">John Doe</div>
          <div className="text-muted-foreground">Day 3 of 7</div>
        </div>
        <div className="p-2 border rounded text-sm">
          <div className="font-medium">Sarah Wilson</div>
          <div className="text-muted-foreground">Day 1 of 7</div>
        </div>
        <div className="p-2 border rounded text-sm">
          <div className="font-medium">Mike Chen</div>
          <div className="text-muted-foreground">Completed ✅</div>
        </div>
      </div>
    </div>
  )
}
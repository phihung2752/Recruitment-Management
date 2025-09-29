"use client"

export function LeaveManagementSystem() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Leave Management</h3>
        <p className="text-sm text-muted-foreground">Current requests</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <div className="font-medium">Pending: 3 requests</div>
          <div className="text-muted-foreground">Need approval</div>
        </div>
        <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
          <div className="font-medium">Approved: 5 requests</div>
          <div className="text-muted-foreground">This month</div>
        </div>
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          <div className="font-medium">Available: 15 days</div>
          <div className="text-muted-foreground">Annual leave</div>
        </div>
      </div>
    </div>
  )
}
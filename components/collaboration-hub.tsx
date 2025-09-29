"use client"

export function CollaborationHub() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Team Collaboration</h3>
        <p className="text-sm text-muted-foreground">Recent activities</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 bg-blue-50 rounded text-sm">
          💬 New message from John
        </div>
        <div className="p-2 bg-green-50 rounded text-sm">
          ✅ Task completed by Sarah
        </div>
        <div className="p-2 bg-yellow-50 rounded text-sm">
          📅 Meeting scheduled
        </div>
      </div>
    </div>
  )
}
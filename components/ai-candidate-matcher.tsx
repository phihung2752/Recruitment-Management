"use client"

export function AICandidateMatcher() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">AI Candidate Matcher</h3>
        <p className="text-sm text-muted-foreground">Smart matching system</p>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm">
          <div className="font-medium">Match Score: 95%</div>
          <div className="text-muted-foreground">John Doe - Frontend Dev</div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Match Score: 87%</div>
          <div className="text-muted-foreground">Jane Smith - UX Designer</div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Match Score: 82%</div>
          <div className="text-muted-foreground">Mike Johnson - Backend Dev</div>
        </div>
      </div>
    </div>
  )
}
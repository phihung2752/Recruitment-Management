"use client"

export function RecruitmentDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">24</div>
          <div className="text-sm text-muted-foreground">Active Jobs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">156</div>
          <div className="text-sm text-muted-foreground">Applications</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">12</div>
          <div className="text-sm text-muted-foreground">Interviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">8</div>
          <div className="text-sm text-muted-foreground">Hired</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Top Performing Jobs</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Frontend Developer</span>
            <span>45 apps</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Backend Developer</span>
            <span>32 apps</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>UX Designer</span>
            <span>28 apps</span>
          </div>
        </div>
      </div>
    </div>
  )
}
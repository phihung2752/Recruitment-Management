"use client"

export function HelpDocumentation() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Help & Docs</h3>
        <p className="text-sm text-muted-foreground">Quick access</p>
      </div>
      
      <div className="space-y-2">
        <div className="p-2 border rounded text-sm cursor-pointer hover:bg-gray-50">
          📖 User Manual
        </div>
        <div className="p-2 border rounded text-sm cursor-pointer hover:bg-gray-50">
          🎥 Video Tutorials
        </div>
        <div className="p-2 border rounded text-sm cursor-pointer hover:bg-gray-50">
          ❓ FAQ
        </div>
        <div className="p-2 border rounded text-sm cursor-pointer hover:bg-gray-50">
          💬 Contact Support
        </div>
      </div>
    </div>
  )
}
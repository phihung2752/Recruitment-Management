"use client"

import { useState, useEffect } from "react"

interface Activity {
  id: number
  type: "interview" | "application" | "hire" | "email"
  message: string
  timestamp: string
  user: string
  priority: "high" | "medium" | "low"
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Mock real-time activities
    const mockActivities: Activity[] = [
      {
        id: 1,
        type: "application",
        message: "New application received for Senior Developer position",
        timestamp: "2 minutes ago",
        user: "John Doe",
        priority: "high",
      },
      {
        id: 2,
        type: "interview",
        message: "Interview scheduled with Sarah Johnson for tomorrow 2 PM",
        timestamp: "15 minutes ago",
        user: "Mike Chen",
        priority: "medium",
      },
      {
        id: 3,
        type: "hire",
        message: "Alex Rodriguez has been hired as Full Stack Developer",
        timestamp: "1 hour ago",
        user: "Emily Davis",
        priority: "high",
      },
      {
        id: 4,
        type: "email",
        message: "Rejection email sent to 5 candidates",
        timestamp: "2 hours ago",
        user: "Lisa Brown",
        priority: "low",
      },
      {
        id: 5,
        type: "interview",
        message: "Technical interview completed for Jane Smith",
        timestamp: "3 hours ago",
        user: "Tom Anderson",
        priority: "medium",
      },
    ]

    setActivities(mockActivities)
  }, [])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "application":
        return "📄"
      case "interview":
        return "🎤"
      case "hire":
        return "✅"
      case "email":
        return "✉️"
      default:
        return "📋"
    }
  }

  const getPriorityColor = (priority: Activity["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className={`p-3 border-l-4 rounded-r-lg ${getPriorityColor(activity.priority)}`}>
            <div className="flex items-start space-x-3">
              <div className="text-xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

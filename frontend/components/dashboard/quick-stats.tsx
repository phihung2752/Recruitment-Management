"use client"

import { useState, useEffect } from "react"

interface Stat {
  title: string
  value: number
  change: number
  changeType: "increase" | "decrease"
  icon: string
  color: string
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    // Mock real-time stats
    const mockStats: Stat[] = [
      {
        title: "Total Applications",
        value: 1247,
        change: 12.5,
        changeType: "increase",
        icon: "📄",
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Active Interviews",
        value: 23,
        change: 8.2,
        changeType: "increase",
        icon: "🎤",
        color: "from-green-500 to-green-600",
      },
      {
        title: "Pending Reviews",
        value: 45,
        change: 3.1,
        changeType: "decrease",
        icon: "⏳",
        color: "from-yellow-500 to-yellow-600",
      },
      {
        title: "Hired This Month",
        value: 18,
        change: 15.7,
        changeType: "increase",
        icon: "✅",
        color: "from-purple-500 to-purple-600",
      },
      {
        title: "Open Positions",
        value: 12,
        change: 5.3,
        changeType: "increase",
        icon: "🎯",
        color: "from-indigo-500 to-indigo-600",
      },
      {
        title: "Response Rate",
        value: 78,
        change: 2.4,
        changeType: "increase",
        icon: "📈",
        color: "from-pink-500 to-pink-600",
      },
    ]

    setStats(mockStats)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${stat.color} text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold mt-1">
                {stat.title.includes("Rate") ? `${stat.value}%` : stat.value.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    stat.changeType === "increase" ? "bg-white/20 text-white" : "bg-white/20 text-white"
                  }`}
                >
                  {stat.changeType === "increase" ? "↗" : "↘"} {stat.change}%
                </span>
                <span className="text-white/80 text-xs ml-2">vs last month</span>
              </div>
            </div>
            <div className="text-4xl opacity-80">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

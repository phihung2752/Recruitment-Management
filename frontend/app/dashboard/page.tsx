"use client"

import { useEffect, useState } from "react"
import { authService, type User } from "@/lib/auth"
import QuickStats from "@/components/dashboard/quick-stats"
import ActivityFeed from "@/components/dashboard/activity-feed"
import RecruitmentFunnel from "@/components/charts/recruitment-funnel"
import HiringTrends from "@/components/charts/hiring-trends"
import DepartmentDistribution from "@/components/charts/department-distribution"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}! 👋</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your recruitment today</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-lg font-semibold text-gray-900">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <QuickStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <HiringTrends />
          <RecruitmentFunnel />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ActivityFeed />
          <DepartmentDistribution />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium">
            <span>📄</span>
            <span>Post New Job</span>
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium">
            <span>🎤</span>
            <span>Schedule Interview</span>
          </button>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 font-medium">
            <span>🤖</span>
            <span>AI Analysis</span>
          </button>
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 font-medium">
            <span>📊</span>
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">This Week's Goals</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Interview Completion</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Rate</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hiring Target</span>
                <span>67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "67%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-500">15 interviews this month</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Mike Chen</p>
                <p className="text-sm text-gray-500">12 interviews this month</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Emily Davis</p>
                <p className="text-sm text-gray-500">10 interviews this month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Urgent Tasks</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Review 5 pending applications</p>
                <p className="text-xs text-gray-500">Due today</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Schedule follow-up interviews</p>
                <p className="text-xs text-gray-500">Due tomorrow</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Send offer letters</p>
                <p className="text-xs text-gray-500">Due this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Sidebar from "@/components/sidebar"

export default function SimpleTestPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Simple Test Page
        </h1>
        <p className="text-gray-600">
          Trang này để test sidebar có hiển thị đúng không.
        </p>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Các trang có sẵn:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Dashboard</li>
            <li>Candidates</li>
            <li>Interviews</li>
            <li>CV Management</li>
            <li>Calendar</li>
            <li>Job Postings</li>
            <li>Reports</li>
            <li>Settings</li>
            <li>Employees</li>
            <li>Analytics</li>
            <li>Notifications</li>
            <li>Help & Support</li>
            <li>User Management</li>
            <li>Chat</li>
            <li>Messages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}






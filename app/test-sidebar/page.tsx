"use client"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

export default function TestSidebarPage() {
  return (
    <div className="flex h-screen bg-hr-bg-primary">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onMenuClick={() => {}} />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 lg:p-6">
            <h1 className="text-2xl font-bold text-hr-text-primary mb-4">
              Test Sidebar Page
            </h1>
            <p className="text-hr-text-secondary">
              Trang này để test sidebar có hiển thị đúng không.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}






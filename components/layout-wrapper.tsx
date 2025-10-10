"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Các trang không cần sidebar và header
  const publicPages = ['/login', '/forgot-password', '/reset-password', '/test', '/simple-login']
  
  // Các trang tạm thời bỏ qua authentication để test
  const testPages = ['/dashboard', '/candidates', '/job-postings', '/interviews', '/reports', '/analytics', '/settings', '/users', '/test-users']
  const isTestPage = testPages.includes(pathname)
  const isPublicPage = publicPages.includes(pathname)
  
  useEffect(() => {
    // Nếu chưa đăng nhập và không phải trang public hoặc test page, redirect đến login
    if (!loading && !isAuthenticated && !isPublicPage && !isTestPage) {
      router.push('/login')
    }
    // Nếu đã đăng nhập và đang ở trang login, redirect đến dashboard
    if (!loading && isAuthenticated && pathname === '/login') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, isPublicPage, isTestPage, pathname, router])
  
  // Hiển thị loading khi đang kiểm tra authentication (chỉ cho trang không public và không phải test page)
  if (loading && !isPublicPage && !isTestPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }
  
  // Nếu chưa đăng nhập và không phải trang public hoặc test page, hiển thị loading
  if (!isAuthenticated && !isPublicPage && !isTestPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    )
  }
  
  // Nếu là trang public (login), chỉ hiển thị children
  if (isPublicPage) {
    return <>{children}</>
  }
  
  // Nếu đã đăng nhập, hiển thị layout đầy đủ với sidebar và header
  return (
    <div className="flex h-screen bg-hr-bg-primary">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <Sidebar 
        isMobile 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Database, Users, Settings } from "lucide-react"

export default function HomePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('authenticated')
    setAuthenticated(!!auth)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (authenticated) {
    router.push('/dashboard-sqlserver')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            HR Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hệ thống quản lý nhân sự toàn diện với SQL Server
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Quản lý người dùng</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Quản lý tài khoản, phân quyền và cài đặt người dùng
              </p>
              <Button 
                className="w-full" 
                onClick={() => router.push('/login-sqlserver')}
              >
                Đăng nhập
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">SQL Server Database</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Sử dụng SQL Server làm cơ sở dữ liệu chính
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/sqlserver-simple-test')}
              >
                Test Database
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Cài đặt hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Cấu hình và quản lý hệ thống
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/sqlserver-test')}
              >
                Test System
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tính năng chính
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🔐 Bảo mật</h3>
                <p className="text-gray-600 text-sm">
                  Xác thực JWT, mã hóa mật khẩu BCrypt, phân quyền chi tiết
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🗄️ Database</h3>
                <p className="text-gray-600 text-sm">
                  SQL Server với Entity Framework Core, migration tự động
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🎨 Giao diện</h3>
                <p className="text-gray-600 text-sm">
                  Next.js 14, Tailwind CSS, UI components hiện đại
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">⚡ Hiệu suất</h3>
                <p className="text-gray-600 text-sm">
                  Tối ưu hóa, caching, responsive design
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Phiên bản 1.0.0 | Powered by Next.js & SQL Server
          </p>
        </div>
      </div>
    </div>
  )
}
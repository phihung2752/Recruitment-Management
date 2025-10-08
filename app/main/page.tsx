"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Database, 
  Users, 
  Settings, 
  LogOut,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function MainPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState({
    database: false,
    backend: false,
    frontend: true
  })
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('authenticated')
    const userData = localStorage.getItem('user')
    
    if (auth && userData) {
      setAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    
    checkSystemStatus()
    setLoading(false)
  }, [])

  const checkSystemStatus = async () => {
    try {
      // Check database connection
      const dbResponse = await fetch('/api/sqlserver-test')
      const dbData = await dbResponse.json()
      setSystemStatus(prev => ({ ...prev, database: dbData.success }))
    } catch (error) {
      console.error('System check error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authenticated')
    localStorage.removeItem('user')
    setAuthenticated(false)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải hệ thống...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                HR Management System
              </h1>
              <Badge variant="outline" className="ml-4">SQL Server</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <>
                  <Badge variant="outline" className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {user?.username}
                  </Badge>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button onClick={() => router.push('/login-sqlserver')}>
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {authenticated ? `Chào mừng trở lại, ${user?.username}!` : 'Chào mừng đến với HR Management System'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hệ thống quản lý nhân sự toàn diện với SQL Server, Next.js và .NET
          </p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              {systemStatus.database ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.database ? 'Connected' : 'Disconnected'}
              </div>
              <p className="text-xs text-muted-foreground">
                SQL Server Database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backend API</CardTitle>
              {systemStatus.backend ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.backend ? 'Running' : 'Stopped'}
              </div>
              <p className="text-xs text-muted-foreground">
                .NET Core API
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frontend</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Running</div>
              <p className="text-xs text-muted-foreground">
                Next.js Application
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {authenticated ? (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard-sqlserver')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-blue-600" />
                    Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Xem tổng quan hệ thống và thống kê
                  </p>
                  <Button className="w-full">
                    Mở Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/users')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Quản lý người dùng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Quản lý tài khoản và phân quyền
                  </p>
                  <Button className="w-full">
                    Quản lý Users
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/sqlserver-test')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-600" />
                    Test System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Kiểm tra và test hệ thống
                  </p>
                  <Button className="w-full">
                    Test System
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/login-sqlserver')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Đăng nhập
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Đăng nhập vào hệ thống
                  </p>
                  <Button className="w-full">
                    Đăng nhập
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/sqlserver-simple-test')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-green-600" />
                    Test Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Kiểm tra kết nối SQL Server
                  </p>
                  <Button className="w-full">
                    Test Database
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/sqlserver-test')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-600" />
                    System Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Test toàn bộ hệ thống
                  </p>
                  <Button className="w-full">
                    System Test
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tính năng chính
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Bảo mật</h4>
              <p className="text-sm text-gray-600">
                JWT Authentication, BCrypt encryption, Role-based access
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Database</h4>
              <p className="text-sm text-gray-600">
                SQL Server với Entity Framework Core
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">User Management</h4>
              <p className="text-sm text-gray-600">
                Quản lý người dùng và phân quyền
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Modern UI</h4>
              <p className="text-sm text-gray-600">
                Next.js 14, Tailwind CSS, Responsive
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            HR Management System v1.0.0 | Powered by Next.js & SQL Server
          </p>
        </div>
      </main>
    </div>
  )
}


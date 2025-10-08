"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Building2,
  Users,
  Calendar,
  FileText,
  BarChart3
} from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(username, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng")
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đăng nhập")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đăng nhập hệ thống
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Nhập thông tin đăng nhập để truy cập HR Management System
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Tài khoản demo:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin:</span>
                    <span className="font-mono">admin / Admin123!</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HR:</span>
                    <span className="font-mono">hr / HR123!</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-mono">manager / Manager123!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - System Info */}
        <div className="flex items-center justify-center">
          <div className="max-w-md">
            <div className="text-center mb-8">
              <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                HR Management System
              </h1>
              <p className="text-lg text-gray-600">
                Hệ thống quản lý nhân sự chuyên nghiệp
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                Phân quyền hệ thống
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Các vai trò và quyền hạn trong hệ thống
              </p>

              <div className="space-y-4">
                {/* Admin Role */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">Admin</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Quản lý người dùng</li>
                    <li>• Quản lý nhân viên</li>
                    <li>• Quản lý ứng viên</li>
                    <li>• Quản lý phỏng vấn</li>
                    <li>• Quản lý tin tuyển dụng</li>
                    <li>• Xem báo cáo</li>
                    <li>• Cài đặt hệ thống</li>
                  </ul>
                </div>

                {/* HR Role */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">HR</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Quản lý nhân viên</li>
                    <li>• Quản lý ứng viên</li>
                    <li>• Quản lý phỏng vấn</li>
                    <li>• Quản lý tin tuyển dụng</li>
                    <li>• Xem báo cáo</li>
                  </ul>
                </div>

                {/* Manager Role */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Manager</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Xem nhân viên</li>
                    <li>• Xem ứng viên</li>
                    <li>• Quản lý phỏng vấn</li>
                    <li>• Xem tin tuyển dụng</li>
                    <li>• Xem báo cáo</li>
                  </ul>
                </div>

                {/* Employee Role */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-semibold text-gray-800">Employee</span>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Xem thông tin cá nhân</li>
                    <li>• Xem lịch làm việc</li>
                  </ul>
                </div>

                {/* Interviewer Role */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-800">Interviewer</span>
                  </div>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Xem ứng viên</li>
                    <li>• Quản lý phỏng vấn</li>
                    <li>• Xem lịch phỏng vấn</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
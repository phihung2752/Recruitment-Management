"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginSQLServerPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Test SQL Server connection first
      const testResponse = await fetch('/api/sqlserver-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const testData = await testResponse.json()

      if (testData.success) {
        setSuccess("Đăng nhập thành công! Đang chuyển hướng...")
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(testData.user))
        localStorage.setItem('authenticated', 'true')
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setError(testData.message || "Đăng nhập thất bại")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError("Đã xảy ra lỗi trong quá trình đăng nhập")
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Generate password hash
      const hashResponse = await fetch('/api/generate-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '123456' })
      })
      
      const hashData = await hashResponse.json()
      
      if (hashData.success) {
        // Create admin user
        const createResponse = await fetch('/api/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: 'admin', 
            password: '123456',
            passwordHash: hashData.hash 
          })
        })
        
        const createData = await createResponse.json()
        
        if (createData.success) {
          setSuccess("Admin user đã được tạo thành công! Username: admin, Password: 123456")
          setUsername("admin")
          setPassword("123456")
        } else {
          setError("Lỗi tạo admin user: " + createData.message)
        }
      } else {
        setError("Lỗi tạo password hash: " + hashData.message)
      }
    } catch (err) {
      console.error('Create user error:', err)
      setError("Lỗi tạo admin user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              HR Management System
            </CardTitle>
            <p className="text-gray-600">
              Đăng nhập vào hệ thống quản lý nhân sự
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            <div className="border-t pt-4">
              <div className="text-center text-sm text-gray-600 mb-3">
                Chưa có tài khoản admin?
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={createAdminUser}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo tài khoản admin"
                )}
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Tài khoản mặc định: admin / 123456</p>
              <p>Database: SQL Server</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


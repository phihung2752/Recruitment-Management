'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  FileText,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Tag,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react'

interface CV {
  id: number
  candidateName: string
  email: string
  phone: string
  position: string
  aiScore: number
  status: 'new' | 'processing' | 'analyzed' | 'pending' | 'rejected' | 'hired'
  source: string
  sourceName: string
  appliedDate: string
  skills: string[]
  experience: string
  education: string
  expectedSalary: string
  tags: string[]
  isStarCandidate: boolean
  isReapplicant: boolean
  applicationCount: number
  lastInterviewDate?: string
  lastInterviewResult?: string
  notes?: string
  cvUrl?: string
  jobMatch: number
  cvQuality: number
  strengths: string[]
  weaknesses: string[]
  missingSkills: string[]
  redFlags: string[]
  recommendations: string[]
}

interface Stats {
  total: number
  analyzed: number
  processing: number
  pending: number
  averageScore: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function CVManagementPage() {
  const { user, isAuthenticated } = useAuth()
  const [cvs, setCvs] = useState<CV[]>([])
  const [filteredCVs, setFilteredCVs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats, setStats] = useState<Stats>({ total: 0, analyzed: 0, processing: 0, pending: 0, averageScore: 0 })
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [duplicateData, setDuplicateData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCV, setSelectedCV] = useState<CV | null>(null)
  const [showAIScoreDetail, setShowAIScoreDetail] = useState(false)

  // Fetch real data from API
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('/api/cv-management', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setCvs(data.cvs || [])
          setFilteredCVs(data.cvs || [])
          setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
        } else {
          console.error('Failed to fetch CVs:', response.statusText)
          // Fallback to empty array
          setCvs([])
          setFilteredCVs([])
        }
      } catch (error) {
        console.error('Error fetching CVs:', error)
        // Fallback to empty array
        setCvs([])
        setFilteredCVs([])
      } finally {
        setLoading(false)
      }
    }

    fetchCVs()
  }, [])

  // Calculate stats from real data
  useEffect(() => {
    const total = cvs.length
    const analyzed = cvs.filter(cv => cv.status === 'analyzed').length
    const processing = cvs.filter(cv => cv.status === 'processing').length
    const pending = cvs.filter(cv => cv.status === 'pending').length
    const averageScore = total > 0 ? cvs.reduce((sum, cv) => sum + cv.aiScore, 0) / total : 0

    setStats({ total, analyzed, processing, pending, averageScore })
  }, [cvs])

  // Filter and search logic
  useEffect(() => {
    let filtered = cvs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cv => 
        cv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cv => cv.status === statusFilter)
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(cv => cv.source === sourceFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime())
        break
      case 'score-high':
        filtered.sort((a, b) => b.aiScore - a.aiScore)
        break
      case 'score-low':
        filtered.sort((a, b) => a.aiScore - b.aiScore)
        break
      case 'name':
        filtered.sort((a, b) => a.candidateName.localeCompare(b.candidateName))
        break
    }

    setFilteredCVs(filtered)
  }, [cvs, searchTerm, statusFilter, sourceFilter, sortBy])

  const handleRefresh = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/cv-management', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      setCvs(data.cvs || [])
      setFilteredCVs(data.cvs || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'hired': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <AlertTriangle className="h-4 w-4" />
      case 'hired': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>
  }

  return (
    <ProtectedRoute requiredPermissions={['candidate.read']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý CV</h1>
            <p className="text-muted-foreground">Quản lý và phân tích CV ứng viên</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import CV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng CV</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã phân tích</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.analyzed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.averageScore.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên, email, vị trí..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="analyzed">Đã phân tích</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                  <SelectItem value="hired">Đã tuyển</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Nguồn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="vietnamworks">VietnamWorks</SelectItem>
                  <SelectItem value="topcv">TopCV</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="referral">Giới thiệu</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="score-high">Điểm cao</SelectItem>
                  <SelectItem value="score-low">Điểm thấp</SelectItem>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* CV List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách CV ({filteredCVs.length})</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredCVs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có CV nào</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                {filteredCVs.map((cv) => (
                  <Card key={cv.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cv.candidateName}</h3>
                            <p className="text-sm text-gray-500">{cv.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {cv.isStarCandidate && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <Badge className={getStatusColor(cv.status)}>
                            {getStatusIcon(cv.status)}
                            <span className="ml-1 capitalize">{cv.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {cv.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {cv.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(cv.appliedDate).toLocaleDateString('vi-VN')}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">AI Score:</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={cv.aiScore} className="w-16 h-2" />
                            <span className="text-sm font-medium">{cv.aiScore}%</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {cv.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {cv.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{cv.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedCV(cv)
                              setShowAIScoreDetail(true)
                            }}
                          >
                            Chi tiết AI
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

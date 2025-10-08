"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import ImportCVSection from '@/components/import-cv-section'
import DuplicateDetection from '@/components/duplicate-detection'
import SourceAnalytics from '@/components/source-analytics'
import AIScoreDetail from '@/components/ai-score-detail'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Brain,
  Sparkles,
  Upload,
  BarChart3,
  Settings,
  Tag,
  MoreHorizontal,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'

interface CV {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  currentPosition: string
  experience: number | null
  skills: string
  status: string
  source: string
  createdAt: string
  updatedAt: string
  aiAnalysis?: {
    score: number
    strengths: string[]
    weaknesses: string[]
    recommendedLabels: string[]
    matchPercentage: number
  }
  isBlacklisted?: boolean
  blacklistReason?: string
  isReapplicant?: boolean
  applicationCount?: number
  isStarCandidate?: boolean
  isFastTrack?: boolean
  isReferral?: boolean
  isUrgent?: boolean
  tags?: {
    auto: string[]
    manual: Array<{
      id: string
      label: string
      color: string
    }>
  }
  duplicates?: Array<{
    id: string
    submissionNumber: number
    date: string
    position: string
    source: string
    status: string
    statusText: string
    rejectionReason?: string
    interviewScore?: number
    changes?: Array<{
      field: string
      oldValue: string
      newValue: string
    }>
    notes?: string
  }>
}

export default function CVManagementPage() {
  const { user } = useAuth()
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [aiScoreRange, setAiScoreRange] = useState([0, 100])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCVs, setSelectedCVs] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [activeTab, setActiveTab] = useState<'cvs' | 'import' | 'analytics'>('cvs')
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    fetchCVs()
  }, [currentPage, searchTerm, statusFilter, sourceFilter, aiScoreRange, sortBy, sortOrder])

  const fetchCVs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: searchTerm,
        status: statusFilter,
        source: sourceFilter,
        aiScoreMin: aiScoreRange[0].toString(),
        aiScoreMax: aiScoreRange[1].toString(),
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/cv-management?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch CVs')
      }

      const data = await response.json()
      setCvs(data.cvs || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching CVs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCVs()
  }

  const handleSelectCV = (cvId: string) => {
    setSelectedCVs(prev => 
      prev.includes(cvId) 
        ? prev.filter(id => id !== cvId)
        : [...prev, cvId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCVs.length === cvs.length) {
      setSelectedCVs([])
    } else {
      setSelectedCVs(cvs.map(cv => cv.id))
    }
  }

  const handleAIAnalysis = async (cvId: string) => {
    try {
      setAiAnalysisLoading(cvId)
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update CV with AI analysis
      setCvs(prev => prev.map(cv => 
        cv.id === cvId 
          ? {
              ...cv,
              aiAnalysis: {
                score: Math.floor(Math.random() * 40) + 60, // 60-100
                strengths: ['Strong technical skills', 'Good communication', 'Relevant experience'],
                weaknesses: ['Limited leadership experience', 'Needs more certifications'],
                recommendedLabels: ['High Potential', 'Technical Expert', 'Fast Learner'],
                matchPercentage: Math.floor(Math.random() * 30) + 70 // 70-100
              }
            }
          : cv
      ))
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setAiAnalysisLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800'
      case 'Interviewed': return 'bg-yellow-100 text-yellow-800'
      case 'Hired': return 'bg-green-100 text-green-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied': return <Clock className="w-4 h-4" />
      case 'Interviewed': return <User className="w-4 h-4" />
      case 'Hired': return <CheckCircle className="w-4 h-4" />
      case 'Rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'VietnamWorks': return '🌐'
      case 'TopCV': return '📄'
      case 'Indeed': return '🔍'
      case 'LinkedIn': return '💼'
      case 'CareerLink': return '🔗'
      case 'Website': return '🌍'
      case 'Email': return '📧'
      case 'Employee Referral': return '🤝'
      default: return '📋'
    }
  }

  const mockDuplicates = [
    {
      id: 'dup-1',
      submissionNumber: 2,
      date: '2024-01-15',
      position: 'Frontend Developer',
      source: 'VietnamWorks',
      status: 'Rejected',
      statusText: 'Rejected',
      rejectionReason: 'Not enough experience',
      changes: [
        { field: 'Skills', oldValue: 'React, Vue', newValue: 'React, Vue, Angular' },
        { field: 'Experience', oldValue: '2 years', newValue: '3 years' }
      ],
      notes: 'Improved skills since last application'
    }
  ]

  const mockAIScoreData = {
    overallScore: 85,
    jobMatch: 90,
    experience: 80,
    skills: 85,
    education: 75,
    cvQuality: 88,
    strengths: ['Strong technical skills', 'Good communication', 'Relevant experience'],
    weaknesses: ['Limited leadership experience', 'Needs more certifications'],
    missingSkills: ['Docker', 'AWS', 'Microservices'],
    redFlags: [],
    recommendations: [
      {
        type: 'schedule_interview',
        label: 'Lên lịch phỏng vấn',
        icon: '📅',
        action: 'Schedule interview for next week'
      },
      {
        type: 'add_tags',
        label: 'Thêm tags',
        icon: '🏷️',
        action: 'Add relevant skill tags'
      },
      {
        type: 'send_email',
        label: 'Gửi email',
        icon: '✉️',
        action: 'Send follow-up email'
      }
    ]
  }

  return (
    <ProtectedRoute requiredPermissions={['candidate.read']}>
      <div className="min-h-screen bg-hr-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-hr-text-primary mb-2">
              Quản lý CV
            </h1>
            <p className="text-hr-text-secondary">
              Quản lý, phân tích và theo dõi CV ứng viên với AI
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-hr-border mb-6">
            {[
              { id: 'cvs', label: 'Danh sách CV', icon: FileText },
              { id: 'import', label: 'Import CV', icon: Upload },
              { id: 'analytics', label: 'Phân tích nguồn', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-hr-accent text-hr-accent'
                    : 'border-transparent text-hr-text-muted hover:text-hr-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'cvs' && (
            <>
              {/* Search and Filters */}
              <div className="bg-hr-bg-secondary rounded-lg p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hr-text-muted w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, kỹ năng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-hr-border rounded-lg focus:ring-2 focus:ring-hr-accent focus:border-transparent bg-hr-bg-primary text-hr-text-primary"
                      />
                    </div>
                  </form>

                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-hr-border rounded-lg bg-hr-bg-primary text-hr-text-primary"
                    >
                      <option value="All">Tất cả trạng thái</option>
                      <option value="Applied">Đã ứng tuyển</option>
                      <option value="Interviewed">Đã phỏng vấn</option>
                      <option value="Hired">Đã thuê</option>
                      <option value="Rejected">Đã từ chối</option>
                    </select>

                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="px-4 py-2 border border-hr-border rounded-lg bg-hr-bg-primary text-hr-text-primary"
                    >
                      <option value="All">Tất cả nguồn</option>
                      <option value="VietnamWorks">VietnamWorks</option>
                      <option value="TopCV">TopCV</option>
                      <option value="Indeed">Indeed</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="CareerLink">CareerLink</option>
                      <option value="Website">Website</option>
                      <option value="Email">Email</option>
                      <option value="Employee Referral">Employee Referral</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-hr-text-muted">AI Score:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={aiScoreRange[0]}
                        onChange={(e) => setAiScoreRange([parseInt(e.target.value), aiScoreRange[1]])}
                        className="w-20"
                      />
                      <span className="text-sm text-hr-text-muted">{aiScoreRange[0]}-{aiScoreRange[1]}</span>
                    </div>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-hr-accent text-white' : 'bg-hr-bg-primary text-hr-text-muted'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-hr-accent text-white' : 'bg-hr-bg-primary text-hr-text-muted'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-')
                        setSortBy(field as any)
                        setSortOrder(order as any)
                      }}
                      className="px-3 py-2 border border-hr-border rounded text-sm"
                    >
                      <option value="date-desc">Mới nhất</option>
                      <option value="date-asc">Cũ nhất</option>
                      <option value="score-desc">Điểm cao nhất</option>
                      <option value="score-asc">Điểm thấp nhất</option>
                      <option value="name-asc">A-Z</option>
                      <option value="name-desc">Z-A</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedCVs.length > 0 && (
                <div className="bg-hr-accent/10 border border-hr-accent/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-hr-text-primary font-medium">
                      {selectedCVs.length} CV đã chọn
                    </span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-hr-accent text-white rounded text-sm hover:bg-hr-accent-dark">
                        Gửi email
                      </button>
                      <button className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-secondary">
                        Thay đổi trạng thái
                      </button>
                      <button className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-secondary">
                        Thêm tags
                      </button>
                      <button className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-secondary">
                        Xuất dữ liệu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CVs List */}
              <div className="bg-hr-bg-secondary rounded-lg overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-accent mx-auto mb-4"></div>
                    <p className="text-hr-text-muted">Đang tải dữ liệu...</p>
                  </div>
                ) : cvs.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="w-12 h-12 text-hr-text-muted mx-auto mb-4" />
                    <p className="text-hr-text-muted">Không tìm thấy CV nào</p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="bg-hr-bg-tertiary px-6 py-3 border-b border-hr-border">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedCVs.length === cvs.length && cvs.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-hr-border"
                        />
                        <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-hr-text-muted">
                          <div className="col-span-3">Ứng viên</div>
                          <div className="col-span-2">Vị trí</div>
                          <div className="col-span-2">Kỹ năng</div>
                          <div className="col-span-1">Trạng thái</div>
                          <div className="col-span-1">Nguồn</div>
                          <div className="col-span-1">AI Score</div>
                          <div className="col-span-2">Thao tác</div>
                        </div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-hr-border">
                      {cvs.map((cv) => (
                        <div key={cv.id} className="px-6 py-4 hover:bg-hr-bg-primary/50 transition-colors duration-200">
                          {/* Duplicate Detection */}
                          {cv.duplicates && cv.duplicates.length > 0 && (
                            <DuplicateDetection
                              candidateId={cv.id}
                              candidateName={`${cv.firstName} ${cv.lastName}`}
                              duplicates={cv.duplicates}
                              onMergeDuplicates={(duplicateIds) => console.log('Merge duplicates:', duplicateIds)}
                              onBlacklistCandidate={(candidateId, reason) => console.log('Blacklist:', candidateId, reason)}
                              onViewCV={(submissionId) => console.log('View CV:', submissionId)}
                              onCompareCVs={(id1, id2) => console.log('Compare CVs:', id1, id2)}
                            />
                          )}

                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={selectedCVs.includes(cv.id)}
                              onChange={() => handleSelectCV(cv.id)}
                              className="rounded border-hr-border"
                            />
                            
                            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                              {/* Candidate Info */}
                              <div className="col-span-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-hr-accent/20 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-hr-accent" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-hr-text-primary">
                                      {cv.firstName} {cv.lastName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-hr-text-muted">
                                      <Mail className="w-3 h-3" />
                                      {cv.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-hr-text-muted">
                                      <Phone className="w-3 h-3" />
                                      {cv.phone}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Position */}
                              <div className="col-span-2">
                                <p className="text-hr-text-primary font-medium">
                                  {cv.currentPosition}
                                </p>
                                {cv.experience && (
                                  <p className="text-sm text-hr-text-muted">
                                    {cv.experience} năm kinh nghiệm
                                  </p>
                                )}
                              </div>

                              {/* Skills */}
                              <div className="col-span-2">
                                <div className="flex flex-wrap gap-1">
                                  {cv.skills.split(',').slice(0, 2).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-hr-accent/10 text-hr-accent text-xs rounded"
                                    >
                                      {skill.trim()}
                                    </span>
                                  ))}
                                  {cv.skills.split(',').length > 2 && (
                                    <span className="px-2 py-1 bg-hr-bg-tertiary text-hr-text-muted text-xs rounded">
                                      +{cv.skills.split(',').length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Status */}
                              <div className="col-span-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cv.status)}`}>
                                  {getStatusIcon(cv.status)}
                                  {cv.status}
                                </span>
                              </div>

                              {/* Source */}
                              <div className="col-span-1">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                  {getSourceIcon(cv.source)} {cv.source}
                                </span>
                              </div>

                              {/* AI Score */}
                              <div className="col-span-1">
                                {cv.aiAnalysis ? (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium text-hr-text-primary">
                                      {cv.aiAnalysis.score}%
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAIAnalysis(cv.id)}
                                    disabled={aiAnalysisLoading === cv.id}
                                    className="px-2 py-1 bg-hr-accent/10 text-hr-accent rounded text-xs hover:bg-hr-accent/20 transition-colors disabled:opacity-50"
                                  >
                                    {aiAnalysisLoading === cv.id ? 'Analyzing...' : 'Analyze'}
                                  </button>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleAIAnalysis(cv.id)}
                                    disabled={aiAnalysisLoading === cv.id}
                                    className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors"
                                    title="AI Analysis"
                                  >
                                    {aiAnalysisLoading === cv.id ? (
                                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-hr-accent border-t-transparent"></div>
                                    ) : (
                                      <Brain className="w-4 h-4 text-hr-accent" />
                                    )}
                                  </button>
                                  
                                  <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors" title="Xem chi tiết">
                                    <Eye className="w-4 h-4 text-hr-text-muted" />
                                  </button>
                                  
                                  <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors" title="Chỉnh sửa">
                                    <Edit className="w-4 h-4 text-hr-text-muted" />
                                  </button>
                                  
                                  <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors" title="Thêm tags">
                                    <Tag className="w-4 h-4 text-hr-text-muted" />
                                  </button>
                                  
                                  <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors text-red-500" title="Xóa">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* AI Analysis Results */}
                          {cv.aiAnalysis && (
                            <AIScoreDetail
                              candidateId={cv.id}
                              candidateName={`${cv.firstName} ${cv.lastName}`}
                              scoreData={mockAIScoreData}
                              onExecuteAction={(actionType) => console.log('Execute action:', actionType)}
                              onViewComparison={() => console.log('View comparison')}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-hr-text-muted">
                    Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, cvs.length)} của {cvs.length} CV
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-hr-border rounded hover:bg-hr-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? 'bg-hr-accent text-white'
                                : 'border border-hr-border hover:bg-hr-bg-secondary'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="px-2">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-3 py-1 rounded ${
                              currentPage === totalPages
                                ? 'bg-hr-accent text-white'
                                : 'border border-hr-border hover:bg-hr-bg-secondary'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-hr-border rounded hover:bg-hr-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'import' && (
            <ImportCVSection />
          )}

          {activeTab === 'analytics' && (
            <SourceAnalytics />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
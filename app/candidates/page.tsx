"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import ProtectedRoute from '@/components/protected-route'
import { 
  Search, 
  Filter, 
  Plus, 
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
  Sparkles
} from 'lucide-react'

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  currentPosition: string
  experience: number | null
  skills: string
  status: string
  createdAt: string
  updatedAt: string
  aiAnalysis?: {
    score: number
    strengths: string[]
    weaknesses: string[]
    recommendedLabels: string[]
    matchPercentage: number
  }
}

export default function CandidatesPage() {
  const { user } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    fetchCandidates()
  }, [currentPage, searchTerm, statusFilter])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: searchTerm,
        status: statusFilter
      })

      const response = await fetch(`/api/candidates?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }

      const data = await response.json()
      setCandidates(data.candidates || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCandidates()
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(candidates.map(c => c.id))
    }
  }

  const handleAIAnalysis = async (candidateId: string) => {
    try {
      setAiAnalysisLoading(candidateId)
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update candidate with AI analysis
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId 
          ? {
              ...candidate,
              aiAnalysis: {
                score: Math.floor(Math.random() * 40) + 60, // 60-100
                strengths: ['Strong technical skills', 'Good communication', 'Relevant experience'],
                weaknesses: ['Limited leadership experience', 'Needs more certifications'],
                recommendedLabels: ['High Potential', 'Technical Expert', 'Fast Learner'],
                matchPercentage: Math.floor(Math.random() * 30) + 70 // 70-100
              }
            }
          : candidate
      ))
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setAiAnalysisLoading(null)
    }
  }

  const handleViewInterview = (candidateId: string) => {
    // Navigate to interview page
    window.location.href = `/interviews/${candidateId}`
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

  return (
    <ProtectedRoute requiredPermissions={['candidate.read']}>
      <div className="min-h-screen bg-hr-bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-hr-text-primary mb-2">
              Quản lý ứng viên
            </h1>
            <p className="text-hr-text-secondary">
              Quản lý và theo dõi đơn xin việc của ứng viên
            </p>
          </div>

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

              {/* Status Filter */}
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-4 py-2 border border-hr-border rounded-lg bg-hr-bg-primary text-hr-text-primary"
                >
                  <option value="All">Tất cả trạng thái</option>
                  <option value="Applied">Đã ứng tuyển</option>
                  <option value="Interviewed">Đã phỏng vấn</option>
                  <option value="Hired">Đã thuê</option>
                  <option value="Rejected">Đã từ chối</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-hr-accent text-white rounded-lg hover:bg-hr-accent-dark transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Thêm ứng viên
                </button>
                <button className="px-4 py-2 border border-hr-border rounded-lg hover:bg-hr-bg-secondary transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Xuất Excel
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCandidates.length > 0 && (
            <div className="bg-hr-accent/10 border border-hr-accent/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-hr-text-primary font-medium">
                  {selectedCandidates.length} ứng viên đã chọn
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-hr-accent text-white rounded text-sm hover:bg-hr-accent-dark">
                    Gửi email
                  </button>
                  <button className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-secondary">
                    Thay đổi trạng thái
                  </button>
                  <button className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-secondary">
                    Xuất dữ liệu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Candidates List */}
          <div className="bg-hr-bg-secondary rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hr-accent mx-auto mb-4"></div>
                <p className="text-hr-text-muted">Đang tải dữ liệu...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="p-8 text-center">
                <User className="w-12 h-12 text-hr-text-muted mx-auto mb-4" />
                <p className="text-hr-text-muted">Không tìm thấy ứng viên nào</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="bg-hr-bg-tertiary px-6 py-3 border-b border-hr-border">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-hr-border"
                    />
                    <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-hr-text-muted">
                      <div className="col-span-3">Ứng viên</div>
                      <div className="col-span-2">Vị trí</div>
                      <div className="col-span-2">Kỹ năng</div>
                      <div className="col-span-1">Trạng thái</div>
                      <div className="col-span-2">Ngày nộp</div>
                      <div className="col-span-2">Thao tác</div>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-hr-border">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="px-6 py-4 hover:bg-hr-bg-primary/50 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleSelectCandidate(candidate.id)}
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
                                  {candidate.firstName} {candidate.lastName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-hr-text-muted">
                                  <Mail className="w-3 h-3" />
                                  {candidate.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-hr-text-muted">
                                  <Phone className="w-3 h-3" />
                                  {candidate.phone}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Position */}
                          <div className="col-span-2">
                            <p className="text-hr-text-primary font-medium">
                              {candidate.currentPosition}
                            </p>
                            {candidate.experience && (
                              <p className="text-sm text-hr-text-muted">
                                {candidate.experience} năm kinh nghiệm
                              </p>
                            )}
                          </div>

                          {/* Skills */}
                          <div className="col-span-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.split(',').slice(0, 2).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-hr-accent/10 text-hr-accent text-xs rounded"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                              {candidate.skills.split(',').length > 2 && (
                                <span className="px-2 py-1 bg-hr-bg-tertiary text-hr-text-muted text-xs rounded">
                                  +{candidate.skills.split(',').length - 2}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                              {getStatusIcon(candidate.status)}
                              {candidate.status}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-1 text-sm text-hr-text-muted">
                              <Calendar className="w-3 h-3" />
                              {new Date(candidate.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAIAnalysis(candidate.id)}
                                disabled={aiAnalysisLoading === candidate.id}
                                className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors"
                                title="AI Analysis"
                              >
                                {aiAnalysisLoading === candidate.id ? (
                                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-hr-accent border-t-transparent"></div>
                                ) : (
                                  <Brain className="w-4 h-4 text-hr-accent" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleViewInterview(candidate.id)}
                                className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors"
                                title="Xem phỏng vấn"
                              >
                                <FileText className="w-4 h-4 text-hr-text-muted" />
                              </button>
                              
                              <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors" title="Xem chi tiết">
                                <Eye className="w-4 h-4 text-hr-text-muted" />
                              </button>
                              
                              <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors" title="Chỉnh sửa">
                                <Edit className="w-4 h-4 text-hr-text-muted" />
                              </button>
                              
                              <button className="p-1 hover:bg-hr-bg-tertiary rounded transition-colors text-red-500" title="Xóa">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Analysis Results */}
                      {candidate.aiAnalysis && (
                        <div className="mt-4 ml-12 bg-hr-accent/5 border border-hr-accent/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-hr-accent" />
                            <span className="font-medium text-hr-text-primary">AI Analysis</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{candidate.aiAnalysis.score}%</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium text-green-600 mb-1">Điểm mạnh:</h4>
                              <ul className="space-y-1">
                                {candidate.aiAnalysis.strengths.map((strength, index) => (
                                  <li key={index} className="text-hr-text-muted">• {strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-orange-600 mb-1">Cần cải thiện:</h4>
                              <ul className="space-y-1">
                                {candidate.aiAnalysis.weaknesses.map((weakness, index) => (
                                  <li key={index} className="text-hr-text-muted">• {weakness}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-blue-600 mb-1">Nhãn đề xuất:</h4>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(candidate.aiAnalysis.recommendedLabels) && candidate.aiAnalysis.recommendedLabels.map((label, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
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
                Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, candidates.length)} của {candidates.length} ứng viên
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
        </div>
      </div>
    </ProtectedRoute>
  )
}
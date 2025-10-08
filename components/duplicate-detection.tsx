"use client"

import { useState } from 'react'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  Eye, 
  GitCompare,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Trash2,
  UserX,
  Link,
  FileText
} from 'lucide-react'

interface DuplicateSubmission {
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
}

interface DuplicateDetectionProps {
  candidateId: string
  candidateName: string
  duplicates: DuplicateSubmission[]
  onMergeDuplicates: (duplicateIds: string[]) => void
  onBlacklistCandidate: (candidateId: string, reason: string) => void
  onViewCV: (submissionId: string) => void
  onCompareCVs: (submissionId1: string, submissionId2: string) => void
}

export default function DuplicateDetection({
  candidateId,
  candidateName,
  duplicates,
  onMergeDuplicates,
  onBlacklistCandidate,
  onViewCV,
  onCompareCVs
}: DuplicateDetectionProps) {
  const [showDuplicateHistory, setShowDuplicateHistory] = useState(false)
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([])
  const [showBlacklistModal, setShowBlacklistModal] = useState(false)
  const [blacklistReason, setBlacklistReason] = useState('')

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
      default: return '📋'
    }
  }

  const handleSelectDuplicate = (duplicateId: string) => {
    setSelectedDuplicates(prev => 
      prev.includes(duplicateId)
        ? prev.filter(id => id !== duplicateId)
        : [...prev, duplicateId]
    )
  }

  const handleMergeDuplicates = () => {
    if (selectedDuplicates.length > 0) {
      onMergeDuplicates(selectedDuplicates)
      setSelectedDuplicates([])
    }
  }

  const handleBlacklist = () => {
    if (blacklistReason.trim()) {
      onBlacklistCandidate(candidateId, blacklistReason)
      setShowBlacklistModal(false)
      setBlacklistReason('')
    }
  }

  if (duplicates.length === 0) return null

  return (
    <>
      {/* Duplicate Warning Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-1">
              Phát hiện CV trùng lặp!
            </h4>
            <p className="text-yellow-700 text-sm mb-3">
              Ứng viên <strong>{candidateName}</strong> đã nộp CV {duplicates.length} lần trước đó
            </p>
            <button
              onClick={() => setShowDuplicateHistory(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 hover:shadow-md transition-all text-sm font-medium"
            >
              Xem lịch sử nộp CV ({duplicates.length})
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate History Modal */}
      {showDuplicateHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Lịch sử nộp CV - {candidateName}
              </h3>
              <button
                onClick={() => setShowDuplicateHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {duplicates.map((submission, index) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                          Lần {duplicates.length - index}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {submission.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDuplicates.includes(submission.id)}
                          onChange={() => handleSelectDuplicate(submission.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-500">Chọn để merge</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Vị trí:</span>
                          <span className="text-sm text-gray-900">{submission.position}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Nguồn:</span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {getSourceIcon(submission.source)} {submission.source}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {getStatusIcon(submission.status)}
                            {submission.statusText}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {submission.rejectionReason && (
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div>
                              <span className="text-sm font-medium text-red-700">Lý do từ chối:</span>
                              <p className="text-sm text-red-600">{submission.rejectionReason}</p>
                            </div>
                          </div>
                        )}

                        {submission.interviewScore && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">
                              Điểm PV: {submission.interviewScore}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CV Changes Detection */}
                    {submission.changes && submission.changes.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Thay đổi so với lần trước:
                        </h5>
                        <ul className="space-y-1">
                          {submission.changes.map((change, changeIndex) => (
                            <li key={changeIndex} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="font-medium">{change.field}:</span>
                              <span className="text-red-600 line-through">{change.oldValue}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-green-600">{change.newValue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Notes from previous submission */}
                    {submission.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-700">Ghi chú lần trước:</p>
                            <p className="text-sm text-blue-600">{submission.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => onCompareCVs(submission.id, duplicates[0]?.id || '')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <GitCompare className="w-4 h-4" />
                        So sánh CV
                      </button>
                      <button
                        onClick={() => onViewCV(submission.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Xem CV cũ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                {selectedDuplicates.length > 0 && (
                  <button
                    onClick={handleMergeDuplicates}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    Gộp các lần nộp thành 1 profile ({selectedDuplicates.length})
                  </button>
                )}
                <button
                  onClick={() => setShowBlacklistModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  Blacklist ứng viên
                </button>
              </div>
              <button
                onClick={() => setShowDuplicateHistory(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blacklist Modal */}
      {showBlacklistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blacklist Ứng viên
              </h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 text-sm">
                      Ứng viên sẽ bị chặn khỏi tất cả vị trí tuyển dụng trong tương lai.
                      Hành động này nên được xem xét cẩn thận.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do Blacklist: *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">-- Chọn lý do --</option>
                    <option value="dishonest">Không trung thực trong CV</option>
                    <option value="no-show">Không đến phỏng vấn (nhiều lần)</option>
                    <option value="unprofessional">Thái độ không chuyên nghiệp</option>
                    <option value="fake-credentials">Bằng cấp giả mạo</option>
                    <option value="breach-contract">Vi phạm hợp đồng cũ</option>
                    <option value="reference-issues">Vấn đề về reference check</option>
                    <option value="other">Lý do khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi tiết: *
                  </label>
                  <textarea
                    value={blacklistReason}
                    onChange={(e) => setBlacklistReason(e.target.value)}
                    rows={4}
                    placeholder="Mô tả chi tiết lý do blacklist..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="confirm-blacklist" className="rounded border-gray-300" />
                  <label htmlFor="confirm-blacklist" className="text-sm text-gray-700">
                    Tôi xác nhận đã xem xét kỹ và quyết định blacklist ứng viên này
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowBlacklistModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBlacklist}
                  disabled={!blacklistReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận Blacklist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from 'react'
import { 
  Upload, 
  Mail, 
  Globe, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react'

interface ImportMethod {
  id: string
  name: string
  icon: React.ReactNode
  status: 'connected' | 'not-connected' | 'error'
  description: string
  stats?: string
  lastSync?: string
}

const importMethods: ImportMethod[] = [
  {
    id: 'vietnamworks',
    name: 'VietnamWorks',
    icon: <Globe className="w-5 h-5" />,
    status: 'connected',
    description: 'Kết nối với VietnamWorks để tự động import CV',
    stats: '156 CVs imported this month',
    lastSync: '2 hours ago'
  },
  {
    id: 'topcv',
    name: 'TopCV',
    icon: <Globe className="w-5 h-5" />,
    status: 'not-connected',
    description: 'Kết nối với TopCV để tự động import CV'
  },
  {
    id: 'indeed',
    name: 'Indeed',
    icon: <Globe className="w-5 h-5" />,
    status: 'connected',
    description: 'Kết nối với Indeed để tự động import CV',
    stats: '89 CVs imported this month',
    lastSync: '1 hour ago'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Globe className="w-5 h-5" />,
    status: 'not-connected',
    description: 'Kết nối với LinkedIn để tự động import CV'
  },
  {
    id: 'careerlink',
    name: 'CareerLink',
    icon: <Globe className="w-5 h-5" />,
    status: 'connected',
    description: 'Kết nối với CareerLink để tự động import CV',
    stats: '45 CVs imported this month',
    lastSync: '3 hours ago'
  }
]

export default function ImportCVSection() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [emailConfig, setEmailConfig] = useState('recruitment@company.com')
  const [embedCode] = useState('<iframe src="https://yourcompany.com/apply"></iframe>')

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
    // Show toast notification
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'not-connected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'not-connected': return 'Not Connected'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-hr-bg-secondary rounded-lg p-6">
        <h2 className="text-xl font-semibold text-hr-text-primary mb-4">
          Import CV từ các nguồn
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Portals Integration */}
          <div className="bg-hr-bg-primary rounded-lg p-4 border border-hr-border">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-hr-accent" />
              <h3 className="font-medium text-hr-text-primary">Kết nối trang tuyển dụng</h3>
            </div>
            
            <div className="space-y-2">
              {importMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-2 bg-hr-bg-secondary rounded">
                  <div className="flex items-center gap-2">
                    {method.icon}
                    <span className="text-sm text-hr-text-primary">{method.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
                      {getStatusText(method.status)}
                    </span>
                    <button className="text-hr-accent hover:text-hr-accent-dark text-sm">
                      {method.status === 'connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-hr-accent text-white rounded-lg hover:bg-hr-accent-dark transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync All CVs Now
            </button>
            
            <p className="text-xs text-hr-text-muted mt-2 text-center">
              Last sync: 2 hours ago
            </p>
          </div>

          {/* Email Integration */}
          <div className="bg-hr-bg-primary rounded-lg p-4 border border-hr-border">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-hr-accent" />
              <h3 className="font-medium text-hr-text-primary">Import từ Email</h3>
            </div>
            
            <p className="text-sm text-hr-text-muted mb-3">
              Tự động lấy CV từ email recruitment@company.com
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={emailConfig}
                  onChange={(e) => setEmailConfig(e.target.value)}
                  className="flex-1 px-3 py-2 border border-hr-border rounded text-sm"
                />
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </div>
              
              <div className="text-sm text-hr-text-muted">
                📥 156 CVs imported this month
              </div>
            </div>
            
            <button className="w-full mt-3 px-4 py-2 border border-hr-border rounded-lg hover:bg-hr-bg-secondary transition-colors text-sm">
              Configure Email Rules
            </button>
          </div>

          {/* Upload Files */}
          <div className="bg-hr-bg-primary rounded-lg p-4 border border-hr-border">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-5 h-5 text-hr-accent" />
              <h3 className="font-medium text-hr-text-primary">Upload CV thủ công</h3>
            </div>
            
            <div
              className="border-2 border-dashed border-hr-border rounded-lg p-6 text-center hover:border-hr-accent transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-8 h-8 text-hr-text-muted mx-auto mb-2" />
              <p className="text-sm text-hr-text-primary mb-1">Kéo thả CV vào đây</p>
              <p className="text-xs text-hr-text-muted mb-2">hoặc</p>
              <button className="px-4 py-1 bg-hr-accent text-white rounded text-sm hover:bg-hr-accent-dark">
                Chọn file
              </button>
              <p className="text-xs text-hr-text-muted mt-2">
                Hỗ trợ: PDF, DOC, DOCX, ZIP (tối đa 20MB)
              </p>
            </div>
            
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.zip"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <h4 className="text-sm font-medium text-hr-text-primary">Files đã chọn:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-hr-bg-secondary rounded p-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-hr-text-muted" />
                      <span className="text-sm text-hr-text-primary">{file.name}</span>
                      <span className="text-xs text-hr-text-muted">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="w-full px-4 py-2 bg-hr-accent text-white rounded text-sm hover:bg-hr-accent-dark">
                  Upload {uploadedFiles.length} files
                </button>
              </div>
            )}
            
            <button className="w-full mt-3 px-4 py-2 border border-hr-border rounded-lg hover:bg-hr-bg-secondary transition-colors text-sm flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Upload nhiều CV cùng lúc
            </button>
          </div>

          {/* Web Form */}
          <div className="bg-hr-bg-primary rounded-lg p-4 border border-hr-border">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-hr-accent" />
              <h3 className="font-medium text-hr-text-primary">Form nộp CV trên website</h3>
            </div>
            
            <p className="text-sm text-hr-text-muted mb-3">
              Nhúng form vào website công ty
            </p>
            
            <div className="space-y-2">
              <div className="bg-hr-bg-secondary rounded p-2">
                <code className="text-xs text-hr-text-primary break-all">
                  {embedCode}
                </code>
              </div>
              
              <button
                onClick={copyEmbedCode}
                className="w-full px-3 py-1 bg-hr-bg-secondary border border-hr-border rounded text-sm hover:bg-hr-bg-tertiary transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </button>
              
              <a
                href="/career-page"
                target="_blank"
                className="w-full px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Xem trang tuyển dụng
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Import Status */}
      <div className="bg-hr-bg-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-hr-text-primary mb-4">
          Trạng thái Import
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Thành công</span>
            </div>
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-green-600">CVs imported today</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Đang xử lý</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">23</p>
            <p className="text-sm text-yellow-600">CVs processing</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">Lỗi</span>
            </div>
            <p className="text-2xl font-bold text-red-600">5</p>
            <p className="text-sm text-red-600">CVs failed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
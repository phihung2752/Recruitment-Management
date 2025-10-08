"use client"

import { useState } from 'react'
import { 
  Star, 
  Target, 
  Briefcase, 
  Wrench, 
  GraduationCap, 
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  BarChart3,
  Brain,
  Sparkles
} from 'lucide-react'

interface AIScoreBreakdown {
  overallScore: number
  jobMatch: number
  experience: number
  skills: number
  education: number
  cvQuality: number
  strengths: string[]
  weaknesses: string[]
  missingSkills: string[]
  redFlags: string[]
  recommendations: Array<{
    type: string
    label: string
    icon: string
    action: string
  }>
}

interface AIScoreDetailProps {
  candidateId: string
  candidateName: string
  scoreData: AIScoreBreakdown
  onExecuteAction: (actionType: string) => void
  onViewComparison: () => void
}

export default function AIScoreDetail({
  candidateId,
  candidateName,
  scoreData,
  onExecuteAction,
  onViewComparison
}: AIScoreDetailProps) {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'insights' | 'recommendations' | 'comparison'>('breakdown')

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-blue-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getRecommendationText = (score: number) => {
    if (score >= 85) return '✅ Highly Recommended'
    if (score >= 70) return '👍 Good Candidate'
    if (score >= 50) return '⚠️ Consider with Caution'
    return '❌ Not Recommended'
  }

  const getRecommendationColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const CircularProgress = ({ value, size = 'large' }: { value: number; size?: 'small' | 'medium' | 'large' }) => {
    const sizeClasses = {
      small: 'w-16 h-16',
      medium: 'w-20 h-20',
      large: 'w-24 h-24'
    }
    
    const strokeWidth = size === 'small' ? 3 : size === 'medium' ? 4 : 6
    const radius = size === 'small' ? 30 : size === 'medium' ? 36 : 42
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-500 ${getScoreColor(value)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'small' ? 'text-lg' : size === 'medium' ? 'text-xl' : 'text-2xl'} ${getScoreColor(value)}`}>
            {value}%
          </span>
        </div>
      </div>
    )
  }

  const ScoreItem = ({ 
    label, 
    value, 
    icon, 
    tooltip 
  }: { 
    label: string
    value: number
    icon: React.ReactNode
    tooltip: string
  }) => (
    <div className="flex items-center justify-between p-3 bg-hr-bg-primary rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-hr-accent/10 rounded-lg">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-hr-text-primary">{label}</span>
            <div className="group relative">
              <div className="w-4 h-4 text-hr-text-muted cursor-help">?</div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {tooltip}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(value)}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <span className={`font-medium w-12 text-right ${getScoreColor(value)}`}>
          {value}%
        </span>
      </div>
    </div>
  )

  return (
    <div className="bg-hr-bg-secondary rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-hr-accent/10 rounded-lg">
            <Brain className="w-6 h-6 text-hr-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-hr-text-primary">AI Analysis</h3>
            <p className="text-sm text-hr-text-muted">{candidateName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewComparison}
            className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-primary hover:shadow-md transition-all flex items-center gap-1"
          >
            <BarChart3 className="w-4 h-4" />
            So sánh
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <CircularProgress value={scoreData.overallScore} />
        <h4 className="text-lg font-semibold text-hr-text-primary mt-4">AI Score</h4>
        <p className={`font-medium ${getRecommendationColor(scoreData.overallScore)}`}>
          {getRecommendationText(scoreData.overallScore)}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hr-border mb-6">
        {[
          { id: 'breakdown', label: 'Chi tiết đánh giá', icon: BarChart3 },
          { id: 'insights', label: 'AI Insights', icon: Sparkles },
          { id: 'recommendations', label: 'Đề xuất', icon: Lightbulb },
          { id: 'comparison', label: 'So sánh', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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
      {activeTab === 'breakdown' && (
        <div className="space-y-4">
          <h4 className="font-medium text-hr-text-primary mb-4">Chi tiết đánh giá:</h4>
          
          <ScoreItem
            label="Job Match"
            value={scoreData.jobMatch}
            icon={<Target className="w-5 h-5 text-hr-accent" />}
            tooltip="Độ phù hợp với JD"
          />
          
          <ScoreItem
            label="Experience"
            value={scoreData.experience}
            icon={<Briefcase className="w-5 h-5 text-hr-accent" />}
            tooltip="Kinh nghiệm làm việc"
          />
          
          <ScoreItem
            label="Skills Match"
            value={scoreData.skills}
            icon={<Wrench className="w-5 h-5 text-hr-accent" />}
            tooltip="Kỹ năng yêu cầu"
          />
          
          <ScoreItem
            label="Education"
            value={scoreData.education}
            icon={<GraduationCap className="w-5 h-5 text-hr-accent" />}
            tooltip="Trình độ học vấn"
          />
          
          <ScoreItem
            label="CV Quality"
            value={scoreData.cvQuality}
            icon={<FileText className="w-5 h-5 text-hr-accent" />}
            tooltip="Chất lượng CV"
          />
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Strengths */}
          <div>
            <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Điểm mạnh:
            </h4>
            <ul className="space-y-2">
              {scoreData.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-hr-text-primary">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="font-medium text-orange-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Điểm yếu:
            </h4>
            <ul className="space-y-2">
              {scoreData.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-hr-text-primary">
                  <span className="text-orange-500 mt-1">⚠</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div>
            <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Kỹ năng thiếu:
            </h4>
            <div className="flex flex-wrap gap-2">
              {scoreData.missingSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          {scoreData.redFlags.length > 0 && (
            <div>
              <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Red Flags:
              </h4>
              <ul className="space-y-2">
                {scoreData.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-600">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <h4 className="font-medium text-hr-text-primary mb-4">💡 Đề xuất:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scoreData.recommendations.map((rec, index) => (
              <button
                key={index}
                onClick={() => onExecuteAction(rec.type)}
                className="p-3 bg-hr-bg-primary border border-hr-border rounded-lg hover:bg-hr-accent/5 hover:border-hr-accent transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{rec.icon}</span>
                  <span className="font-medium text-hr-text-primary">{rec.label}</span>
                </div>
                <p className="text-sm text-hr-text-muted">{rec.action}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <h4 className="font-medium text-hr-text-primary mb-4">So sánh với ứng viên khác:</h4>
          <div className="bg-hr-bg-primary rounded-lg p-4">
            <div className="text-center text-hr-text-muted">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Biểu đồ so sánh sẽ được hiển thị ở đây</p>
              <p className="text-sm">So sánh điểm số với các ứng viên khác cho cùng vị trí</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
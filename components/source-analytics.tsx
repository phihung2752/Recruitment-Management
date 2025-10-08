"use client"

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  PieChart,
  Download,
  Filter,
  Calendar
} from 'lucide-react'

interface SourceData {
  source: string
  sourceName: string
  totalCVs: number
  interviewed: number
  passedInterview: number
  hired: number
  conversionRate: number
  avgScore: number
  costPerHire: number
  quality: number
}

interface SourceAnalyticsProps {
  data?: SourceData[]
  dateRange?: {
    from: Date
    to: Date
  }
}

const mockData: SourceData[] = [
  {
    source: 'vietnamworks',
    sourceName: 'VietnamWorks',
    totalCVs: 245,
    interviewed: 89,
    passedInterview: 45,
    hired: 12,
    conversionRate: 4.9,
    avgScore: 4.2,
    costPerHire: 2500000,
    quality: 85
  },
  {
    source: 'topcv',
    sourceName: 'TopCV',
    totalCVs: 189,
    interviewed: 67,
    passedInterview: 34,
    hired: 8,
    conversionRate: 4.2,
    avgScore: 3.9,
    costPerHire: 3200000,
    quality: 78
  },
  {
    source: 'indeed',
    sourceName: 'Indeed',
    totalCVs: 156,
    interviewed: 45,
    passedInterview: 23,
    hired: 6,
    conversionRate: 3.8,
    avgScore: 3.7,
    costPerHire: 2800000,
    quality: 72
  },
  {
    source: 'linkedin',
    sourceName: 'LinkedIn',
    totalCVs: 98,
    interviewed: 34,
    passedInterview: 18,
    hired: 5,
    conversionRate: 5.1,
    avgScore: 4.5,
    costPerHire: 4500000,
    quality: 92
  },
  {
    source: 'careerlink',
    sourceName: 'CareerLink',
    totalCVs: 134,
    interviewed: 38,
    passedInterview: 19,
    hired: 4,
    conversionRate: 3.0,
    avgScore: 3.5,
    costPerHire: 2200000,
    quality: 68
  },
  {
    source: 'website',
    sourceName: 'Website công ty',
    totalCVs: 87,
    interviewed: 28,
    passedInterview: 15,
    hired: 7,
    conversionRate: 8.0,
    avgScore: 4.1,
    costPerHire: 1500000,
    quality: 88
  },
  {
    source: 'email',
    sourceName: 'Email trực tiếp',
    totalCVs: 45,
    interviewed: 18,
    passedInterview: 12,
    hired: 6,
    conversionRate: 13.3,
    avgScore: 4.3,
    costPerHire: 800000,
    quality: 90
  },
  {
    source: 'employee-referral',
    sourceName: 'Nhân viên giới thiệu',
    totalCVs: 67,
    interviewed: 25,
    passedInterview: 18,
    hired: 9,
    conversionRate: 13.4,
    avgScore: 4.6,
    costPerHire: 1200000,
    quality: 95
  }
]

export default function SourceAnalytics({ data = mockData, dateRange }: SourceAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'total' | 'conversion' | 'quality' | 'cost'>('total')
  const [sortBy, setSortBy] = useState<'totalCVs' | 'conversionRate' | 'avgScore' | 'costPerHire'>('totalCVs')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })

  const totalCVs = data.reduce((sum, item) => sum + item.totalCVs, 0)
  const totalHired = data.reduce((sum, item) => sum + item.hired, 0)
  const avgConversionRate = data.reduce((sum, item) => sum + item.conversionRate, 0) / data.length
  const avgCostPerHire = data.reduce((sum, item) => sum + item.costPerHire, 0) / data.length

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'vietnamworks': return '🌐'
      case 'topcv': return '📄'
      case 'indeed': return '🔍'
      case 'linkedin': return '💼'
      case 'careerlink': return '🔗'
      case 'website': return '🌍'
      case 'email': return '📧'
      case 'employee-referral': return '🤝'
      default: return '📋'
    }
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-600 bg-green-100'
    if (quality >= 80) return 'text-blue-600 bg-blue-100'
    if (quality >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getConversionColor = (rate: number) => {
    if (rate >= 10) return 'text-green-600'
    if (rate >= 5) return 'text-blue-600'
    if (rate >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hr-text-primary">Phân tích nguồn tuyển dụng</h2>
          <p className="text-hr-text-muted">Hiệu quả và chi phí của từng nguồn CV</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-hr-border rounded-lg hover:bg-hr-bg-secondary transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </button>
          <button className="px-4 py-2 border border-hr-border rounded-lg hover:bg-hr-bg-secondary transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Chọn khoảng thời gian
          </button>
          <button className="px-4 py-2 bg-hr-accent text-white rounded-lg hover:bg-hr-accent-dark transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-hr-bg-secondary rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-hr-text-muted">Tổng CV</p>
              <p className="text-2xl font-bold text-hr-text-primary">{totalCVs.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-hr-bg-secondary rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-hr-text-muted">Đã thuê</p>
              <p className="text-2xl font-bold text-hr-text-primary">{totalHired}</p>
            </div>
          </div>
        </div>

        <div className="bg-hr-bg-secondary rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-hr-text-muted">Tỷ lệ chuyển đổi TB</p>
              <p className="text-2xl font-bold text-hr-text-primary">{avgConversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-hr-bg-secondary rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-hr-text-muted">Chi phí TB/hire</p>
              <p className="text-2xl font-bold text-hr-text-primary">
                {(avgCostPerHire / 1000000).toFixed(1)}M VNĐ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Sources Chart */}
      <div className="bg-hr-bg-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-hr-text-primary mb-4">Top 5 nguồn CV</h3>
        <div className="space-y-4">
          {sortedData.slice(0, 5).map((item, index) => (
            <div key={item.source} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getSourceIcon(item.source)}</span>
                <div>
                  <p className="font-medium text-hr-text-primary">{item.sourceName}</p>
                  <p className="text-sm text-hr-text-muted">
                    {item.totalCVs} CVs • {item.conversionRate}% conversion
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-hr-text-primary">{item.totalCVs}</p>
                  <p className="text-sm text-hr-text-muted">CVs</p>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-hr-accent h-2 rounded-full" 
                    style={{ width: `${(item.totalCVs / Math.max(...data.map(d => d.totalCVs))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality by Source */}
      <div className="bg-hr-bg-secondary rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-hr-text-primary">Chất lượng ứng viên theo nguồn</h3>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-hr-border rounded text-sm"
            >
              <option value="totalCVs">Sắp xếp theo CV</option>
              <option value="conversionRate">Sắp xếp theo conversion</option>
              <option value="avgScore">Sắp xếp theo điểm</option>
              <option value="costPerHire">Sắp xếp theo chi phí</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border border-hr-border rounded text-sm hover:bg-hr-bg-primary"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hr-border">
                <th className="text-left py-3 px-4 font-medium text-hr-text-muted">Nguồn</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Tổng CV</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Phỏng vấn</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Pass PV</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Hired</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Conversion Rate</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Avg Score</th>
                <th className="text-right py-3 px-4 font-medium text-hr-text-muted">Chi phí/hire</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.source} className="border-b border-hr-border hover:bg-hr-bg-primary/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getSourceIcon(item.source)}</span>
                      <span className="font-medium text-hr-text-primary">{item.sourceName}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-hr-text-primary">{item.totalCVs}</td>
                  <td className="text-right py-3 px-4 text-hr-text-primary">{item.interviewed}</td>
                  <td className="text-right py-3 px-4 text-hr-text-primary">{item.passedInterview}</td>
                  <td className="text-right py-3 px-4 text-hr-text-primary">{item.hired}</td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getConversionColor(item.conversionRate)}`}
                          style={{ width: `${Math.min(item.conversionRate * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`font-medium ${getConversionColor(item.conversionRate)}`}>
                        {item.conversionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.avgScore) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-hr-text-primary">{item.avgScore}/5</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-hr-text-primary">
                    {(item.costPerHire / 1000000).toFixed(1)}M VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost per Hire Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-hr-bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-hr-text-primary mb-4">Chi phí thuê mướn theo nguồn</h3>
          <div className="space-y-3">
            {sortedData.slice(0, 6).map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getSourceIcon(item.source)}</span>
                  <span className="text-sm text-hr-text-primary">{item.sourceName}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-hr-text-primary">
                    {(item.costPerHire / 1000000).toFixed(1)}M VNĐ/hire
                  </p>
                  <p className="text-xs text-hr-text-muted">{item.hired} hires</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-hr-bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-hr-text-primary mb-4">ROI của từng nguồn tuyển dụng</h3>
          <p className="text-sm text-hr-text-muted mb-4">So sánh chi phí vs chất lượng ứng viên</p>
          <div className="space-y-3">
            {sortedData.map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getSourceIcon(item.source)}</span>
                  <span className="text-sm text-hr-text-primary">{item.sourceName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-hr-text-muted">Quality</p>
                    <p className="text-sm font-medium">{item.quality}%</p>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getQualityColor(item.quality).split(' ')[0]}`}
                      style={{ width: `${item.quality}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-hr-text-muted">Cost</p>
                    <p className="text-sm font-medium">{(item.costPerHire / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
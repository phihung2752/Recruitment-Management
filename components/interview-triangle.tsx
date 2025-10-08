"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Settings,
  Plus,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InterviewRound {
  id: number
  name: string
  status: 'pending' | 'current' | 'passed' | 'failed'
  date?: string
  interviewer: string
  interviewerAvatar?: string
}

interface InterviewTriangleProps {
  rounds: InterviewRound[]
  candidateName: string
  onPassRound?: () => void
  onFailRound?: () => void
  onConfigureRounds?: () => void
  isAdmin?: boolean
}

export default function InterviewTriangle({ 
  rounds, 
  candidateName, 
  onPassRound, 
  onFailRound, 
  onConfigureRounds,
  isAdmin = false 
}: InterviewTriangleProps) {
  const [showConfig, setShowConfig] = useState(false)
  const [newRoundName, setNewRoundName] = useState("")
  const [newInterviewer, setNewInterviewer] = useState("")

  // Tự động xác định layout dựa trên số lượng vòng
  const getTriangleLayout = (rounds: InterviewRound[]) => {
    if (!rounds || !Array.isArray(rounds)) {
      return []
    }
    const totalRounds = rounds.length
    
    if (totalRounds <= 4) {
      // Tam giác cơ bản cho ≤4 vòng
      return getBasicTriangleLayout(rounds)
    } else {
      // Tam giác phân tầng (kim tự tháp) cho >4 vòng
      return getPyramidLayout(rounds)
    }
  }

  // Layout tam giác cơ bản (≤4 vòng)
  const getBasicTriangleLayout = (rounds: InterviewRound[]) => {
    if (!rounds || !Array.isArray(rounds)) {
      return []
    }
    
    const positions = [
      { row: 0, col: 1, name: "Đỉnh" },      // Vòng 1 - Đỉnh
      { row: 1, col: 0, name: "Trái" },     // Vòng 2 - Góc trái  
      { row: 1, col: 2, name: "Phải" },     // Vòng 3 - Góc phải
      { row: 2, col: 1, name: "Đáy" }       // Vòng 4 - Giữa đáy
    ]
    
    return rounds.map((round, index) => ({
      ...round,
      position: positions[index] || { row: 2, col: index, name: "Thêm" }
    }))
  }

  // Layout kim tự tháp phân tầng (>4 vòng)
  const getPyramidLayout = (rounds: InterviewRound[]) => {
    if (!rounds || !Array.isArray(rounds)) {
      return []
    }
    
    const totalRounds = rounds.length
    const rows = Math.ceil(Math.sqrt(totalRounds * 2)) // Tính số tầng cần thiết
    
    const layout: Array<{ row: number; col: number; name: string }> = []
    let roundIndex = 0
    
    // Tạo kim tự tháp từ đỉnh xuống đáy
    for (let row = 0; row < rows && roundIndex < totalRounds; row++) {
      const colsInRow = row + 1 // Mỗi tầng có nhiều vòng hơn tầng trên
      const startCol = Math.floor((rows - colsInRow) / 2) // Căn giữa
      
      for (let col = 0; col < colsInRow && roundIndex < totalRounds; col++) {
        layout.push({
          row,
          col: startCol + col,
          name: `Tầng ${row + 1}`
        })
        roundIndex++
      }
    }
    
    return rounds.map((round, index) => ({
      ...round,
      position: layout[index] || { row: rows - 1, col: index, name: "Thêm" }
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return CheckCircle
      case "current": return Clock
      case "pending": return AlertCircle
      case "failed": return XCircle
      default: return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-500 text-white"
      case "current": return "bg-blue-500 text-white"
      case "pending": return "bg-gray-400 text-white"
      case "failed": return "bg-red-500 text-white"
      default: return "bg-gray-400 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "passed": return "Đạt ✅"
      case "current": return "Đang chờ ⏳"
      case "pending": return "Chờ xử lý"
      case "failed": return "Không đạt ❌"
      default: return "Chưa xác định"
    }
  }

  const layoutRounds = getTriangleLayout(rounds || [])
  const maxCols = layoutRounds.length > 0 ? Math.max(...layoutRounds.map(r => r.position.col)) + 1 : 1
  const maxRows = layoutRounds.length > 0 ? Math.max(...layoutRounds.map(r => r.position.row)) + 1 : 1

  return (
    <div className="w-full">
      {/* Header với nút cấu hình */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Tiến trình phỏng vấn: {candidateName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {rounds.length} vòng phỏng vấn • {rounds.filter(r => r.status === 'passed').length} đã hoàn thành
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            >
              <Settings className="mr-2 h-4 w-4" />
              Cấu hình vòng
            </Button>
          </div>
        )}
      </div>

      {/* Cấu hình vòng phỏng vấn (Admin only) */}
      {showConfig && isAdmin && (
        <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-3">
            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 text-sm">
              Cấu hình vòng phỏng vấn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Tên vòng mới</label>
                <input
                  type="text"
                  value={newRoundName}
                  onChange={(e) => setNewRoundName(e.target.value)}
                  placeholder="VD: Technical Interview"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Người phỏng vấn</label>
                <input
                  type="text"
                  value={newInterviewer}
                  onChange={(e) => setNewInterviewer(e.target.value)}
                  placeholder="VD: John Smith"
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-2 py-1"
                  onClick={() => {
                    // Logic thêm vòng mới
                    console.log('Add new round:', { newRoundName, newInterviewer })
                    setNewRoundName("")
                    setNewInterviewer("")
                  }}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Thêm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tam giác phỏng vấn */}
      <div className="relative">
        {/* Grid container cho tam giác */}
        <div 
          className="grid gap-4 mx-auto relative"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
            gridTemplateRows: `repeat(${maxRows}, 1fr)`,
            maxWidth: `${maxCols * 200}px`
          }}
        >
          {layoutRounds.map((round, index) => {
            const StatusIcon = getStatusIcon(round.status)
            const isCurrentRound = round.status === 'current'
            const nextRound = layoutRounds[index + 1]
            const showArrow = nextRound && round.status === 'passed' && nextRound.status === 'current'
            
            return (
              <div
                key={round.id}
                className="relative"
                style={{
                  gridRow: round.position.row + 1,
                  gridColumn: round.position.col + 1
                }}
              >
                <Card 
                  className={cn(
                    "transition-all duration-300 hover:shadow-lg cursor-pointer",
                    isCurrentRound && "ring-2 ring-blue-500 shadow-lg scale-105",
                    round.status === 'passed' && "bg-green-50 dark:bg-green-900/20",
                    round.status === 'failed' && "bg-red-50 dark:bg-red-900/20",
                    round.status === 'pending' && "bg-gray-50 dark:bg-gray-800"
                  )}
                >
                  <CardContent className="p-4 text-center">
                    {/* Avatar interviewer */}
                    <div className="flex justify-center mb-3">
                      <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700">
                        <AvatarImage src={round.interviewerAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Tên vòng */}
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white line-clamp-2">
                      {round.name}
                    </h4>

                    {/* Người phỏng vấn */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-1">
                      {round.interviewer}
                    </p>

                    {/* Điểm số và trọng số */}
                    {(round as any).score && (round as any).score > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Điểm:</span>
                          <span className={`text-sm font-bold ${
                            (round as any).score >= 8 ? 'text-green-600' : 
                            (round as any).score >= 6 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {(round as any).score}/10
                          </span>
                          {(round as any).weight && (round as any).weight > 0 && (
                            <>
                              <span className="text-xs text-gray-400">|</span>
                              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                {(round as any).weight}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trạng thái */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={cn(
                        "p-2 rounded-full",
                        getStatusColor(round.status)
                      )}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs font-medium",
                          round.status === 'passed' && "bg-green-100 text-green-800",
                          round.status === 'current' && "bg-blue-100 text-blue-800",
                          round.status === 'failed' && "bg-red-100 text-red-800",
                          round.status === 'pending' && "bg-gray-100 text-gray-800"
                        )}
                      >
                        {getStatusText(round.status)}
                      </Badge>
                    </div>

                    {/* Ngày phỏng vấn */}
                    {round.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {round.date}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Mũi tên chuyển vòng */}
                {showArrow && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-green-500"></div>
                      <div className="text-xs text-green-600 font-medium mt-1">Tiếp theo</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Mũi tên chỉ hướng luồng phỏng vấn */}
        {rounds.length > 1 && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {layoutRounds.slice(0, -1).map((round, index) => {
                const nextRound = layoutRounds[index + 1]
                if (!nextRound) return null
                
                const currentX = (round.position.col + 0.5) / maxCols * 100
                const currentY = (round.position.row + 0.5) / maxRows * 100
                const nextX = (nextRound.position.col + 0.5) / maxCols * 100
                const nextY = (nextRound.position.row + 0.5) / maxRows * 100
                
                return (
                  <line
                    key={`arrow-${index}`}
                    x1={currentX}
                    y1={currentY}
                    x2={nextX}
                    y2={nextY}
                    stroke="#6366f1"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="opacity-60"
                  />
                )
              })}
              
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6366f1"
                  />
                </marker>
              </defs>
            </svg>
          </div>
        )}
      </div>

      {/* Nút điều khiển cho vòng hiện tại */}
      {rounds.some(r => r.status === 'current') && (
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            variant="outline"
            className="bg-green-600 text-white border-green-600 hover:bg-green-700"
            onClick={onPassRound}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Pass Round
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 text-white border-red-600 hover:bg-red-700"
            onClick={onFailRound}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Fail Round
          </Button>
        </div>
      )}

      {/* Thông tin tổng quan */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{rounds.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng vòng</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {rounds.filter(r => r.status === 'passed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đã hoàn thành</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {rounds.filter(r => r.status === 'current').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đang chờ</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {rounds.filter(r => r.status === 'failed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Không đạt</div>
        </div>
      </div>
    </div>
  )
}

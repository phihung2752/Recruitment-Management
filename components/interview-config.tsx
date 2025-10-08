"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InterviewRoundConfig {
  id: number
  name: string
  description: string
  duration: number // minutes
  interviewer: string
  isRequired: boolean
  order: number
}

interface InterviewConfigProps {
  onSave?: (configs: InterviewRoundConfig[]) => void
  onReset?: () => void
}

export default function InterviewConfig({ onSave, onReset }: InterviewConfigProps) {
  const [configs, setConfigs] = useState<InterviewRoundConfig[]>([
    {
      id: 1,
      name: "Pre-screening",
      description: "Sàng lọc ban đầu, đánh giá yêu cầu cơ bản (Điểm tối thiểu: 6/10, Trọng số: 15%)",
      duration: 30,
      interviewer: "Recruiter",
      isRequired: true,
      order: 1
    },
    {
      id: 2,
      name: "Sàng Lọc HR",
      description: "Kiểm tra phù hợp văn hóa và yêu cầu (Điểm tối thiểu: 7/10, Trọng số: 20%)",
      duration: 45,
      interviewer: "HR Manager",
      isRequired: true,
      order: 2
    },
    {
      id: 3,
      name: "Phỏng Vấn Điện Thoại",
      description: "Phỏng vấn sơ bộ qua điện thoại/video (Điểm tối thiểu: 6/10, Trọng số: 10%)",
      duration: 45,
      interviewer: "Recruiter",
      isRequired: true,
      order: 3
    },
    {
      id: 4,
      name: "Kiểm Tra Kỹ Thuật",
      description: "Kiểm tra kỹ năng kỹ thuật và coding (Điểm tối thiểu: 7/10, Trọng số: 25%)",
      duration: 90,
      interviewer: "Technical Lead",
      isRequired: true,
      order: 4
    },
    {
      id: 5,
      name: "Phỏng Vấn Kỹ Thuật",
      description: "Phỏng vấn kỹ thuật chi tiết (Điểm tối thiểu: 7/10, Trọng số: 20%)",
      duration: 90,
      interviewer: "Senior Developer",
      isRequired: true,
      order: 5
    },
    {
      id: 6,
      name: "Phỏng Vấn Manager",
      description: "Phỏng vấn với Team Manager (Điểm tối thiểu: 7/10, Trọng số: 10%)",
      duration: 60,
      interviewer: "Team Manager",
      isRequired: true,
      order: 6
    },
    {
      id: 7,
      name: "Kiểm Tra Lý Lịch",
      description: "Xác minh thông tin cá nhân và lý lịch",
      duration: 0,
      interviewer: "Background Check Specialist",
      isRequired: true,
      order: 7
    },
    {
      id: 8,
      name: "Kiểm Tra Tham Chiếu",
      description: "Liên hệ và xác minh tham chiếu",
      duration: 0,
      interviewer: "HR Manager",
      isRequired: true,
      order: 8
    }
  ])

  const [editingId, setEditingId] = useState<number | null>(null)
  const [newConfig, setNewConfig] = useState<Partial<InterviewRoundConfig>>({
    name: "",
    description: "",
    duration: 30,
    interviewer: "",
    isRequired: true,
    order: configs.length + 1
  })

  const addNewRound = () => {
    if (!newConfig.name || !newConfig.interviewer) return

    const config: InterviewRoundConfig = {
      id: Math.max(...configs.map(c => c.id)) + 1,
      name: newConfig.name,
      description: newConfig.description || "",
      duration: newConfig.duration || 30,
      interviewer: newConfig.interviewer,
      isRequired: newConfig.isRequired || false,
      order: newConfig.order || configs.length + 1
    }

    setConfigs([...configs, config])
    setNewConfig({
      name: "",
      description: "",
      duration: 30,
      interviewer: "",
      isRequired: true,
      order: configs.length + 2
    })
  }

  const updateConfig = (id: number, field: keyof InterviewRoundConfig, value: any) => {
    setConfigs(configs.map(config => 
      config.id === id ? { ...config, [field]: value } : config
    ))
  }

  const deleteConfig = (id: number) => {
    setConfigs(configs.filter(config => config.id !== id))
  }

  const moveUp = (id: number) => {
    const config = configs.find(c => c.id === id)
    if (!config || config.order <= 1) return

    const prevConfig = configs.find(c => c.order === config.order - 1)
    if (prevConfig) {
      setConfigs(configs.map(c => 
        c.id === id ? { ...c, order: c.order - 1 } :
        c.id === prevConfig.id ? { ...c, order: c.order + 1 } : c
      ))
    }
  }

  const moveDown = (id: number) => {
    const config = configs.find(c => c.id === id)
    if (!config) return

    const nextConfig = configs.find(c => c.order === config.order + 1)
    if (nextConfig) {
      setConfigs(configs.map(c => 
        c.id === id ? { ...c, order: c.order + 1 } :
        c.id === nextConfig.id ? { ...c, order: c.order - 1 } : c
      ))
    }
  }

  const handleSave = () => {
    onSave?.(configs.sort((a, b) => a.order - b.order))
  }

  const handleReset = () => {
    onReset?.()
  }

  const sortedConfigs = [...configs].sort((a, b) => a.order - b.order)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Cấu hình vòng phỏng vấn</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu cấu hình
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Thêm vòng mới */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Thêm vòng phỏng vấn mới
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Tên vòng *
              </label>
              <Input
                value={newConfig.name || ""}
                onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                placeholder="VD: Technical Interview"
                className="bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Người phỏng vấn *
              </label>
              <Input
                value={newConfig.interviewer || ""}
                onChange={(e) => setNewConfig({...newConfig, interviewer: e.target.value})}
                placeholder="VD: John Smith"
                className="bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Thời gian (phút)
              </label>
              <Input
                type="number"
                value={newConfig.duration || 30}
                onChange={(e) => setNewConfig({...newConfig, duration: parseInt(e.target.value) || 30})}
                className="bg-white dark:bg-gray-700"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Mô tả
              </label>
              <Input
                value={newConfig.description || ""}
                onChange={(e) => setNewConfig({...newConfig, description: e.target.value})}
                placeholder="Mô tả chi tiết về vòng phỏng vấn"
                className="bg-white dark:bg-gray-700"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newConfig.isRequired || false}
                  onChange={(e) => setNewConfig({...newConfig, isRequired: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Bắt buộc</span>
              </label>
              
              <Button
                onClick={addNewRound}
                disabled={!newConfig.name || !newConfig.interviewer}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm vòng
              </Button>
            </div>
          </div>
        </div>

        {/* Danh sách vòng phỏng vấn */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Danh sách vòng phỏng vấn ({sortedConfigs.length} vòng)
          </h4>
          
          {sortedConfigs.map((config, index) => (
            <div
              key={config.id}
              className={cn(
                "border rounded-lg p-4 transition-all",
                editingId === config.id 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                  : "border-gray-200 bg-white dark:bg-gray-800 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{config.order}
                    </span>
                    <Badge 
                      variant={config.isRequired ? "default" : "secondary"}
                      className={config.isRequired ? "bg-green-100 text-green-800" : ""}
                    >
                      {config.isRequired ? "Bắt buộc" : "Tùy chọn"}
                    </Badge>
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {config.name}
                  </h5>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(editingId === config.id ? null : config.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {editingId === config.id ? "Hủy" : "Sửa"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveUp(config.id)}
                    disabled={config.order <= 1}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ↑
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveDown(config.id)}
                    disabled={config.order >= sortedConfigs.length}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ↓
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteConfig(config.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span className="font-medium">Người phỏng vấn:</span> {config.interviewer}
                </div>
                <div>
                  <span className="font-medium">Thời gian:</span> {config.duration} phút
                </div>
                <div>
                  <span className="font-medium">Mô tả:</span> {config.description || "Không có"}
                </div>
              </div>
              
              {editingId === config.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tên vòng</label>
                      <Input
                        value={config.name}
                        onChange={(e) => updateConfig(config.id, 'name', e.target.value)}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Người phỏng vấn</label>
                      <Input
                        value={config.interviewer}
                        onChange={(e) => updateConfig(config.id, 'interviewer', e.target.value)}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Thời gian (phút)</label>
                      <Input
                        type="number"
                        value={config.duration}
                        onChange={(e) => updateConfig(config.id, 'duration', parseInt(e.target.value) || 30)}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mô tả</label>
                      <Input
                        value={config.description}
                        onChange={(e) => updateConfig(config.id, 'description', e.target.value)}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.isRequired}
                          onChange={(e) => updateConfig(config.id, 'isRequired', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Bắt buộc</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{sortedConfigs.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng vòng</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {sortedConfigs.filter(c => c.isRequired).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bắt buộc</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {sortedConfigs.reduce((sum, c) => sum + c.duration, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng phút</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(sortedConfigs.reduce((sum, c) => sum + c.duration, 0) / 60 * 10) / 10}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng giờ</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

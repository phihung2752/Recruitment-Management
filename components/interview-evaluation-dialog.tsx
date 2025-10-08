"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, FileText, CheckCircle, XCircle } from "lucide-react"

interface InterviewEvaluationDialogProps {
  isOpen: boolean
  onClose: () => void
  candidate: any
  roundId: number
  onSave: (evaluation: any) => void
}

export default function InterviewEvaluationDialog({
  isOpen,
  onClose,
  candidate,
  roundId,
  onSave
}: InterviewEvaluationDialogProps) {
  const [evaluation, setEvaluation] = useState({
    technicalSkills: 3,
    communication: 3,
    problemSolving: 3,
    culturalFit: 3,
    overallRating: 3,
    recommendation: 'maybe',
    strengths: '',
    weaknesses: '',
    notes: '',
    attachments: [] as File[]
  })

  const handleRatingChange = (category: string, rating: number) => {
    setEvaluation(prev => ({
      ...prev,
      [category]: rating,
      overallRating: Math.round((prev.technicalSkills + prev.communication + prev.problemSolving + prev.culturalFit + rating) / 5)
    }))
  }

  const handleSave = () => {
    onSave({
      ...evaluation,
      candidateId: candidate.id,
      roundId,
      evaluatedAt: new Date().toISOString()
    })
    onClose()
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Hire':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Not Hire':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Maybe':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Đánh giá phỏng vấn - {candidate?.firstName} {candidate?.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin ứng viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Họ tên</Label>
                  <p className="text-sm text-gray-600">{candidate?.firstName} {candidate?.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vị trí ứng tuyển</Label>
                  <p className="text-sm text-gray-600">{candidate?.appliedPosition || candidate?.currentPosition}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{candidate?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-gray-600">{candidate?.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Đánh giá chi tiết</h3>
            
            {[
              { key: 'technicalSkills', label: 'Kỹ năng kỹ thuật', description: 'Kiến thức chuyên môn, kinh nghiệm' },
              { key: 'communication', label: 'Kỹ năng giao tiếp', description: 'Khả năng trình bày, lắng nghe' },
              { key: 'problemSolving', label: 'Giải quyết vấn đề', description: 'Tư duy logic, sáng tạo' },
              { key: 'culturalFit', label: 'Phù hợp văn hóa', description: 'Hòa hợp với team, giá trị công ty' }
            ].map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{label}</Label>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(key, rating)}
                        className={`p-1 rounded ${
                          (evaluation[key as keyof typeof evaluation] as number) >= rating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium">
                      {(evaluation[key as keyof typeof evaluation] as number)}/5
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Overall Rating */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Đánh giá tổng thể</Label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-6 w-6 ${
                          evaluation.overallRating >= rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold">{evaluation.overallRating}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Khuyến nghị</Label>
            <div className="flex gap-2">
              {['Hire', 'Not Hire', 'Maybe'].map((rec) => (
                <Button
                  key={rec}
                  variant={evaluation.recommendation === rec ? 'default' : 'outline'}
                  onClick={() => setEvaluation(prev => ({ ...prev, recommendation: rec }))}
                  className={evaluation.recommendation === rec ? '' : 'border-gray-300'}
                >
                  {rec === 'Hire' && <CheckCircle className="h-4 w-4 mr-2" />}
                  {rec === 'Not Hire' && <XCircle className="h-4 w-4 mr-2" />}
                  {rec === 'Maybe' && <Star className="h-4 w-4 mr-2" />}
                  {rec}
                </Button>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Điểm mạnh</Label>
              <Textarea
                placeholder="Nhập điểm mạnh của ứng viên..."
                value={evaluation.strengths}
                onChange={(e) => setEvaluation(prev => ({ ...prev, strengths: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Điểm cần cải thiện</Label>
              <Textarea
                placeholder="Nhập điểm cần cải thiện..."
                value={evaluation.weaknesses}
                onChange={(e) => setEvaluation(prev => ({ ...prev, weaknesses: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ghi chú bổ sung</Label>
            <Textarea
              placeholder="Nhập ghi chú bổ sung về ứng viên..."
              value={evaluation.notes}
              onChange={(e) => setEvaluation(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">File đính kèm</Label>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setEvaluation(prev => ({ ...prev, attachments: files }))
              }}
            />
            <p className="text-xs text-gray-500">
              Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB mỗi file)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSave} className="bg-hr-primary hover:bg-hr-primary-dark text-white">
              Lưu đánh giá
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}












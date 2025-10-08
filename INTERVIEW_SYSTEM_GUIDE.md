# Hệ Thống Quản Lý Phỏng Vấn AI-Powered

## Tổng Quan

Hệ thống quản lý phỏng vấn được tích hợp AI toàn diện, cung cấp các chức năng từ lập lịch đến đánh giá và phân tích kết quả phỏng vấn.

## 🚀 Chức Năng Cốt Lõi (Must-have)

### 1. Quản Lý Lịch Phỏng Vấn
- **Tạo lịch mới**: Chọn ứng viên, người phỏng vấn, ngày giờ, hình thức (online/in-person)
- **Tích hợp meeting**: Tự động tạo link Zoom/Google Meet
- **Gửi thông báo**: Email và thông báo hệ thống tự động
- **Quản lý trạng thái**: Pending → In Progress → Completed → Result

### 2. Chi Tiết Phỏng Vấn
- **Thông tin ứng viên**: CV, hồ sơ, kỹ năng
- **Thông tin vị trí**: Job description, yêu cầu
- **Thông tin interviewer**: Người phỏng vấn, phòng ban
- **Link meeting**: Tích hợp Zoom/Google Meet cho phỏng vấn online

### 3. Đánh Giá Kết Quả
- **Form đánh giá**: Kỹ năng, thái độ, điểm số (1-10)
- **Trạng thái**: Pass / Fail / On Hold
- **Ghi chú**: Nhận xét chi tiết từ interviewer
- **AI Scoring**: Hỗ trợ chấm điểm tự động

### 4. Theo Dõi Trạng Thái
- **Workflow**: Pending → In Progress → Completed → Result
- **Cập nhật real-time**: Trạng thái được cập nhật ngay lập tức
- **Cancel/Reschedule**: Có thể hủy hoặc dời lịch phỏng vấn

## ⚡ Chức Năng Nâng Cao (Nice-to-have)

### 1. AI Hỗ Trợ Interviewer
- **Gợi ý câu hỏi**: Dựa trên JD và CV ứng viên
- **Tóm tắt CV**: AI phân tích và tóm tắt hồ sơ ứng viên
- **AI Scoring Assistant**: Gợi ý điểm số dựa trên tiêu chí
- **Real-time notes**: Ghi chú thời gian thực với phân tích AI

### 2. Phân Tích AI
- **Speech-to-Text**: Chuyển đổi âm thanh thành văn bản
- **Sentiment Analysis**: Phân tích cảm xúc và mức độ tự tin
- **Transcript & Highlight**: Tạo bản ghi và highlight điểm quan trọng
- **Pass/Fail Suggestion**: Đề xuất đánh giá dựa trên AI

### 3. Tích Hợp Calendar
- **Google Calendar**: Đồng bộ lịch cá nhân
- **Outlook Calendar**: Tích hợp với Microsoft
- **Gửi lời mời**: Tự động gửi lời mời đến interviewer và ứng viên

### 4. Phỏng Vấn Online
- **Zoom Integration**: Tích hợp trực tiếp với Zoom
- **Google Meet**: Tích hợp với Google Meet
- **MS Teams**: Hỗ trợ Microsoft Teams
- **Tự tạo meeting**: Tự động tạo link meeting

### 5. Hệ Thống Chấm Điểm
- **Tiêu chí đánh giá**: Kỹ thuật, soft-skill, văn hóa
- **Scoring matrix**: Ma trận chấm điểm chuẩn
- **Auto-calculation**: Tính điểm tự động
- **Report generation**: Xuất báo cáo đánh giá

### 6. Báo Cáo & Thống Kê
- **Tỷ lệ pass/fail**: Theo từng vòng phỏng vấn
- **Thời gian trung bình**: Hoàn tất mỗi vòng
- **Tỷ lệ cancel/no-show**: Thống kê không tham gia
- **AI Analytics**: Phân tích xu hướng và dự đoán

## 🎯 Giao Diện Người Dùng

### 1. Interview Scheduler (`/interview-scheduler`)
- **Danh sách phỏng vấn**: Grid view với filter và search
- **Tạo mới**: Multi-step form với AI hỗ trợ
- **Chi tiết**: Xem thông tin đầy đủ từng buổi phỏng vấn
- **Actions**: Join meeting, Edit, Delete, Send reminder

### 2. Interview Details (`/interview-details/[id]`)
- **Overview**: Thông tin cơ bản ứng viên và phỏng vấn
- **Feedback**: Form đánh giá với AI scoring
- **AI Analysis**: Phân tích AI và gợi ý
- **Documents**: CV, JD, Transcript

### 3. Interview Progress (Tam Giác Thông Minh)
- **Basic Triangle**: ≤4 vòng phỏng vấn
- **Pyramid Layout**: >4 vòng phỏng vấn
- **Auto-scaling**: Tự động điều chỉnh layout
- **Status tracking**: Theo dõi trạng thái real-time

### 4. AI Assistant
- **Question Generator**: Tạo câu hỏi dựa trên AI
- **CV Analyzer**: Phân tích và tóm tắt CV
- **Real-time Scoring**: Chấm điểm thời gian thực
- **Notes & Summary**: Ghi chú và tóm tắt AI

### 5. Analytics Dashboard
- **Overview Metrics**: Tổng quan số liệu
- **Trends**: Xu hướng theo thời gian
- **Top Performers**: Interviewer và ứng viên xuất sắc
- **AI Insights**: Khuyến nghị và cảnh báo từ AI

## 🔧 Công Nghệ Sử Dụng

### Frontend
- **Next.js 14**: React framework với App Router
- **TypeScript**: Type safety và developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Component library hiện đại
- **Lucide React**: Icon library

### Backend
- **.NET 8 Web API**: RESTful API
- **Entity Framework**: ORM cho database
- **SQL Server**: Database chính
- **SignalR**: Real-time communication

### AI & Integration
- **Google AI API**: AI analysis và generation
- **OpenAI API**: Advanced AI capabilities
- **Calendar APIs**: Google Calendar, Outlook
- **Video APIs**: Zoom, Google Meet, Teams

## 📊 Cấu Trúc Dữ Liệu

### Interview Entity
```typescript
interface Interview {
  id: string
  candidateId: string
  interviewerId: string
  jobPositionId: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  type: 'online' | 'in-person'
  location?: string
  meetingLink?: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  result?: 'pass' | 'fail' | 'on-hold'
  notes?: string
  feedback?: InterviewFeedback
  aiAnalysis?: AIAnalysis
}
```

### Interview Feedback
```typescript
interface InterviewFeedback {
  technicalSkills: number
  communication: number
  problemSolving: number
  culturalFit: number
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string
  interviewerNotes: string
  aiAnalysis?: AIAnalysis
}
```

### AI Analysis
```typescript
interface AIAnalysis {
  sentimentScore: number
  confidenceLevel: number
  keyPoints: string[]
  suggestedQuestions: string[]
  passFailSuggestion: 'pass' | 'fail' | 'on-hold'
  reasoning: string
}
```

## 🚀 Hướng Dẫn Sử Dụng

### 1. Tạo Lịch Phỏng Vấn
1. Truy cập `/interview-scheduler`
2. Click "Schedule Interview"
3. Chọn ứng viên, interviewer, vị trí
4. Chọn ngày giờ và hình thức
5. AI sẽ gợi ý câu hỏi phù hợp
6. Xác nhận và gửi thông báo

### 2. Tiến Hành Phỏng Vấn
1. Vào chi tiết phỏng vấn
2. Click "Join Meeting" (nếu online)
3. Sử dụng AI Assistant để:
   - Xem câu hỏi gợi ý
   - Ghi chú real-time
   - Chấm điểm tự động
4. Hoàn tất và đánh giá kết quả

### 3. Đánh Giá Kết Quả
1. Vào tab "Feedback"
2. Điền điểm số các tiêu chí
3. AI sẽ gợi ý điểm số dựa trên ghi chú
4. Nhập nhận xét và khuyến nghị
5. Lưu và gửi kết quả

### 4. Xem Báo Cáo
1. Vào tab "Analytics"
2. Xem tổng quan metrics
3. Phân tích xu hướng
4. Xem AI insights và khuyến nghị

## 🔮 Roadmap Tương Lai

### Phase 1 (Hiện tại)
- ✅ Interview Scheduler cơ bản
- ✅ Interview Details & Feedback
- ✅ AI Assistant cơ bản
- ✅ Analytics Dashboard

### Phase 2 (Sắp tới)
- 🔄 Calendar Integration (Google/Outlook)
- 🔄 Video Interview Integration (Zoom/Meet)
- 🔄 Advanced AI Analysis
- 🔄 Mobile App

### Phase 3 (Tương lai)
- ⏳ Predictive Hiring
- ⏳ Advanced Analytics
- ⏳ Multi-language Support
- ⏳ Enterprise Features

## 📞 Hỗ Trợ

- **Documentation**: `/docs/interview-system`
- **API Reference**: `/api/docs`
- **Troubleshooting**: `/support/interview`
- **Feature Requests**: `/feedback/interview`

---

**Phiên bản**: 1.0.0  
**Cập nhật cuối**: 2025-09-29  
**Tác giả**: HR Management System Team






# HR Management System - Hệ thống Quản lý Nhân sự

Hệ thống HR Management hoàn chỉnh với .NET 8 Web API Backend, Next.js Frontend, và tích hợp AI thông minh.

## 🚀 CÁCH CHẠY NHANH NHẤT (Dành cho sinh viên)

### Bước 1: Download và giải nén
1. Click nút **3 chấm** ở góc phải v0
2. Chọn **Download ZIP**
3. Giải nén folder

### Bước 2: Chạy hệ thống
**Windows**: Double-click file `start-all.bat`
**Mac/Linux**: Chạy lệnh `chmod +x start-all.sh && ./start-all.sh`

### Bước 3: Cấu hình AI (Tùy chọn)
**Để sử dụng tính năng AI**: Double-click file `setup-ai.bat` và làm theo hướng dẫn

### Bước 4: Truy cập hệ thống
- **Frontend**: http://localhost:3000
- **Backend API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001/swagger

### Bước 5: Đăng nhập
- **Email**: admin@gmail.com
- **Password**: 123456

## ✅ Tính năng đã hoàn thành

### 🔐 Authentication & Authorization
- ✅ JWT Token authentication với protected routes
- ✅ Google OAuth 2.0 integration
- ✅ Role-based access control (Admin, HR Manager, Employee)
- ✅ Secure password hashing
- ✅ Token refresh mechanism
- ✅ **MỚI**: Authentication wrapper - chỉ hiển thị sidebar khi đã đăng nhập

### 🤖 AI Integration (Google Gemini)
- ✅ **MỚI**: CV Analysis với AI - phân tích kỹ năng, kinh nghiệm, điểm mạnh/yếu
- ✅ **MỚI**: Candidate Matching - tự động match ứng viên với job (match score %)
- ✅ **MỚI**: Interview Questions Generator - tạo câu hỏi phỏng vấn thông minh
- ✅ **MỚI**: Recruitment Report - báo cáo tuyển dụng tự động
- ✅ **MỚI**: Interview Evaluation - đánh giá phỏng vấn bằng AI

### 🎯 Interview Management
- ✅ Schedule interviews
- ✅ Interview status tracking
- ✅ **MỚI**: Triangle/Pyramid Visualization - hiển thị vòng phỏng vấn theo hình tam giác
- ✅ **MỚI**: Multi-round interview support (tự động chuyển kim tự tháp khi >4 vòng)
- ✅ **MỚI**: Interviewer avatars và status colors
- ✅ Candidate management
- ✅ Email notifications

### 📊 Dashboard & Analytics (Hoàn toàn mới)
- ✅ **MỚI**: Dashboard ấn tượng với gradient cards và animations
- ✅ **MỚI**: Recruitment Funnel Chart (Recharts)
- ✅ **MỚI**: Hiring Trends với line chart
- ✅ **MỚI**: Department Distribution pie chart
- ✅ **MỚI**: Real-time Activity Feed
- ✅ **MỚI**: Quick Stats với performance metrics
- ✅ **MỚI**: Responsive design với Tailwind CSS

### 📄 CV Management
- ✅ **MỚI**: CV upload và storage
- ✅ **MỚI**: AI-powered CV analysis
- ✅ **MỚI**: Skills extraction và matching
- ✅ **MỚI**: Job recommendation engine
- ✅ **MỚI**: Match score visualization

### 👥 User & Candidate Management
- ✅ CRUD operations cho users và candidates
- ✅ **MỚI**: Advanced candidate profiles
- ✅ **MỚI**: Skills và experience tracking
- ✅ Role management
- ✅ Department assignment
- ✅ Status tracking (Active/Inactive)

### 📧 Email & Gmail Integration
- ✅ Gmail API integration
- ✅ SMTP email service
- ✅ Email templates (Interview invitation, Welcome, etc.)
- ✅ OAuth token management
- ✅ Automatic email notifications

### 🗄️ Database Support
- ✅ SQLite (default - không cần cài gì)
- ✅ MySQL support
- ✅ SQL Server support
- ✅ InMemory database (testing)
- ✅ Auto migrations
- ✅ **MỚI**: Seed data với sample candidates và jobs

## 🛠️ Công nghệ sử dụng

### Backend (.NET 8)
- ASP.NET Core 8.0 Web API
- Entity Framework Core
- **MỚI**: Google Gemini AI integration
- JWT Authentication
- Google OAuth 2.0
- Gmail API
- AutoMapper
- Swagger/OpenAPI

### Frontend (Next.js)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- **MỚI**: Recharts cho data visualization
- **MỚI**: Framer Motion cho animations
- Axios HTTP client
- **MỚI**: Protected routes với AuthWrapper
- Responsive design

### AI & Analytics
- **MỚI**: Google Gemini Pro API
- **MỚI**: CV parsing và analysis
- **MỚI**: Machine learning-based matching
- **MỚI**: Natural language processing

## 📋 Yêu cầu hệ thống

### Tối thiểu
- .NET 8.0 SDK
- Node.js 18+
- Web browser hiện đại

### Cho AI features (tùy chọn)
- Google Gemini API key (miễn phí tại https://makersuite.google.com/app/apikey)

### Tùy chọn (nếu dùng MySQL)
- MySQL 8.0+
- MySQL Workbench

## 🔧 Cấu hình nâng cao

### Cấu hình Google Gemini AI
1. Truy cập https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Sửa file `backend/appsettings.json`:
\`\`\`json
{
  "GoogleAI": {
    "ApiKey": "your-gemini-api-key-here"
  }
}
\`\`\`

### Chuyển sang MySQL
Sửa file `appsettings.json`:
\`\`\`json
{
  "DatabaseProvider": "MySQL",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HRManagementDB;User=root;Password=yourpassword;Port=3306;"
  }
}
\`\`\`

### Cấu hình Google OAuth (tùy chọn)
1. Tạo project tại [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Gmail API
3. Tạo OAuth 2.0 credentials
4. Cập nhật `appsettings.json`:
\`\`\`json
{
  "GoogleSettings": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret"
  }
}
\`\`\`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Đăng xuất

### AI Services (MỚI)
- `POST /api/ai/analyze-cv` - Phân tích CV bằng AI
- `POST /api/ai/match-candidates` - Match ứng viên với job
- `POST /api/ai/interview-questions` - Tạo câu hỏi phỏng vấn
- `POST /api/ai/report` - Tạo báo cáo tuyển dụng
- `POST /api/ai/evaluate-interview` - Đánh giá phỏng vấn

### Candidates (MỚI)
- `GET /api/candidates` - Danh sách candidates
- `GET /api/candidates/{id}` - Chi tiết candidate
- `POST /api/candidates` - Tạo candidate mới
- `PUT /api/candidates/{id}` - Cập nhật candidate
- `DELETE /api/candidates/{id}` - Xóa candidate

### Jobs (MỚI)
- `GET /api/jobs` - Danh sách jobs
- `GET /api/jobs/{id}` - Chi tiết job
- `POST /api/jobs` - Tạo job mới
- `PUT /api/jobs/{id}` - Cập nhật job
- `DELETE /api/jobs/{id}` - Xóa job

### Users
- `GET /api/users` - Danh sách users
- `GET /api/users/{id}` - Chi tiết user
- `POST /api/users` - Tạo user mới
- `PUT /api/users/{id}` - Cập nhật user
- `DELETE /api/users/{id}` - Xóa user

### Interviews
- `GET /api/interviews` - Danh sách interviews
- `POST /api/interviews` - Tạo interview mới
- `PUT /api/interviews/{id}` - Cập nhật interview
- `DELETE /api/interviews/{id}` - Xóa interview

## 🎨 UI/UX Features

### Design System
- **MỚI**: Modern gradient design với blue-purple theme
- **MỚI**: Consistent typography với Inter font
- **MỚI**: Responsive grid layouts
- **MỚI**: Smooth animations và transitions
- **MỚI**: Dark mode ready components

### Interactive Elements
- **MỚI**: Triangle visualization cho interview rounds
- **MỚI**: Interactive charts với hover effects
- **MỚI**: Real-time data updates
- **MỚI**: Loading states và error handling
- **MỚI**: Toast notifications

## 🔍 Troubleshooting

### Lỗi thường gặp

#### AI features không hoạt động
\`\`\`bash
# Kiểm tra API key
grep "YOUR_GEMINI_API_KEY_HERE" backend/appsettings.json

# Nếu thấy text trên, cần cấu hình API key
# Chạy setup-ai.bat để được hướng dẫn
\`\`\`

#### Backend không chạy được
\`\`\`bash
# Kiểm tra .NET SDK
dotnet --version

# Restore packages
dotnet restore

# Chạy lại
dotnet run
\`\`\`

#### Frontend không chạy được
\`\`\`bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install

# Chạy lại
npm run dev
\`\`\`

#### Database lỗi
- Mặc định dùng SQLite (file `hrmanagement.db`)
- Xóa file database để reset: `rm hrmanagement.db`
- Chạy lại backend để tạo database mới với seed data

#### CORS Error
- Đảm bảo frontend chạy ở port 3000
- Đảm bảo backend chạy ở port 7001
- Kiểm tra CORS settings trong `Program.cs`

## 📁 Cấu trúc dự án

\`\`\`
hr-management-system/
├── backend/
│   ├── Controllers/         # API Controllers (Auth, Users, AI, Candidates, Jobs)
│   ├── Data/               # Database Context
│   ├── DTOs/               # Data Transfer Objects
│   ├── Models/             # Entity Models
│   ├── Services/           # Business Logic (AI, Email, etc.)
│   └── Program.cs          # Application startup
├── frontend/
│   ├── app/                # Next.js App Router
│   │   ├── dashboard/      # Dashboard với charts
│   │   ├── cv-management/  # CV analysis page
│   │   ├── interviews/     # Interview triangle visualization
│   │   └── login/          # Authentication
│   ├── components/         # React Components
│   │   ├── charts/         # Recharts components
│   │   ├── dashboard/      # Dashboard components
│   │   └── auth-wrapper.tsx # Authentication wrapper
│   └── lib/                # Utilities và API client
├── start-all.bat          # Windows startup script
├── setup-ai.bat           # AI configuration script
└── README.md              # Documentation
\`\`\`

## 🎓 Dành cho sinh viên

### Điểm mạnh của dự án
- ✅ **AI Integration**: Sử dụng Google Gemini cho CV analysis và candidate matching
- ✅ **Modern Tech Stack**: .NET 8, Next.js 14, TypeScript, Tailwind CSS
- ✅ **Advanced UI**: Triangle visualization, interactive charts, animations
- ✅ **Security**: JWT authentication, protected routes, role-based access
- ✅ **Architecture**: Clean architecture với Repository pattern, Services
- ✅ **Database**: Multi-provider support với Entity Framework Core
- ✅ **API Design**: RESTful APIs với Swagger documentation
- ✅ **Real-time Features**: Live dashboard, activity feeds

### Có thể mở rộng
- Thêm AI chatbot cho HR support
- Video interview integration
- Mobile app với React Native
- Advanced analytics với machine learning
- Integration với LinkedIn, Indeed
- Payroll và Leave Management modules
- Real-time notifications với SignalR
- Multi-tenant architecture

### Học được gì
- **Backend**: .NET 8 Web API, Entity Framework, JWT, OAuth
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **AI**: Google Gemini integration, NLP, ML-based matching
- **Database**: Design, migrations, seeding, multi-provider
- **Architecture**: Clean code, SOLID principles, design patterns
- **DevOps**: Configuration management, environment setup
- **UI/UX**: Modern design, responsive layouts, data visualization

### Tính năng nổi bật cho demo
1. **AI CV Analysis**: Upload CV và xem AI phân tích skills, experience
2. **Triangle Interview Visualization**: Unique UI cho interview rounds
3. **Interactive Dashboard**: Charts và metrics với real-time data
4. **Smart Candidate Matching**: AI tự động match ứng viên với job
5. **Protected Authentication**: Secure login flow với JWT

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. **AI không hoạt động**: Chạy `setup-ai.bat` để cấu hình API key
2. **Database lỗi**: Xóa file `hrmanagement.db` và restart backend
3. **CORS error**: Kiểm tra ports 3000 (frontend) và 7001 (backend)
4. **Build lỗi**: Chạy `dotnet restore` và `npm install`
5. **Authentication lỗi**: Clear browser cookies và login lại

---

**Hệ thống HR Management với AI - Sẵn sàng cho tương lai! 🚀🤖**

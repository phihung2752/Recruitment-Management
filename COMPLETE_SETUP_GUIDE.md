# 🚀 HR Management System - Complete Setup Guide

## 📋 Tổng quan dự án

Hệ thống HR Management hoàn chỉnh bao gồm:
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: .NET 8 + ASP.NET Core + SQL Server
- **Database**: SQL Server với dữ liệu mẫu
- **Gmail Integration**: Console App để gửi email
- **Design System**: Bảng màu chuyên nghiệp với chế độ sáng/tối

## 🎨 Bảng màu chuyên nghiệp

### Màu chủ đạo
- **Primary**: Professional Blue (#3b82f6)
- **Background**: Pure White / Dark Slate
- **Text**: Dark Slate / Light
- **Accent**: Success Green (#22c55e)
- **Status**: Success, Warning, Danger, Info

### Tính năng
- ✅ Chế độ sáng/tối tự động
- ✅ Độ tương phản cao, dễ đọc
- ✅ Phù hợp UI/UX hiện đại
- ✅ Responsive design
- ✅ Accessibility friendly

## 📧 Gmail Console App

### Chức năng
- Gửi email qua Gmail API
- OAuth2 authentication
- Hỗ trợ tiếng Việt
- Lưu trữ token tự động
- Error handling đầy đủ

### Cài đặt nhanh
```bash
cd GmailConsoleApp
dotnet restore
# Tạo file credentials.json
dotnet run
```

## 🗄️ Database Schema

### Bảng chính
- **Users**: Quản lý người dùng
- **Companies**: Thông tin công ty
- **Departments**: Phòng ban
- **Positions**: Vị trí công việc
- **JobPostings**: Tin tuyển dụng
- **Candidates**: Ứng viên
- **Interviews**: Phỏng vấn
- **Employees**: Nhân viên

### Dữ liệu mẫu
- 3 công ty mẫu
- 5 phòng ban
- 10 vị trí công việc
- 6 tin tuyển dụng
- 5 ứng viên
- Dữ liệu đầy đủ cho testing

## 🚀 Khởi chạy hệ thống

### 1. Backend (.NET)
```bash
cd /root/projects/frontend/hr-management-system\ \(3\)
dotnet run --project HRManagementSystem.csproj --urls="http://localhost:5000"
```

### 2. Frontend (Next.js)
```bash
cd /root/projects/frontend/hr-management-system\ \(3\)
npm run dev
```

### 3. Database (SQL Server)
```bash
# Import schema
sqlcmd -S localhost -d HRManagementDB -U SA -P "Hung@2752025" -i database/fixed-complete-schema.sql

# Import sample data
sqlcmd -S localhost -d HRManagementDB -U SA -P "Hung@2752025" -i database/working-company-and-jobs.sql
```

### 4. Gmail Console App
```bash
cd GmailConsoleApp
./run-gmail-app.sh  # Linux/Mac
# hoặc
run-gmail-app.bat   # Windows
```

## 🔧 Cấu hình

### Backend (.NET)
- **Port**: 5000
- **Database**: SQL Server
- **Connection String**: Trong appsettings.json
- **CORS**: Cho phép localhost:3000

### Frontend (Next.js)
- **Port**: 3000
- **API Base URL**: http://localhost:5000
- **Theme**: Light/Dark mode
- **Language**: Vietnamese/English

### Database (SQL Server)
- **Server**: localhost
- **Database**: HRManagementDB
- **Authentication**: SQL Server Authentication
- **User**: SA
- **Password**: Hung@2752025

## 📱 Tính năng chính

### Dashboard
- Thống kê tổng quan
- Biểu đồ trực quan
- Thao tác nhanh
- Xuất báo cáo Excel

### Quản lý Job Postings
- ✅ CRUD hoàn chỉnh
- ✅ Tìm kiếm và lọc
- ✅ Phân trang
- ✅ Kết nối database thật

### Quản lý Ứng viên
- Danh sách ứng viên
- Thông tin chi tiết
- Trạng thái ứng tuyển

### Quản lý Phỏng vấn
- Lịch phỏng vấn
- AI Analysis
- Smart Scheduling
- Gmail integration

### Quản lý Nhân viên
- Danh sách nhân viên
- Thông tin cá nhân
- Phòng ban và vị trí

## 🎯 API Endpoints

### Job Postings
- `GET /api/job-postings` - Lấy danh sách
- `POST /api/job-postings` - Tạo mới
- `PUT /api/job-postings/{id}` - Cập nhật
- `DELETE /api/job-postings/{id}` - Xóa

### Admin
- `GET /api/admin/stats` - Thống kê dashboard
- `GET /api/admin/employees` - Danh sách nhân viên
- `GET /api/admin/candidates` - Danh sách ứng viên

### Reports
- `GET /api/reports/dashboard-excel` - Xuất Excel

### Email
- `POST /api/email/send-invitation` - Gửi thư mời
- `POST /api/email/send-result` - Gửi kết quả

## 🔐 Bảo mật

### Authentication
- Google OAuth (Gmail)
- JWT tokens
- Session management

### Data Protection
- SQL injection prevention
- XSS protection
- CSRF protection
- Input validation

## 📊 Monitoring & Logging

### Backend Logs
- Request/Response logging
- Error tracking
- Performance metrics

### Frontend Logs
- Console logging
- Error boundaries
- User interaction tracking

## 🚀 Deployment

### Development
- Local development setup
- Hot reload
- Debug mode

### Production
- Docker containers
- Environment variables
- SSL certificates
- Load balancing

## 📚 Documentation

### Code Documentation
- Inline comments
- API documentation
- README files
- Setup guides

### User Documentation
- User manual
- Admin guide
- Troubleshooting

## 🎨 Design System

### Color Palette
- Professional blue theme
- High contrast ratios
- Accessibility compliant
- Dark/light mode support

### Components
- Reusable UI components
- Consistent styling
- Responsive design
- Modern aesthetics

## 🔄 Version Control

### Git Workflow
- Feature branches
- Pull requests
- Code reviews
- Automated testing

### Backup Strategy
- Database backups
- Code repository
- Configuration files
- Documentation

## 📞 Support

### Troubleshooting
- Common issues
- Error messages
- Solutions
- Best practices

### Contact
- Developer: AI Assistant
- Email: nguyenphihung275202@gmail.com
- Project: HR Management System

---

## 🎉 Kết luận

Hệ thống HR Management đã được phát triển hoàn chỉnh với:
- ✅ Frontend hiện đại (Next.js)
- ✅ Backend mạnh mẽ (.NET 8)
- ✅ Database đầy đủ (SQL Server)
- ✅ Gmail integration
- ✅ Design system chuyên nghiệp
- ✅ CRUD operations hoàn chỉnh
- ✅ Real-time data
- ✅ Excel export
- ✅ Dark/Light theme
- ✅ Responsive design

**Hệ thống sẵn sàng sử dụng cho môi trường production!** 🚀


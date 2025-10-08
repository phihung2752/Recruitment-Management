# HR Management System với RBAC

Hệ thống quản lý nhân sự chuyên nghiệp với Role-Based Access Control (RBAC) được xây dựng bằng .NET 8, React/Next.js và SQL Server.

## 🏗️ Kiến trúc hệ thống

### Backend (.NET 8)
- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server
- **Authentication**: JWT Bearer Token
- **ORM**: Entity Framework Core
- **Password Hashing**: BCrypt.Net

### Frontend (React/Next.js)
- **Framework**: Next.js 14
- **UI Library**: Custom components với Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Database (SQL Server)
- **Database**: HRManagementSystem
- **Tables**: Users, Roles, Permissions, RolePermissions, Employees, Candidates, Interviews, JobPostings, AuditLogs

## 🚀 Tính năng chính

### 1. Authentication & Authorization
- ✅ Đăng nhập với JWT token
- ✅ Phân quyền dựa trên vai trò (RBAC)
- ✅ Middleware kiểm tra quyền truy cập
- ✅ Auto redirect sau đăng nhập

### 2. User Management
- ✅ Quản lý người dùng (CRUD)
- ✅ Phân quyền chi tiết
- ✅ Quản lý vai trò
- ✅ Audit logging

### 3. Role-Based Access Control
- **Admin**: Toàn quyền hệ thống
- **HR**: Quản lý nhân sự và tuyển dụng
- **Manager**: Xem báo cáo và quản lý phỏng vấn
- **Employee**: Xem thông tin cá nhân
- **Interviewer**: Quản lý phỏng vấn

## 📋 Cài đặt và chạy

### 1. Database Setup

```sql
-- Tạo database
CREATE DATABASE HRManagementSystem;

-- Chạy script database-schema.sql để tạo tables và seed data
```

### 2. Backend Setup

```bash
cd backend/HRManagement.API

# Restore packages
dotnet restore

# Update connection string trong appsettings.json
# "DefaultConnection": "Server=localhost;Database=HRManagementSystem;Trusted_Connection=true;TrustServerCertificate=true;"

# Run migrations
dotnet ef database update

# Run application
dotnet run
```

Backend sẽ chạy tại: `https://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update API URL trong next.config.js nếu cần
# API_BASE_URL: 'https://localhost:5001'

# Run development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔐 Tài khoản demo

- **Username**: admin
- **Password**: Admin123!
- **Role**: Admin (toàn quyền)

## 📁 Cấu trúc project

```
HR-Management-System/
├── backend/
│   └── HRManagement.API/
│       ├── Controllers/          # API Controllers
│       ├── Services/            # Business Logic
│       ├── Models/              # Data Models
│       ├── Data/                # Database Context
│       ├── Middleware/          # Custom Middleware
│       └── Program.cs           # Application Entry Point
├── frontend/
│   └── src/
│       ├── components/          # React Components
│       ├── contexts/            # React Contexts
│       ├── pages/               # Next.js Pages
│       ├── lib/                 # Utilities
│       └── styles/              # CSS Styles
├── database-schema.sql          # Database Schema
└── README.md                    # Documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký (Admin only)
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/permissions` - Lấy danh sách quyền
- `POST /api/auth/check-permission` - Kiểm tra quyền

### User Management
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/{id}` - Lấy thông tin user
- `POST /api/users` - Tạo user mới
- `PUT /api/users/{id}` - Cập nhật user
- `DELETE /api/users/{id}` - Xóa user
- `POST /api/users/{id}/activate` - Kích hoạt user
- `POST /api/users/{id}/deactivate` - Vô hiệu hóa user

## 🎨 Frontend Components

### Pages
- `/login` - Trang đăng nhập
- `/dashboard` - Dashboard chính
- `/users` - Quản lý người dùng
- `/employees` - Quản lý nhân viên
- `/candidates` - Quản lý ứng viên
- `/interviews` - Quản lý phỏng vấn

### Components
- `ProtectedRoute` - Bảo vệ routes
- `AuthContext` - Quản lý authentication
- UI Components: Button, Input, Card, Badge, Alert

## 🔒 Bảo mật

### Backend Security
- JWT token authentication
- Password hashing với BCrypt
- Role-based authorization
- Audit logging
- CORS configuration
- Input validation

### Frontend Security
- Protected routes
- Permission-based UI rendering
- Token storage trong cookies
- Auto logout khi token hết hạn

## 📊 Database Schema

### Core Tables
- **Users**: Thông tin người dùng
- **Roles**: Vai trò trong hệ thống
- **Permissions**: Quyền hạn chi tiết
- **RolePermissions**: Liên kết vai trò và quyền

### Business Tables
- **Employees**: Thông tin nhân viên
- **Candidates**: Thông tin ứng viên
- **Interviews**: Lịch phỏng vấn
- **JobPostings**: Tin tuyển dụng
- **AuditLogs**: Log hoạt động

## 🚀 Deployment

### Backend Deployment
1. Publish application: `dotnet publish -c Release`
2. Deploy to IIS hoặc Azure App Service
3. Cấu hình connection string
4. Cấu hình JWT settings

### Frontend Deployment
1. Build application: `npm run build`
2. Deploy to Vercel, Netlify hoặc Azure Static Web Apps
3. Cấu hình API URL

## 📝 Development Notes

### Backend
- Sử dụng Entity Framework Core cho ORM
- Repository pattern cho data access
- Service layer cho business logic
- Middleware cho authentication/authorization
- Swagger cho API documentation

### Frontend
- Next.js App Router
- TypeScript cho type safety
- Tailwind CSS cho styling
- Context API cho state management
- Custom hooks cho logic reuse

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Support

Nếu có vấn đề gì, vui lòng tạo issue trên GitHub repository.

---

**Lưu ý**: Đây là hệ thống demo, trong production cần thêm các biện pháp bảo mật và tối ưu hóa khác.
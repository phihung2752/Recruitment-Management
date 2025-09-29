# Hướng dẫn Import Database HR Management System

## Tổng quan
Hệ thống HR Management sử dụng SQL Server với chuỗi kết nối:
```
Server=localhost\\SONTIEN;Database=HRManagementDB_New;Trusted_Connection=True;TrustServerCertificate=True;
```

## Các file database

### 1. File Schema (Cấu trúc bảng)
- `fixed-complete-schema.sql` - Schema hoàn chỉnh đã sửa lỗi (KHUYẾN NGHỊ)
- `complete-schema.sql` - Schema gốc có lỗi cú pháp
- `schema.sql` - Schema đơn giản hơn
- `init.sql` - Schema cho MySQL (không dùng cho SQL Server)

### 2. File Dữ liệu mẫu
- `fixed-vietnamese-sample-data.sql` - Dữ liệu mẫu tiếng Việt đã sửa lỗi (KHUYẾN NGHỊ)
- `vietnamese-sample-data.sql` - Dữ liệu mẫu gốc có lỗi

## Cách Import vào SQL Server

### Bước 1: Tạo Database
```sql
-- Kết nối đến SQL Server instance SONTIEN
-- Tạo database mới
CREATE DATABASE HRManagementDB_New;
GO

-- Sử dụng database mới
USE HRManagementDB_New;
GO
```

### Bước 2: Import Schema
```sql
-- Chạy file schema đã sửa lỗi
-- Mở file: database/fixed-complete-schema.sql
-- Copy toàn bộ nội dung và chạy trong SQL Server Management Studio
```

### Bước 3: Import Dữ liệu mẫu
```sql
-- Chạy file dữ liệu mẫu đã sửa lỗi
-- Mở file: database/fixed-vietnamese-sample-data.sql
-- Copy toàn bộ nội dung và chạy trong SQL Server Management Studio
```

### Bước 4: Kiểm tra kết quả
```sql
-- Kiểm tra các bảng đã được tạo
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Kiểm tra dữ liệu mẫu
SELECT COUNT(*) as UserCount FROM Users;
SELECT COUNT(*) as CompanyCount FROM Companies;
SELECT COUNT(*) as DepartmentCount FROM Departments;
SELECT COUNT(*) as EmployeeCount FROM Employees;
SELECT COUNT(*) as CandidateCount FROM Candidates;
```

## Cấu hình Authentication

### Google OAuth Configuration
```json
{
  "web": {
    "client_id": "67877337396-bo86qgkhlp5krp7s4o7a2jek8liopp46.apps.googleusercontent.com",
    "project_id": "hrsst-473118",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "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",
    "redirect_uris": [
      "https://localhost:7001/signin-google",
      "http://localhost:3000"
    ],
    "javascript_origins": [
      "http://localhost:3000"
    ]
  }
}
```

## Troubleshooting

### Lỗi thường gặp:

1. **"Incorrect syntax near 'DECIMAL'"**
   - Nguyên nhân: File `complete-schema.sql` có lỗi cú pháp
   - Giải pháp: Sử dụng file `fixed-complete-schema.sql`

2. **"There is already an object named 'Users'"**
   - Nguyên nhân: Bảng đã tồn tại
   - Giải pháp: Xóa database cũ và tạo mới, hoặc sử dụng `DROP TABLE` trước khi tạo

3. **"Invalid column name 'CompanyId'"**
   - Nguyên nhân: Dữ liệu mẫu không khớp với schema
   - Giải pháp: Sử dụng file `fixed-vietnamese-sample-data.sql`

4. **"Trusted_Connection=True" không hoạt động**
   - Nguyên nhân: Windows Authentication không được cấu hình
   - Giải pháp: Sử dụng SQL Server Authentication hoặc cấu hình Windows Auth

### Cấu hình Connection String khác:

#### SQL Server Authentication:
```
Server=localhost\\SONTIEN;Database=HRManagementDB_New;User Id=sa;Password=your_password;TrustServerCertificate=True;
```

#### Windows Authentication (nếu có vấn đề):
```
Server=localhost\\SONTIEN;Database=HRManagementDB_New;Integrated Security=true;TrustServerCertificate=True;
```

## Cấu trúc Database chính

### Bảng Core:
- `Users` - Người dùng hệ thống
- `Roles` - Vai trò
- `Permissions` - Quyền hạn
- `Companies` - Công ty
- `Departments` - Phòng ban
- `Positions` - Vị trí công việc
- `Employees` - Nhân viên

### Bảng Recruitment:
- `JobPostings` - Tin tuyển dụng
- `Candidates` - Ứng viên
- `JobApplications` - Đơn ứng tuyển
- `Interviews` - Phỏng vấn
- `InterviewFeedback` - Đánh giá phỏng vấn

### Bảng System:
- `SystemSettings` - Cài đặt hệ thống
- `AuditLogs` - Nhật ký hoạt động
- `Notifications` - Thông báo
- `CalendarEvents` - Sự kiện lịch

## Dữ liệu mẫu bao gồm:

- 1 công ty: Công ty TNHH Công nghệ ABC
- 5 phòng ban: HR, IT, Marketing, Sales, Design
- 8 vị trí công việc
- 5 người dùng hệ thống
- 5 nhân viên
- 5 tin tuyển dụng
- 5 ứng viên
- Cài đặt hệ thống cơ bản

## Lưu ý quan trọng:

1. **Backup trước khi import** nếu database đã có dữ liệu quan trọng
2. **Kiểm tra quyền truy cập** SQL Server instance
3. **Cấu hình firewall** nếu kết nối từ xa
4. **Test connection** trước khi chạy ứng dụng
5. **Kiểm tra log** nếu có lỗi trong quá trình import

## Chạy ứng dụng:

Sau khi import database thành công, bạn có thể chạy ứng dụng với:

```bash
# Backend (API)
dotnet run

# Frontend (React/Next.js)
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ chạy trên:
- Backend: https://localhost:7001
- Frontend: http://localhost:3000

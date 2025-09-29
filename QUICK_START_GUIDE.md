# Hướng dẫn sử dụng nhanh HR Management System

## 🎯 Tổng quan
Hệ thống quản lý nhân sự và tuyển dụng hoàn chỉnh với dashboard admin tiện lợi, sử dụng SQL Server và dữ liệu thật.

## 🚀 Bước 1: Cài đặt SQL Server

### Windows:
1. Tải SQL Server 2022 Developer Edition: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Cài đặt với cấu hình mặc định
3. Cài đặt SQL Server Management Studio (SSMS)

### Linux (Ubuntu/Debian):
```bash
# Cài đặt SQL Server
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2022.list)"
sudo apt-get update
sudo apt-get install -y mssql-server

# Cấu hình SQL Server
sudo /opt/mssql/bin/mssql-conf setup

# Cài đặt command line tools
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt-get update
sudo apt-get install mssql-tools unixodbc-dev
```

## 🗄️ Bước 2: Tạo Database và Import dữ liệu

### Cách 1: Sử dụng script tự động (Khuyến nghị)
```bash
# Windows PowerShell (chạy as Administrator)
cd database
.\import-to-sqlserver.ps1

# Linux
cd database
chmod +x import-to-sqlserver.sh
./import-to-sqlserver.sh
```

### Cách 2: Thủ công
1. Mở SQL Server Management Studio
2. Tạo database mới: `HRManagementDB_New`
3. Chạy file `database/fixed-complete-schema.sql`
4. Chạy file `database/fixed-vietnamese-sample-data.sql`

## ⚙️ Bước 3: Cấu hình Backend

1. Cập nhật connection string trong `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "SqlServerConnection": "Server=localhost\\SONTIEN;Database=HRManagementDB_New;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "DatabaseProvider": "SqlServer"
}
```

2. Chạy backend:
```bash
dotnet run --urls="https://localhost:7001;http://localhost:5000"
```

## 🎨 Bước 4: Chạy Frontend

```bash
npm run dev
```

Truy cập: http://localhost:3000/dashboard

## 📊 Dashboard Admin - Các chức năng chính

### 1. Quản lý Hệ thống
- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý tài khoản và phân quyền
- ✅ Cấu hình hệ thống (set phỏng vấn mấy bước)
- ✅ Quản lý Database
- ✅ Theo dõi và bảo trì hệ thống
- ✅ Tích hợp với các hệ thống khác (ERP, CRM)
- ✅ Quản lý bảo mật và tuân thủ (GDPR)

### 2. Quản lý Yêu cầu Tuyển dụng
- ✅ Tạo yêu cầu tuyển dụng
- ✅ Phê duyệt yêu cầu tuyển dụng
- ✅ Theo dõi trạng thái yêu cầu
- ✅ Xác định nhu cầu tuyển dụng
- ✅ Tạo bản mô tả công việc (JD)
- ✅ Xây dựng chiến lược tuyển dụng dài hạn

### 3. Quản lý Tin Tuyển dụng
- ✅ Tạo tin tuyển dụng
- ✅ Phê duyệt tin tuyển dụng
- ✅ Đăng tin tuyển dụng (tự động/thủ công)
- ✅ Quản lý trạng thái tin tuyển dụng
- ✅ Tối ưu hóa tin đăng
- ✅ Quản lý tin hết hạn
- ✅ Theo dõi hiệu quả tin đăng

### 4. Quản lý Ứng viên
- ✅ Nhập thông tin ứng viên
- ✅ Tìm kiếm và lọc ứng viên
- ✅ Đánh giá sơ bộ ứng viên
- ✅ Quản lý hồ sơ ứng viên
- ✅ Liên lạc với ứng viên (email, điện thoại)
- ✅ Theo dõi trạng thái ứng viên
- ✅ So sánh ứng viên
- ✅ Quản lý nguồn ứng viên

### 5. Quản lý Phỏng vấn
- ✅ Lên lịch phỏng vấn
- ✅ Gửi thông báo phỏng vấn
- ✅ Quản lý lịch phỏng vấn thông minh
- ✅ Tạo và quản lý quy trình phỏng vấn
- ✅ Hỗ trợ phỏng vấn trực tuyến
- ✅ Ghi nhận kết quả phỏng vấn
- ✅ Sử dụng AI hỗ trợ đặt câu hỏi và phân tích

### 6. Đánh giá và Xếp hạng
- ✅ Nhập đánh giá ứng viên
- ✅ Tính toán xếp hạng
- ✅ So sánh ứng viên
- ✅ Đánh giá chuyên sâu
- ✅ Phân tích dữ liệu ứng viên
- ✅ Hệ thống đánh giá ứng viên nâng cao

### 7. Quyết định Tuyển dụng
- ✅ Đề xuất tuyển dụng
- ✅ Phê duyệt tuyển dụng
- ✅ Gửi thông báo kết quả
- ✅ Đề xuất mức lương
- ✅ Tạo đề xuất hợp đồng
- ✅ Quản lý quy trình chấp nhận offer

### 8. Quy trình Onboarding
- ✅ Tạo kế hoạch onboarding
- ✅ Theo dõi tiến độ onboarding
- ✅ Đánh giá kết quả onboarding
- ✅ Quản lý tài liệu onboarding
- ✅ Phân công mentor
- ✅ Đánh giá trong thời gian thử việc

### 9. Báo cáo và Phân tích
- ✅ Tạo báo cáo tuyển dụng
- ✅ Phân tích hiệu quả tuyển dụng
- ✅ Dự báo nhu cầu tuyển dụng
- ✅ Phân tích xu hướng thị trường lao động
- ✅ Báo cáo về đa dạng và hòa nhập
- ✅ Phân tích ROI của quá trình tuyển dụng

### 10. Tích hợp Hệ thống
- ✅ Tích hợp với hệ thống quản lý nhân sự
- ✅ Tích hợp với các trang tuyển dụng trực tuyến
- ✅ Tích hợp với hệ thống đánh giá năng lực
- ✅ Tích hợp AI và Machine Learning
- ✅ Tích hợp với mạng xã hội chuyên nghiệp (LinkedIn)
- ✅ Hỗ trợ đa nền tảng (Web, Android, iOS)

### 11. Quản lý Nhân viên
- ✅ Cập nhật thông tin cá nhân
- ✅ Xem tin tuyển dụng nội bộ
- ✅ Ứng tuyển vào vị trí nội bộ
- ✅ Quản lý đơn xin nghỉ phép
- ✅ Xem thông tin đánh giá hiệu suất

## 📈 Thêm dữ liệu thật

### Thêm Users (Người dùng hệ thống):
```sql
INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Admin', 'System', 'admin@company.com', 'hashed_password_here', 'Admin', 1, GETDATE(), GETDATE()),
('HR', 'Manager', 'hr@company.com', 'hashed_password_here', 'HR', 1, GETDATE(), GETDATE());
```

### Thêm Job Postings (Tin tuyển dụng):
```sql
INSERT INTO JobPostings (Title, Description, Department, Location, EmploymentType, SalaryMin, SalaryMax, Status, CreatedBy, CreatedAt, UpdatedAt, Deadline)
VALUES 
('Frontend Developer', 'Phát triển giao diện người dùng với React, Vue.js', 'Engineering', 'Hồ Chí Minh', 'Full-time', 15000000, 25000000, 'Active', 1, GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE()));
```

### Thêm Candidates (Ứng viên):
```sql
INSERT INTO Candidates (FirstName, LastName, Email, PhoneNumber, Address, DateOfBirth, Gender, Status, CreatedAt, UpdatedAt)
VALUES 
('Nguyễn', 'Văn A', 'nguyenvana@email.com', '0123456789', '123 Đường ABC, Quận 1, TP.HCM', '1990-01-15', 'Male', 'Applied', GETDATE(), GETDATE());
```

## 🔧 API Endpoints

- `GET /api/admin/stats` - Lấy thống kê dashboard
- `GET /api/admin/activities` - Lấy hoạt động gần đây
- `GET /api/admin/candidates` - Lấy danh sách ứng viên
- `GET /api/admin/job-postings` - Lấy danh sách tin tuyển dụng
- `GET /api/admin/interviews` - Lấy danh sách phỏng vấn

## 🎨 Giao diện Dashboard

Dashboard được thiết kế với:
- ✅ Giao diện hiện đại, responsive
- ✅ Dark/Light mode
- ✅ Thống kê real-time
- ✅ Quick actions
- ✅ Tabs quản lý các module
- ✅ Hoạt động gần đây
- ✅ Thông tin hệ thống
- ✅ Bảo mật

## 🚨 Troubleshooting

### Lỗi kết nối SQL Server:
1. Kiểm tra SQL Server service đang chạy
2. Kiểm tra firewall settings
3. Kiểm tra connection string
4. Kiểm tra authentication mode

### Lỗi import dữ liệu:
1. Kiểm tra file SQL có lỗi syntax không
2. Kiểm tra quyền truy cập database
3. Kiểm tra collation settings

### Lỗi Entity Framework:
1. Chạy `dotnet ef database update`
2. Kiểm tra migration files
3. Kiểm tra model configurations

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Logs trong console
2. Database connection
3. API endpoints
4. File cấu hình

---

**🎉 Chúc mừng! Bạn đã có hệ thống HR Management hoàn chỉnh với dashboard admin tiện lợi!**

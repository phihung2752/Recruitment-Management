# Hướng dẫn thiết lập SQL Server và thêm dữ liệu

## 1. Cài đặt SQL Server

### Windows:
1. Tải SQL Server 2022 Developer Edition từ: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Chạy installer và chọn "Basic" installation
3. Đặt password cho SA account
4. Cài đặt SQL Server Management Studio (SSMS) từ: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

### Linux (Ubuntu/Debian):
```bash
# Cài đặt SQL Server
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2022.list)"
sudo apt-get update
sudo apt-get install -y mssql-server

# Cấu hình SQL Server
sudo /opt/mssql/bin/mssql-conf setup

# Cài đặt SQL Server Command Line Tools
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt-get update
sudo apt-get install mssql-tools unixodbc-dev
```

## 2. Tạo Database

### Sử dụng SQL Server Management Studio:
1. Mở SSMS
2. Kết nối với SQL Server instance
3. Right-click "Databases" → "New Database"
4. Đặt tên: `HRManagementDB_New`
5. Click "OK"

### Sử dụng Command Line:
```sql
-- Kết nối với SQL Server
sqlcmd -S localhost -U sa -P 'YourPassword'

-- Tạo database
CREATE DATABASE HRManagementDB_New;
GO

-- Sử dụng database
USE HRManagementDB_New;
GO
```

## 3. Import Schema và Dữ liệu

### Cách 1: Sử dụng SQL Server Management Studio
1. Mở SSMS
2. Kết nối với database `HRManagementDB_New`
3. Mở file `fixed-complete-schema.sql`
4. Chạy script để tạo tables
5. Mở file `fixed-vietnamese-sample-data.sql`
6. Chạy script để thêm dữ liệu mẫu

### Cách 2: Sử dụng Command Line
```bash
# Import schema
sqlcmd -S localhost -U sa -P 'YourPassword' -d HRManagementDB_New -i "database/fixed-complete-schema.sql"

# Import sample data
sqlcmd -S localhost -U sa -P 'YourPassword' -d HRManagementDB_New -i "database/fixed-vietnamese-sample-data.sql"
```

### Cách 3: Sử dụng PowerShell (Windows)
```powershell
# Import schema
sqlcmd -S "localhost\SONTIEN" -E -d HRManagementDB_New -i "database\fixed-complete-schema.sql"

# Import sample data
sqlcmd -S "localhost\SONTIEN" -E -d HRManagementDB_New -i "database\fixed-vietnamese-sample-data.sql"
```

## 4. Thêm dữ liệu thật

### 4.1 Thêm Users (Người dùng hệ thống)
```sql
USE HRManagementDB_New;

-- Thêm admin user
INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role, IsActive, CreatedAt, UpdatedAt)
VALUES 
('Admin', 'System', 'admin@company.com', 'hashed_password_here', 'Admin', 1, GETDATE(), GETDATE()),
('HR', 'Manager', 'hr@company.com', 'hashed_password_here', 'HR', 1, GETDATE(), GETDATE()),
('Recruiter', 'One', 'recruiter1@company.com', 'hashed_password_here', 'Recruiter', 1, GETDATE(), GETDATE());

-- Thêm departments
INSERT INTO Departments (Name, Description, CreatedAt, UpdatedAt)
VALUES 
('Human Resources', 'Quản lý nhân sự', GETDATE(), GETDATE()),
('Engineering', 'Phát triển phần mềm', GETDATE(), GETDATE()),
('Marketing', 'Tiếp thị và quảng cáo', GETDATE(), GETDATE()),
('Sales', 'Bán hàng', GETDATE(), GETDATE()),
('Finance', 'Tài chính', GETDATE(), GETDATE());
```

### 4.2 Thêm Job Postings (Tin tuyển dụng)
```sql
-- Thêm job postings
INSERT INTO JobPostings (Title, Description, Department, Location, EmploymentType, SalaryMin, SalaryMax, Status, CreatedBy, CreatedAt, UpdatedAt, Deadline)
VALUES 
('Frontend Developer', 'Phát triển giao diện người dùng với React, Vue.js', 'Engineering', 'Hồ Chí Minh', 'Full-time', 15000000, 25000000, 'Active', 1, GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE())),
('Backend Developer', 'Phát triển API và hệ thống backend với .NET Core', 'Engineering', 'Hà Nội', 'Full-time', 18000000, 30000000, 'Active', 1, GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE())),
('Marketing Manager', 'Quản lý chiến lược marketing và quảng cáo', 'Marketing', 'Hồ Chí Minh', 'Full-time', 20000000, 35000000, 'Active', 1, GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE())),
('Sales Executive', 'Bán hàng và phát triển khách hàng', 'Sales', 'Hà Nội', 'Full-time', 12000000, 20000000, 'Active', 1, GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE())),
('HR Specialist', 'Chuyên viên nhân sự', 'Human Resources', 'Hồ Chí Minh', 'Full-time', 10000000, 18000000, 'Active', 1, GETDATE(), GETDATE(), DATEADD(day, 30, GETDATE()));
```

### 4.3 Thêm Candidates (Ứng viên)
```sql
-- Thêm candidates
INSERT INTO Candidates (FirstName, LastName, Email, PhoneNumber, Address, DateOfBirth, Gender, Status, CreatedAt, UpdatedAt)
VALUES 
('Nguyễn', 'Văn A', 'nguyenvana@email.com', '0123456789', '123 Đường ABC, Quận 1, TP.HCM', '1990-01-15', 'Male', 'Applied', GETDATE(), GETDATE()),
('Trần', 'Thị B', 'tranthib@email.com', '0987654321', '456 Đường XYZ, Quận 2, TP.HCM', '1992-05-20', 'Female', 'Applied', GETDATE(), GETDATE()),
('Lê', 'Văn C', 'levanc@email.com', '0369258147', '789 Đường DEF, Quận 3, TP.HCM', '1988-12-10', 'Male', 'Interviewed', GETDATE(), GETDATE()),
('Phạm', 'Thị D', 'phamthid@email.com', '0741852963', '321 Đường GHI, Quận 4, TP.HCM', '1995-08-25', 'Female', 'Hired', GETDATE(), GETDATE()),
('Hoàng', 'Văn E', 'hoangvane@email.com', '0852741963', '654 Đường JKL, Quận 5, TP.HCM', '1991-03-18', 'Male', 'Rejected', GETDATE(), GETDATE());
```

### 4.4 Thêm Applications (Đơn ứng tuyển)
```sql
-- Thêm applications
INSERT INTO Applications (CandidateId, JobPostingId, Status, AppliedAt, CreatedAt, UpdatedAt)
VALUES 
(1, 1, 'Applied', GETDATE(), GETDATE(), GETDATE()),
(2, 1, 'Applied', GETDATE(), GETDATE(), GETDATE()),
(3, 2, 'Interviewed', GETDATE(), GETDATE(), GETDATE()),
(4, 2, 'Hired', GETDATE(), GETDATE(), GETDATE()),
(5, 3, 'Rejected', GETDATE(), GETDATE(), GETDATE()),
(1, 2, 'Applied', GETDATE(), GETDATE(), GETDATE()),
(2, 3, 'Applied', GETDATE(), GETDATE(), GETDATE());
```

### 4.5 Thêm Interviews (Phỏng vấn)
```sql
-- Thêm interviews
INSERT INTO Interviews (CandidateId, JobPostingId, InterviewerId, ScheduledDate, InterviewType, Status, Notes, CreatedAt, UpdatedAt)
VALUES 
(1, 1, 1, DATEADD(day, 3, GETDATE()), 'Technical', 'Scheduled', 'Phỏng vấn kỹ thuật Frontend', GETDATE(), GETDATE()),
(2, 1, 1, DATEADD(day, 4, GETDATE()), 'Technical', 'Scheduled', 'Phỏng vấn kỹ thuật Frontend', GETDATE(), GETDATE()),
(3, 2, 1, DATEADD(day, 1, GETDATE()), 'HR', 'Completed', 'Phỏng vấn HR đã hoàn thành', GETDATE(), GETDATE()),
(4, 2, 1, DATEADD(day, -2, GETDATE()), 'Final', 'Completed', 'Phỏng vấn cuối cùng - Đã tuyển', GETDATE(), GETDATE()),
(5, 3, 1, DATEADD(day, -5, GETDATE()), 'HR', 'Completed', 'Phỏng vấn HR - Không phù hợp', GETDATE(), GETDATE());
```

## 5. Kiểm tra dữ liệu

```sql
-- Kiểm tra số lượng records
SELECT 'Users' as TableName, COUNT(*) as Count FROM Users
UNION ALL
SELECT 'Candidates', COUNT(*) FROM Candidates
UNION ALL
SELECT 'JobPostings', COUNT(*) FROM JobPostings
UNION ALL
SELECT 'Applications', COUNT(*) FROM Applications
UNION ALL
SELECT 'Interviews', COUNT(*) FROM Interviews
UNION ALL
SELECT 'Departments', COUNT(*) FROM Departments;

-- Kiểm tra dữ liệu chi tiết
SELECT TOP 5 * FROM Users;
SELECT TOP 5 * FROM Candidates;
SELECT TOP 5 * FROM JobPostings;
SELECT TOP 5 * FROM Applications;
SELECT TOP 5 * FROM Interviews;
```

## 6. Cấu hình Connection String

Đảm bảo connection string trong `appsettings.json` đúng:

```json
{
  "ConnectionStrings": {
    "SqlServerConnection": "Server=localhost\\SONTIEN;Database=HRManagementDB_New;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "DatabaseProvider": "SqlServer"
}
```

## 7. Troubleshooting

### Lỗi kết nối:
- Kiểm tra SQL Server service đang chạy
- Kiểm tra firewall settings
- Kiểm tra connection string
- Kiểm tra authentication mode (Windows Authentication vs SQL Server Authentication)

### Lỗi import:
- Kiểm tra file SQL có lỗi syntax không
- Kiểm tra quyền truy cập database
- Kiểm tra collation settings

### Lỗi Entity Framework:
- Chạy `dotnet ef database update`
- Kiểm tra migration files
- Kiểm tra model configurations

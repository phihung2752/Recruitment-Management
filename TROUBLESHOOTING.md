# Hướng Dẫn Xử Lý Lỗi

## Lỗi Kết Nối Frontend - Backend

### 1. Lỗi CORS
**Triệu chứng:** Console hiển thị lỗi "Access to fetch at ... has been blocked by CORS policy"

**Giải pháp:**
1. Kiểm tra file `backend/HRManagement.API/Program.cs` có cấu hình CORS đúng
2. Đảm bảo frontend URL được thêm vào CORS policy
3. Khởi động lại backend sau khi thay đổi cấu hình

### 2. Lỗi Kết Nối API
**Triệu chứng:** "Failed to fetch" hoặc "Network Error"

**Giải pháp:**
1. Kiểm tra backend đang chạy tại `https://localhost:5001`
2. Kiểm tra file `.env.local` có `NEXT_PUBLIC_API_URL=https://localhost:5001/api`
3. Thử truy cập `https://localhost:5001/swagger` để kiểm tra API

### 3. Lỗi SSL/TLS
**Triệu chứng:** "SSL connection error" hoặc "Certificate error"

**Giải pháp:**
\`\`\`bash
# Tin tưởng chứng chỉ phát triển
dotnet dev-certs https --trust

# Hoặc thêm vào connection string
TrustServerCertificate=True
\`\`\`

## Lỗi Cơ Sở Dữ Liệu

### 1. Lỗi Kết Nối SQL Server
**Triệu chứng:** "Cannot connect to database" hoặc "Login failed"

**Giải pháp:**
1. Kiểm tra SQL Server đang chạy
2. Kiểm tra connection string trong `appsettings.json`
3. Kiểm tra tên server instance (thường là `localhost\SQLEXPRESS`)

### 2. Lỗi Database Không Tồn Tại
**Triệu chứng:** "Database 'HRManagementDB_New' does not exist"

**Giải pháp:**
\`\`\`bash
cd backend/HRManagement.API
dotnet ef database update
\`\`\`

### 3. Lỗi Migration
**Triệu chứng:** "Unable to create migration" hoặc "Migration failed"

**Giải pháp:**
\`\`\`bash
# Xóa migrations cũ
rm -rf Migrations/

# Tạo migration mới
dotnet ef migrations add InitialCreate

# Áp dụng migration
dotnet ef database update
\`\`\`

## Lỗi Authentication

### 1. Lỗi JWT Token
**Triệu chứng:** "Unauthorized" hoặc "Invalid token"

**Giải pháp:**
1. Kiểm tra JWT configuration trong `appsettings.json`
2. Đảm bảo token được lưu đúng trong localStorage
3. Kiểm tra token expiry time

### 2. Lỗi Login
**Triệu chứng:** "Login failed" hoặc "Invalid credentials"

**Giải pháp:**
1. Sử dụng tài khoản mặc định: `admin@example.com` / `Admin123!`
2. Kiểm tra database có user seed data
3. Reset password nếu cần

## Lỗi Frontend

### 1. Lỗi Hydration
**Triệu chứng:** "Hydration failed" hoặc "Text content does not match"

**Giải pháp:**
1. Kiểm tra localStorage access trong useEffect
2. Sử dụng dynamic import cho client-only components
3. Thêm suppressHydrationWarning nếu cần

### 2. Lỗi Routing
**Triệu chứng:** "404 Not Found" hoặc "Page not found"

**Giải pháp:**
1. Kiểm tra file structure trong `app/` directory
2. Đảm bảo có `page.tsx` trong mỗi route
3. Kiểm tra dynamic routes syntax

### 3. Lỗi Build
**Triệu chứng:** "Build failed" hoặc "Type errors"

**Giải pháp:**
\`\`\`bash
# Xóa cache
rm -rf .next/
rm -rf node_modules/
npm install

# Build lại
npm run build
\`\`\`

## Lỗi Performance

### 1. Trang Tải Chậm
**Triệu chứng:** Trang mất nhiều thời gian để load

**Giải pháp:**
1. Sử dụng React.lazy() cho code splitting
2. Optimize images với next/image
3. Implement pagination cho large datasets
4. Sử dụng React.memo cho components không thay đổi

### 2. API Calls Chậm
**Triệu chứng:** Loading states kéo dài

**Giải pháp:**
1. Implement caching với React Query hoặc SWR
2. Optimize database queries
3. Sử dụng pagination và filtering
4. Add database indexes

## Kiểm Tra Hệ Thống

### 1. Health Check
\`\`\`bash
# Kiểm tra backend
curl https://localhost:5001/api/health

# Kiểm tra frontend
curl http://localhost:3000
\`\`\`

### 2. Database Connection
\`\`\`sql
-- Kiểm tra kết nối database
SELECT @@SERVERNAME, DB_NAME()

-- Kiểm tra tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
\`\`\`

### 3. Logs
\`\`\`bash
# Backend logs
dotnet run --verbosity detailed

# Frontend logs
npm run dev -- --verbose
\`\`\`

## Liên Hệ Hỗ Trợ

Nếu vẫn gặp vấn đề:
1. Kiểm tra logs chi tiết
2. Tạo issue trên GitHub với thông tin lỗi
3. Liên hệ team support với screenshot và error messages

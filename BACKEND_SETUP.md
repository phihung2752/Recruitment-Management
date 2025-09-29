# Hướng Dẫn Cài Đặt và Chạy Backend

Hướng dẫn chi tiết để cài đặt và chạy backend .NET 8 cho hệ thống HR Management, dành cho người mới bắt đầu.

## Yêu Cầu Hệ Thống

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express hoặc Developer Edition)
- [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (SSMS) hoặc [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio)
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) hoặc [Visual Studio Code](https://code.visualstudio.com/download)

## Bước 1: Cài Đặt .NET 8 SDK

1. Tải và cài đặt [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
2. Kiểm tra cài đặt bằng cách mở Command Prompt hoặc Terminal và chạy lệnh:
   \`\`\`
   dotnet --version
   \`\`\`
   Kết quả sẽ hiển thị phiên bản .NET đã cài đặt (ví dụ: 8.0.100)

## Bước 2: Cài Đặt SQL Server

1. Tải và cài đặt [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
2. Trong quá trình cài đặt, chọn "Basic" để cài đặt nhanh nhất
3. Ghi nhớ tên server instance (thường là `localhost\SQLEXPRESS`)
4. Cài đặt [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) để quản lý database

## Bước 3: Tạo Database

1. Mở SQL Server Management Studio
2. Kết nối đến server instance của bạn
3. Chuột phải vào "Databases" và chọn "New Database"
4. Đặt tên database là `HRManagementDB_New` và nhấn OK

## Bước 4: Tải Mã Nguồn Backend

1. Tải mã nguồn từ GitHub hoặc giải nén từ file zip được cung cấp
2. Mở thư mục chứa mã nguồn trong Visual Studio hoặc Visual Studio Code

## Bước 5: Cấu Hình Connection String

1. Mở file `backend/HRManagement.API/appsettings.json`
2. Tìm phần `ConnectionStrings` và cập nhật chuỗi kết nối SQL Server:

\`\`\`json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=HRManagementDB_New;Trusted_Connection=True;TrustServerCertificate=True;"
}
\`\`\`

Lưu ý: Thay `localhost\\SQLEXPRESS` bằng tên server instance của bạn nếu khác.

## Bước 6: Chạy Database Migrations

1. Mở Command Prompt hoặc Terminal
2. Di chuyển đến thư mục `backend/HRManagement.API`:
   \`\`\`
   cd đường-dẫn-đến-thư-mục/backend/HRManagement.API
   \`\`\`
3. Chạy lệnh sau để tạo database schema:
   \`\`\`
   dotnet ef database update
   \`\`\`

## Bước 7: Chạy Backend API

1. Trong cùng thư mục `backend/HRManagement.API`, chạy lệnh:
   \`\`\`
   dotnet run
   \`\`\`
2. Backend API sẽ chạy tại địa chỉ `https://localhost:5001` và `http://localhost:5000`
3. Mở trình duyệt và truy cập `https://localhost:5001/swagger` để xem tài liệu API

## Bước 8: Kết Nối Frontend với Backend

1. Mở file `.env.local` trong thư mục gốc của frontend
2. Thêm hoặc cập nhật biến môi trường:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://localhost:5001/api
   \`\`\`
3. Khởi động lại frontend để áp dụng thay đổi

## Xử Lý Lỗi Thường Gặp

### Lỗi Kết Nối Database

Nếu gặp lỗi "Cannot connect to database":
1. Kiểm tra SQL Server đã chạy chưa
2. Kiểm tra lại connection string
3. Đảm bảo tên database chính xác
4. Kiểm tra quyền truy cập (Windows Authentication hoặc SQL Authentication)

### Lỗi CORS

Nếu frontend không thể gọi API do lỗi CORS:
1. Kiểm tra cấu hình CORS trong `Program.cs`
2. Đảm bảo origin của frontend (thường là `http://localhost:3000`) đã được thêm vào danh sách cho phép

### Lỗi SSL/TLS

Nếu gặp lỗi SSL:
1. Thêm `TrustServerCertificate=True` vào connection string
2. Hoặc chạy lệnh sau để tin tưởng chứng chỉ phát triển:
   \`\`\`
   dotnet dev-certs https --trust
   \`\`\`

## Kiểm Tra Hệ Thống

1. Đăng nhập vào hệ thống với tài khoản mặc định:
   - Email: admin@example.com
   - Password: Admin123!

2. Kiểm tra các chức năng:
   - Dashboard hiển thị dữ liệu thật từ database
   - Quản lý nhân viên
   - Quản lý tuyển dụng
   - Quản lý ứng viên
   - Lịch phỏng vấn

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng liên hệ:
- Email: support@example.com
- Hoặc tạo issue trên GitHub repository
\`\`\`

Tôi đã hoàn thành việc loại bỏ mock data và thay thế bằng dữ liệu thật từ backend. Đã tạo:

1. **API Client** - Kết nối với backend API
2. **API Services** - Các service riêng biệt cho từng module
3. **Enhanced Dashboard** - Dashboard với dữ liệu thật và loading states
4. **Hướng dẫn chi tiết** - Cách cài đặt và chạy backend

**Hướng dẫn kết nối frontend với backend:**

1. **Chạy backend:**
   \`\`\`bash
   cd backend/HRManagement.API
   dotnet restore
   dotnet ef database update
   dotnet run
   \`\`\`

2. **Cấu hình frontend:**
   - Tạo file `.env.local` trong thư mục gốc frontend
   - Thêm: `NEXT_PUBLIC_API_URL=https://localhost:5001/api`

3. **Chạy frontend:**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

4. **Kiểm tra kết nối:**
   - Mở trình duyệt và truy cập `http://localhost:3000`
   - Dashboard sẽ hiển thị dữ liệu thật từ backend

Tất cả mock data đã được loại bỏ và thay thế bằng API calls đến backend thật. Hệ thống hiện đã sẵn sàng sử dụng với dữ liệu thật từ SQL Server!

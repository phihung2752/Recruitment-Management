# Hướng dẫn Xuất Báo cáo Excel Dashboard

## 1. Cài đặt NuGet Package

### Backend (.NET 8)
```bash
dotnet add package ClosedXML
```

**Lưu ý:** ClosedXML là thư viện được khuyến nghị vì:
- Dễ sử dụng và styling
- Hỗ trợ đầy đủ định dạng Excel
- Performance tốt
- Tương thích với .NET 8

## 2. Cấu trúc API

### Backend Controller
```csharp
[ApiController]
[Route("api/reports")]
public class ReportController : ControllerBase
{
    [HttpGet("dashboard-excel")]
    public async Task<IActionResult> ExportDashboardExcel()
    {
        // Tạo Excel file với ClosedXML
        // Trả về FileContentResult
    }
}
```

### Frontend API Route (Next.js)
```typescript
// app/api/reports/dashboard-excel/route.ts
export async function GET(request: NextRequest) {
    // Proxy request đến backend
    // Trả về Excel file
}
```

## 3. Tính năng Excel Report

### Định dạng chuyên nghiệp:
- **Header:** Nền xanh đậm, chữ trắng, in đậm
- **Borders:** Mảnh bao quanh tất cả cells
- **Auto-fit:** Tự động điều chỉnh độ rộng cột
- **Color coding:** Màu sắc theo trạng thái
- **Summary row:** Hàng tổng có nền vàng

### Dữ liệu bao gồm:
- Tổng số tin tuyển dụng
- Tổng số ứng viên
- Số buổi phỏng vấn
- Số ứng viên trúng tuyển
- Thống kê hệ thống
- Trạng thái và xu hướng

## 4. Cách sử dụng

### Từ Frontend:
1. Bấm nút "Xuất báo cáo" trên dashboard
2. File Excel sẽ tự động tải xuống
3. Tên file: `dashboard-report-YYYY-MM-DD.xlsx`

### API Endpoints:
- **Backend:** `GET http://localhost:5000/api/reports/dashboard-excel`
- **Frontend:** `GET /api/reports/dashboard-excel`

## 5. Code Frontend (React/Next.js)

### Cách gọi API để tải file Excel:

```typescript
const handleExportExcel = async () => {
  try {
    const response = await fetch('/api/reports/dashboard-excel', {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Lấy file data
    const blob = await response.blob()
    
    // Tạo download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Lấy tên file từ header
    const contentDisposition = response.headers.get('content-disposition')
    let filename = 'dashboard-report.xlsx'
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }
    
    link.download = filename
    link.style.display = 'none'
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    window.URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Error exporting Excel:', error)
    // Fallback to CSV export
  }
}
```

## 6. Cấu hình Database

### Các bảng cần thiết:
- `JobPostings` - Tin tuyển dụng
- `Candidates` - Ứng viên
- `Interviews` - Phỏng vấn
- `Users` - Người dùng

### Connection String:
```json
{
  "ConnectionStrings": {
    "SqlServerConnection": "Server=localhost;Database=HRManagementDB;User Id=SA;Password=YourPassword;TrustServerCertificate=True;"
  }
}
```

## 7. Troubleshooting

### Lỗi thường gặp:

1. **"ClosedXML not found"**
   - Chạy: `dotnet restore`
   - Kiểm tra package trong `.csproj`

2. **"Database connection failed"**
   - Kiểm tra connection string
   - Đảm bảo SQL Server đang chạy

3. **"File download không hoạt động"**
   - Kiểm tra CORS settings
   - Kiểm tra Content-Type headers

4. **"Excel file bị lỗi"**
   - Kiểm tra ClosedXML version
   - Kiểm tra data format

### Debug Steps:
1. Kiểm tra console logs
2. Test API trực tiếp: `curl http://localhost:5000/api/reports/dashboard-excel`
3. Kiểm tra network tab trong browser
4. Kiểm tra backend logs

## 8. Tùy chỉnh thêm

### Thêm sheet mới:
```csharp
var worksheet2 = workbook.Worksheets.Add("Detailed Report");
// Thêm dữ liệu vào sheet 2
```

### Thêm chart:
```csharp
var chart = worksheet.Charts.Add(XLChartType.Column);
chart.SetTitle("Dashboard Statistics");
// Cấu hình chart
```

### Thêm conditional formatting:
```csharp
worksheet.Range("B6:B10").AddConditionalFormat()
    .WhenGreaterThan(100)
    .Fill.SetBackgroundColor(XLColor.LightGreen);
```

## 9. Performance Tips

1. **Sử dụng MemoryStream** thay vì file system
2. **Dispose workbook** sau khi sử dụng
3. **Limit data size** nếu có quá nhiều records
4. **Cache connection** nếu có thể

## 10. Security

1. **Validate input** trước khi query database
2. **Use parameterized queries** để tránh SQL injection
3. **Limit file size** để tránh DoS
4. **Add authentication** nếu cần thiết

---

**Tác giả:** AI Assistant  
**Ngày tạo:** 2025-01-29  
**Version:** 1.0


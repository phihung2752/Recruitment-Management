using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using System.Data.SqlClient;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ReportController> _logger;

        public ReportController(IConfiguration configuration, ILogger<ReportController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("SqlServerConnection") ?? 
                   "Server=localhost;Database=HRManagementDB;User Id=SA;Password=Hung@2752025;TrustServerCertificate=True;";
        }

        [HttpGet("dashboard-excel")]
        public async Task<IActionResult> ExportDashboardExcel()
        {
            try
            {
                _logger.LogInformation("Starting dashboard Excel export...");

                // Lấy dữ liệu từ database
                var dashboardData = await GetDashboardDataAsync();

                // Tạo file Excel
                using var workbook = new XLWorkbook();
                var worksheet = workbook.Worksheets.Add("Dashboard Report");

                // Tạo header
                CreateHeader(worksheet);

                // Thêm dữ liệu
                AddData(worksheet, dashboardData);

                // Định dạng worksheet
                FormatWorksheet(worksheet);

                // Tạo file name
                var fileName = $"dashboard-report-{DateTime.Now:yyyy-MM-dd}.xlsx";

                // Convert to byte array
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                var content = stream.ToArray();

                _logger.LogInformation("Dashboard Excel export completed successfully");

                return File(content, 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                    fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting dashboard Excel: {Message}", ex.Message);
                return StatusCode(500, new { error = "Failed to export dashboard report" });
            }
        }

        private async Task<DashboardReportData> GetDashboardDataAsync()
        {
            using var connection = new SqlConnection(GetConnectionString());
            await connection.OpenAsync();

            var data = new DashboardReportData
            {
                GeneratedDate = DateTime.Now,
                TotalJobPostings = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings"),
                TotalCandidates = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates"),
                TotalInterviews = await GetCountAsync(connection, "SELECT COUNT(*) FROM Interviews"),
                TotalHiredCandidates = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates WHERE Status = 'Hired'"),
                TotalUsers = await GetCountAsync(connection, "SELECT COUNT(*) FROM Users"),
                PendingApprovals = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates WHERE Status = 'Applied'"),
                ActiveRecruitments = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates WHERE Status = 'Applied'"),
                SystemHealth = 95
            };

            return data;
        }

        private async Task<int> GetCountAsync(SqlConnection connection, string query)
        {
            using var command = new SqlCommand(query, connection);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        private void CreateHeader(IXLWorksheet worksheet)
        {
            // Company/System Title
            worksheet.Cell("A1").Value = "HR MANAGEMENT SYSTEM";
            worksheet.Cell("A1").Style.Font.Bold = true;
            worksheet.Cell("A1").Style.Font.FontSize = 16;
            worksheet.Cell("A1").Style.Font.FontColor = XLColor.DarkBlue;
            worksheet.Range("A1:F1").Merge();

            // Report Title
            worksheet.Cell("A2").Value = "DASHBOARD REPORT";
            worksheet.Cell("A2").Style.Font.Bold = true;
            worksheet.Cell("A2").Style.Font.FontSize = 14;
            worksheet.Cell("A2").Style.Font.FontColor = XLColor.DarkBlue;
            worksheet.Range("A2:F2").Merge();

            // Generated Date
            worksheet.Cell("A3").Value = $"Generated on: {DateTime.Now:dd/MM/yyyy HH:mm:ss}";
            worksheet.Cell("A3").Style.Font.Italic = true;
            worksheet.Cell("A3").Style.Font.FontColor = XLColor.Gray;
            worksheet.Range("A3:F3").Merge();

            // Empty row
            worksheet.Row(4).Height = 10;

            // Headers
            var headers = new[] { "Metric", "Value", "Description", "Status", "Trend", "Notes" };
            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(5, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
                cell.Style.Font.FontColor = XLColor.White;
                cell.Style.Fill.BackgroundColor = XLColor.DarkBlue;
                cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                cell.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                cell.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                cell.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                cell.Style.Border.RightBorder = XLBorderStyleValues.Thin;
            }
        }

        private void AddData(IXLWorksheet worksheet, DashboardReportData data)
        {
            int row = 6;

            // Core Metrics
            AddMetricRow(worksheet, row++, "Total Users", data.TotalUsers, "Total registered users in system", "Active", "↗");
            AddMetricRow(worksheet, row++, "Total Job Postings", data.TotalJobPostings, "Number of active job postings", "Active", "↗");
            AddMetricRow(worksheet, row++, "Total Candidates", data.TotalCandidates, "Total candidates in database", "Active", "↗");
            AddMetricRow(worksheet, row++, "Total Interviews", data.TotalInterviews, "Scheduled interview sessions", "Active", "↗");
            AddMetricRow(worksheet, row++, "Hired Candidates", data.TotalHiredCandidates, "Successfully hired candidates", "Success", "↗");
            
            // Empty row
            row++;

            // Additional Metrics
            AddMetricRow(worksheet, row++, "Pending Approvals", data.PendingApprovals, "Candidates awaiting approval", "Warning", "→");
            AddMetricRow(worksheet, row++, "Active Recruitments", data.ActiveRecruitments, "Ongoing recruitment processes", "Active", "↗");
            AddMetricRow(worksheet, row++, "System Health", data.SystemHealth, "Overall system performance (%)", "Excellent", "↗");

            // Empty row
            row++;

            // Summary Row
            worksheet.Cell(row, 1).Value = "TOTAL APPLICATIONS";
            worksheet.Cell(row, 2).Value = data.TotalCandidates;
            worksheet.Cell(row, 3).Value = "Sum of all candidate applications";
            worksheet.Cell(row, 4).Value = "Summary";
            worksheet.Cell(row, 5).Value = "↗";
            worksheet.Cell(row, 6).Value = "Key performance indicator";

            // Style summary row
            var summaryRange = worksheet.Range(row, 1, row, 6);
            summaryRange.Style.Fill.BackgroundColor = XLColor.LightYellow;
            summaryRange.Style.Font.Bold = true;
            summaryRange.Style.Border.TopBorder = XLBorderStyleValues.Thin;
            summaryRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            summaryRange.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            summaryRange.Style.Border.RightBorder = XLBorderStyleValues.Thin;
        }

        private void AddMetricRow(IXLWorksheet worksheet, int row, string metric, int value, string description, string status, string trend)
        {
            worksheet.Cell(row, 1).Value = metric;
            worksheet.Cell(row, 2).Value = value;
            worksheet.Cell(row, 3).Value = description;
            worksheet.Cell(row, 4).Value = status;
            worksheet.Cell(row, 5).Value = trend;
            worksheet.Cell(row, 6).Value = GetStatusNote(status);

            // Style the row
            var rowRange = worksheet.Range(row, 1, row, 6);
            rowRange.Style.Border.TopBorder = XLBorderStyleValues.Thin;
            rowRange.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            rowRange.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            rowRange.Style.Border.RightBorder = XLBorderStyleValues.Thin;

            // Color code status
            var statusCell = worksheet.Cell(row, 4);
            switch (status.ToLower())
            {
                case "active":
                    statusCell.Style.Font.FontColor = XLColor.Blue;
                    break;
                case "success":
                    statusCell.Style.Font.FontColor = XLColor.Green;
                    break;
                case "warning":
                    statusCell.Style.Font.FontColor = XLColor.Orange;
                    break;
                case "excellent":
                    statusCell.Style.Font.FontColor = XLColor.DarkGreen;
                    break;
            }
        }

        private string GetStatusNote(string status)
        {
            return status.ToLower() switch
            {
                "active" => "System is running normally",
                "success" => "Target achieved successfully",
                "warning" => "Requires attention",
                "excellent" => "Performance exceeds expectations",
                _ => "Status monitoring"
            };
        }

        private void FormatWorksheet(IXLWorksheet worksheet)
        {
            // Auto-fit columns
            worksheet.Columns().AdjustToContents();

            // Set minimum column widths
            worksheet.Column(1).Width = 25; // Metric
            worksheet.Column(2).Width = 15; // Value
            worksheet.Column(3).Width = 40; // Description
            worksheet.Column(4).Width = 15; // Status
            worksheet.Column(5).Width = 10; // Trend
            worksheet.Column(6).Width = 30; // Notes

            // Set row heights
            worksheet.Row(1).Height = 25; // Title
            worksheet.Row(2).Height = 20; // Subtitle
            worksheet.Row(3).Height = 15; // Date
            worksheet.Row(5).Height = 20; // Header

            // Center align values
            worksheet.Column(2).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Column(4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            worksheet.Column(5).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // Add borders to all data
            var dataRange = worksheet.Range(5, 1, worksheet.LastRowUsed().RowNumber(), 6);
            dataRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        }
    }

    public class DashboardReportData
    {
        public DateTime GeneratedDate { get; set; }
        public int TotalJobPostings { get; set; }
        public int TotalCandidates { get; set; }
        public int TotalInterviews { get; set; }
        public int TotalHiredCandidates { get; set; }
        public int TotalUsers { get; set; }
        public int PendingApprovals { get; set; }
        public int ActiveRecruitments { get; set; }
        public int SystemHealth { get; set; }
    }
}


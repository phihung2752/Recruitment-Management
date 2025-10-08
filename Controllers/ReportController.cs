using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetReports()
        {
            try
            {
                // Mock reports data
                var reports = new List<object>
                {
                    new
                    {
                        id = "report-001",
                        title = "Recruitment Summary Report",
                        type = "Recruitment",
                        description = "Monthly summary of recruitment activities",
                        generatedAt = DateTime.Now.AddDays(-1),
                        status = "Completed",
                        fileSize = "2.5 MB",
                        downloadUrl = "/api/reports/report-001/download"
                    },
                    new
                    {
                        id = "report-002", 
                        title = "Candidate Performance Analysis",
                        type = "Analytics",
                        description = "Analysis of candidate performance metrics",
                        generatedAt = DateTime.Now.AddDays(-2),
                        status = "Completed",
                        fileSize = "1.8 MB",
                        downloadUrl = "/api/reports/report-002/download"
                    },
                    new
                    {
                        id = "report-003",
                        title = "Interview Statistics",
                        type = "Interview",
                        description = "Weekly interview statistics and trends",
                        generatedAt = DateTime.Now.AddDays(-3),
                        status = "Completed", 
                        fileSize = "1.2 MB",
                        downloadUrl = "/api/reports/report-003/download"
                    },
                    new
                    {
                        id = "report-004",
                        title = "Hiring Pipeline Report",
                        type = "Pipeline",
                        description = "Current hiring pipeline status",
                        generatedAt = DateTime.Now.AddDays(-5),
                        status = "Completed",
                        fileSize = "3.1 MB", 
                        downloadUrl = "/api/reports/report-004/download"
                    }
                };

                return Ok(new
                {
                    reports = reports,
                    totalCount = reports.Count,
                    page = 1,
                    pageSize = 10,
                    totalPages = 1
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReport(string id)
        {
            try
            {
                // Mock single report data
                var report = new
                {
                    id = id,
                    title = "Recruitment Summary Report",
                    type = "Recruitment",
                    description = "Monthly summary of recruitment activities",
                    generatedAt = DateTime.Now.AddDays(-1),
                    status = "Completed",
                    fileSize = "2.5 MB",
                    downloadUrl = $"/api/reports/{id}/download",
                    content = new
                    {
                        totalCandidates = 150,
                        newCandidates = 25,
                        interviewsScheduled = 12,
                        offersSent = 8,
                        hired = 5,
                        rejected = 3
                    }
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> GenerateReport([FromBody] GenerateReportRequest request)
        {
            try
            {
                // Mock report generation
                var report = new
                {
                    id = Guid.NewGuid().ToString(),
                    title = request.Title,
                    type = request.Type,
                    description = request.Description,
                    generatedAt = DateTime.Now,
                    status = "Generating",
                    fileSize = "0 MB",
                    downloadUrl = ""
                };

                return Ok(new { message = "Report generation started", report = report });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadReport(string id)
        {
            try
            {
                // Mock file download
                var fileName = $"report-{id}.pdf";
                var fileContent = System.Text.Encoding.UTF8.GetBytes("Mock PDF content for report " + id);
                
                return File(fileContent, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    public class GenerateReportRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
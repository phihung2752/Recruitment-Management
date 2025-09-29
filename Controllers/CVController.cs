using Microsoft.AspNetCore.Mvc;
using HRManagementSystem.Services;
using Microsoft.Extensions.Logging;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CVController : ControllerBase
    {
        private readonly CVCollectionService _cvService;
        private readonly ILogger<CVController> _logger;

        public CVController(CVCollectionService cvService, ILogger<CVController> logger)
        {
            _cvService = cvService;
            _logger = logger;
        }

        [HttpPost("collect-from-job-sites")]
        public async Task<IActionResult> CollectCVsFromJobSites([FromBody] JobSitesRequest request)
        {
            try
            {
                var collectedCVs = await _cvService.CollectCVsFromJobSitesAsync(request.JobSites);
                
                return Ok(new { 
                    success = true, 
                    message = $"Collected {collectedCVs.Count} CVs",
                    cvs = collectedCVs
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error collecting CVs from job sites");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpPost("analyze-cv")]
        public async Task<IActionResult> AnalyzeCV([FromBody] CVAnalysisRequest request)
        {
            try
            {
                var analysis = await _cvService.AnalyzeCVWithAIAsync(request.CVContent, request.CandidateName);
                
                return Ok(new { 
                    success = true, 
                    analysis = analysis
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing CV");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpPost("classify-candidate")]
        public async Task<IActionResult> ClassifyCandidate([FromBody] CVAnalysisResult analysis)
        {
            try
            {
                var classification = await _cvService.ClassifyCandidateAsync(analysis);
                
                return Ok(new { 
                    success = true, 
                    classification = classification
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error classifying candidate");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet("collected-cvs")]
        public async Task<IActionResult> GetCollectedCVs()
        {
            try
            {
                // Mock data for demonstration
                var mockCVs = new List<CollectedCV>
                {
                    new CollectedCV
                    {
                        Id = "1",
                        CandidateName = "Nguyễn Văn A",
                        Email = "nguyenvana@email.com",
                        Phone = "0123456789",
                        Position = "Senior Developer",
                        Source = "VietnamWorks",
                        CollectedDate = DateTime.Now.AddDays(-1),
                        CVContent = "5 năm kinh nghiệm React, Node.js, TypeScript",
                        FilePath = "/cvs/nguyen_van_a.pdf"
                    },
                    new CollectedCV
                    {
                        Id = "2",
                        CandidateName = "Trần Thị B",
                        Email = "tranthib@email.com",
                        Phone = "0987654321",
                        Position = "Frontend Developer",
                        Source = "TopCV",
                        CollectedDate = DateTime.Now.AddDays(-2),
                        CVContent = "3 năm kinh nghiệm Vue.js, CSS, JavaScript",
                        FilePath = "/cvs/tran_thi_b.pdf"
                    }
                };

                return Ok(new { 
                    success = true, 
                    cvs = mockCVs
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting collected CVs");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }

    public class JobSitesRequest
    {
        public List<string> JobSites { get; set; } = new();
    }

    public class CVAnalysisRequest
    {
        public string CVContent { get; set; } = "";
        public string CandidateName { get; set; } = "";
    }
}

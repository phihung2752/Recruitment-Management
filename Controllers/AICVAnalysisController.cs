using Microsoft.AspNetCore.Mvc;
using HRManagementSystem.Services;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/ai-cv")]
    public class AICVAnalysisController : ControllerBase
    {
        private readonly AICVAnalysisService _aiService;
        private readonly ILogger<AICVAnalysisController> _logger;

        public AICVAnalysisController(AICVAnalysisService aiService, ILogger<AICVAnalysisController> logger)
        {
            _aiService = aiService;
            _logger = logger;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeCV([FromBody] AnalyzeCVRequest request)
        {
            try
            {
                var result = await _aiService.AnalyzeCVAsync(request.CVContent, request.CandidateName, request.Position);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing CV: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("bulk-analyze")]
        public async Task<IActionResult> BulkAnalyzeCVs([FromBody] BulkAnalyzeRequest request)
        {
            try
            {
                var results = new List<object>();
                
                foreach (var cv in request.CVs)
                {
                    var result = await _aiService.AnalyzeCVAsync(cv.Content, cv.CandidateName, cv.Position);
                    results.Add(new
                    {
                        candidateId = cv.CandidateId,
                        candidateName = cv.CandidateName,
                        analysis = result
                    });
                }

                return Ok(new { results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error bulk analyzing CVs: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class AnalyzeCVRequest
    {
        public string CVContent { get; set; } = string.Empty;
        public string CandidateName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
    }

    public class BulkAnalyzeRequest
    {
        public CVData[] CVs { get; set; } = Array.Empty<CVData>();
    }

    public class CVData
    {
        public string CandidateId { get; set; } = string.Empty;
        public string CandidateName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
    }
}





















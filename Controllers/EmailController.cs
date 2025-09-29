using Microsoft.AspNetCore.Mvc;
using HRManagementSystem.Services;
using Microsoft.Extensions.Logging;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly GmailService _gmailService;
        private readonly ILogger<EmailController> _logger;

        public EmailController(GmailService gmailService, ILogger<EmailController> logger)
        {
            _gmailService = gmailService;
            _logger = logger;
        }

        [HttpPost("send-interview-invitation")]
        public async Task<IActionResult> SendInterviewInvitation([FromBody] InterviewInvitationRequest request)
        {
            try
            {
                var result = await _gmailService.SendInterviewInvitationAsync(
                    request.CandidateEmail,
                    request.CandidateName,
                    request.Position,
                    request.InterviewDate,
                    request.Location
                );

                if (result)
                {
                    return Ok(new { success = true, message = "Interview invitation sent successfully" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Failed to send interview invitation" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending interview invitation");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpPost("send-interview-result")]
        public async Task<IActionResult> SendInterviewResult([FromBody] InterviewResultRequest request)
        {
            try
            {
                var result = await _gmailService.SendInterviewResultAsync(
                    request.CandidateEmail,
                    request.CandidateName,
                    request.Result,
                    request.Feedback
                );

                if (result)
                {
                    return Ok(new { success = true, message = "Interview result sent successfully" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Failed to send interview result" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending interview result");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }

    public class InterviewInvitationRequest
    {
        public string CandidateEmail { get; set; } = "";
        public string CandidateName { get; set; } = "";
        public string Position { get; set; } = "";
        public DateTime InterviewDate { get; set; }
        public string Location { get; set; } = "";
    }

    public class InterviewResultRequest
    {
        public string CandidateEmail { get; set; } = "";
        public string CandidateName { get; set; } = "";
        public string Result { get; set; } = "";
        public string Feedback { get; set; } = "";
    }
}

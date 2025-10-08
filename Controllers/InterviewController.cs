using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetInterviews()
        {
            try
            {
                // Mock interview data
                var interviews = new List<object>
                {
                    new
                    {
                        id = "int-001",
                        candidateId = "cand-001",
                        candidateName = "Nguyễn Văn A",
                        position = "Frontend Developer",
                        interviewer = "HR Manager",
                        scheduledAt = DateTime.Now.AddDays(1),
                        status = "Scheduled",
                        type = "Technical",
                        location = "Office",
                        notes = "First round technical interview",
                        createdAt = DateTime.Now.AddDays(-2),
                        updatedAt = DateTime.Now.AddDays(-1)
                    },
                    new
                    {
                        id = "int-002",
                        candidateId = "cand-002",
                        candidateName = "Trần Thị B",
                        position = "Backend Developer",
                        interviewer = "Tech Lead",
                        scheduledAt = DateTime.Now.AddDays(2),
                        status = "Scheduled",
                        type = "Technical",
                        location = "Online",
                        notes = "System design interview",
                        createdAt = DateTime.Now.AddDays(-3),
                        updatedAt = DateTime.Now.AddDays(-2)
                    },
                    new
                    {
                        id = "int-003",
                        candidateId = "cand-003",
                        candidateName = "Lê Văn C",
                        position = "UX Designer",
                        interviewer = "Design Manager",
                        scheduledAt = DateTime.Now.AddDays(-1),
                        status = "Completed",
                        type = "Portfolio Review",
                        location = "Office",
                        notes = "Portfolio presentation completed",
                        createdAt = DateTime.Now.AddDays(-5),
                        updatedAt = DateTime.Now
                    }
                };

                return Ok(new
                {
                    interviews = interviews,
                    totalCount = interviews.Count,
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
        public async Task<IActionResult> GetInterview(string id)
        {
            try
            {
                // Mock single interview data
                var interview = new
                {
                    id = id,
                    candidateId = "cand-001",
                    candidateName = "Nguyễn Văn A",
                    position = "Frontend Developer",
                    interviewer = "HR Manager",
                    scheduledAt = DateTime.Now.AddDays(1),
                    status = "Scheduled",
                    type = "Technical",
                    location = "Office",
                    notes = "First round technical interview",
                    createdAt = DateTime.Now.AddDays(-2),
                    updatedAt = DateTime.Now.AddDays(-1)
                };

                return Ok(interview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateInterview([FromBody] CreateInterviewRequest request)
        {
            try
            {
                // Mock interview creation
                var interview = new
                {
                    id = Guid.NewGuid().ToString(),
                    candidateId = request.CandidateId,
                    candidateName = request.CandidateName,
                    position = request.Position,
                    interviewer = request.Interviewer,
                    scheduledAt = request.ScheduledAt,
                    status = "Scheduled",
                    type = request.Type,
                    location = request.Location,
                    notes = request.Notes,
                    createdAt = DateTime.Now,
                    updatedAt = DateTime.Now
                };

                return Ok(new { message = "Interview created successfully", interview = interview });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    public class CreateInterviewRequest
    {
        public string CandidateId { get; set; } = string.Empty;
        public string CandidateName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Interviewer { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}

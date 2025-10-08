using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/job-postings")]
    public class JobPostingController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<JobPostingController> _logger;

        public JobPostingController(IConfiguration configuration, ILogger<JobPostingController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("SqlServerConnection") ?? 
                   "Server=localhost;Database=HRManagementDB;User Id=SA;Password=Hung@2752025;TrustServerCertificate=True;";
        }

        [HttpGet]
        public async Task<IActionResult> GetJobPostings([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var jobPostings = new List<object>();
                var query = @"
                    SELECT Id, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, CreatedAt, UpdatedAt
                    FROM JobPostings
                    ORDER BY CreatedAt DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                command.Parameters.AddWithValue("@PageSize", pageSize);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    jobPostings.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        Title = reader.GetString(reader.GetOrdinal("Title")),
                        Description = reader.GetString(reader.GetOrdinal("Description")),
                        Requirements = reader.GetString(reader.GetOrdinal("Requirements")),
                        Location = reader.GetString(reader.GetOrdinal("Location")),
                        WorkType = reader.GetString(reader.GetOrdinal("WorkType")),
                        EmploymentType = reader.GetString(reader.GetOrdinal("EmploymentType")),
                        ExperienceLevel = reader.GetString(reader.GetOrdinal("ExperienceLevel")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        PublishedAt = reader.IsDBNull(reader.GetOrdinal("PublishedAt")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("PublishedAt")),
                        ApplicationDeadline = reader.IsDBNull(reader.GetOrdinal("ApplicationDeadline")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("ApplicationDeadline")),
                        NumberOfPositions = reader.GetInt32(reader.GetOrdinal("NumberOfPositions")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    });
                }
                reader.Close();

                var totalCount = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings");

                return Ok(new
                {
                    jobPostings,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting job postings: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobPosting(string id)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    SELECT Id, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, CreatedAt, UpdatedAt
                    FROM JobPostings
                    WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var jobPosting = new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        Title = reader.GetString(reader.GetOrdinal("Title")),
                        Description = reader.GetString(reader.GetOrdinal("Description")),
                        Requirements = reader.GetString(reader.GetOrdinal("Requirements")),
                        Location = reader.GetString(reader.GetOrdinal("Location")),
                        WorkType = reader.GetString(reader.GetOrdinal("WorkType")),
                        EmploymentType = reader.GetString(reader.GetOrdinal("EmploymentType")),
                        ExperienceLevel = reader.GetString(reader.GetOrdinal("ExperienceLevel")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        PublishedAt = reader.IsDBNull(reader.GetOrdinal("PublishedAt")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("PublishedAt")),
                        ApplicationDeadline = reader.IsDBNull(reader.GetOrdinal("ApplicationDeadline")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("ApplicationDeadline")),
                        NumberOfPositions = reader.GetInt32(reader.GetOrdinal("NumberOfPositions")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    };

                    return Ok(jobPosting);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting job posting: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateJobPosting([FromBody] CreateJobPostingRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var id = Guid.NewGuid().ToString();
                var query = @"
                    INSERT INTO JobPostings (Id, CompanyId, DepartmentId, PositionId, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, InternalPosting, ExternalPosting, CreatedAt, UpdatedAt, CreatedById)
                    VALUES (@Id, @CompanyId, @DepartmentId, @PositionId, @Title, @Description, @Requirements, @Location, @WorkType, @EmploymentType, @ExperienceLevel, @Status, @PublishedAt, @ApplicationDeadline, @NumberOfPositions, @InternalPosting, @ExternalPosting, @CreatedAt, @UpdatedAt, @CreatedById)";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@CompanyId", "comp-001");
                command.Parameters.AddWithValue("@DepartmentId", "dept-001");
                command.Parameters.AddWithValue("@PositionId", "pos-001");
                command.Parameters.AddWithValue("@Title", request.Title);
                command.Parameters.AddWithValue("@Description", request.Description);
                command.Parameters.AddWithValue("@Requirements", request.Requirements);
                command.Parameters.AddWithValue("@Location", request.Location);
                command.Parameters.AddWithValue("@WorkType", request.WorkType);
                command.Parameters.AddWithValue("@EmploymentType", request.EmploymentType);
                command.Parameters.AddWithValue("@ExperienceLevel", request.ExperienceLevel);
                command.Parameters.AddWithValue("@Status", request.Status);
                command.Parameters.AddWithValue("@PublishedAt", request.PublishedAt ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ApplicationDeadline", request.ApplicationDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@NumberOfPositions", request.NumberOfPositions);
                command.Parameters.AddWithValue("@InternalPosting", false);
                command.Parameters.AddWithValue("@ExternalPosting", true);
                command.Parameters.AddWithValue("@CreatedAt", DateTime.Now);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);
                command.Parameters.AddWithValue("@CreatedById", "3D287A93-9DE4-48F7-B9ED-26F0A5B0E124");

                await command.ExecuteNonQueryAsync();

                return CreatedAtAction(nameof(GetJobPosting), new { id }, new { id, message = "Job posting created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating job posting: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJobPosting(string id, [FromBody] UpdateJobPostingRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    UPDATE JobPostings 
                    SET Title = @Title, Description = @Description, Requirements = @Requirements, Location = @Location, 
                        WorkType = @WorkType, EmploymentType = @EmploymentType, ExperienceLevel = @ExperienceLevel, 
                        Status = @Status, PublishedAt = @PublishedAt, ApplicationDeadline = @ApplicationDeadline, 
                        NumberOfPositions = @NumberOfPositions, UpdatedAt = @UpdatedAt
                    WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Title", request.Title);
                command.Parameters.AddWithValue("@Description", request.Description);
                command.Parameters.AddWithValue("@Requirements", request.Requirements);
                command.Parameters.AddWithValue("@Location", request.Location);
                command.Parameters.AddWithValue("@WorkType", request.WorkType);
                command.Parameters.AddWithValue("@EmploymentType", request.EmploymentType);
                command.Parameters.AddWithValue("@ExperienceLevel", request.ExperienceLevel);
                command.Parameters.AddWithValue("@Status", request.Status);
                command.Parameters.AddWithValue("@PublishedAt", request.PublishedAt ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@ApplicationDeadline", request.ApplicationDeadline ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@NumberOfPositions", request.NumberOfPositions);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Job posting updated successfully" });
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating job posting: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobPosting(string id)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = "DELETE FROM JobPostings WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Job posting deleted successfully" });
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting job posting: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveJobPosting(string id, [FromBody] ApproveJobPostingRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    UPDATE JobPostings 
                    SET Status = @Status, PublishedAt = @PublishedAt, UpdatedAt = @UpdatedAt
                    WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Status", request.Status);
                command.Parameters.AddWithValue("@PublishedAt", request.PublishedAt ?? DateTime.Now);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { id, message = "Job posting approved successfully", status = request.Status });
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving job posting: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectJobPosting(string id, [FromBody] RejectJobPostingRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    UPDATE JobPostings 
                    SET Status = @Status, UpdatedAt = @UpdatedAt
                    WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Status", request.Status);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { id, message = "Job posting rejected successfully", status = request.Status });
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting job posting: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        private async Task<int> GetCountAsync(SqlConnection connection, string query)
        {
            using var command = new SqlCommand(query, connection);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
    }

    public class CreateJobPostingRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string WorkType { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public string Status { get; set; } = "Draft";
        public DateTime? PublishedAt { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public int NumberOfPositions { get; set; } = 1;
    }

    public class UpdateJobPostingRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string WorkType { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? PublishedAt { get; set; }
        public DateTime? ApplicationDeadline { get; set; }
        public int NumberOfPositions { get; set; }
    }

    public class ApproveJobPostingRequest
    {
        public string Status { get; set; } = "Active";
        public DateTime? PublishedAt { get; set; }
        public string? ReviewComment { get; set; }
    }

    public class RejectJobPostingRequest
    {
        public string Status { get; set; } = "Rejected";
        public string? ReviewComment { get; set; }
    }
}
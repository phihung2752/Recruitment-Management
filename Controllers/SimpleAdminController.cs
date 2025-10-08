using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class SimpleAdminController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SimpleAdminController> _logger;

        public SimpleAdminController(IConfiguration configuration, ILogger<SimpleAdminController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("SqlServerConnection") ?? 
                   "Server=localhost;Database=HRManagementDB;User Id=SA;Password=Hung@2752025;TrustServerCertificate=True;";
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var stats = new
                {
                    totalUsers = await GetCountAsync(connection, "SELECT COUNT(*) FROM Users"),
                    totalCandidates = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates"),
                    totalJobPostings = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings"),
                    totalInterviews = await GetCountAsync(connection, "SELECT COUNT(*) FROM Interviews"),
                    pendingApprovals = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings WHERE Status = 'Draft'"),
                    activeRecruitments = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings WHERE Status = 'Active'"),
                    completedHires = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates WHERE Status = 'Hired'"),
                    systemHealth = 95
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching dashboard stats: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("candidates")]
        public async Task<IActionResult> GetCandidates([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                // Test simple query first
                var testQuery = "SELECT COUNT(*) FROM Candidates";
                using var testCommand = new SqlCommand(testQuery, connection);
                var count = await testCommand.ExecuteScalarAsync();
                _logger.LogInformation($"Candidates count: {count}");

                var candidates = new List<object>();
                var query = new System.Text.StringBuilder($@"
                    SELECT Id, FirstName, LastName, Email, Phone, CurrentPosition, YearsOfExperience, Skills, Status, CreatedAt, UpdatedAt
                    FROM Candidates
                    WHERE 1=1");

                if (!string.IsNullOrEmpty(search))
                {
                    query.Append(" AND (FirstName LIKE @Search OR LastName LIKE @Search OR Email LIKE @Search OR CurrentPosition LIKE @Search)");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    query.Append(" AND Status = @Status");
                }

                query.Append(" ORDER BY CreatedAt DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

                using var command = new SqlCommand(query.ToString(), connection);
                command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                command.Parameters.AddWithValue("@PageSize", pageSize);
                if (!string.IsNullOrEmpty(search))
                {
                    command.Parameters.AddWithValue("@Search", $"%{search}%");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    command.Parameters.AddWithValue("@Status", status);
                }

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        candidates.Add(new
                        {
                            Id = reader.GetString(reader.GetOrdinal("Id")),
                            FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                            LastName = reader.GetString(reader.GetOrdinal("LastName")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? (string?)null : reader.GetString(reader.GetOrdinal("Phone")),
                            CurrentPosition = reader.IsDBNull(reader.GetOrdinal("CurrentPosition")) ? (string?)null : reader.GetString(reader.GetOrdinal("CurrentPosition")),
                            Experience = reader.IsDBNull(reader.GetOrdinal("YearsOfExperience")) ? (string?)null : reader.GetInt32(reader.GetOrdinal("YearsOfExperience")).ToString(),
                            Skills = reader.IsDBNull(reader.GetOrdinal("Skills")) ? (string?)null : reader.GetString(reader.GetOrdinal("Skills")),
                            Status = reader.GetString(reader.GetOrdinal("Status")),
                            CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                            UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                        });
                    }
                }

                // Get total count with same filters using separate connection
                using var countConnection = new SqlConnection(GetConnectionString());
                await countConnection.OpenAsync();
                
                var countQuery = new System.Text.StringBuilder("SELECT COUNT(*) FROM Candidates WHERE 1=1");
                if (!string.IsNullOrEmpty(search))
                {
                    countQuery.Append(" AND (FirstName LIKE @Search OR LastName LIKE @Search OR Email LIKE @Search OR CurrentPosition LIKE @Search)");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    countQuery.Append(" AND Status = @Status");
                }

                using var countCommand = new SqlCommand(countQuery.ToString(), countConnection);
                if (!string.IsNullOrEmpty(search))
                {
                    countCommand.Parameters.AddWithValue("@Search", $"%{search}%");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    countCommand.Parameters.AddWithValue("@Status", status);
                }

                var totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());

                return Ok(new
                {
                    candidates,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching candidates: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("jobpostings")]
        public async Task<IActionResult> GetJobPostings([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var jobPostings = new List<object>();
                var query = new System.Text.StringBuilder($@"
                    SELECT Id, Title, Description, Requirements, Location, WorkType, EmploymentType, ExperienceLevel, Status, PublishedAt, ApplicationDeadline, NumberOfPositions, CreatedAt, UpdatedAt
                    FROM JobPostings
                    WHERE 1=1");

                if (!string.IsNullOrEmpty(search))
                {
                    query.Append(" AND (Title LIKE @Search OR Description LIKE @Search OR Location LIKE @Search)");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    query.Append(" AND Status = @Status");
                }

                query.Append(" ORDER BY CreatedAt DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

                using var command = new SqlCommand(query.ToString(), connection);
                command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                command.Parameters.AddWithValue("@PageSize", pageSize);
                if (!string.IsNullOrEmpty(search))
                {
                    command.Parameters.AddWithValue("@Search", $"%{search}%");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    command.Parameters.AddWithValue("@Status", status);
                }

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

                var countQuery = new System.Text.StringBuilder("SELECT COUNT(*) FROM JobPostings WHERE 1=1");
                if (!string.IsNullOrEmpty(search))
                {
                    countQuery.Append(" AND (Title LIKE @Search OR Description LIKE @Search OR Location LIKE @Search)");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    countQuery.Append(" AND Status = @Status");
                }

                var totalCount = await GetCountAsync(connection, countQuery.ToString());

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
                _logger.LogError(ex, "Error fetching job postings: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("interviews")]
        public async Task<IActionResult> GetInterviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var interviews = new List<object>();
                var query = @"
                    SELECT Id, CandidateId, JobPostingId, InterviewerId, InterviewDate, Status, Notes, CreatedAt, UpdatedAt
                    FROM Interviews
                    ORDER BY CreatedAt DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                command.Parameters.AddWithValue("@PageSize", pageSize);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    interviews.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        CandidateId = reader.GetString(reader.GetOrdinal("CandidateId")),
                        JobPostingId = reader.GetString(reader.GetOrdinal("JobPostingId")),
                        InterviewerId = reader.GetString(reader.GetOrdinal("InterviewerId")),
                        InterviewDate = reader.GetDateTime(reader.GetOrdinal("InterviewDate")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? (string?)null : reader.GetString(reader.GetOrdinal("Notes")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    });
                }

                var totalCount = await GetCountAsync(connection, "SELECT COUNT(*) FROM Interviews");

                return Ok(new
                {
                    interviews,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching interviews: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? department = null, [FromQuery] string? status = null)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                // First, let's check if we have any employees at all
                var testQuery = "SELECT COUNT(*) FROM Employees";
                using var testCommand = new SqlCommand(testQuery, connection);
                var employeeCount = (int)await testCommand.ExecuteScalarAsync();
                
                if (employeeCount == 0)
                {
                    return Ok(new
                    {
                        employees = new List<object>(),
                        totalCount = 0,
                        page,
                        pageSize,
                        totalPages = 0,
                        message = "No employees found in database"
                    });
                }

                var employees = new List<object>();
                var query = new System.Text.StringBuilder($@"
                    SELECT e.Id, u.FirstName, u.LastName, u.Email, u.PhoneNumber as Phone, 
                           p.Title as Position, d.Name as Department, 
                           CASE WHEN e.TerminationDate IS NULL THEN 'Active' ELSE 'Inactive' END as Status,
                           e.HireDate, e.CreatedAt, e.UpdatedAt
                    FROM Employees e
                    INNER JOIN Users u ON e.UserId = u.Id
                    LEFT JOIN Positions p ON e.PositionId = p.Id
                    LEFT JOIN Departments d ON e.DepartmentId = d.Id
                    WHERE 1=1");

                if (!string.IsNullOrEmpty(search))
                {
                    query.Append(" AND (u.FirstName LIKE @Search OR u.LastName LIKE @Search OR u.Email LIKE @Search OR p.Title LIKE @Search)");
                }
                if (!string.IsNullOrEmpty(department) && department != "All")
                {
                    query.Append(" AND d.Name = @Department");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    if (status == "Active")
                    {
                        query.Append(" AND e.TerminationDate IS NULL");
                    }
                    else if (status == "Inactive")
                    {
                        query.Append(" AND e.TerminationDate IS NOT NULL");
                    }
                }

                query.Append(" ORDER BY e.CreatedAt DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

                using var command = new SqlCommand(query.ToString(), connection);
                command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                command.Parameters.AddWithValue("@PageSize", pageSize);
                if (!string.IsNullOrEmpty(search))
                {
                    command.Parameters.AddWithValue("@Search", $"%{search}%");
                }
                if (!string.IsNullOrEmpty(department) && department != "All")
                {
                    command.Parameters.AddWithValue("@Department", department);
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    command.Parameters.AddWithValue("@Status", status);
                }

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    employees.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        LastName = reader.GetString(reader.GetOrdinal("LastName")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? (string?)null : reader.GetString(reader.GetOrdinal("Phone")),
                        Position = reader.IsDBNull(reader.GetOrdinal("Position")) ? "N/A" : reader.GetString(reader.GetOrdinal("Position")),
                        Department = reader.IsDBNull(reader.GetOrdinal("Department")) ? "N/A" : reader.GetString(reader.GetOrdinal("Department")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        HireDate = reader.GetDateTime(reader.GetOrdinal("HireDate")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    });
                }

                // Use separate connection for count query to avoid DataReader conflicts
                using var countConnection = new SqlConnection(GetConnectionString());
                await countConnection.OpenAsync();
                
                var countQuery = new System.Text.StringBuilder($@"
                    SELECT COUNT(*)
                    FROM Employees e
                    INNER JOIN Users u ON e.UserId = u.Id
                    LEFT JOIN Positions p ON e.PositionId = p.Id
                    LEFT JOIN Departments d ON e.DepartmentId = d.Id
                    WHERE 1=1");
                    
                if (!string.IsNullOrEmpty(search))
                {
                    countQuery.Append(" AND (u.FirstName LIKE @Search OR u.LastName LIKE @Search OR u.Email LIKE @Search OR p.Title LIKE @Search)");
                }
                if (!string.IsNullOrEmpty(department) && department != "All")
                {
                    countQuery.Append(" AND d.Name = @Department");
                }
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    if (status == "Active")
                    {
                        countQuery.Append(" AND e.TerminationDate IS NULL");
                    }
                    else if (status == "Inactive")
                    {
                        countQuery.Append(" AND e.TerminationDate IS NOT NULL");
                    }
                }

                using var countCommand = new SqlCommand(countQuery.ToString(), countConnection);
                if (!string.IsNullOrEmpty(search))
                {
                    countCommand.Parameters.AddWithValue("@Search", $"%{search}%");
                }
                if (!string.IsNullOrEmpty(department) && department != "All")
                {
                    countCommand.Parameters.AddWithValue("@Department", department);
                }

                var totalCount = (int)await countCommand.ExecuteScalarAsync();

                return Ok(new
                {
                    employees,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employees: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("reports")]
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
                        downloadUrl = "/api/admin/reports/report-001/download"
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
                        downloadUrl = "/api/admin/reports/report-002/download"
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
                        downloadUrl = "/api/admin/reports/report-003/download"
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
                        downloadUrl = "/api/admin/reports/report-004/download"
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
                _logger.LogError(ex, "Error fetching reports: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        u.Id as UserId,
                        u.Username,
                        u.Email,
                        u.FirstName,
                        u.LastName,
                        CASE WHEN u.IsActive = 1 THEN 'Active' ELSE 'Inactive' END as Status,
                        COALESCE(r.Name, 'Employee') as RoleName,
                        u.CreatedAt
                    FROM Users u
                    LEFT JOIN UserRoles ur ON u.Id = ur.UserId
                    LEFT JOIN Roles r ON ur.RoleId = r.Id
                    ORDER BY u.CreatedAt DESC";

                using var command = new SqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                var users = new List<object>();
                while (await reader.ReadAsync())
                {
                    users.Add(new
                    {
                        UserId = reader.GetString("UserId"),
                        Username = reader.GetString("Username"),
                        Email = reader.GetString("Email"),
                        FirstName = reader.GetString("FirstName"),
                        LastName = reader.GetString("LastName"),
                        Status = reader.GetString("Status"),
                        RoleName = reader.IsDBNull("RoleName") ? "Employee" : reader.GetString("RoleName"),
                        CreatedAt = reader.GetDateTime("CreatedAt").ToString("yyyy-MM-ddTHH:mm:ssZ")
                    });
                }

                return Ok(new { users });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        private async Task<int> GetCountAsync(SqlConnection connection, string query)
        {
            using var command = new SqlCommand(query, connection);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
    }
}
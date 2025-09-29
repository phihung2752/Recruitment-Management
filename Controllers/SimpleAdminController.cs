using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Text.Json;

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
                    pendingApprovals = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings WHERE Status = 'Pending'"),
                    activeRecruitments = await GetCountAsync(connection, "SELECT COUNT(*) FROM JobPostings WHERE Status = 'Active'"),
                    completedHires = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates WHERE Status = 'Hired'"),
                    systemHealth = 95
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard stats: {Message}", ex.Message);
                
                // Return mock data if database connection fails
                var mockStats = new
                {
                    totalUsers = 5,
                    totalCandidates = 8,
                    totalJobPostings = 5,
                    totalInterviews = 5,
                    pendingApprovals = 3,
                    activeRecruitments = 5,
                    completedHires = 2,
                    systemHealth = 95
                };
                return Ok(mockStats);
            }
        }

        [HttpGet("activities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var activities = new List<object>
                {
                    new
                    {
                        id = "1",
                        type = "candidate",
                        title = "Ứng viên mới đăng ký",
                        description = "John Doe đã đăng ký ứng tuyển vị trí Frontend Developer",
                        timestamp = DateTime.Now.AddMinutes(-30),
                        status = "success"
                    },
                    new
                    {
                        id = "2",
                        type = "job",
                        title = "Tin tuyển dụng được tạo",
                        description = "Tin tuyển dụng 'Senior Backend Developer' đã được tạo",
                        timestamp = DateTime.Now.AddHours(-2),
                        status = "info"
                    },
                    new
                    {
                        id = "3",
                        type = "interview",
                        title = "Phỏng vấn được lên lịch",
                        description = "Phỏng vấn với Jane Smith được lên lịch vào 14:00 ngày mai",
                        timestamp = DateTime.Now.AddHours(-4),
                        status = "info"
                    },
                    new
                    {
                        id = "4",
                        type = "system",
                        title = "Cảnh báo hệ thống",
                        description = "Email service có thể gặp sự cố",
                        timestamp = DateTime.Now.AddHours(-6),
                        status = "warning"
                    }
                };

                return Ok(activities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activities: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("candidates")]
        public async Task<IActionResult> GetCandidates([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var offset = (page - 1) * pageSize;
                var query = @"
                    SELECT Id, FirstName, LastName, Email, PhoneNumber, Status, CreatedAt, UpdatedAt
                    FROM Candidates 
                    ORDER BY CreatedAt DESC
                    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";

                var candidates = new List<object>();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@pageSize", pageSize);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    candidates.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        LastName = reader.GetString(reader.GetOrdinal("LastName")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? null : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    });
                }

                var totalCount = await GetCountAsync(connection, "SELECT COUNT(*) FROM Candidates");

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
                _logger.LogError(ex, "Error getting candidates: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("job-postings")]
        public async Task<IActionResult> GetJobPostings([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var offset = (page - 1) * pageSize;
                var query = @"
                    SELECT Id, Title, Department, Location, Status, CreatedAt, UpdatedAt, Deadline
                    FROM JobPostings 
                    ORDER BY CreatedAt DESC
                    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";

                var jobPostings = new List<object>();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@pageSize", pageSize);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    jobPostings.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        Title = reader.GetString(reader.GetOrdinal("Title")),
                        Department = reader.GetString(reader.GetOrdinal("Department")),
                        Location = reader.GetString(reader.GetOrdinal("Location")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                        Deadline = reader.IsDBNull(reader.GetOrdinal("Deadline")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("Deadline"))
                    });
                }

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

        [HttpGet("interviews")]
        public async Task<IActionResult> GetInterviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var offset = (page - 1) * pageSize;
                var query = @"
                    SELECT i.Id, i.ScheduledDate, i.Status, i.InterviewType, i.CreatedAt,
                           c.FirstName + ' ' + c.LastName as CandidateName,
                           j.Title as JobTitle
                    FROM Interviews i
                    LEFT JOIN Candidates c ON i.CandidateId = c.Id
                    LEFT JOIN JobPostings j ON i.JobPostingId = j.Id
                    ORDER BY i.CreatedAt DESC
                    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";

                var interviews = new List<object>();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@pageSize", pageSize);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    interviews.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        ScheduledDate = reader.GetDateTime(reader.GetOrdinal("ScheduledDate")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        InterviewType = reader.GetString(reader.GetOrdinal("InterviewType")),
                        CandidateName = reader.IsDBNull(reader.GetOrdinal("CandidateName")) ? "N/A" : reader.GetString(reader.GetOrdinal("CandidateName")),
                        JobTitle = reader.IsDBNull(reader.GetOrdinal("JobTitle")) ? "N/A" : reader.GetString(reader.GetOrdinal("JobTitle")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
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
                _logger.LogError(ex, "Error getting interviews: {Message}", ex.Message);
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

                var offset = (page - 1) * pageSize;
                var query = @"
                    SELECT e.Id, e.EmployeeCode, e.HireDate, e.TerminationDate, e.Salary, e.Status, e.CreatedAt, e.UpdatedAt,
                           u.FirstName, u.LastName, u.Email, u.PhoneNumber, u.Avatar,
                           d.Name as DepartmentName,
                           p.Title as PositionTitle,
                           m.FirstName + ' ' + m.LastName as ManagerName
                    FROM Employees e
                    LEFT JOIN Users u ON e.UserId = u.Id
                    LEFT JOIN Departments d ON e.DepartmentId = d.Id
                    LEFT JOIN Positions p ON e.PositionId = p.Id
                    LEFT JOIN Users m ON d.ManagerId = m.Id
                    WHERE (@search IS NULL OR u.FirstName LIKE '%' + @search + '%' OR u.LastName LIKE '%' + @search + '%' OR u.Email LIKE '%' + @search + '%' OR e.EmployeeCode LIKE '%' + @search + '%')
                    AND (@department IS NULL OR d.Name = @department)
                    AND (@status IS NULL OR e.Status = @status)
                    ORDER BY e.CreatedAt DESC
                    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";

                var employees = new List<object>();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@search", (object)search ?? DBNull.Value);
                command.Parameters.AddWithValue("@department", (object)department ?? DBNull.Value);
                command.Parameters.AddWithValue("@status", (object)status ?? DBNull.Value);
                command.Parameters.AddWithValue("@offset", offset);
                command.Parameters.AddWithValue("@pageSize", pageSize);

                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    employees.Add(new
                    {
                        Id = reader.GetString(reader.GetOrdinal("Id")),
                        EmployeeCode = reader.GetString(reader.GetOrdinal("EmployeeCode")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        LastName = reader.GetString(reader.GetOrdinal("LastName")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? null : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                        Avatar = reader.IsDBNull(reader.GetOrdinal("Avatar")) ? null : reader.GetString(reader.GetOrdinal("Avatar")),
                        Department = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? "Unknown" : reader.GetString(reader.GetOrdinal("DepartmentName")),
                        Position = reader.IsDBNull(reader.GetOrdinal("PositionTitle")) ? "Unknown" : reader.GetString(reader.GetOrdinal("PositionTitle")),
                        Manager = reader.IsDBNull(reader.GetOrdinal("ManagerName")) ? "Unknown" : reader.GetString(reader.GetOrdinal("ManagerName")),
                        HireDate = reader.GetDateTime(reader.GetOrdinal("HireDate")).ToString("yyyy-MM-dd"),
                        TerminationDate = reader.IsDBNull(reader.GetOrdinal("TerminationDate")) ? null : reader.GetDateTime(reader.GetOrdinal("TerminationDate")).ToString("yyyy-MM-dd"),
                        Salary = reader.GetDecimal(reader.GetOrdinal("Salary")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        WorkType = "Full-time", // Default value since it's not in the current schema
                        Location = "Office", // Default value since it's not in the current schema
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    });
                }

                var totalCount = await GetCountAsync(connection, "SELECT COUNT(*) FROM Employees");

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
                _logger.LogError(ex, "Error getting employees: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        private async Task<int> GetCountAsync(SqlConnection connection, string query)
        {
            using var command = new SqlCommand(query, connection);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        [HttpGet("candidates")]
        public IActionResult GetCandidates([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = "", [FromQuery] string status = "All")
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            connection.Open();

            // Build search condition
            var searchCondition = "";
            var parameters = new List<SqlParameter>();
            
            if (!string.IsNullOrEmpty(search))
            {
                searchCondition = "AND (c.Name LIKE @search OR c.Email LIKE @search OR c.Position LIKE @search)";
                parameters.Add(new SqlParameter("@search", $"%{search}%"));
            }

            if (status != "All")
            {
                searchCondition += " AND c.Status = @status";
                parameters.Add(new SqlParameter("@status", status));
            }

            // Get total count
            var countQuery = $@"
                SELECT COUNT(*) 
                FROM Candidates c 
                WHERE 1=1 {searchCondition}";

            using var countCommand = new SqlCommand(countQuery, connection);
            countCommand.Parameters.AddRange(parameters.ToArray());
            var totalCount = (int)countCommand.ExecuteScalar();

            // Get candidates with pagination
            var offset = (page - 1) * pageSize;
            var query = $@"
                SELECT 
                    c.Id,
                    c.Name,
                    c.Email,
                    c.Phone,
                    c.Position,
                    c.Status,
                    c.Experience,
                    c.Skills,
                    c.AIScore,
                    c.CreatedAt
                FROM Candidates c 
                WHERE 1=1 {searchCondition}
                ORDER BY c.CreatedAt DESC
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddRange(parameters.ToArray());
            command.Parameters.Add(new SqlParameter("@offset", offset));
            command.Parameters.Add(new SqlParameter("@pageSize", pageSize));

            var candidates = new List<object>();
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                var skills = reader["Skills"]?.ToString();
                var skillsList = !string.IsNullOrEmpty(skills) ? skills.Split(',').ToList() : new List<string>();

                candidates.Add(new
                {
                    id = reader["Id"].ToString(),
                    name = reader["Name"].ToString(),
                    email = reader["Email"].ToString(),
                    phone = reader["Phone"]?.ToString(),
                    position = reader["Position"].ToString(),
                    status = reader["Status"].ToString(),
                    experience = reader["Experience"]?.ToString(),
                    skills = skillsList,
                    aiScore = reader["AIScore"] != DBNull.Value ? (int)reader["AIScore"] : 0,
                    createdAt = reader["CreatedAt"],
                    avatar = "",
                    interviewRounds = new List<object>
                    {
                        new
                        {
                            id = 1,
                            name = "Initial Screening",
                            status = "pending",
                            type = "screening",
                            interviewer = "HR Team",
                            interviewerAvatar = "",
                            scheduledDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-ddTHH:mm:ssZ"),
                            duration = 30,
                            location = "Online"
                        }
                    }
                });
            }

            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            return Ok(new { 
                candidates = candidates, 
                totalCount = totalCount, 
                page = page, 
                pageSize = pageSize, 
                totalPages = totalPages 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching candidates");
            return StatusCode(500, new { error = "Failed to fetch candidates" });
        }
    }
}

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

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                // Check if username or email already exists
                var checkQuery = @"
                    SELECT COUNT(*) FROM Users 
                    WHERE Username = @Username OR Email = @Email";

                using var checkCommand = new SqlCommand(checkQuery, connection);
                checkCommand.Parameters.AddWithValue("@Username", request.Username);
                checkCommand.Parameters.AddWithValue("@Email", request.Email);

                var exists = (int)await checkCommand.ExecuteScalarAsync();
                if (exists > 0)
                {
                    return BadRequest(new { message = "Username or email already exists" });
                }

                // Create new user
                var userId = Guid.NewGuid().ToString();
                var insertQuery = @"
                    INSERT INTO Users (Id, Username, Email, PasswordHash, Salt, FirstName, LastName, IsActive, CreatedAt, UpdatedAt)
                    VALUES (@Id, @Username, @Email, @PasswordHash, @Salt, @FirstName, @LastName, @IsActive, @CreatedAt, @UpdatedAt)";

                using var insertCommand = new SqlCommand(insertQuery, connection);
                insertCommand.Parameters.AddWithValue("@Id", userId);
                insertCommand.Parameters.AddWithValue("@Username", request.Username);
                insertCommand.Parameters.AddWithValue("@Email", request.Email);
                insertCommand.Parameters.AddWithValue("@PasswordHash", BCrypt.Net.BCrypt.HashPassword(request.Password));
                insertCommand.Parameters.AddWithValue("@Salt", "");
                insertCommand.Parameters.AddWithValue("@FirstName", request.FirstName);
                insertCommand.Parameters.AddWithValue("@LastName", request.LastName);
                insertCommand.Parameters.AddWithValue("@IsActive", true);
                insertCommand.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                insertCommand.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

                await insertCommand.ExecuteNonQueryAsync();

                // Get the created user
                var getUserQuery = @"
                    SELECT 
                        u.Id as UserId,
                        u.Username,
                        u.Email,
                        u.FirstName,
                        u.LastName,
                        CASE WHEN u.IsActive = 1 THEN 'Active' ELSE 'Inactive' END as Status,
                        'Employee' as RoleName,
                        u.CreatedAt
                    FROM Users u
                    WHERE u.Id = @Id";

                using var getUserCommand = new SqlCommand(getUserQuery, connection);
                getUserCommand.Parameters.AddWithValue("@Id", userId);
                using var reader = await getUserCommand.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    var newUser = new
                    {
                        UserId = reader.GetString("UserId"),
                        Username = reader.GetString("Username"),
                        Email = reader.GetString("Email"),
                        FirstName = reader.GetString("FirstName"),
                        LastName = reader.GetString("LastName"),
                        Status = reader.GetString("Status"),
                        RoleName = reader.GetString("RoleName"),
                        CreatedAt = reader.GetDateTime("CreatedAt").ToString("yyyy-MM-ddTHH:mm:ssZ")
                    };

                    return Ok(new { success = true, message = "User created successfully", user = newUser });
                }

                return StatusCode(500, new { message = "Failed to retrieve created user" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        r.Id,
                        r.Name,
                        r.Description,
                        r.IsSystemRole,
                        r.CreatedAt,
                        COUNT(ur.UserId) as UserCount
                    FROM Roles r
                    LEFT JOIN UserRoles ur ON r.Id = ur.RoleId
                    GROUP BY r.Id, r.Name, r.Description, r.IsSystemRole, r.CreatedAt
                    ORDER BY r.CreatedAt DESC";

                using var command = new SqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                var roles = new List<object>();
                while (await reader.ReadAsync())
                {
                    roles.Add(new
                    {
                        Id = reader.GetString("Id"),
                        Name = reader.GetString("Name"),
                        Description = reader.IsDBNull("Description") ? "" : reader.GetString("Description"),
                        IsSystemRole = reader.GetBoolean("IsSystemRole"),
                        UserCount = reader.GetInt32("UserCount"),
                        CreatedAt = reader.GetDateTime("CreatedAt").ToString("yyyy-MM-ddTHH:mm:ssZ")
                    });
                }

                return Ok(new { roles });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching roles: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("permissions")]
        public async Task<IActionResult> GetPermissions()
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        p.Id,
                        p.Name,
                        p.Description,
                        p.Module,
                        p.Action,
                        p.Resource,
                        p.CreatedAt
                    FROM Permissions p
                    ORDER BY p.Module, p.Action";

                using var command = new SqlCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                var permissions = new List<object>();
                while (await reader.ReadAsync())
                {
                    permissions.Add(new
                    {
                        Id = reader.GetString("Id"),
                        Name = reader.GetString("Name"),
                        Description = reader.IsDBNull("Description") ? "" : reader.GetString("Description"),
                        Module = reader.GetString("Module"),
                        Action = reader.GetString("Action"),
                        Resource = reader.GetString("Resource"),
                        CreatedAt = reader.GetDateTime("CreatedAt").ToString("yyyy-MM-ddTHH:mm:ssZ")
                    });
                }

                return Ok(new { permissions });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching permissions: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("users/{userId}/roles")]
        public async Task<IActionResult> AssignUserRole(string userId, [FromBody] AssignRoleRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                // Check if user exists
                var userExistsQuery = "SELECT COUNT(*) FROM Users WHERE Id = @UserId";
                using var userExistsCommand = new SqlCommand(userExistsQuery, connection);
                userExistsCommand.Parameters.AddWithValue("@UserId", userId);
                var userExists = (int)await userExistsCommand.ExecuteScalarAsync();

                if (userExists == 0)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Check if role exists
                var roleExistsQuery = "SELECT COUNT(*) FROM Roles WHERE Id = @RoleId";
                using var roleExistsCommand = new SqlCommand(roleExistsQuery, connection);
                roleExistsCommand.Parameters.AddWithValue("@RoleId", request.RoleId);
                var roleExists = (int)await roleExistsCommand.ExecuteScalarAsync();

                if (roleExists == 0)
                {
                    return NotFound(new { message = "Role not found" });
                }

                // Check if assignment already exists
                var existsQuery = "SELECT COUNT(*) FROM UserRoles WHERE UserId = @UserId AND RoleId = @RoleId";
                using var existsCommand = new SqlCommand(existsQuery, connection);
                existsCommand.Parameters.AddWithValue("@UserId", userId);
                existsCommand.Parameters.AddWithValue("@RoleId", request.RoleId);
                var alreadyExists = (int)await existsCommand.ExecuteScalarAsync();

                if (alreadyExists > 0)
                {
                    return BadRequest(new { message = "User already has this role" });
                }

                // Assign role
                var assignQuery = @"
                    INSERT INTO UserRoles (UserId, RoleId, AssignedAt, AssignedById)
                    VALUES (@UserId, @RoleId, @AssignedAt, @AssignedById)";

                using var assignCommand = new SqlCommand(assignQuery, connection);
                assignCommand.Parameters.AddWithValue("@UserId", userId);
                assignCommand.Parameters.AddWithValue("@RoleId", request.RoleId);
                assignCommand.Parameters.AddWithValue("@AssignedAt", DateTime.UtcNow);
                assignCommand.Parameters.AddWithValue("@AssignedById", DBNull.Value); // TODO: Get from current user

                await assignCommand.ExecuteNonQueryAsync();

                return Ok(new { success = true, message = "Role assigned successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning role: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("users/{userId}/roles/{roleId}")]
        public async Task<IActionResult> RemoveUserRole(string userId, string roleId)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = "DELETE FROM UserRoles WHERE UserId = @UserId AND RoleId = @RoleId";
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@UserId", userId);
                command.Parameters.AddWithValue("@RoleId", roleId);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected == 0)
                {
                    return NotFound(new { message = "User role assignment not found" });
                }

                return Ok(new { success = true, message = "Role removed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing role: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        public class CreateUserRequest
        {
            public string Username { get; set; } = "";
            public string Email { get; set; } = "";
            public string Password { get; set; } = "";
            public string FirstName { get; set; } = "";
            public string LastName { get; set; } = "";
        }

        public class AssignRoleRequest
        {
            public string RoleId { get; set; } = "";
        }

        private async Task<int> GetCountAsync(SqlConnection connection, string query)
        {
            using var command = new SqlCommand(query, connection);
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
    }
}
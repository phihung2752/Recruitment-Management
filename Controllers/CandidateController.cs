using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/candidates")]
    public class CandidateController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<CandidateController> _logger;

        public CandidateController(IConfiguration configuration, ILogger<CandidateController> logger)
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
        public async Task<IActionResult> GetCandidates([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCandidate(string id)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    SELECT Id, FirstName, LastName, Email, Phone, CurrentPosition, YearsOfExperience, Skills, Status, CreatedAt, UpdatedAt
                    FROM Candidates
                    WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var candidate = new
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
                    };

                    return Ok(candidate);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching candidate: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCandidate([FromBody] CreateCandidateRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var id = Guid.NewGuid().ToString();
                var query = @"
                    INSERT INTO Candidates (Id, FirstName, LastName, Email, Phone, CurrentPosition, YearsOfExperience, Skills, Status, CreatedAt, UpdatedAt)
                    VALUES (@Id, @FirstName, @LastName, @Email, @Phone, @CurrentPosition, @YearsOfExperience, @Skills, @Status, @CreatedAt, @UpdatedAt)";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@FirstName", request.FirstName);
                command.Parameters.AddWithValue("@LastName", request.LastName);
                command.Parameters.AddWithValue("@Email", request.Email);
                command.Parameters.AddWithValue("@Phone", request.Phone ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@CurrentPosition", request.CurrentPosition ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@YearsOfExperience", request.YearsOfExperience ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Skills", request.Skills ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", request.Status ?? "Pending");
                command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

                await command.ExecuteNonQueryAsync();

                return CreatedAtAction(nameof(GetCandidate), new { id }, new { id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating candidate: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidate(string id, [FromBody] UpdateCandidateRequest request)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = @"
                    UPDATE Candidates 
                    SET FirstName = @FirstName, LastName = @LastName, Email = @Email, Phone = @Phone, 
                        CurrentPosition = @CurrentPosition, YearsOfExperience = @YearsOfExperience, 
                        Skills = @Skills, Status = @Status, UpdatedAt = @UpdatedAt
                    WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@FirstName", request.FirstName);
                command.Parameters.AddWithValue("@LastName", request.LastName);
                command.Parameters.AddWithValue("@Email", request.Email);
                command.Parameters.AddWithValue("@Phone", request.Phone ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@CurrentPosition", request.CurrentPosition ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@YearsOfExperience", request.YearsOfExperience ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Skills", request.Skills ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@Status", request.Status ?? "Pending");
                command.Parameters.AddWithValue("@UpdatedAt", DateTime.UtcNow);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok();
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating candidate: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(string id)
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = "DELETE FROM Candidates WHERE Id = @Id";

                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                var rowsAffected = await command.ExecuteNonQueryAsync();

                if (rowsAffected > 0)
                {
                    return Ok();
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting candidate: {Message}", ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class CreateCandidateRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? CurrentPosition { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Skills { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateCandidateRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? CurrentPosition { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Skills { get; set; }
        public string? Status { get; set; }
    }
}





















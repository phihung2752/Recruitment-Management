using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace HRManagementSystem.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TestController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("SqlServerConnection") ?? 
                   "Server=localhost;Database=HRManagementDB;User Id=SA;Password=Hung@2752025;TrustServerCertificate=True;";
        }

        [HttpGet("job-postings")]
        public async Task<IActionResult> GetJobPostings()
        {
            try
            {
                using var connection = new SqlConnection(GetConnectionString());
                await connection.OpenAsync();

                var query = "SELECT COUNT(*) FROM JobPostings";
                using var command = new SqlCommand(query, connection);
                var count = await command.ExecuteScalarAsync();

                return Ok(new { count = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}


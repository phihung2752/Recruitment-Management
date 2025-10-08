using System.Text;
using System.Text.Json;

namespace HRManagementSystem.Services
{
    public class AICVAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AICVAnalysisService> _logger;
        private readonly string _apiKey;

        public AICVAnalysisService(HttpClient httpClient, ILogger<AICVAnalysisService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = configuration["GoogleSettings:ApiKey"] ?? "AIzaSyAWg5O3B40-glvaycqrYqfK6PKXWw5kvUA";
        }

        public async Task<CVAnalysisResult> AnalyzeCVAsync(string cvContent, string candidateName, string position)
        {
            try
            {
                var prompt = $@"
Phân tích CV của ứng viên {candidateName} cho vị trí {position}.

Nội dung CV:
{cvContent}

Hãy phân tích và trả về kết quả theo định dạng JSON sau:
{{
  ""overallScore"": 85,
  ""skillsMatch"": 90,
  ""experienceMatch"": 80,
  ""educationMatch"": 85,
  ""recommendedLabels"": [""Senior"", ""React Expert"", ""Team Lead""],
  ""strengths"": [""5+ năm kinh nghiệm React"", ""Có kinh nghiệm quản lý team"", ""Thành thạo TypeScript""],
  ""weaknesses"": [""Thiếu kinh nghiệm với Node.js"", ""Chưa có kinh nghiệm với AWS""],
  ""recommendation"": ""Strong Match"",
  ""interviewQuestions"": [
    ""Bạn có thể chia sẻ về dự án React phức tạp nhất mà bạn đã làm?"",
    ""Làm thế nào bạn quản lý team trong dự án trước đây?"",
    ""Bạn có kinh nghiệm gì với testing trong React?""
  ],
  ""suggestedSalary"": ""25-35 triệu VND"",
  ""priority"": ""High""
}}

Chỉ trả về JSON, không có text khác.";

                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new
                                {
                                    text = prompt
                                }
                            }
                        }
                    },
                    generationConfig = new
                    {
                        temperature = 0.3,
                        topK = 40,
                        topP = 0.95,
                        maxOutputTokens = 2048
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(
                    $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_apiKey}",
                    content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseObj = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    
                    if (responseObj.TryGetProperty("candidates", out var candidates) && 
                        candidates.GetArrayLength() > 0)
                    {
                        var candidate = candidates[0];
                        if (candidate.TryGetProperty("content", out var contentObj) &&
                            contentObj.TryGetProperty("parts", out var parts) &&
                            parts.GetArrayLength() > 0)
                        {
                            var text = parts[0].GetProperty("text").GetString();
                            if (!string.IsNullOrEmpty(text))
                            {
                                // Extract JSON from response
                                var jsonStart = text.IndexOf('{');
                                var jsonEnd = text.LastIndexOf('}');
                                if (jsonStart >= 0 && jsonEnd > jsonStart)
                                {
                                    var jsonText = text.Substring(jsonStart, jsonEnd - jsonStart + 1);
                                    var result = JsonSerializer.Deserialize<CVAnalysisResult>(jsonText);
                                    return result;
                                }
                            }
                        }
                    }
                }

                _logger.LogWarning("AI analysis failed, returning default result");
                return GetDefaultAnalysisResult();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing CV: {Message}", ex.Message);
                return GetDefaultAnalysisResult();
            }
        }

        private CVAnalysisResult GetDefaultAnalysisResult()
        {
            return new CVAnalysisResult
            {
                OverallScore = 70,
                SkillsMatch = 75,
                ExperienceMatch = 65,
                EducationMatch = 70,
                RecommendedLabels = new[] { "Standard", "Potential" },
                Strengths = new[] { "Có kinh nghiệm cơ bản", "Sẵn sàng học hỏi" },
                Weaknesses = new[] { "Cần đánh giá thêm trong phỏng vấn" },
                Recommendation = "Review",
                InterviewQuestions = new[] { "Bạn có thể giới thiệu về bản thân?", "Tại sao bạn quan tâm đến vị trí này?" },
                SuggestedSalary = "15-25 triệu VND",
                Priority = "Medium"
            };
        }
    }

    public class CVAnalysisResult
    {
        public int OverallScore { get; set; }
        public int SkillsMatch { get; set; }
        public int ExperienceMatch { get; set; }
        public int EducationMatch { get; set; }
        public string[] RecommendedLabels { get; set; } = Array.Empty<string>();
        public string[] Strengths { get; set; } = Array.Empty<string>();
        public string[] Weaknesses { get; set; } = Array.Empty<string>();
        public string Recommendation { get; set; } = "Review";
        public string[] InterviewQuestions { get; set; } = Array.Empty<string>();
        public string SuggestedSalary { get; set; } = "15-25 triệu VND";
        public string Priority { get; set; } = "Medium";
    }
}





















using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace HRManagementSystem.Services
{
    public class CVCollectionService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CVCollectionService> _logger;
        private readonly string _googleAIKey;

        public CVCollectionService(HttpClient httpClient, IConfiguration configuration, ILogger<CVCollectionService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _googleAIKey = "AIzaSyAWg5O3B40-glvaycqrYqfK6PKXWw5kvUA";
        }

        public async Task<List<CollectedCV>> CollectCVsFromJobSitesAsync(List<string> jobSites)
        {
            var collectedCVs = new List<CollectedCV>();

            foreach (var site in jobSites)
            {
                try
                {
                    _logger.LogInformation($"Collecting CVs from {site}");
                    
                    // Simulate CV collection from job sites
                    var cvs = await SimulateCVCollection(site);
                    collectedCVs.AddRange(cvs);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error collecting CVs from {site}");
                }
            }

            return collectedCVs;
        }

        public async Task<CVAnalysisResult> AnalyzeCVWithAIAsync(string cvContent, string candidateName)
        {
            try
            {
                var prompt = $@"
                Analyze this CV for candidate {candidateName} and provide:
                1. Technical skills score (0-100)
                2. Experience level (Junior/Mid/Senior)
                3. Education background
                4. Key strengths
                5. Areas for improvement
                6. Overall recommendation (Strong/Good/Average/Weak)
                7. Suggested interview questions
                
                CV Content: {cvContent}
                
                Respond in JSON format.
                ";

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

                var response = await _httpClient.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_googleAIKey}", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    
                    if (result.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                    {
                        var firstCandidate = candidates[0];
                        if (firstCandidate.TryGetProperty("content", out var contentObj) && 
                            contentObj.TryGetProperty("parts", out var parts) && 
                            parts.GetArrayLength() > 0)
                        {
                            var analysisText = parts[0].GetProperty("text").GetString() ?? "";
                            return ParseAIAnalysis(analysisText);
                        }
                    }
                }

                // Fallback analysis if AI fails
                return GenerateFallbackAnalysis(cvContent, candidateName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing CV with AI");
                return GenerateFallbackAnalysis(cvContent, candidateName);
            }
        }

        public async Task<string> ClassifyCandidateAsync(CVAnalysisResult analysis)
        {
            try
            {
                var prompt = $@"
                Classify this candidate based on the analysis:
                - Technical Skills: {analysis.TechnicalSkillsScore}/100
                - Experience Level: {analysis.ExperienceLevel}
                - Education: {analysis.EducationBackground}
                - Strengths: {string.Join(", ", analysis.KeyStrengths)}
                
                Classify into one of these categories:
                1. Strong Candidate - High potential, immediate hire
                2. Good Candidate - Good fit, consider for interview
                3. Average Candidate - Decent skills, may need training
                4. Weak Candidate - Not suitable for current positions
                
                Also suggest which positions they might be suitable for.
                ";

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
                        maxOutputTokens = 1024
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={_googleAIKey}", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    
                    if (result.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                    {
                        var firstCandidate = candidates[0];
                        if (firstCandidate.TryGetProperty("content", out var contentObj) && 
                            contentObj.TryGetProperty("parts", out var parts) && 
                            parts.GetArrayLength() > 0)
                        {
                            return parts[0].GetProperty("text").GetString() ?? "Unable to classify";
                        }
                    }
                }

                return "Unable to classify - AI analysis failed";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error classifying candidate with AI");
                return "Unable to classify - Error occurred";
            }
        }

        private async Task<List<CollectedCV>> SimulateCVCollection(string jobSite)
        {
            // Simulate collecting CVs from job sites
            await Task.Delay(1000); // Simulate network delay

            var mockCVs = new List<CollectedCV>
            {
                new CollectedCV
                {
                    Id = Guid.NewGuid().ToString(),
                    CandidateName = "Nguyễn Văn A",
                    Email = "nguyenvana@email.com",
                    Phone = "0123456789",
                    Position = "Senior Developer",
                    Source = jobSite,
                    CollectedDate = DateTime.Now,
                    CVContent = "5 năm kinh nghiệm React, Node.js, TypeScript. Tốt nghiệp Đại học Bách Khoa. Thành thạo AWS, Docker.",
                    FilePath = $"/cvs/nguyen_van_a_{DateTime.Now:yyyyMMdd}.pdf"
                },
                new CollectedCV
                {
                    Id = Guid.NewGuid().ToString(),
                    CandidateName = "Trần Thị B",
                    Email = "tranthib@email.com",
                    Phone = "0987654321",
                    Position = "Frontend Developer",
                    Source = jobSite,
                    CollectedDate = DateTime.Now,
                    CVContent = "3 năm kinh nghiệm Vue.js, CSS, JavaScript. Tốt nghiệp Đại học Công nghệ. Có kinh nghiệm làm việc với Figma.",
                    FilePath = $"/cvs/tran_thi_b_{DateTime.Now:yyyyMMdd}.pdf"
                }
            };

            return mockCVs;
        }

        private CVAnalysisResult ParseAIAnalysis(string analysisText)
        {
            try
            {
                // Try to parse JSON response
                var analysis = JsonSerializer.Deserialize<JsonElement>(analysisText);
                
                return new CVAnalysisResult
                {
                    TechnicalSkillsScore = analysis.TryGetProperty("technicalSkillsScore", out var tech) ? tech.GetInt32() : 75,
                    ExperienceLevel = analysis.TryGetProperty("experienceLevel", out var exp) ? exp.GetString() ?? "Mid" : "Mid",
                    EducationBackground = analysis.TryGetProperty("education", out var edu) ? edu.GetString() ?? "Unknown" : "Unknown",
                    KeyStrengths = analysis.TryGetProperty("strengths", out var strengths) ? 
                        strengths.EnumerateArray().Select(s => s.GetString()).Where(s => s != null).ToList() : 
                        new List<string> { "Good technical skills" },
                    AreasForImprovement = analysis.TryGetProperty("improvements", out var improvements) ? 
                        improvements.EnumerateArray().Select(s => s.GetString()).Where(s => s != null).ToList() : 
                        new List<string> { "Communication skills" },
                    OverallRecommendation = analysis.TryGetProperty("recommendation", out var rec) ? rec.GetString() ?? "Good" : "Good",
                    SuggestedQuestions = analysis.TryGetProperty("questions", out var questions) ? 
                        questions.EnumerateArray().Select(s => s.GetString()).Where(s => s != null).ToList() : 
                        new List<string> { "Tell me about your experience" }
                };
            }
            catch
            {
                // If JSON parsing fails, return fallback analysis
                return GenerateFallbackAnalysis(analysisText, "Unknown");
            }
        }

        private CVAnalysisResult GenerateFallbackAnalysis(string cvContent, string candidateName)
        {
            return new CVAnalysisResult
            {
                TechnicalSkillsScore = 75,
                ExperienceLevel = "Mid",
                EducationBackground = "Unknown",
                KeyStrengths = new List<string> { "Good technical skills", "Relevant experience" },
                AreasForImprovement = new List<string> { "Communication skills", "Leadership experience" },
                OverallRecommendation = "Good",
                SuggestedQuestions = new List<string> 
                { 
                    "Tell me about your experience with React",
                    "How do you handle debugging complex issues?",
                    "Describe a challenging project you worked on"
                }
            };
        }
    }

    public class CollectedCV
    {
        public string Id { get; set; } = "";
        public string CandidateName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Position { get; set; } = "";
        public string Source { get; set; } = "";
        public DateTime CollectedDate { get; set; }
        public string CVContent { get; set; } = "";
        public string FilePath { get; set; } = "";
    }

    public class CVAnalysisResult
    {
        public int TechnicalSkillsScore { get; set; }
        public string ExperienceLevel { get; set; } = "";
        public string EducationBackground { get; set; } = "";
        public List<string> KeyStrengths { get; set; } = new();
        public List<string> AreasForImprovement { get; set; } = new();
        public string OverallRecommendation { get; set; } = "";
        public List<string> SuggestedQuestions { get; set; } = new();
    }
}

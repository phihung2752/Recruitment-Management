using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HRManagementSystem.Services
{
    public class GmailService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GmailService> _logger;
        private readonly string _googleAIKey;

        public GmailService(HttpClient httpClient, IConfiguration configuration, ILogger<GmailService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _googleAIKey = "AIzaSyAWg5O3B40-glvaycqrYqfK6PKXWw5kvUA";
        }

        public async Task<bool> SendInterviewInvitationAsync(string candidateEmail, string candidateName, string position, DateTime interviewDate, string location)
        {
            try
            {
                var emailTemplate = await GenerateInterviewInvitationTemplate(candidateName, position, interviewDate, location);
                
                // Here you would integrate with Gmail API to send the email
                // For now, we'll just log the email content
                _logger.LogInformation($"Sending interview invitation to {candidateEmail}: {emailTemplate}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending interview invitation");
                return false;
            }
        }

        public async Task<bool> SendInterviewResultAsync(string candidateEmail, string candidateName, string interviewResult, string feedback)
        {
            try
            {
                var emailTemplate = await GenerateInterviewResultTemplate(candidateName, interviewResult, feedback);
                
                // Here you would integrate with Gmail API to send the email
                _logger.LogInformation($"Sending interview result to {candidateEmail}: {emailTemplate}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending interview result");
                return false;
            }
        }

        private async Task<string> GenerateInterviewInvitationTemplate(string candidateName, string position, DateTime interviewDate, string location)
        {
            try
            {
                var prompt = $@"
                Generate a professional interview invitation email in Vietnamese for:
                - Candidate: {candidateName}
                - Position: {position}
                - Date: {interviewDate:dd/MM/yyyy HH:mm}
                - Location: {location}
                
                Make it professional, friendly, and include all necessary details.
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
                        temperature = 0.7,
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
                    var responseResult = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    
                    if (responseResult.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                    {
                        var firstCandidate = candidates[0];
                        if (firstCandidate.TryGetProperty("content", out var contentObj) && 
                            contentObj.TryGetProperty("parts", out var parts) && 
                            parts.GetArrayLength() > 0)
                        {
                            return parts[0].GetProperty("text").GetString() ?? "Error generating email template";
                        }
                    }
                }

                // Fallback template if AI fails
                return GenerateFallbackInvitationTemplate(candidateName, position, interviewDate, location);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating interview invitation template with AI");
                return GenerateFallbackInvitationTemplate(candidateName, position, interviewDate, location);
            }
        }

        private async Task<string> GenerateInterviewResultTemplate(string candidateName, string interviewResult, string feedback)
        {
            try
            {
                var prompt = $@"
                Generate a professional interview result email in Vietnamese for:
                - Candidate: {candidateName}
                - Result: {interviewResult}
                - Feedback: {feedback}
                
                Make it professional, constructive, and appropriate for the result.
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
                        temperature = 0.7,
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
                    var responseResult = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    
                    if (responseResult.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                    {
                        var firstCandidate = candidates[0];
                        if (firstCandidate.TryGetProperty("content", out var contentObj) && 
                            contentObj.TryGetProperty("parts", out var parts) && 
                            parts.GetArrayLength() > 0)
                        {
                            return parts[0].GetProperty("text").GetString() ?? "Error generating email template";
                        }
                    }
                }

                // Fallback template if AI fails
                return GenerateFallbackResultTemplate(candidateName, interviewResult, feedback);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating interview result template with AI");
                return GenerateFallbackResultTemplate(candidateName, interviewResult, feedback);
            }
        }

        private string GenerateFallbackInvitationTemplate(string candidateName, string position, DateTime interviewDate, string location)
        {
            return $@"
Chào {candidateName},

Cảm ơn bạn đã quan tâm đến vị trí {position} tại công ty chúng tôi.

Chúng tôi rất vui mừng thông báo rằng bạn đã được mời tham gia phỏng vấn cho vị trí này.

Thông tin chi tiết:
- Vị trí: {position}
- Thời gian: {interviewDate:dd/MM/yyyy HH:mm}
- Địa điểm: {location}

Vui lòng xác nhận tham gia phỏng vấn bằng cách trả lời email này.

Trân trọng,
Bộ phận Nhân sự
            ";
        }

        private string GenerateFallbackResultTemplate(string candidateName, string interviewResult, string feedback)
        {
            if (interviewResult.ToLower() == "passed")
            {
                return $@"
Chào {candidateName},

Cảm ơn bạn đã tham gia phỏng vấn cho vị trí tại công ty chúng tôi.

Chúng tôi rất vui mừng thông báo rằng bạn đã vượt qua vòng phỏng vấn này.

Phản hồi từ ban giám khảo:
{feedback}

Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để thông báo về bước tiếp theo.

Trân trọng,
Bộ phận Nhân sự
                ";
            }
            else
            {
                return $@"
Chào {candidateName},

Cảm ơn bạn đã tham gia phỏng vấn cho vị trí tại công ty chúng tôi.

Sau khi xem xét kỹ lưỡng, chúng tôi quyết định không tiếp tục với ứng dụng của bạn cho vị trí này.

Phản hồi từ ban giám khảo:
{feedback}

Chúng tôi đánh giá cao sự quan tâm của bạn và chúc bạn thành công trong tương lai.

Trân trọng,
Bộ phận Nhân sự
                ";
            }
        }
    }
}

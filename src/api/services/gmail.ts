import { apiClient } from "../client"

export interface EmailMessage {
  id: string
  threadId: string
  subject: string
  from: string
  to: string
  body: string
  date: string
  isRead: boolean
  labels: string[]
}

export interface SendEmailRequest {
  to: string
  subject: string
  body: string
  isHtml?: boolean
}

class GmailService {
  async getAuthorizationUrl() {
    return apiClient.get<{ authorizationUrl: string }>("/auth/gmail/authorize")
  }

  async handleCallback(code: string) {
    return apiClient.post("/auth/gmail/callback", { code })
  }

  async sendEmail(emailData: SendEmailRequest) {
    return apiClient.post("/gmail/send", emailData)
  }

  async getMessages(maxResults = 10) {
    return apiClient.get<EmailMessage[]>(`/gmail/messages?maxResults=${maxResults}`)
  }

  async getMessage(messageId: string) {
    return apiClient.get<EmailMessage>(`/gmail/messages/${messageId}`)
  }
}

export const gmailService = new GmailService()

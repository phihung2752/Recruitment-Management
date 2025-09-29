import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"

export interface EmailData {
  to: string | string[]
  subject: string
  body: string
  template?: string
  attachments?: File[]
}

export interface SMSData {
  to: string | string[]
  message: string
}

export const communicationService = {
  async sendEmail(emailData: EmailData) {
    return apiClient.post(API_ENDPOINTS.COMMUNICATION.SEND_EMAIL, emailData)
  },

  async sendSMS(smsData: SMSData) {
    return apiClient.post(API_ENDPOINTS.COMMUNICATION.SEND_SMS, smsData)
  },

  async getTemplates() {
    return apiClient.get<
      {
        id: string
        name: string
        subject: string
        body: string
        type: "email" | "sms"
      }[]
    >(API_ENDPOINTS.COMMUNICATION.TEMPLATES)
  },
}

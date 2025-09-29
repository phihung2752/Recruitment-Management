import { apiClient } from "../client"
import { API_ENDPOINTS, createApiUrl } from "../config"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  attendees: string[]
  type: "interview" | "meeting" | "deadline"
  location?: string
  meetingLink?: string
}

export const calendarService = {
  async getEvents(params?: {
    startDate?: string
    endDate?: string
    type?: string
  }) {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
    }

    const endpoint = `${API_ENDPOINTS.CALENDAR.EVENTS}?${queryParams.toString()}`
    return apiClient.get<CalendarEvent[]>(endpoint)
  },

  async createEvent(eventData: Omit<CalendarEvent, "id">) {
    return apiClient.post<CalendarEvent>(API_ENDPOINTS.CALENDAR.CREATE_EVENT, eventData)
  },

  async updateEvent(id: string, eventData: Partial<CalendarEvent>) {
    const endpoint = createApiUrl(API_ENDPOINTS.CALENDAR.UPDATE_EVENT, { id })
    return apiClient.put<CalendarEvent>(endpoint, eventData)
  },
}

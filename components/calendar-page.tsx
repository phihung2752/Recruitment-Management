"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

// Note: In a real application, you would need to set up proper authentication and use environment variables for client IDs and API keys
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"

declare global {
  interface Window {
    gapi: any
  }
}

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newEvent, setNewEvent] = useState({ summary: "", description: "", start: "", end: "" })
  const { toast } = useToast()

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://apis.google.com/js/api.js"
    script.onload = initializeGoogleCalendar
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializeGoogleCalendar = () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar",
      }).then(() => {
        // Listen for sign-in state changes
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        // Handle the initial sign-in state
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
    })
  }

  const updateSigninStatus = (isSignedIn: boolean) => {
    if (isSignedIn) {
      listUpcomingEvents()
    }
  }

  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn()
  }

  const handleSignoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut()
  }

  const listUpcomingEvents = () => {
    setIsLoading(true)
    window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then((response: any) => {
      setEvents(response.result.items)
      setIsLoading(false)
    })
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    const event = {
      'summary': newEvent.summary,
      'description': newEvent.description,
      'start': {
        'dateTime': newEvent.start,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': newEvent.end,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    window.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    }).then(() => {
      toast({
        title: "Event added",
        description: "Your event has been added to Google Calendar",
      })
      setNewEvent({ summary: "", description: "", start: "", end: "" })
      listUpcomingEvents()
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <div className="flex space-x-4">
        <Button onClick={handleAuthClick}>Sign In</Button>
        <Button onClick={handleSignoutClick} variant="outline">Sign Out</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <ul className="space-y-2">
                {events.map((event: any) => (
                  <li key={event.id} className="flex justify-between items-center">
                    <span>{event.summary}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.start.dateTime).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <Label htmlFor="summary">Event Title</Label>
              <Input
                id="summary"
                value={newEvent.summary}
                onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Add Event</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


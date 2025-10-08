'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Plus, Filter } from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, isToday, isTomorrow } from 'date-fns'

interface InterviewSchedule {
  id: string
  candidateName: string
  position: string
  interviewer: string
  date: string
  time: string
  duration: number
  location: string
  status: 'scheduled' | 'completed' | 'cancelled'
  type: 'phone' | 'video' | 'in-person'
}

export default function SchedulerTab() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [schedules, setSchedules] = useState<InterviewSchedule[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Mock data
  useEffect(() => {
    const mockSchedules: InterviewSchedule[] = [
      {
        id: '1',
        candidateName: 'John Doe',
        position: 'Frontend Developer',
        interviewer: 'Sarah Johnson',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '10:00',
        duration: 60,
        location: 'Conference Room A',
        status: 'scheduled',
        type: 'in-person'
      },
      {
        id: '2',
        candidateName: 'Jane Smith',
        position: 'Backend Developer',
        interviewer: 'Mike Chen',
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        time: '14:00',
        duration: 45,
        location: 'Zoom Meeting',
        status: 'scheduled',
        type: 'video'
      },
      {
        id: '3',
        candidateName: 'Bob Wilson',
        position: 'Full Stack Developer',
        interviewer: 'Emily Davis',
        date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        time: '09:30',
        duration: 90,
        location: 'Phone Call',
        status: 'scheduled',
        type: 'phone'
      }
    ]
    setSchedules(mockSchedules)
  }, [])

  const getTodaySchedules = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return schedules.filter(schedule => schedule.date === today)
  }

  const getUpcomingSchedules = () => {
    const today = new Date()
    return schedules
      .filter(schedule => new Date(schedule.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return '📞'
      case 'video': return '📹'
      case 'in-person': return '🏢'
      default: return '📅'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hr-text-primary">Interview Scheduler</h2>
          <p className="text-hr-text-secondary">Manage and schedule interviews efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateForm(true)}
            className="bg-hr-accent text-white hover:bg-hr-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Interviews */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTodaySchedules().length === 0 ? (
                <p className="text-hr-text-secondary text-center py-4">No interviews scheduled for today</p>
              ) : (
                getTodaySchedules().map((schedule) => (
                  <div key={schedule.id} className="p-3 rounded-lg bg-hr-bg-primary border border-hr-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-hr-text-primary">{schedule.candidateName}</h4>
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-hr-text-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {schedule.time} ({schedule.duration}min)
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {schedule.interviewer}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {schedule.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{getTypeIcon(schedule.type)}</span>
                        {schedule.position}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingSchedules().map((schedule) => (
                <div key={schedule.id} className="p-3 rounded-lg bg-hr-bg-primary border border-hr-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-hr-text-primary">{schedule.candidateName}</h4>
                    <Badge variant="outline" className="text-hr-text-secondary">
                      {isTomorrow(new Date(schedule.date)) ? 'Tomorrow' : format(new Date(schedule.date), 'MMM dd')}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-hr-text-secondary">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {schedule.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {schedule.interviewer}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(schedule.type)}</span>
                      {schedule.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-hr-text-secondary">Today</span>
                <Badge variant="outline" className="text-hr-text-primary">
                  {getTodaySchedules().length} interviews
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-hr-text-secondary">This Week</span>
                <Badge variant="outline" className="text-hr-text-primary">
                  {schedules.filter(s => {
                    const scheduleDate = new Date(s.date)
                    const weekStart = startOfWeek(new Date())
                    const weekEnd = endOfWeek(new Date())
                    return scheduleDate >= weekStart && scheduleDate <= weekEnd
                  }).length} interviews
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-hr-text-secondary">Completed</span>
                <Badge variant="outline" className="text-green-500">
                  {schedules.filter(s => s.status === 'completed').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-hr-text-secondary">Scheduled</span>
                <Badge variant="outline" className="text-blue-500">
                  {schedules.filter(s => s.status === 'scheduled').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View Placeholder */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardHeader>
          <CardTitle className="text-hr-text-primary">Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center bg-hr-bg-primary rounded-lg border border-hr-border">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-hr-text-secondary" />
              <p className="text-hr-text-secondary">Calendar view will be implemented here</p>
              <p className="text-sm text-hr-text-secondary mt-2">
                Integration with FullCalendar or similar library
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}







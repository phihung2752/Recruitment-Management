import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || '1'
    const year = searchParams.get('year') || '2025'

    console.log('🔥 API: Fetching calendar events...', { month, year })

    // Mock data fallback
    const mockData = {
      events: [
        {
          id: 'event-001',
          title: 'Team Meeting',
          description: 'Weekly team sync meeting',
          date: '2025-01-15',
          startTime: '09:00',
          endTime: '10:00',
          type: 'meeting',
          attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
          location: 'Conference Room A',
          status: 'confirmed',
          createdAt: '2025-01-10T08:00:00Z',
          updatedAt: '2025-01-10T08:00:00Z'
        },
        {
          id: 'event-002',
          title: 'Interview - Frontend Developer',
          description: 'Technical interview for senior frontend developer position',
          date: '2025-01-16',
          startTime: '14:00',
          endTime: '15:30',
          type: 'interview',
          attendees: ['Sarah Wilson', 'Candidate: Alex Chen'],
          location: 'Interview Room 1',
          status: 'confirmed',
          createdAt: '2025-01-11T10:00:00Z',
          updatedAt: '2025-01-11T10:00:00Z'
        },
        {
          id: 'event-003',
          title: 'Project Deadline',
          description: 'Deadline for Q1 project deliverables',
          date: '2025-01-20',
          startTime: '17:00',
          endTime: '17:00',
          type: 'deadline',
          attendees: ['Development Team'],
          location: 'Office',
          status: 'pending',
          createdAt: '2025-01-12T09:00:00Z',
          updatedAt: '2025-01-12T09:00:00Z'
        },
        {
          id: 'event-004',
          title: 'Client Presentation',
          description: 'Present quarterly results to client',
          date: '2025-01-22',
          startTime: '10:00',
          endTime: '11:30',
          type: 'presentation',
          attendees: ['CEO', 'CTO', 'Client Team'],
          location: 'Client Office',
          status: 'confirmed',
          createdAt: '2025-01-13T14:00:00Z',
          updatedAt: '2025-01-13T14:00:00Z'
        },
        {
          id: 'event-005',
          title: 'Training Session',
          description: 'New technology training for development team',
          date: '2025-01-25',
          startTime: '13:00',
          endTime: '16:00',
          type: 'training',
          attendees: ['Development Team', 'Tech Lead'],
          location: 'Training Room',
          status: 'confirmed',
          createdAt: '2025-01-14T11:00:00Z',
          updatedAt: '2025-01-14T11:00:00Z'
        },
        {
          id: 'event-006',
          title: 'Interview - Backend Developer',
          description: 'Technical interview for backend developer position',
          date: '2025-01-28',
          startTime: '15:00',
          endTime: '16:30',
          type: 'interview',
          attendees: ['Tech Lead', 'Candidate: Maria Garcia'],
          location: 'Interview Room 2',
          status: 'confirmed',
          createdAt: '2025-01-15T12:00:00Z',
          updatedAt: '2025-01-15T12:00:00Z'
        }
      ],
      totalCount: 6,
      month: parseInt(month),
      year: parseInt(year)
    }
    
    console.log('✅ Mock calendar data generated:', mockData.events.length, 'events')
    return NextResponse.json(mockData)
  } catch (error) {
    console.error('❌ Error fetching calendar events:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch calendar events',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
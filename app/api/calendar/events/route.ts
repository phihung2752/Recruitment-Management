import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    // Build WHERE clause
    let whereConditions = []
    let params = []

    if (startDate) {
      whereConditions.push('StartTime >= ?')
      params.push(startDate)
    }

    if (endDate) {
      whereConditions.push('StartTime <= ?')
      params.push(endDate)
    }

    if (type && type !== 'all') {
      whereConditions.push('EventType = ?')
      params.push(type)
    }

    if (status && status !== 'all') {
      whereConditions.push('Status = ?')
      params.push(status)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get events
    const events = await executeQuery(`
      SELECT 
        Id as id,
        Title as title,
        Description as description,
        EventType as type,
        StartTime as startTime,
        EndTime as endTime,
        Location as location,
        Attendees as attendees,
        CandidateId as candidateId,
        InterviewRoundId as interviewRoundId,
        Status as status,
        Priority as priority,
        CreatedBy as createdBy,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM CalendarEvents
      ${whereClause}
      ORDER BY StartTime ASC
    `, params)

    // Transform events to match frontend interface
    const transformedEvents = events.map((event: any) => ({
      id: event.id.toString(),
      title: event.title,
      type: event.type.toLowerCase(),
      status: event.status.toLowerCase(),
      startTime: new Date(event.startTime).toTimeString().slice(0, 5),
      endTime: new Date(event.endTime).toTimeString().slice(0, 5),
      date: new Date(event.startTime).toISOString().split('T')[0],
      location: event.location,
      description: event.description,
      priority: event.priority.toLowerCase(),
      attendees: event.attendees ? event.attendees.split(',').map((email: string) => email.trim()) : [],
      isVideoCall: event.type.toLowerCase() === 'interview',
      platform: event.type.toLowerCase() === 'interview' ? 'zoom' : undefined,
      videoLink: event.type.toLowerCase() === 'interview' ? `https://zoom.us/j/${event.id}` : undefined,
      meetingId: event.type.toLowerCase() === 'interview' ? event.id.toString() : undefined,
      color: getEventColor(event.type.toLowerCase()),
      reminder: 15
    }))

    return NextResponse.json({
      events: transformedEvents
    })

  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      startTime,
      endTime,
      location,
      attendees,
      candidateId,
      interviewRoundId,
      status,
      priority,
      isVideoCall,
      platform,
      videoLink,
      meetingId,
      meetingPassword
    } = body

    const result = await executeQuery(`
      INSERT INTO CalendarEvents (
        Title, Description, EventType, StartTime, EndTime, Location, 
        Attendees, CandidateId, InterviewRoundId, Status, Priority, CreatedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description, type, startTime, endTime, location,
      attendees ? attendees.join(', ') : null, candidateId, interviewRoundId, status, priority, authResult.user?.id || 1
    ])

    return NextResponse.json({
      success: true,
      id: (result as any).insertId
    })

  } catch (error) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}

function getEventColor(type: string): string {
  switch (type) {
    case 'interview': return '#6366f1' // hr-primary
    case 'meeting': return '#10b981' // hr-success
    case 'deadline': return '#ef4444' // hr-danger
    case 'onboarding': return '#8b5cf6' // hr-purple
    case 'training': return '#f59e0b' // hr-warning
    default: return '#6b7280'
  }
}





import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const status = searchParams.get('status') || 'all'
    
    // Get meetings from database (simulate)
    const meetings = await getMeetingsFromDatabase(page, pageSize, status)
    
    return NextResponse.json({
      success: true,
      meetings: meetings.data,
      pagination: {
        page,
        pageSize,
        total: meetings.total,
        totalPages: Math.ceil(meetings.total / pageSize)
      }
    })
    
  } catch (error) {
    console.error('Get meetings error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const meetingData = await request.json()
    
    // Create new meeting
    const meeting = await createMeeting(meetingData)
    
    return NextResponse.json({
      success: true,
      meeting,
      message: 'Meeting created successfully'
    })
    
  } catch (error) {
    console.error('Create meeting error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}

async function getMeetingsFromDatabase(page: number, pageSize: number, status: string) {
  // Simulate database query
  const mockMeetings = [
    {
      id: 'meeting_001',
      topic: 'Frontend Developer Interview - Nguyễn Văn A',
      startTime: '2025-01-15T10:00:00Z',
      duration: 60,
      joinUrl: 'https://zoom.us/j/123456789',
      startUrl: 'https://zoom.us/s/123456789',
      candidateName: 'Nguyễn Văn A',
      candidateEmail: 'nguyen.van.a@email.com',
      interviewerName: 'Trần Thị B',
      interviewerEmail: 'tran.thi.b@company.com',
      jobTitle: 'Frontend Developer',
      companyName: 'Tech Company',
      status: 'scheduled',
      createdAt: '2025-01-10T09:00:00Z'
    },
    {
      id: 'meeting_002',
      topic: 'Backend Developer Interview - Lê Thị C',
      startTime: '2025-01-16T14:00:00Z',
      duration: 90,
      joinUrl: 'https://zoom.us/j/987654321',
      startUrl: 'https://zoom.us/s/987654321',
      candidateName: 'Lê Thị C',
      candidateEmail: 'le.thi.c@email.com',
      interviewerName: 'Phạm Văn D',
      interviewerEmail: 'pham.van.d@company.com',
      jobTitle: 'Backend Developer',
      companyName: 'Tech Company',
      status: 'completed',
      createdAt: '2025-01-11T10:30:00Z'
    },
    {
      id: 'meeting_003',
      topic: 'UX Designer Interview - Hoàng Văn E',
      startTime: '2025-01-17T09:30:00Z',
      duration: 45,
      joinUrl: 'https://zoom.us/j/456789123',
      startUrl: 'https://zoom.us/s/456789123',
      candidateName: 'Hoàng Văn E',
      candidateEmail: 'hoang.van.e@email.com',
      interviewerName: 'Vũ Thị F',
      interviewerEmail: 'vu.thi.f@company.com',
      jobTitle: 'UX Designer',
      companyName: 'Tech Company',
      status: 'scheduled',
      createdAt: '2025-01-12T11:15:00Z'
    }
  ]
  
  // Filter by status
  let filteredMeetings = mockMeetings
  if (status !== 'all') {
    filteredMeetings = mockMeetings.filter(meeting => meeting.status === status)
  }
  
  // Pagination
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedMeetings = filteredMeetings.slice(startIndex, endIndex)
  
  return {
    data: paginatedMeetings,
    total: filteredMeetings.length
  }
}

async function createMeeting(meetingData: any) {
  // Simulate meeting creation
  const newMeeting = {
    id: `meeting_${Date.now()}`,
    ...meetingData,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  }
  
  console.log('📅 Created meeting:', newMeeting)
  
  return newMeeting
}


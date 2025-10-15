import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      topic, 
      startTime, 
      duration, 
      candidateEmail, 
      candidateName,
      interviewerEmail,
      interviewerName,
      jobTitle,
      companyName
    } = await request.json()
    
    // Create Zoom meeting
    const meetingData = await createZoomMeeting({
      topic: `${topic} - ${candidateName}`,
      startTime,
      duration: duration || 60,
      type: 2, // Scheduled meeting
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        auto_recording: 'local'
      }
    })
    
    // Save meeting to database (simulate)
    const savedMeeting = await saveMeetingToDatabase({
      meetingId: meetingData.id,
      topic: meetingData.topic,
      startTime: meetingData.start_time,
      duration: meetingData.duration,
      joinUrl: meetingData.join_url,
      startUrl: meetingData.start_url,
      candidateEmail,
      candidateName,
      interviewerEmail,
      interviewerName,
      jobTitle,
      companyName,
      status: 'scheduled'
    })
    
    // Send email invitation
    const emailResult = await sendMeetingInvitation({
      candidateEmail,
      candidateName,
      interviewerEmail,
      interviewerName,
      jobTitle,
      companyName,
      meetingId: meetingData.id,
      joinUrl: meetingData.join_url,
      startTime: meetingData.start_time,
      duration: meetingData.duration
    })
    
    return NextResponse.json({
      success: true,
      meeting: {
        id: meetingData.id,
        topic: meetingData.topic,
        startTime: meetingData.start_time,
        duration: meetingData.duration,
        joinUrl: meetingData.join_url,
        startUrl: meetingData.start_url,
        password: meetingData.password
      },
      emailSent: emailResult.success,
      message: 'Meeting created and invitation sent successfully'
    })
    
  } catch (error) {
    console.error('Zoom meeting creation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}

async function createZoomMeeting(meetingData: any) {
  // Simulate Zoom API call
  const mockMeeting = {
    id: `meeting_${Date.now()}`,
    topic: meetingData.topic,
    start_time: meetingData.startTime,
    duration: meetingData.duration,
    join_url: `https://zoom.us/j/${Math.random().toString(36).substr(2, 9)}`,
    start_url: `https://zoom.us/s/${Math.random().toString(36).substr(2, 9)}`,
    password: Math.random().toString(36).substr(2, 8),
    settings: meetingData.settings
  }
  
  // In real implementation, you would call Zoom API:
  /*
  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ZOOM_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingData)
  })
  
  return await response.json()
  */
  
  return mockMeeting
}

async function saveMeetingToDatabase(meetingData: any) {
  // Simulate database save
  console.log('💾 Saving meeting to database:', meetingData)
  
  // In real implementation, save to SQL Server:
  /*
  const query = `
    INSERT INTO interview_meetings 
    (meeting_id, topic, start_time, duration, join_url, start_url, 
     candidate_email, candidate_name, interviewer_email, interviewer_name, 
     job_title, company_name, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())
  `
  */
  
  return { id: Date.now(), ...meetingData }
}

async function sendMeetingInvitation(data: any) {
  try {
    // Send email via Gmail API
    const emailResponse = await fetch('/api/email/send-meeting-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    return await emailResponse.json()
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}


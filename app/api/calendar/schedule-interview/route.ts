import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requirePermission } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Kiểm tra permission
    const permissionResult = await requirePermission(request, 'interviews.edit')
    if (!permissionResult.success) {
      return NextResponse.json(permissionResult, { status: 403 })
    }

    const { 
      candidateId, 
      roundId, 
      scheduledDate, 
      duration, 
      location, 
      meetingLink,
      interviewer,
      interviewerEmail,
      notes 
    } = await request.json()

    // Lấy thông tin ứng viên
    const candidateQuery = `
      SELECT FirstName, LastName, Email, Phone, Position
      FROM Candidates 
      WHERE Id = ?
    `
    const candidateResult = await executeQuery(candidateQuery, [candidateId])
    
    if (!candidateResult || candidateResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Candidate not found"
      }, { status: 404 })
    }

    const candidate = candidateResult[0]
    const candidateName = `${candidate.FirstName} ${candidate.LastName}`
    const candidateEmail = candidate.Email
    const position = candidate.Position

    // Cập nhật thông tin lịch hẹn trong database
    const updateQuery = `
      UPDATE InterviewRounds 
      SET 
        ScheduledDate = ?,
        Interviewer = ?,
        InterviewerEmail = ?,
        Notes = ?,
        UpdatedAt = NOW()
      WHERE Id = ?
    `
    await executeQuery(updateQuery, [
      scheduledDate,
      interviewer,
      interviewerEmail,
      notes,
      roundId
    ])

    // Tạo event cho Google Calendar (mock implementation)
    const eventDetails = {
      summary: `Phỏng vấn ${position} - ${candidateName}`,
      description: `
        Ứng viên: ${candidateName}
        Vị trí: ${position}
        Email: ${candidateEmail}
        Ghi chú: ${notes || 'Không có ghi chú'}
        ${meetingLink ? `Link phỏng vấn: ${meetingLink}` : ''}
      `,
      start: {
        dateTime: scheduledDate,
        timeZone: 'Asia/Ho_Chi_Minh'
      },
      end: {
        dateTime: new Date(new Date(scheduledDate).getTime() + (duration || 60) * 60000).toISOString(),
        timeZone: 'Asia/Ho_Chi_Minh'
      },
      attendees: [
        { email: candidateEmail, displayName: candidateName },
        { email: interviewerEmail, displayName: interviewer }
      ],
      location: location || 'Tại văn phòng',
      conferenceData: meetingLink ? {
        createRequest: {
          requestId: `interview-${roundId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      } : undefined
    }

    console.log('📅 Creating calendar event:', eventDetails)

    // Lưu calendar event vào database
    const insertEventQuery = `
      INSERT INTO CalendarEvents (
        Title, Description, StartTime, EndTime, Location, 
        MeetingLink, Attendees, CreatedBy, CreatedAt, UpdatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `
    
    const attendees = JSON.stringify(eventDetails.attendees)
    const eventResult = await executeQuery(insertEventQuery, [
      eventDetails.summary,
      eventDetails.description,
      eventDetails.start.dateTime,
      eventDetails.end.dateTime,
      eventDetails.location,
      meetingLink || null,
      attendees,
      'system' // Created by system
    ])

    console.log(`✅ Calendar event saved to database with ID: ${(eventResult as any).insertId}`)

    // Trong thực tế, ở đây sẽ gọi Google Calendar API
    // const calendarEvent = await createCalendarEvent(eventDetails)

    // Gửi email mời họp
    const emailSubject = `Lịch hẹn phỏng vấn ${position} - ${new Date(scheduledDate).toLocaleDateString('vi-VN')}`
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Lịch hẹn phỏng vấn</h2>
        
        <p>Xin chào ${candidateName},</p>
        
        <p>Chúng tôi xin thông báo lịch hẹn phỏng vấn cho vị trí <strong>${position}</strong>:</p>
        
        <div style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1E40AF; margin-top: 0;">Thông tin lịch hẹn</h3>
          <p><strong>Thời gian:</strong> ${new Date(scheduledDate).toLocaleString('vi-VN')}</p>
          <p><strong>Phỏng vấn viên:</strong> ${interviewer}</p>
          <p><strong>Địa điểm:</strong> ${location || 'Tại văn phòng'}</p>
          ${meetingLink ? `<p><strong>Link phỏng vấn:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
          ${notes ? `<p><strong>Ghi chú:</strong> ${notes}</p>` : ''}
        </div>

        <p>Vui lòng xác nhận tham gia bằng cách reply email này hoặc liên hệ trực tiếp với chúng tôi.</p>
        
        <p>Trân trọng,<br>
        <strong>Đội ngũ Nhân sự</strong></p>
      </div>
    `

    console.log('📧 Sending calendar invitation to:', candidateEmail)
    console.log('📧 Subject:', emailSubject)

    return NextResponse.json({
      success: true,
      message: "Interview scheduled successfully",
      data: {
        candidateName,
        scheduledDate,
        interviewer,
        eventDetails
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error scheduling interview:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to schedule interview"
    }, { status: 500 })
  }
}













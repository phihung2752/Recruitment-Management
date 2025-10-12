import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateEmail, candidateName, jobTitle, interviewDate, interviewTime } = body

    console.log('📧 Sending interview invitation...', { candidateEmail, candidateName, jobTitle })

    // Mock email sending (since backend is not running)
    const mockResponse = {
      success: true,
      message: 'Interview invitation sent successfully',
      emailDetails: {
        to: candidateEmail,
        subject: `Interview Invitation - ${jobTitle}`,
        candidateName,
        jobTitle,
        interviewDate,
        interviewTime,
        timestamp: new Date().toISOString()
      }
    }

    console.log('✅ Mock email sent:', mockResponse)
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('❌ Error sending interview invitation:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send interview invitation',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
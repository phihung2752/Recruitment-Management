import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Call backend API
    const backendResponse = await fetch('http://localhost:5000/api/email/send-interview-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (backendResponse.ok) {
      const result = await backendResponse.json()
      return NextResponse.json(result)
    } else {
      throw new Error('Backend API call failed')
    }
  } catch (error) {
    console.error('Error sending interview invitation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send interview invitation' },
      { status: 500 }
    )
  }
}

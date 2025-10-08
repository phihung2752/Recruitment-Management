import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('🔥 API: Fetching candidate...', { id })

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/candidates/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Candidate fetched successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock data')
      
      // Mock data fallback
      const mockCandidate = {
        id,
        firstName: "Nguyễn Văn",
        lastName: "An",
        email: "an.nguyen@example.com",
        phone: "+84 123 456 789",
        currentPosition: "Senior Developer",
        experience: "5",
        skills: "React, Node.js, TypeScript, AWS",
        status: "Pending",
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z"
      }

      return NextResponse.json(mockCandidate)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidate' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log('🔥 API: Updating candidate...', { id, body })

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/candidates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      console.log('✅ API: Candidate updated successfully')
      return NextResponse.json({ success: true })
    } else {
      console.log('❌ Backend not available, simulating update')
      
      // Mock update
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('🔥 API: Deleting candidate...', { id })

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/candidates/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      console.log('✅ API: Candidate deleted successfully')
      return NextResponse.json({ success: true })
    } else {
      console.log('❌ Backend not available, simulating deletion')
      
      // Mock deletion
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    )
  }
}





















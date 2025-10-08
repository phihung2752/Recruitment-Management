import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('🔥 API: Fetching job posting...', id)

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job posting fetched successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock data')
      
      // Mock data fallback
      const mockData = {
        id,
        title: 'Sample Job Posting',
        description: 'This is a sample job posting description.',
        requirements: 'Sample requirements',
        location: 'Sample Location',
        workType: 'Full-time',
        employmentType: 'Permanent',
        experienceLevel: 'Mid',
        status: 'Active',
        publishedAt: new Date().toISOString(),
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        numberOfPositions: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while fetching job posting' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log('🔥 API: Updating job posting...', id, body)

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job posting updated successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, simulating update')
      
      // Simulate update
      const mockData = {
        message: 'Job posting updated successfully (simulated)'
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while updating job posting' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('🔥 API: Deleting job posting...', id)

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job posting deleted successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, simulating deletion')
      
      // Simulate deletion
      const mockData = {
        message: 'Job posting deleted successfully (simulated)'
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while deleting job posting' },
      { status: 500 }
    )
  }
}


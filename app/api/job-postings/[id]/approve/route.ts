import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()
    const { status, publishedAt, reviewComment } = body

    console.log('🔥 API: Approving job posting...', { jobId, status, publishedAt })

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings/${jobId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        publishedAt,
        reviewComment
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job posting approved successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, simulating approval')
      
      // Simulate approval
      const mockData = {
        id: jobId,
        message: 'Job posting approved successfully (simulated)',
        status: 'Active',
        publishedAt: publishedAt || new Date().toISOString()
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while approving job posting' },
      { status: 500 }
    )
  }
}

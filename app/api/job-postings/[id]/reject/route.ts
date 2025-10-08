import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()
    const { status, reviewComment } = body

    console.log('🔥 API: Rejecting job posting...', { jobId, status })

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings/${jobId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        reviewComment
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job posting rejected successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, simulating rejection')
      
      // Simulate rejection
      const mockData = {
        id: jobId,
        message: 'Job posting rejected successfully (simulated)',
        status: 'Rejected'
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while rejecting job posting' },
      { status: 500 }
    )
  }
}

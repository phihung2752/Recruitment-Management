import { NextRequest, NextResponse } from 'next/server'

// Disable SSL verification for development
if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export async function GET(request: NextRequest) {
  try {
    // Try to fetch real data from backend
    try {
      const backendResponse = await fetch('https://localhost:7001/api/admin/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(3000)
      })

      if (backendResponse.ok) {
        const realData = await backendResponse.json()
        console.log('Successfully fetched real data from backend:', realData)
        return NextResponse.json(realData)
      }
    } catch (backendError) {
      console.log('Backend not available, using mock data:', backendError.message)
    }

    // Fallback to mock data with Vietnamese sample data
    const mockData = {
      totalUsers: 5,
      totalCandidates: 8,
      totalJobPostings: 5,
      totalInterviews: 3,
      pendingApprovals: 2,
      activeRecruitments: 4,
      completedHires: 1,
      systemHealth: 95
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}

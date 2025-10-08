import { NextRequest, NextResponse } from 'next/server'

// Disable SSL verification for development
if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export async function GET(request: NextRequest) {
  try {
    // Try to fetch real data from backend
    try {
      const backendResponse = await fetch('https://localhost:7001/api/admin/jobpostings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(3000)
      })

      if (backendResponse.ok) {
        const realData = await backendResponse.json()
        console.log('Successfully fetched job postings from backend:', realData)
        return NextResponse.json(realData)
      }
    } catch (backendError) {
      console.log('Backend not available for job postings, using mock data:', backendError instanceof Error ? backendError.message : 'Unknown error')
    }

    // Fallback to mock data
    const mockData = {
      jobPostings: [
        {
          id: "1",
          title: "Senior Software Engineer",
          department: "Engineering",
          location: "Ho Chi Minh City",
          employmentType: "Full-time",
          experienceLevel: "Senior",
          salaryMin: 20000000,
          salaryMax: 30000000,
          description: "We are looking for a Senior Software Engineer to join our team...",
          requirements: "5+ years experience, React, Node.js, TypeScript",
          benefits: "Health insurance, flexible hours, remote work",
          applicationDeadline: "2024-02-15",
          startDate: "2024-03-01",
          status: "Active",
          applicationsCount: 15,
          createdAt: "2024-01-15T00:00:00Z"
        },
        {
          id: "2", 
          title: "Product Manager",
          department: "Product",
          location: "Hanoi",
          employmentType: "Full-time",
          experienceLevel: "Mid",
          salaryMin: 18000000,
          salaryMax: 25000000,
          description: "Join our product team to drive innovation...",
          requirements: "3+ years PM experience, Agile, User Research",
          benefits: "Competitive salary, learning budget",
          applicationDeadline: "2024-02-20",
          startDate: "2024-03-15",
          status: "Active",
          applicationsCount: 8,
          createdAt: "2024-01-18T00:00:00Z"
        },
        {
          id: "3",
          title: "UX Designer",
          department: "Design", 
          location: "Da Nang",
          employmentType: "Full-time",
          experienceLevel: "Mid",
          salaryMin: 15000000,
          salaryMax: 22000000,
          description: "Create amazing user experiences...",
          requirements: "3+ years UX experience, Figma, Prototyping",
          benefits: "Design tools, creative freedom",
          applicationDeadline: "2024-02-25",
          startDate: "2024-03-20",
          status: "Draft",
          applicationsCount: 0,
          createdAt: "2024-01-20T00:00:00Z"
        }
      ],
      totalCount: 3,
      page: 1,
      pageSize: 10,
      totalPages: 1
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Error fetching job postings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job postings' },
      { status: 500 }
    )
  }
}

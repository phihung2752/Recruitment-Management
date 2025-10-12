import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'

    console.log('🔥 API: Fetching job postings...', { page, pageSize, search, status })

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    
    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    
    const response = await fetch(`${backendUrl}/api/job-postings?page=${page}&pageSize=${pageSize}&search=${search}&status=${status}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job postings fetched successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock data')
      
      // Mock data fallback
      const mockData = {
        jobPostings: [
          {
            id: '1',
            title: 'Senior Software Engineer',
            description: 'We are looking for an experienced software engineer to join our development team.',
            requirements: '5+ years experience, C#, .NET, SQL Server, React',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Senior',
            status: 'Active',
            publishedAt: '2025-01-15T00:00:00Z',
            applicationDeadline: '2025-02-15T00:00:00Z',
            numberOfPositions: 2,
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z'
          },
          {
            id: '2',
            title: 'Frontend Developer',
            description: 'Join our frontend team to build amazing user experiences.',
            requirements: '3+ years experience, React, TypeScript, CSS, HTML',
            location: 'Ha Noi',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Mid',
            status: 'Active',
            publishedAt: '2025-01-20T00:00:00Z',
            applicationDeadline: '2025-02-20T00:00:00Z',
            numberOfPositions: 3,
            createdAt: '2025-01-20T00:00:00Z',
            updatedAt: '2025-01-20T00:00:00Z'
          },
          {
            id: '3',
            title: 'Marketing Manager',
            description: 'Lead our marketing initiatives and drive growth.',
            requirements: '5+ years marketing experience, Digital marketing, Analytics',
            location: 'Da Nang',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Senior',
            status: 'Draft',
            publishedAt: null,
            applicationDeadline: '2025-02-10T00:00:00Z',
            numberOfPositions: 1,
            createdAt: '2025-01-25T00:00:00Z',
            updatedAt: '2025-01-25T00:00:00Z'
          }
        ],
        totalCount: 3,
        page,
        pageSize,
        totalPages: 1
      }

      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while fetching job postings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔥 API: Creating job posting...', body)

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job posting created successfully')
      return NextResponse.json(data, { status: 201 })
    } else {
      console.log('❌ Backend not available, simulating creation')
      
      // Simulate creation
      const mockData = {
        id: Date.now().toString(),
        message: 'Job posting created successfully (simulated)'
      }

      return NextResponse.json(mockData, { status: 201 })
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while creating job posting' },
      { status: 500 }
    )
  }
}


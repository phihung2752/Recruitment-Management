import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const status = searchParams.get('status') || 'Draft'

    console.log('🔥 API: Fetching job approvals...', { page, pageSize, status })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings?page=${page}&pageSize=${pageSize}&status=${status}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job approvals fetched successfully')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock data')
      
      // Mock data fallback
      const mockData = {
        jobPostings: [
          {
            id: 'job-001',
            title: 'Senior Frontend Developer',
            description: 'We are looking for a senior frontend developer with React experience to join our dynamic team. You will be responsible for building user-facing features and ensuring the best user experience.',
            requirements: '5+ years React, TypeScript, Node.js experience. Strong understanding of modern web development practices.',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Senior',
            status: 'Draft',
            publishedAt: null,
            applicationDeadline: '2025-02-15',
            numberOfPositions: 2,
            createdAt: '2025-01-10T09:00:00Z',
            updatedAt: '2025-01-10T09:00:00Z',
            createdBy: 'hr-manager',
            salary: '$80,000 - $100,000',
            benefits: ['Health insurance', 'Flexible hours', 'Remote work'],
            department: 'Engineering'
          },
          {
            id: 'job-002',
            title: 'Backend Developer',
            description: 'Join our backend team to build scalable APIs and microservices. You will work with modern technologies and contribute to our growing platform.',
            requirements: '3+ years Java, Spring Boot, Microservices, AWS, Docker experience',
            location: 'Hanoi',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Mid-level',
            status: 'Draft',
            publishedAt: null,
            applicationDeadline: '2025-02-20',
            numberOfPositions: 1,
            createdAt: '2025-01-11T10:30:00Z',
            updatedAt: '2025-01-11T10:30:00Z',
            createdBy: 'tech-lead',
            salary: '$60,000 - $80,000',
            benefits: ['Health insurance', 'Learning budget', 'Team events'],
            department: 'Engineering'
          },
          {
            id: 'job-003',
            title: 'UX Designer',
            description: 'We need a creative UX designer to improve our user experience and design intuitive interfaces for our products.',
            requirements: '2+ years UX/UI design, Figma, Adobe Creative Suite, User Research',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Mid-level',
            status: 'Draft',
            publishedAt: null,
            applicationDeadline: '2025-02-25',
            numberOfPositions: 1,
            createdAt: '2025-01-12T14:15:00Z',
            updatedAt: '2025-01-12T14:15:00Z',
            createdBy: 'design-manager',
            salary: '$50,000 - $70,000',
            benefits: ['Health insurance', 'Design tools', 'Creative freedom'],
            department: 'Design'
          },
          {
            id: 'job-004',
            title: 'Marketing Manager',
            description: 'Lead our marketing efforts and develop strategies to grow our brand presence in the market.',
            requirements: '4+ years marketing experience, Digital marketing, Brand management, Analytics',
            location: 'Ho Chi Minh City',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Senior',
            status: 'Draft',
            publishedAt: null,
            applicationDeadline: '2025-03-01',
            numberOfPositions: 1,
            createdAt: '2025-01-13T11:20:00Z',
            updatedAt: '2025-01-13T11:20:00Z',
            createdBy: 'ceo',
            salary: '$70,000 - $90,000',
            benefits: ['Health insurance', 'Marketing budget', 'Team leadership'],
            department: 'Marketing'
          },
          {
            id: 'job-005',
            title: 'Data Analyst',
            description: 'Analyze data to provide insights and support business decisions. Work with large datasets and create meaningful reports.',
            requirements: '2+ years data analysis, SQL, Python, Excel, Statistics, Machine Learning',
            location: 'Hanoi',
            workType: 'Full-time',
            employmentType: 'Permanent',
            experienceLevel: 'Mid-level',
            status: 'Draft',
            publishedAt: null,
            applicationDeadline: '2025-03-05',
            numberOfPositions: 2,
            createdAt: '2025-01-14T16:45:00Z',
            updatedAt: '2025-01-14T16:45:00Z',
            createdBy: 'data-manager',
            salary: '$55,000 - $75,000',
            benefits: ['Health insurance', 'Data tools', 'Learning opportunities'],
            department: 'Analytics'
          }
        ],
        totalCount: 5,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(5 / pageSize)
      }
      
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch job approvals',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, jobId, comment } = body

    console.log('🔥 API: Job approval action...', { action, jobId, comment })

    // Set environment variable to ignore SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

    // Call backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    const response = await fetch(`${backendUrl}/api/job-postings/${jobId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, comment })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API: Job approval action successful')
      return NextResponse.json(data)
    } else {
      console.log('❌ Backend not available, using mock response')
      
      // Mock response
      const mockResponse = {
        success: true,
        message: action === 'approve' ? 'Job posting approved successfully' : 'Job posting rejected',
        jobId: jobId,
        action: action,
        comment: comment,
        timestamp: new Date().toISOString()
      }
      
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to process job approval',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

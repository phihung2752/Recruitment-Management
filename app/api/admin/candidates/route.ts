import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'All'

    // Try to fetch from backend
    try {
      const backendUrl = `http://localhost:5000/api/admin/candidates?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&status=${status}`
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Successfully fetched candidates from backend:', data)
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.log('Backend not available, using mock data:', backendError)
    }

    // Fallback to mock data
    const mockCandidates = [
      {
        id: "1",
        name: "Nguyễn Văn An",
        position: "Senior Developer",
        email: "an.nguyen@example.com",
        status: "pending",
        avatar: "",
        experience: "5 years",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        aiScore: 85,
        interviewRounds: [
          { 
            id: 1,
            name: "Initial Screening", 
            status: "current", 
            type: "screening",
            interviewer: "Trần Thị Bình",
            interviewerAvatar: "",
            scheduledDate: "2024-01-25T10:00:00Z",
            duration: 30,
            location: "Online"
          },
          { 
            id: 2,
            name: "Technical Interview", 
            status: "pending", 
            type: "technical",
            interviewer: "Lê Văn Cường",
            interviewerAvatar: "",
            scheduledDate: "2024-01-30T14:00:00Z",
            duration: 60,
            location: "Office"
          }
        ]
      },
      {
        id: "2", 
        name: "Phạm Thị Dung",
        position: "Frontend Developer",
        email: "dung.pham@example.com",
        status: "pending",
        avatar: "",
        experience: "3 years",
        skills: ["Vue.js", "CSS", "JavaScript", "Bootstrap"],
        aiScore: 78,
        interviewRounds: [
          { 
            id: 1,
            name: "Initial Screening", 
            status: "passed", 
            type: "screening",
            interviewer: "Trần Thị Bình",
            interviewerAvatar: "",
            scheduledDate: "2024-01-20T10:00:00Z",
            duration: 30,
            location: "Online"
          },
          { 
            id: 2,
            name: "Technical Interview", 
            status: "current", 
            type: "technical",
            interviewer: "Lê Văn Cường",
            interviewerAvatar: "",
            scheduledDate: "2024-01-28T14:00:00Z",
            duration: 60,
            location: "Office"
          }
        ]
      },
      {
        id: "3",
        name: "Hoàng Văn Em",
        position: "React Developer", 
        email: "em.hoang@example.com",
        status: "pending",
        avatar: "",
        experience: "2 years",
        skills: ["React", "Redux", "GraphQL", "Docker"],
        aiScore: 92,
        interviewRounds: [
          { 
            id: 1,
            name: "Initial Screening", 
            status: "pending", 
            type: "screening",
            interviewer: "Trần Thị Bình",
            interviewerAvatar: "",
            scheduledDate: "2024-01-30T11:00:00Z",
            duration: 30,
            location: "Online"
          }
        ]
      }
    ]

    // Filter candidates based on search and status
    let filteredCandidates = mockCandidates

    if (search) {
      filteredCandidates = filteredCandidates.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase()) ||
        candidate.position.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'All') {
      filteredCandidates = filteredCandidates.filter(candidate => candidate.status === status)
    }

    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex)

    const result = {
      candidates: paginatedCandidates,
      totalCount: filteredCandidates.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredCandidates.length / pageSize)
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}

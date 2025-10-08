import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { executeQuery } from '@/lib/database'
import { PERMISSIONS } from '@/lib/permissions'

async function getInterviews(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const candidateId = searchParams.get('candidateId')
    
    const offset = (page - 1) * pageSize
    
    let whereClause = '1=1'
    const params: any[] = []
    
    if (candidateId) {
      whereClause += ' AND i.CandidateId = ?'
      params.push(candidateId)
    }
    
    // Get interviews with candidate and interviewer info
    const interviews = await executeQuery(`
      SELECT 
        i.Id,
        i.CandidateId,
        i.JobPostId,
        i.InterviewerId,
        i.ScheduledDate,
        i.Duration,
        i.Type,
        i.Status,
        i.Location,
        i.Notes,
        i.Feedback,
        i.Rating,
        i.Recommendation,
        i.CreatedAt,
        i.UpdatedAt,
        CONCAT(c.FirstName, ' ', c.LastName) as candidateName,
        c.Email as candidateEmail,
        CONCAT(u.FirstName, ' ', u.LastName) as interviewerName,
        u.Email as interviewerEmail,
        jp.Title as jobTitle
      FROM Interviews i
      LEFT JOIN Candidates c ON i.CandidateId = c.Id
      LEFT JOIN Users u ON i.InterviewerId = u.Id
      LEFT JOIN JobPosts jp ON i.JobPostId = jp.Id
      WHERE ${whereClause}
      ORDER BY i.ScheduledDate DESC
      LIMIT ? OFFSET ?
    `, [...params, pageSize, offset])
    
    // Get total count
    const countResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM Interviews i
      WHERE ${whereClause}
    `, params)
    
    const totalCount = countResult[0].total
    const totalPages = Math.ceil(totalCount / pageSize)
    
    return NextResponse.json({
      success: true,
      interviews,
      totalCount,
      page,
      pageSize,
      totalPages
    })
  } catch (error) {
    console.error('Get interviews error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}

async function createInterview(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      candidateId, 
      jobPostId, 
      interviewerId, 
      scheduledDate, 
      duration, 
      type, 
      location, 
      notes 
    } = body
    
    const result = await executeQuery(`
      INSERT INTO Interviews 
      (CandidateId, JobPostId, InterviewerId, ScheduledDate, Duration, Type, Location, Notes, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')
    `, [candidateId, jobPostId, interviewerId, scheduledDate, duration, type, location, notes])
    
    return NextResponse.json({
      success: true,
      message: 'Interview created successfully',
      interviewId: (result as any).insertId
    })
  } catch (error) {
    console.error('Create interview error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create interview' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return getInterviews(request)
}

export async function POST(request: NextRequest) {
  return createInterview(request)
}





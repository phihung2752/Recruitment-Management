import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { requireAuth, requirePermission } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Kiểm tra permission
    const permissionResult = await requirePermission(request, 'interviews.view')
    if (!permissionResult.success) {
      return NextResponse.json(permissionResult, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId')

    if (!candidateId) {
      return NextResponse.json({
        success: false,
        message: "Candidate ID is required"
      }, { status: 400 })
    }

    // Lấy thông tin candidate
    const candidateQuery = `
      SELECT Id, FirstName, LastName, Email, Phone, Position, Status
      FROM Candidates 
      WHERE Id = ?
    `
    const candidateResult = await executeQuery(candidateQuery, [candidateId])
    
    if (!candidateResult || candidateResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Candidate not found"
      }, { status: 404 })
    }

    const candidate = candidateResult[0]

    // Lấy các vòng phỏng vấn
    const roundsQuery = `
      SELECT 
        Id,
        RoundNumber,
        RoundName as name,
        Status as status,
        Interviewer as interviewer,
        InterviewerEmail as interviewerEmail,
        ScheduledDate as scheduledDate,
        CompletedDate as completedDate,
        Notes as notes,
        CreatedAt as createdAt,
        UpdatedAt as updatedAt
      FROM InterviewRounds 
      WHERE CandidateId = ?
      ORDER BY RoundNumber ASC
    `
    const roundsResult = await executeQuery(roundsQuery, [candidateId])

    return NextResponse.json({
      success: true,
      data: {
        candidate: {
          id: candidate.Id,
          firstName: candidate.FirstName,
          lastName: candidate.LastName,
          email: candidate.Email,
          phone: candidate.Phone,
          position: candidate.Position,
          status: candidate.Status,
        },
        rounds: roundsResult.map((round: any) => ({
          id: round.Id,
          roundNumber: round.RoundNumber,
          name: round.name,
          status: round.status,
          interviewer: round.interviewer,
          interviewerEmail: round.interviewerEmail,
          scheduledDate: round.scheduledDate,
          completedDate: round.completedDate,
          notes: round.notes,
          createdAt: round.createdAt,
          updatedAt: round.updatedAt,
        }))
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching interview rounds:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to fetch interview rounds"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Kiểm tra permission
    const permissionResult = await requirePermission(request, 'interviews.edit')
    if (!permissionResult.success) {
      return NextResponse.json(permissionResult, { status: 403 })
    }

    const {
      candidateId,
      roundNumber,
      roundName,
      status,
      interviewer,
      interviewerEmail,
      scheduledDate,
      notes
    } = await request.json()

    // Tạo vòng phỏng vấn mới
    const insertQuery = `
      INSERT INTO InterviewRounds (
        CandidateId,
        RoundNumber,
        RoundName,
        Status,
        Interviewer,
        InterviewerEmail,
        ScheduledDate,
        Notes,
        CreatedAt,
        UpdatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

    const result = await executeQuery(insertQuery, [
      candidateId,
      roundNumber,
      roundName,
      status,
      interviewer || null,
      interviewerEmail || null,
      scheduledDate || null,
      notes || null
    ])

    return NextResponse.json({
      success: true,
      message: "Interview round created successfully",
      data: {
        id: (result as any).insertId,
        candidateId,
        roundNumber,
        roundName,
        status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating interview round:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to create interview round"
    }, { status: 500 })
  }
}









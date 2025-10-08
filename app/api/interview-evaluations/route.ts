import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const {
      candidateId,
      roundId,
      technicalSkills,
      communication,
      problemSolving,
      culturalFit,
      overallRating,
      strengths,
      areasForImprovement,
      additionalComments,
      recommendation,
      attachmentUrl
    } = await request.json()

    // Save evaluation to database
    const query = `
      INSERT INTO InterviewEvaluations (
        CandidateId, RoundId, TechnicalSkills, Communication, ProblemSolving,
        CulturalFit, OverallRating, Strengths, AreasForImprovement,
        AdditionalComments, Recommendation, AttachmentUrl, EvaluatedBy, EvaluatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `

    await executeQuery(query, [
      candidateId,
      roundId,
      technicalSkills,
      communication,
      problemSolving,
      culturalFit,
      overallRating,
      strengths,
      areasForImprovement,
      additionalComments,
      recommendation,
      attachmentUrl,
      authResult.user?.id || 0
    ])

    return NextResponse.json({
      success: true,
      message: 'Evaluation saved successfully'
    })
  } catch (error) {
    console.error('Error saving interview evaluation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save evaluation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidateId')
    const roundId = searchParams.get('roundId')

    let query = 'SELECT * FROM InterviewEvaluations WHERE 1=1'
    const params = []

    if (candidateId) {
      query += ' AND CandidateId = ?'
      params.push(candidateId)
    }

    if (roundId) {
      query += ' AND RoundId = ?'
      params.push(roundId)
    }

    query += ' ORDER BY EvaluatedAt DESC'

    const evaluations = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      evaluations
    })
  } catch (error) {
    console.error('Error fetching interview evaluations:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch evaluations' },
      { status: 500 }
    )
  }
}

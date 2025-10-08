import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const { status, notes } = await request.json()
    const roundId = params.id

    // Update interview round status
    const query = `
      UPDATE InterviewRounds 
      SET Status = ?, Notes = ?, UpdatedAt = NOW()
      WHERE Id = ?
    `

    await executeQuery(query, [status, notes, roundId])

    return NextResponse.json({
      success: true,
      message: 'Interview round status updated successfully'
    })
  } catch (error) {
    console.error('Error updating interview round status:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    )
  }
}







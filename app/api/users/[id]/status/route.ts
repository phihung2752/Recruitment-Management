import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { executeQuery, executeSingle } from '@/lib/database'

// PATCH /api/users/[id]/status - Cập nhật trạng thái user
async function updateUserStatus(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id)
    const body = await request.json()
    const { status } = body
    
    // Validate status
    if (!status || !['Active', 'Inactive', 'Locked'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be Active, Inactive, or Locked' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await executeSingle(`
      SELECT Id, Status FROM Users WHERE Id = ?
    `, [userId])
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    // Update user status
    await executeQuery(`
      UPDATE Users 
      SET Status = ?, UpdatedAt = NOW()
      WHERE Id = ?
    `, [status, userId])
    
    return NextResponse.json({
      success: true,
      message: `User status updated to ${status}`,
      status
    })
  } catch (error) {
    console.error('Update user status error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user status', error: error instanceof Error ? error instanceof Error ? error.message : "Unknown error" : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return updateUserStatus(request, { params })
}

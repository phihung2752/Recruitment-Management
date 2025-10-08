import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requirePermission } from '@/lib/auth'
import { executeQuery, executeSingle } from '@/lib/database'
import bcrypt from 'bcryptjs'

// PUT /api/users/[id] - Cập nhật user
async function updateUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id)
    const body = await request.json()
    const { username, email, firstName, lastName, password, roleId } = body
    
    // Validate required fields
    if (!username || !email || !firstName || !lastName || !roleId) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Check if user exists
    const existingUser = await executeSingle(`
      SELECT Id FROM Users WHERE Id = ?
    `, [userId])
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    // Check if username or email already exists (excluding current user)
    const duplicateUser = await executeSingle(`
      SELECT Id FROM Users WHERE (Username = ? OR Email = ?) AND Id != ?
    `, [username, email, userId])
    
    if (duplicateUser) {
      return NextResponse.json(
        { success: false, message: 'Username or email already exists' },
        { status: 400 }
      )
    }
    
    // Prepare update query (without RoleId for now)
    let updateFields = ['Username = ?', 'Email = ?', 'FirstName = ?', 'LastName = ?', 'UpdatedAt = NOW()']
    let updateParams = [username, email, firstName, lastName]
    
    // Update password if provided
    if (password && password.trim() !== '') {
      const passwordHash = await bcrypt.hash(password, 12)
      updateFields.push('PasswordHash = ?')
      updateParams.push(passwordHash)
    }
    
    updateParams.push(userId)
    
    // Update user
    await executeQuery(`
      UPDATE Users 
      SET ${updateFields.join(', ')}
      WHERE Id = ?
    `, updateParams)
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user', error: error instanceof Error ? error instanceof Error ? error.message : "Unknown error" : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Xóa user
async function deleteUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id)
    
    // Check if user exists
    const existingUser = await executeSingle(`
      SELECT Id FROM Users WHERE Id = ?
    `, [userId])
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    // Delete user
    await executeQuery(`
      DELETE FROM Users WHERE Id = ?
    `, [userId])
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete user', error: error instanceof Error ? error instanceof Error ? error.message : "Unknown error" : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return updateUser(request, { params })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return deleteUser(request, { params })
}

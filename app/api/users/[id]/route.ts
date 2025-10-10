import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()
    
    console.log('Updating user:', userId, 'with data:', body)

    // Forward to backend API
    const backendResponse = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()
    
    if (data.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'User updated successfully',
        user: data.user 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to update user' 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}